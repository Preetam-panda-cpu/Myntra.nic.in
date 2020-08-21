//ROUTER LEVEL MIDDLEWARE
const express = require("express");
const router = express.Router();

//@ http method GET
//@description its SPORTS get information
//@access PUBLIC
router.get("/", (req, res) => {
    res.send("i am sports page");
});

module.exports = router;