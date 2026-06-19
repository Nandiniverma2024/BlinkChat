import express from 'express';
import "dotenv/config";
import cors from "cors";
import { connectDB } from './lib/db.js';
import job from './lib/cron.js';
import clerkWebhook from './webhooks/clerk.webhook.js';
import authRoutes from './routes/auth.route.js';


import fs from 'fs';
import path from 'path';


import { clerkMiddleware } from '@clerk/express';

const app=express();
const PORT=process.env.PORT || 3000;
const FRONTEND_URL=process.env.FRONTEND_URL;
const publicDir=path.join(process.cwd(),"public");  //public directory path

// it's importtant that we don't parse webhook event data, it should be in raw format 
app.use("/api/webhooks/clerk",express.raw({type:"application/json"}), clerkWebhook);

// Middlewares
app.use(express.json());
app.use(cors({origin:FRONTEND_URL, credentials:true}));
app.use(clerkMiddleware());


app.get("/health", (req,res)=>{
    res.status(200).json({ok:true});
});

app.use("/api.auth",authRoutes);

// if public directory exists, serve the static files
// This is for prodcution build
if(fs.existsSync(publicDir)){
    app.use(express.static(publicDir));

    app.get("/{*any}",(req, res,next)=>{
        res.sendFile(path.join(publicDir, "index.html"), (err)=>next(err));
    })
}

app.listen(PORT,()=>{
    connectDB();
    console.log(`Server is running on port ${PORT}`);

    if(process.env.NODE_ENV==="production"){
        job.start;
    }
})
