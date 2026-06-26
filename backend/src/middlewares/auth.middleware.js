import { getAuth } from "@clerk/express";
import User from "../models/user.model.js";


// if protectRoute not run successfully , we call the method next to protectRoute
export async function protectRoute(req,res, next) {
    try {
        const { userId }=getAuth(req);
        // if userId is not existthen user is unauthorized
        if(!userId){
            res.status(401).json({ message:"Unauthorized" });
            return;
        }

        // Get user from database
        const user=await User.findOne({clerkId:userId});
        // This user can be undefined(or not exist)
        if(!user){
            res.status(404).json({ message: "User profile is not synced yet" });
            return;
        }

        // If everyThing run successfully
        req.user=user;
        next();
    } catch (error) {
        console.log("Error in protectRule middleware:", error.message);
        res.status(500).json({message:"Internal server error"});
    }
}


