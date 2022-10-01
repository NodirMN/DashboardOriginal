const { Router } = require("express");
const router = Router();
const Users = require("../model/users");
const bcrypt = require("bcrypt");
const auth = require("../middleware/auth");


///////////////////////////User api send
router.get("/", auth, async (req, res) => {
    let users = await Users.find().lean();
    res.render("pages/profile", {
       
        title: "Список админов ",
        users,
    });   
});


module.exports = router;