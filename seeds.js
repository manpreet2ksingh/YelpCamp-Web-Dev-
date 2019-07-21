var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");

var data = [
    {name:"Salmon Creek",image: "https://cl9r93gnrb42o3l0v1aawby1-wpengine.netdna-ssl.com/wp-content/uploads/2018/02/Arrowhead-300x300.png"},
    {name:"Granite Hill",image: "https://img.hipcamp.com/image/upload/c_fill,f_auto,h_300,q_60,w_300/v1441053881/campground-photos/gcilsuylcktq0fyg6irf.jpg"},
    {name:"Mountains Goat's Rest",image: "https://explorersedge.ca/wp-content/uploads/2013/02/granite-ridge-wilderness-campground-300x300.jpg"}
] 

function seedDB(){
    Campground.deleteMany({},function(err)
    {
        if(err)
        {
            console.log("error");
        }
            console.log("removed campgrounds");

            Comment.deleteMany({}, function(err) {
                if(err){
                    console.log(err);
                }
                console.log("removed comments!");
            });
            

        data.forEach(function(seed){
            Campground.create(seed,function(err,addedData){
                if(err)
                {
                    console.log(err);
                }
                else
                {
                    console.log("added a campground")
                    Comment.create({
                        text:"what a place! The ambience there describes it all",
                        author:"Someone"
                    },function(err,comment){
                        if(err)
                        {
                        console.log(err);
                        }
                        else
                        {
                            //Campground.comments.push(comment);
                            //Campground.save();
                            console.log("comment added");
                        }
                    });
                }
            });
        });
   
    });
}


module.exports = seedDB;