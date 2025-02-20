import express from "express";
import dotenv from "dotenv";

import ConnectDB from "./database/ConnectDB.js";
import userRoutes from "./routes/userRoutes.js";
import User from "./model/user.js";
import jwt from 'jsonwebtoken';
import packagesRoute from './routes/packagesRoute.js';
import path from 'path';
import { fileURLToPath } from "url";
import cors from 'cors';


// Properly derive __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({
  origin: "https://tripjinny.kbsoftwaresolutions.com", 
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept"]
}));
// app.use(cors({origin:"*"}))


app.use('/uploads', express.static('uploads'));

ConnectDB();
app.use('/uploads', express.static(path.resolve(__dirname, 'uploads')));
app.use("/api/user", userRoutes);
app.use("/api/user",packagesRoute);
app.get('/verify/:token', async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }
    user.isVerified = true;
    user.verificationToken = null;
    console.log("user2",user)
    await user.save();
    res.status(200).json({ message: "Email verified successfully! You can now log in." });

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });

  }

})
app.post('/api/user/reset-password/:resetToken', async (req, res) => {
  try {
    const { resetToken } = req.params;
    const { newpassword } = req.body;

    if (!resetToken || !newpassword) {
      return res.status(400).json({ message: "Token and new password are required" });
    }
    console.log("New password:", newpassword);

    let decoded;
    try {
      decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }
   console.log("decoded",decoded);

    const user = await User.findOne({ _id: decoded.id });
    console.log("new user ",user);


    if (!user || user.resetTokenExpires < new Date()) {
      return res.status(400).json({ message: "Token expired or invalid" });
    }

    // Hash the new password
   

    // Clear reset token fields
    user.password=newpassword;
    user.resetToken = null;
    user.resetTokenExpires = null;

    // Save the updated user
    try {
      await user.save();
      console.log("User  after save:", user); // Log the user after saving
    } catch (saveError) {
      console.error("Error saving user:", saveError);
      return res.status(500).json({ message: "Failed to save user" });
    }

    res.status(200).json({ message: "Password reset successful!" });

  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ message: "Failed to reset password" });
  }
});
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`App is Running at port number ${PORT}`);
});
