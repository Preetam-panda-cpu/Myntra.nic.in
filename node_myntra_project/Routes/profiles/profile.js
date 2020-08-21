//ROUTER LEVEL MIDDLEWARE
const express = require("express");
const router = express.Router();
const multer = require("multer");

const { ensureAuthenticated } = require("../../helper/auth_helper");

//Load Schema
const Profile = require("../../Model/profile");
//Load multer
const { storage } = require("../../config/multer");
const { update } = require("../../Model/profile");
const upload = multer({ storage });

//@ http method GET
//@description its profile get information
//@access PUBLIC
router.get("/", (req, res) => {
    res.send("i am profile router");
});

router.get("/create-profile", ensureAuthenticated, (req, res) => {
    res.render("./profiles/create-profile");
});
router.get("/all-profiles", (req, res) => {
    res.render("./profiles/all-profiles");
    //find Profile collections and fetch data from that collection
    // Profile.find({})
    //.sort({ date: "desc" })
    //.lean()
    //.then((profile) => {
    //  res.render("./profiles/all-profiles", { profile });
    // })
    //.catch((err) => console.log(err));
});

/*========================GET USER PROFILE DETAILS ========================*/
router.get("/user-details/:id", (req, res) => {
    Profile.findOne({ _id: req.params.id })
        .lean()
        .then((profile_detail) => {
            res.render("./profiles/user-profile", { profile_detail });
        })
        .catch((err) => console.log(err));
});
/*========================GET EDIT ROUTE BY ID =============================*/
router.get("/edit-profile/:id", ensureAuthenticated, (req, res) => {
    Profile.findOne({ _id: req.params.id })
        .lean()
        .then((editProfile) => {
            res.render("./profiles/edit-profile", { editProfile });
        })
        .catch((err) => console.log(err));
});

/*========================Close GET EDIT ROUTE BY ID =============================*/

// @http method POST
// @description CREATE PROFILE DATA
// @access PRIVATE

router.post("/create-profile", ensureAuthenticated, upload.single("photo"), (req, res) => {
    let {
        firstname,
        lastname,
        designation,
        phone,
        skills,
        address,
        alt_address,
        gender,
        country,
        pincode,
        landmark,
    } = req.body;
    let newProfile = {
        photo: req.file,
        firstname,
        lastname,
        phone,
        designation,
        skills,
        address,
        alt_address,
        gender,
        country,
        pincode,
        landmark,
    };

    new Profile(newProfile)
        .save()
        .then((profile) => {
            req.flash("success_msg", "successfully profile created");
            res.redirect("/profile/all-profiles", 201, { profile });
        })
        .catch((err) => console.log(err));
});

/*==================================USE HTTP PUT METHOD FOR UPDATE OR MODIFY DATA ==========*/
router.put("/edit-profile/:id", ensureAuthenticated, upload.single("photo"), (req, res) => {
    // first find existing data and update data
    Profile.findOne({ _id: req.params.id })
        .then((updateProfile) => {
            //old                  //new
            updateProfile.photo = req.file;
            updateProfile.firstname = req.body.firstname;
            updateProfile.lastname = req.body.lastname;
            updateProfile.designation = req.body.designation;
            updateProfile.phone = req.body.phone;
            updateProfile.address = req.body.address;
            updateProfile.alt_address = req.body.alt_address;
            updateProfile.skills = req.body.skills;
            updateProfile.gender = req.body.gender;
            updateProfile.country = req.body.country;
            updateProfile.pincode = req.body.pincode;
            updateProfile.landmark = req.body.landmark;

            //save new values in to database
            updateProfile
                .save()
                .then((update) => {
                    req.flash("success_msg", "successfully profile updated");
                    res.redirect("/profiles/all-profiles", 201, { update });
                })
                .catch((err) => console.log(err));
        })
        .catch((err) => console.log(err));
});

/*===============================HTTP DELETE METHOD FOR DELETING DATA ========================*/
router.delete("/profile-delete/:id", ensureAuthenticated, (req, res) => {
    Profile.deleteOne({ _id: req.params.id })
        .then(() => {
            req.flash("success_msg", "successfully profile deleted");
            res.redirect("/profiles/all-profiles", 201);
        })
        .catch((err) => console.log(err));
});

module.exports = router;