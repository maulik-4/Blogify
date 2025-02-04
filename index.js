require('dotenv').config();
const express=  require('express');
const path = require('path');
const app = express();
const userRoute = require('./routes/user');
const BlogRoute = require('./routes/blog');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { checkForAuthenticationCookie } = require('./middlewares/authentication');
const Blog = require('./models/blog');


// $ export MONGO_URL=mongodb://localhost:27017/Blogify


app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));

app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve("./public")));

mongoose.connect(process.env.MONGO_URL)
.then( e =>  console.log('Connected to MongoDB'));


app.get('/' , async (req,res) =>{
    const allBlogs = await Blog.find({});
    res.render('home',{
        user:req.user,
        blogs : allBlogs,
    });
})


app.use('/' ,userRoute);
app.use('/blog' , BlogRoute);
const port = process.env.PORT || 9000;
app.listen(port , () => console.log(`Server is running on port ${port}`));