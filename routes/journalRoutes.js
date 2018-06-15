var express = require("express");
var router = express.Router();
var Entry = require("../models/entry");
var middleware = require("../middleware");

router.get("/",function(req,res){
    res.render("landing");
})

//INDEX
router.get("/myjournal",middleware.isLoggedIn,function(req,res){
    Entry.find({"author.id":req.user._id},function(err,entries){
        if(err){
            console.log(err);
        }else{
            res.render("myjournal",{entry:entries});
        }
    });
});

//NEW
router.get("/myjournal/new",function(req,res){
    res.render("new");
});

//CREATE
router.post("/myjournal",middleware.isLoggedIn,function(req,res){
    var title=req.body.title,
        date=req.body.date,
        flyType=req.body.flyType,
        flyBreed=req.body.flyBreed,
        location=req.body.location,
        image=req.body.image,
        description=req.body.description,
        author= {
                    id: req.user._id,
                    username:req.user.username
                }
    var newEntry = {title:title,date:date,flyType:flyType,flyBreed:flyBreed,location:location,image:image,description:description,author:author}
    Entry.create(newEntry,function(err,newEntry){
        if(err){
            console.log(err);
        }else{
            res.redirect("/myjournal")
        }
    })
})

//SHOW
router.get("/myjournal/:id",function(req,res){
    Entry.findById(req.params.id,function(err,foundEntry){
       if(err){
           console.log(err);
       } else {
           res.render("show",{entry:foundEntry});
       }
    });
});

module.exports = router;