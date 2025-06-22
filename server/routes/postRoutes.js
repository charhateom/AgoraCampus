
import express from "express";
import { protectRoute } from "../middleware/auth.js";
import {
  createPost,
  getPosts,
  likePost,
  commentOnPost,
  deletePost
} from "../controllers/postController.js";

const router = express.Router();

router.post("/", protectRoute, createPost);
router.get("/", protectRoute, getPosts);
router.put("/like/:id", protectRoute, likePost);
router.put("/comment/:id", protectRoute, commentOnPost);
router.delete("/:id", protectRoute, deletePost);

export default router;