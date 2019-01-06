var bodyParser = require("body-parser"),
mongoose       = require("mongoose"),
express        = require("express"),
methodOverride = require("method-override"),
expressSanitizer        = require("express-sanitizer"),
app            = express();

mongoose.connect("mongodb://localhost/restful_blog_app");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer);
app.use(methodOverride("_method"));

var blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created: {type:Date, default: Date.now}
});
//RESTFUL ROUTES
var blog = mongoose.model("blog",blogSchema)

app.get("/", function(req, res) {
    res.redirect("/blogs");
})

app.get("/blogs", function(req,res){
  blog.find({},function(err,blogs){
    if(err){
      console.log("ERROR")
    }else{
      res.render("index",{blogs: blogs});
    }
  })
})

//NEW ROUTE
app.get("/blogs/new",function(req, res) {
    res.render("new")
})

app.post("/blogs",function(req,res){
  //create

  req.body.blog.body = req.sanitize(req.body.blog.body)
  blog.create(req.body.Blog, function(err, newBlog){
    if(err){
        res.render("new");
      }else{
        res.redirect("/blogs");
      }
  })
  //redirect
})
//SHOW ROUTE
app.get("/blogs/:id",function(req, res) {
  blog.findById(req.params.id, function(err, foundBlog){
    if(err){
      res.redirect("/blogs");
    }else{
      res.render("show",{blog:foundBlog});
    }
  })
})
//EDIT ROUTE
app.get("/blogs/:id/edit", function(req, res) {
    blog.findById(req.params.id,function(err,foundBlog){
      if(err){
        res.redirect("/blogs");
      }else{
        res.render("edit", {blog: foundBlog});
      }
    })
})
//UPDATE ROUTE
app.put("/blogs/:id",function(req,res){
  blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
    if(err){
      res.redirect("/blogs");
    }else{
      res.redirect("/blogs/" + req.params.id);
    }
  })
  //res.send(req.params.id)
})
//DELETE ROUTE
app.delete("/blogs/:id/",function(req,res){
  blog.findByIdAndRemove(req.params.id, function(err){
    if(err){
      res.redirect("/blogs");
    }else{
      res.redirect("/blogs")
    }
  })
})
app.listen(process.env.PORT, process.env.IP, function(){
  console.log(("SERVER IS RUNNING"));
})