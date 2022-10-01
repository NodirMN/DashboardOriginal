const {Router} = require('express');
const router = Router()
const Users = require('../model/users');
const bcrypt = require("bcrypt");
const auth = require("../middleware/auth");
const { v4: uuidv4 } = require( "uuid");


///////////////////////////User api send
router.get("/",auth, async (req, res) => {
    let users = await Users.find().lean()
    res.render("users/index", {
        isUsers: true,
        title: "Список пользователей ",
        users,
    });
});


router.get('/delete/:id',auth,async(req,res)=>{
    let _id = req.params.id
    await Users.findByIdAndRemove({_id})
    res.redirect("/users"); 
})


router.post("/",auth,async (req, res) => {
    let { name, email,phone, avatar } = req.body;
    let newUsers = await Users({ name, email, phone, avatar });
    await newUsers.save();
    res.render("users/index");
});

router.post("/users/login",auth,async (req, res) => {
    try {
        let { email, password } = req.body;
        let checkUsers = await Users.findOne({
            $or: [{ email }, { phone: email }]});
            if (checkUsers) {
            let comprePass = await bcrypt.compare(password,checkUsers.password)
            if (comprePass) {
                    let token = uuidv4();
                    let date = new Date();
                    date.setDate(date.getDate() + 1);
                    let tokenExp = date
                    checkUsers.token = token
                    checkUsers.tokenExp = tokenExp
                    await Users.findByIdAndUpdate({_id:checkUsers._id},{token,tokenExp})
                    res.send({
                        _id:checkUsers._id,
                        token,
                    })
            }else {
                res.send('password invalid')
            }
        }else{
            res.send('not exists')
        }
        } catch(error){
            res.send(error)
        }
});
////////////////////////////////////////////////////////////////////////////////////

router.get('/login',async(req,res)=>{
    res.render("users/login", {
        title: "Please Sign-in to your account.",
        layout: "no-head", 
        error: req.flash("error"),
    });  
    
})   





router.get('/logout',async(req,res)=>{
    req.session.destroy(()=>{
            res.redirect('/users/login')
        })
    })

router.post("/login", async(req, res) => {
        let {login,password} = req.body
        if (login == 'admin' && password == 'admin'){
            req.session.isAuthed = true
            res.redirect('/')
        } else{
            req.flash('error','Xatolik')
            res.redirect('/users/login')
        }
});

router.get('/logout',(re,res)=>
{req.session.destroy(err=>{
    if(err) throw err
    res.redirect('/')
})
})

///////////////////////////////////////////
router.get("/check/:login", async (req, res) => {
    let login = req.params.login;
    let checkLogin = await Users.findOne({ login });
    if (checkLogin) {
        res.send(true);
    }else{
        res.send(false)
    }
});




module.exports = router;