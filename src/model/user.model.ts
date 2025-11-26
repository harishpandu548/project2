import mongoose from "mongoose";

interface Iuser{
    _id?:mongoose.Types.ObjectId
    name:string,
    email:string,
    password?:string
    image?:string
    createdAt?:Date //optional
    updatedAt?:Date
}

const userSchema=new mongoose.Schema<Iuser>({
    name:{
        type:String
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:false
    },
    image:{
        type:String,
    }

},{
    timestamps:true
})

const User= mongoose.models.User || mongoose.model("User",userSchema)

export default User;

// const User=mongoose.model("User",userSchema)
// based on this line in mongodb will create model
// like mongoose.models={
//     User:userModel
// }
