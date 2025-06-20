import express from 'express';
import {
  signup,
  login,
  checkAuth,
  updateProfile,
} from '../controllers/userController.js';
import { protectRoute } from '../middleware/auth.js';

const userRouter = express.Router();

// ✅ These routes will be prefixed with /api/auth from server.js
userRouter.post("/signup", signup);
userRouter.post("/login", login);
userRouter.get("/check", protectRoute, checkAuth);
userRouter.put("/update-profile", protectRoute, updateProfile); // ✅ Full path: /api/auth/update-profile

export default userRouter;