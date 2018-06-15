var express               = require("express"),
    app                   = express(),
    bodyParser            = require("body-parser"),
    mongoose              = require("mongoose"),
    passport              = require("passport"),
    LocalStrategy         = require("passport-local"),
    User                  = require("./models/user");

mongoose.connect("mongodb://localhost/my_fish_journal");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use('/images',express.static(__dirname + "/images"));

var entrySchema = new mongoose.Schema({
    title: String,
    date: String,
    flyType: String,
    flyBreed: String,
    location: String,
    image: String,
    description: String
});

var Entry = mongoose.model("Entry",entrySchema);

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


app.get("/",function(req,res){
    res.render("landing");
})

//INDEX
app.get("/myjournal",isLoggedIn,function(req,res){
    Entry.find({},function(err,entries){
        if(err){
            console.log(err);
        }else{
            res.render("myjournal",{entry:entries});
        }
    });
});

//NEW
app.get("/myjournal/new",function(req,res){
    res.render("new");
});

//CREATE
app.post("/myjournal",isLoggedIn,function(req,res){
    var title=req.body.title,
        date=req.body.date,
        flyType=req.body.flyType,
        flyBreed=req.body.flyBreed,
        location=req.body.location,
        image=req.body.image,
        description=req.body.description;
    var newEntry = {title:title,date:date,flyType:flyType,flyBreed:flyBreed,location:location,image:image,description:description}
    Entry.create(newEntry,function(err,newEntry){
        if(err){
            console.log(err);
        }else{
            res.redirect("/myjournal")
        }
    })
})

//SHOW
app.get("/myjournal/:id",function(req,res){
    Entry.findById(req.params.id,function(err,foundEntry){
       if(err){
           console.log(err);
       } else {
           res.render("show",{entry:foundEntry});
       }
    });
});

// ====================
// |   AUTH ROUTES    |
// ====================


// ====================
// |     REGISTER     |
// ====================

app.get("/register",function(req,res){
    res.render("register");
});

//Handle Sign Up Logic
app.post("/register",function(req,res){
    var newUser = new User({username:req.body.username});
    User.register(newUser,req.body.password,function(err,user){
        if(err){
            console.log(err);
            return res.render("register")
        }
        passport.authenticate("local")(req,res,function(){
            res.redirect("/myjournal")
        });
    });
});

// ====================
// |       LOGIN      |
// ====================

app.get("/login",function(req,res){
   res.render("login"); 
});

app.post("/login",passport.authenticate("local",
    {
        successRedirect: "/myjournal",
        failureRedirect: "/login"
    }), function(req,res){
    
});

// ====================
// |       LOGOUT     |
// ====================
app.get("/logout",function(req,res){
   req.logout();
   res.redirect("/");
});




// ====================
// |    MIDDLEWARE    |
// ====================
function isLoggedIn(req,res,next) {
    if(req.isAuthenticated()){
        return next();
    } else {
        res.redirect("/login");
    }
}

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("The Fishbook Server Has Started");
});