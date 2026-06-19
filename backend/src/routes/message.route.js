import express from 'express';
import { getUsersForSidebar, getConversationsForSidebar, getMessages, sendMessage } from '../controllers/message.controller.js';
import { upload } from '../middlewares/upload.middleware.js';
import { protectRoute } from '../middlewares/auth.middleware.js';

const router=express.Router();

router.use(protectRoute); // Apply the protectRoute middleware to all routes in this router

// before getting this method check if user is authenticated with help of => protectRoute(middleware)
router.get("/users", getUsersForSidebar);
router.get("/conversations", getConversationsForSidebar);
router.get("/:id", getMessages);
router.post("/send/:id", upload.single("media"), sendMessage); //upload-> since user can send image or video so we need to upload it first and then send it

export default router;
