import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';


dotenv.config();
const ConnectDB=async()=>{
  try{
    const conn=await mongoose.connect(`${process.env.MONGO_DB_URL}`);
    console.log("Database coonect successfully");

  }catch(err){
    console.log("failed to connected database",err)

  }
}

export default ConnectDB;