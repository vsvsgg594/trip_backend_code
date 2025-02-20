import User from "../model/user.js";
import nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid'; 
import jwt from 'jsonwebtoken';
const transpoter=nodemailer.createTransport({
    service:"gmail",
    host:"smtp.gmail.com",
    port:587,
    secure:false,
    auth:{
        user:process.env.EMAIL,
        pass:process.env.PASSWORD

    }
})

export const registerUser=async(req,res)=>{
    try{
        const{name,email,password,username}=req.body;
        if(!name||!email||!password||!username){
            return res.status(400).json({message:"All fields are requied"});
        }

        
        const verificationToken=uuidv4();
        const newUser=new User({name,email,password,username,isVerified:true,verificationToken});
        await newUser.save();
        const verificationLink = `https://trip-backend-code-1.onrender.com/${verificationToken}`;
;
        const mailOption={
            from:process.env.EMAIL,
            to:email,
            subject:"verify your account",
            html: `
                <h2>Hello ${name},</h2>
                <p>Click the link below to verify your email:</p>
                <a href="${verificationLink}" target="_blank">Verify Email</a>
            `,
        }
        transpoter.sendMail(mailOption);
        res.status(200).json({ message: "Registration successful. Email sent!" });

    }catch(error){
        console.log("error",error);
        return res.status(404).json({message:"failed to send email"})

    }
}

export const loginUser=async(req,res)=>{
    try{
        const{username,password}=req.body;
        if(!username || !password){
            return res.status(400).json({message:"all fields are requeied"});
        }
        const user=await User.findOne({username});
        console.log("login user1223",user);
        if(!user){
            return res.status(402).json({message:"user not found"});
        }
        console.log("user login",user);
        const isMatchPassword = await user.isValidPassword(password);
        console.log("ismatch password",isMatchPassword);
        if(!isMatchPassword){
            return res.status(401).json({message:"password does not match"});
        }
        if(user.verificationToken!=null){
            return res.status(403).json({message:"please verify your account"});
        }
        
        return res.status(200).json({message:"user login successfully",user})




    }catch(err){
        console.log("error",err);
        return res.status(400).json({message:"failed to login"});

    }
}

export const forgotPassword=async(req,res)=>{
    try{
        const{email}=req.body;
        if(!email){
            return res.status(400).json({message:"Email fields are reruied"});

        }
        const user=await User.findOne({email});
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET,{ expiresIn: "15m" });
        user.resetToken = resetToken;
        user.resetTokenExpires = new Date(Date.now() + 15 * 60 * 1000);
        await user.save();

        const resetLink = `http://localhost:8000/reset-password/${resetToken}`;
        const mailOption={
           from:process.env.EMAIL,
           to:email,
           subject:"Reset your password",
           html: `
                <h2>Hello,</h2>
                <p>Click the link below to reset your password:</p>
                <a href="${resetLink}" target="_blank">Reset Password</a>
                <p>This link is valid for 15 minutes.</p>
            `,
        }
        await transpoter.sendMail(mailOption); 
        res.status(200).json({ message: "Password reset link sent to email!" });



    }catch(err){
        console.log("error",err);
        return res.status(401).json({message:"Failed to send email"});

    }
}