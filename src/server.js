import express from "express";
import bodyParser from "body-parser";
import viewEngine from "./config/viewEngine";
import initWebRoutes from './route/web';
import cors from 'cors';
const mongoose = require("mongoose");



require('dotenv').config();

let app = express();
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));


app.use(bodyParser.json({limit: '50mb'}))
app.use(bodyParser.urlencoded({limit: '50mb', extended: true }))


viewEngine(app);
initWebRoutes(app);

let port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log("Backend Nodejs is running on port: " + port);
});


mongoose
  .connect(process.env.MONGOOSE_HTTP, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Mongodb connect establish"))
  .catch((error) => console.log("MongoDB connection failed"));