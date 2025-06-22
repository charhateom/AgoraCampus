
import Post from "../models/Post.js";
import User from "../models/User.js";
import cloudinary from "../lib/cloudinary.js";

export const createPost = async (req, res) => {
  try {
    const { content, image } = req.body;
    const author = req.user._id;

    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newPost = await Post.create({
      author,
      content,
      image: imageUrl
    });

    // Populate author details
    await newPost.populate("author", "fullName profilePic");

    res.status(201).json({
      success: true,
      post: newPost
    });
  } catch (error) {
    console.error("Create post error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create post"
    });
  }
};

export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate("author", "fullName profilePic")
      .populate("comments.user", "fullName profilePic");

    res.json({
      success: true,
      posts
    });
  } catch (error) {
    console.error("Get posts error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch posts"
    });
  }
};

export const likePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found"
      });
    }

    // Check if user already liked the post
    const alreadyLiked = post.likes.includes(userId);
    if (alreadyLiked) {
      // Unlike the post
      post.likes = post.likes.filter(id => id.toString() !== userId.toString());
    } else {
      // Like the post
      post.likes.push(userId);
    }

    await post.save();

    // Populate author and comments after saving
    await post.populate("author", "fullName profilePic");
    await post.populate("comments.user", "fullName profilePic");

    res.json({
      success: true,
      post
    });
  } catch (error) {
    console.error("Like post error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to like post"
    });
  }
};

export const commentOnPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const { text } = req.body;
    const userId = req.user._id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found"
      });
    }

    post.comments.push({
      user: userId,
      text,
      createdAt: new Date()
    });

    await post.save();

    // Populate author and all comments' user details
    await post.populate("author", "fullName profilePic");
    await post.populate("comments.user", "fullName profilePic");

    res.json({
      success: true,
      post
    });
  } catch (error) {
    console.error("Comment error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add comment"
    });
  }
};

export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found"
      });
    }

    // Check if user is the author
    if (post.author.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this post"
      });
    }

    await Post.findByIdAndDelete(postId);

    res.json({
      success: true,
      message: "Post deleted successfully"
    });
  } catch (error) {
    console.error("Delete post error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete post"
    });
  }
};