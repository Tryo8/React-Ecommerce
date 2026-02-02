import express from 'express';
import path from "path";
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import productsController from './controller/productsController.js';
import { corsOptions } from './config/corsConfigOptions.js';
import cors from 'cors';
import user from './controller/userController.js';
import register from './routes/register.js';
import login from './routes/login.js';
import refresh from './routes/refresh.js';
import cookieParser from "cookie-parser";
import logout from './routes/logout.js';
import githubAuthRoute from "./routes/githubAuth.js";
import geoip from "geoip-lite";
import checkout from './routes/checkOut.js';
import verfiySession from './routes/verifySession.js';
import { getUserLocation } from './model/getUserLocation.js';
import cron from "node-cron";
import { deleteOldCompletedOrders } from './model/cleanupOrders.js';
dotenv.config({ silent: true });
const PORT = process.env.PORT || 9090; 
const app = express();  
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors(corsOptions))
app.use(express.static("view"));
app.use(express.json());
app.use(cookieParser());
app.set("trust proxy", true); // IMPORTANT if behind proxy (nginx, cloud, vercel, etc.)

cron.schedule("0 * * * *", () => {
  console.log("Running order cleanup job...");
  deleteOldPendingOrders();  // set orders to expired every 1 day and it checks every hour
});

app.get('/u',(req,res) => {
    res.sendFile(path.join(__dirname,'view', "hello.html"))
});
app.use("/auth", githubAuthRoute);
app.use('/register',register);
app.use('/login',login);
app.use('/refresh',refresh);
app.use('/logout',logout);

app.use('/products', productsController);
app.use('/user', user);
app.use('/create-checkout-session',checkout ) 
app.use('/verify-payment', verfiySession);
app.use(getUserLocation)

app.get("/api/geo", (req, res) => {
    res.json(req.geo);
});
// STATUS 404
app.get('/*path', (req, res) => {  
    res.status(404);
    if(req.accepts('html')) {
        res.status(404).sendFile(path.join(__dirname,'view','404.html'));
    } else if (req.accepts('json')) {
        res.json({error: '404 Not Found'});
    } else {
        res.type('txt').send('404 Not Found')
    }
});






app.listen(PORT, () => {console.log(`Server Running at Port: ${PORT}`)})