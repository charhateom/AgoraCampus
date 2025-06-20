import { generateToken } from "../lib/utils.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";
// ---------------------------------------------
// SIGNUP CONTROLLER
// ---------------------------------------------
export const signup = async (req, res) => {
  const { fullName, email, password, bio } = req.body;

  try {
    if (!fullName || !email || !password || !bio) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields.",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Account already exists with this email.",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
      bio,
    });

    const token = generateToken(newUser._id);

    res.status(201).json({
      success: true,
      message: "Account created successfully.",
      userData: {
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        bio: newUser.bio,
      },
      token,
    });
  } catch (error) {
    console.error("Signup error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

// ---------------------------------------------
// LOGIN CONTROLLER
// ---------------------------------------------
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials.",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials.",
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: "Login successful.",
      userData: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        bio: user.bio,
      },
      token,
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};


// controller to check if user is authenticated 

export const checkAuth = (req,res) => {
    res.json({
        success:true , user:req.user
    });

}
// controller to update user profile details 
// export const updateProfile = async (req, res) => {
//   try {
//     const { profilePic, bio, fullName } = req.body;
//     const userId = req.user._id;

//     if (!bio || !fullName) {
//       return res.status(400).json({
//         success: false,
//         message: "Full name and bio are required.",
//       });
//     }

//     let updatedUser;

//     if (!profilePic) {
//       updatedUser = await User.findByIdAndUpdate(
//         userId,
//         { fullName, bio },
//         { new: true }
//       );
//     } else {
//       const upload = await cloudinary.uploader.upload(profilePic, {
//         folder: "profilePics",
//       });

//       updatedUser = await User.findByIdAndUpdate(
//         userId,
//         { profilePic: upload.secure_url, fullName, bio },
//         { new: true }
//       );
//     }

//     res.status(200).json({
//       success: true,
//       message: "Profile updated successfully.",
//       user: {
//         _id: updatedUser._id,
//         fullName: updatedUser.fullName,
//         email: updatedUser.email,
//         bio: updatedUser.bio,
//         profilePic: updatedUser.profilePic,
//       },
//     });
//   } catch (error) {
//     console.error("Profile update error:", error.message);
//     res.status(500).json({
//       success: false,
//       message: "Server error. Please try again later.",
//     });
//   }
// };



// Update profile controller with better error handling
export const updateProfile = async (req, res) => {
  try {
    console.log('Update profile request received:', req.body);
    
    const { profilePic, bio, fullName } = req.body;
    const userId = req.user._id;

    if (!bio || !fullName) {
      return res.status(400).json({
        success: false,
        message: "Full name and bio are required",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { fullName, bio, profilePic },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser
    });

  } catch (error) {
    console.error('Profile update error:', error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error during profile update"
    });
  }
};
