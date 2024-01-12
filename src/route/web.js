const express = require('express');
const userController = require('../controllers/userController');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// Define your JWT secret key
const imageDownloader = require('image-downloader')
const jwtSecret = 'your_secret_key';
const ts = require('fs').promises;
const multer = require('multer')
const router = express.Router();
const fs = require('fs');


let initWebRoutes = (app) => {
    router.post('/register', async (req, res) => {
        const { name, email, password } = req.body;
        try {
            const salt = await bcrypt.genSalt(12);
            const hashedPassword = await bcrypt.hash(password, salt);

            const userDoc = await userController.create({
                name,
                email,
                password: hashedPassword
            });

            res.json(userDoc);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal server error" });
        }
    });

    router.post('/login', async (req, res) => {
        const { email, password } = req.body;

        try {
            const userDoc = await userController.findOne({ email });
            if (userDoc) {
                const passwordOk = await bcrypt.compare(password, userDoc.password);
                    
                if (passwordOk) {
                    jwt.sign({ email: userDoc.email, id: userDoc._id,name : userDoc.name }, jwtSecret, {}, (err, token) => {
                        if (err) throw err;
                        console.log("check userDoc",userDoc)
                        res.cookie('token', token).json(userDoc);
                    });
                } else {
                    res.status(401).json({ error: "Incorrect password" });
                }
            } else {
                res.status(404).json({ error: "User not found" });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal server error" });
        }
    });


    router.get("/profile", (req, res) => {
        const { token } = req.cookies
        if (token) {
            jwt.verify(token, jwtSecret, {},async (err, user) => {
                const { name, email, _id } = await userController.findById(user.id)
                res.json({name,email,_id})
            })
        }
        else {
            res.json(null)
        }
    })

    router.post('/logout', (req, res) => {
        res.cookie('token','').json(true)
    })

    router.post('/upload-by-link', async (req, res) => {
        const { link } = req.body;
        const newName = Date.now() + '.jpg';
        const uploadPath = __dirname + '/uploads/' + newName;
        console.log(link)
        try {
            // Create the 'uploads' directory if it doesn't exist
            await ts.mkdir(__dirname + '/uploads', { recursive: true });
    
            // Download and save the image
            await imageDownloader.image({
                url: link,
                dest: uploadPath,
            });
    
            res.json(newName);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal server error" });
        }
    
    });
    
    const photosMiddleware = multer({dest:'uploads'})
    router.post('/upload', photosMiddleware.array('photos', 100), (req, res) => {
        const uploadFiles = []
        for (let i = 0; i < req.files.length; i++){
            const { path, originalname } = req.files[i]
            const parts = originalname.split('.')
            const ext = parts[parts.length - 1]
            const newPath = path + '.' + ext
            
            fs.renameSync(path, newPath)
            uploadFiles.push(newPath.replace('uploads\\',''))
        }
        console.log('check upload',uploadFiles)
        res.json(uploadFiles)
    })

    app.post('/places', (req, res) => {
        
    })

    return app.use("/", router);
};

module.exports = initWebRoutes;
