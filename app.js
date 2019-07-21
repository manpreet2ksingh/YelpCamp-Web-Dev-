var express               = require('express'),
    app                   = express(),
    mongoose              = require('mongoose'),
    bodyParser            =require('body-parser'),
    seedDB                = require("./seeds.js"),
    Comment               = require("./models/comment"),
    Campground            = require("./models/campground.js"),
    User                  = require("./models/user"),
    passport              = require("passport"),
    LocalStrategy         = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose");

mongoose.connect('mongodb://localhost:27017/yelpcamp', {useNewUrlParser: true});
seedDB();

app.use(require("express-session")({
    secret:"Rusty is best",
    resave:false,
    saveUninitialized:false
}));

app.use(bodyParser.urlencoded({extended:true}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use(bodyParser.urlencoded({extended:true}));

app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    next();
})



app.get("/",function(req,res){
    res.render("landing.ejs"); 
});

app.get("/campgrounds",function(req,res){
     Campground.find({},function(err,AllCampgrounds){
         if(err)
         console.log("error");
         else{
            res.render("campgrounds/index.ejs",{campgrounds:AllCampgrounds});
         }
     });
    
});

app.post("/campgrounds",function(req,res){
    var name = req.body.name;
    var url = req.body.image;
    var newCampground = {name:name,image:url};
    Campground.create(newCampground,function(err){
        if(err)
        console.log("error");
        else
        {
            res.redirect("/campgrounds");
        }
    });
    
});

app.get("/campgrounds/new",function(req,res){
    res.render("campgrounds/new.ejs");
   
});

app.get("/campgrounds/:id",function(req,res){
    Campground.findById(req.params.id).populate("comments").exec(function(err,found){
        if(err)
        res.redirect("/campgrounds");
        else
        {
            res.render("campgrounds/show.ejs",{campground:found});
        }
    });
});

// ==================== //
//COMMENTS ROUTES
// ==================== //

app.get("/campgrounds/:id/comments/new",isLoggedIn,function(req,res){
    Campground.findById(req.params.id , function(err,campground){
        if(err)
        console.log(error);
        else
        res.render("comments/new.ejs",{campground:campground});
    })
    
});

app.post("/campgrounds/:id/comments",isLoggedIn,function(req,res){
    Campground.findById(req.params.id,function(err,campground){
        if(err)
        res.redirect("/campgrounds");
        else
        {
            Comment.create(req.body.comment,function(err,comment){
                if(err)
                res.redirect("/campgrounds");
                else
                {
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/"+campground._id);
                }
            })
        }
    })
})

//Auth Routes
app.get("/register",function(req,res){
    res.render("register.ejs");
})

app.post("/register",function(req,res){
    User.register(new User({username:req.body.username}),req.body.password,function(err,user){
        if(err)
        {
            console.log(err);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req,res,function(){
            res.redirect("/campgrounds");
        })
    })
})

app.get("/login",function(req,res){
    res.render("login.ejs");
})

app.post("/login",passport.authenticate("local",{
    successRedirect:"/campgrounds",
    failureRedirect:"/login"
}),function(req,res){

});

app.get("/logout",function(req,res){
    req.logout();
    res.redirect("/campgrounds");
})

function isLoggedIn(req,res,next)
{
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

app.listen(3000,function(){
    console.log("server has started");
});