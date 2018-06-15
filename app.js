var express               = require("express"),
    app                   = express(),
    bodyParser            = require("body-parser"),
    mongoose              = require("mongoose"),
    passport              = require("passport"),
    LocalStrategy         = require("passport-local"),
    User                  = require("./models/user"),
    Entry                 = require("./models/entry"),
    indexRoutes           = require("./routes/index"),
    journalRoutes         = require("./routes/journalRoutes");
    
mongoose.connect("mongodb://localhost/my_fish_journal");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use('/images',express.static(__dirname + "/images"));



//passport config/////////////////////////////////
app.use(require("express-session")({
    secret: "This is thakdjal;jf ls;djf sadfsaiuhdf asudfh",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
   res.locals.currentUser = req.user;
   next();
});
////////////////////////////////////////////////

app.use(indexRoutes);
app.use(journalRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("The Fishbook Server Has Started");
});