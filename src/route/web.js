const express = require('express');
const userController = require('../controllers/userController');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser')
// Define your JWT secret key
const jwtSecret = 'your_secret_key';

const router = express.Router();

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
                    jwt.sign({ email: userDoc.email, id: userDoc.id }, jwtSecret, {}, (err, token) => {
                        if (err) throw err;
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
        req.json({token})
    })

    return app.use("/", router);
};

module.exports = initWebRoutes;
