//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash"); // Use Lodash libaray to convert express route parameter value to lower case
const port = 3000;
const app = express();
const mongoose = require("mongoose");
const { Schema } = mongoose;


const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect('mongodb://127.0.0.1:27017/blogpostDB');

// create Schema
const postSchema = new Schema({
  title: String,
  content: String
});

// create an collection Model
const Post = mongoose.model('Post', postSchema);

//Use EJS to render parse paragraph element to home.ejs file
app.get("/", function(req, res){
  Post.find()
  .then(function(foundItems){
    res.render("home", {
      homePostUnchanged: homeStartingContent,
      homeTitle: foundItems
    });
    //console.log(foundItems);
  }).catch(function(err) {
    console.log(err);
  });
  // use EJS to change values inside home.ejs homeTitle and homePost

});
//Use EJS to render parse about.ejs file to the server
app.get('/about', function(req, res) {
  res.render('about', {aboutContent: aboutContent});
});
//Use EJS to render parse contact.ejs file to the server
app.get('/contact', function(req, res) {
  res.render('contact', {contactContent: contactContent});
});

app.get('/compose', function(req, res) {
  res.render('compose');
});

//tap into the post req data in compose
app.post('/compose', function(req, res) {
  // Tpo push value from the name titletext and postText in compose.ejs into composeTitleContainer and composeTitleContainer array

  const post = new Post({
    title: req.body.titleText,
    content: req.body.postText
  });
  post.save()
   .then(function(){
     console.log('Save Succesfully');
     res.redirect("/");
   }).catch(function(err){
     console.log(err);
     res.sendStatus(505);
   });
});

// Express routing parameters to capture the values specified at their position in the URL
app.get('/post/:postId', function(req,res) {
  //Use Lodash libaray to convert express route parameter value to lower case
  Post.findOne({_id: req.params.postId})
   .then(function(postFind){
     res.render('post', {
       postTitle: postFind,
       postPost: postFind
     });
   }).catch(function(err) {
     console.log(err);
     res.sendStatus(505);
   });

});

app.listen(port, function() {
  console.log("Server started on port 3000");
});




// <%- include('partials/header'); -%>
// <% homeTitle.forEach(function(home) { %>
//   <h1><%= homeTitle %></h1>
//   <p><%= homePost %></p>
// <% }) %>
//
// <%- include('partials/footer'); -%>
