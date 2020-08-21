const express = require("express");
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");
const Handlebars = require("handlebars");
const methodOverride = require("method-override");
const passport = require("passport");
const session = require("express-session");
const flash = require("connect-flash");

const { connect } = require("mongoose");
const { PORT, MONGODB_URL } = require("./config");

const app = express();


//import local-passport to server
require("./config/passport")(passport);

/*=================connect mongodnb database ========================*/
connect(
    MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },
    (err) => {
        if (err) throw err;
        console.log("Myntra database connection successfully connected");
    }
);

/*==========================Template engine middleware starts here====================*/
app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");
/*==========================Template engine middleware ends here====================*/
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


//handlebars helper class
Handlebars.registerHelper('remove first 6 character', (str) => {
    let Trimvalue = [...str].splice(6).join('');
    return new Handlebars.SafeString(Trimvalue);
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/*========================METHOD OVERRIDE MIDDLEWARE =======================*/

// override with POST having ?_method=PUT or DELETE
app.use(methodOverride("_method"));

/*==================session and connect flass middlewares are stated here ======*/
app.use(
    session({
        secret: "secret",
        resave: true,
        saveUninitialized: true,
    })
);
app.use(flash());


/*========PASSPORT MIDDLEWARE HERE==================*/
app.use(passport.initialize());
app.use(passport.session());
/*========PASSPORT MIDDLEWARE ENDS HERE==================*/
/*==================session and connect flass middlewares are ended here ======*/
/*==================SET GLOBAL VARIABLES THIS VARIABLE CAN ACCESS ENTIRE YOUR APPLICATIONS =======*/
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.errors_msg = req.flash("errors_msg");
    res.locals.warnings_msg = req.flash("warnings_msg ");
    res.locals.error = req.flash("error");
    res.locals.user = req.user || null;
    next();
});


/*---------static files----------*/
app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/node_modules"));

app.get("/", (req, res) => {
    res.render("./home");
})

/*------load router files------*/
app.use("/profile/", require("./Routes/profiles/profile"));
app.use("/auth/", require("./Routes/auth/auth"));

app.listen(PORT, (err) => {
    if (err) throw err;
    console.log("myntra server is running on port number " + PORT);
});