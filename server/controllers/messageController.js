import User from '../models/User.js';
import Message from '../models/Message.js';
import cloudinary from '../lib/cloudinary.js';
import {io , userSocketMap} from "../server.js"
export const getUserForSidebar = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get all users except the logged-in user
    const filteredUsers = await User.find({ _id: { $ne: userId } }).select("-password");

    const unseenMessages = {};

    // For each user, count unseen messages sent to current user
    const promises = filteredUsers.map(async (user) => {
      const count = await Message.countDocuments({
        senderId: user._id,
        receiverId: userId,
        seen: false
      });

      if (count > 0) {
        unseenMessages[user._id] = count;
      }
    });

    await Promise.all(promises);

    res.json({
      success: true,
      users: filteredUsers,
      unseenMessages
    });

  } catch (error) {
    console.error("Sidebar Error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};


export const getMessage = async (req, res) => {
  try {
    const { id: selectedUserId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: selectedUserId },
        { senderId: selectedUserId, receiverId: myId },
      ],
    }).sort({ createdAt: 1 }); // Optional: sort messages chronologically

    // Mark all unseen messages from selected user to current user as seen
    await Message.updateMany(
      { senderId: selectedUserId, receiverId: myId, seen: false },
      { $set: { seen: true } }
    );

    res.json({
      success: true,
      messages,
    });

  } catch (error) {
    console.error("Get Message Error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};



//api to mark message as seen using message id
export const markMessageAsSeen = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedMessage = await Message.findByIdAndUpdate(
      id,
      { seen: true },
      { new: true }
    );

    if (!updatedMessage) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Message marked as seen",
      data: updatedMessage,
    });

  } catch (error) {
    console.error("Mark as Seen Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};


// send message to selected user 

export const sendMessage = async(req,res) =>{
    try{
        const {text , image} = req.body ;
        const receiverId = req.params.id ;
        const senderId = req.user._id;
        let imageUrl ;
        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }
        const newMessage = await Message.create({
            senderId,
            receiverId,
            text,
            image:imageUrl
        });
        //Emit the new message to the reciver 's scocket 
        const receiverSocketId = userSocketMap[receiverId];
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage",newMessage);
        }
        res.json({success:true , newMessage});

    }catch(error){
        console.log(error )
    }
}
