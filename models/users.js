const mongoose=require("mongoose")

const userSchema = mongoose.Schema({
    phoneNumber:{type:String,required:false, unique:true},
    email:{type:String,unique:true}
    
});

const User=mongoose.model(`User`,userSchema)
module.exports=User;