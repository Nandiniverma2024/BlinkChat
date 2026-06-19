import express from 'express';
import { checkAuth } from '../controllers/auth.controller.js';
import { protectRoute } from '../middlewares/auth.middleware.js';

const router=express.Router();

// When user sends an api , it will look like => /api/auth/check
// because of this line from index.js file => app.use("/api.auth",authRoutes)
// this(/api/auth) will already a prefix
router.get("/check", protectRoute, checkAuth);
// check if user is authenticated with help of => protectRoute(middleware)
// only then we call checkAuth method

export default router;
