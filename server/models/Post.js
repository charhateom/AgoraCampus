import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  author: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  content: { 
    type: String, 
    required: true 
  },
  image: { 
    type: String 
  },
  likes: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User" 
  }],
  comments: [{
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    text: { 
      type: String, 
      required: true 
    },
    createdAt: { 
      type: Date, 
      default: Date.now 
    }
  }],
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

const Post = mongoose.model("Post", postSchema);

export default Post;