var express             = require("express"),
    app                 = express(),
    bodyParser          = require("body-parser"),
    mongoose            = require("mongoose");

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

app.get("/",function(req,res){
    res.render("landing");
})

//INDEX
app.get("/myjournal",function(req,res){
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
app.post("/myjournal",function(req,res){
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


app.listen(process.env.PORT, process.env.IP, function(){
   console.log("The Fishbook Server Has Started");
});