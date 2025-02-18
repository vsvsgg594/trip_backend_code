import mongoose from 'mongoose';

import bcrypt from 'bcrypt';

const userSchema=new mongoose.Schema(
  { 
    name:{type:String,required:true},
    email:{type:String,required:true},
    password:{type:String,required:true},
    username:{type:String ,required:true},
    isVerified:{type:Boolean,default:false},
    verificationToken:{type:String},
    resetToken: { type: String, default: null },
    resetTokenExpires: { type: Date, default: null },
    role:{type:String,enum:["Admin","User"],default:"User"},
  },
  {timestamps: true }
);

userSchema.pre("save",async function(next){
  if(!this.isModified("password")) return next();
  this.password=await bcrypt.hash(this.password,12);
  next();
})

userSchema.methods.isValidPassword = async function(password) {
  return bcrypt.compare(password, this.password);
}

const User = mongoose.model("User", userSchema);
export default User;