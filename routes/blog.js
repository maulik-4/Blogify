const {Router} = require('express');
const router = Router();
const multer = require('multer');
const path = require('path');
const Blog = require('../models/blog');

router.get('/add-new' ,(req,res)=>{
    return res.render('add-blog',{
        user:req.user,
    });
})


router.get('/:id', async (req,res) =>{
    const blog = await Blog.findById(req.params.id).populate('CreatedBy');
    return res.render('blog',{
        user:req.user,
       
        blog,
    });

})

//Multer storage  : for handling the file  storage
const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,path.resolve(`./public/uploads`));
    },
    filename: function(req,file,cb){
        const filename = `${Date.now()}-${file.originalname}`;
        cb(null,filename);
    }
});
const upload = multer({storage});

router.post('/' ,upload.single("coverImage"),async (req,res) =>{
    const {title , body} = req.body;
    const blog = await Blog.create({
        title,
        body,
        coverImageUrl: `/uploads/${req.file.filename}`,
        CreatedBy: req.user._id
    })
    return res.redirect('/');
})
module.exports = router;