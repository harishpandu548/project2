import connectdb from "@/lib/dbconnection";
import User from "@/model/user.model";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request:NextRequest) {
    try {
        const {name,email,password}=await request.json()
        // this await coonectdb()
//         means
//         if (already connected) {
//    return existing connection;
// } else {
//    connect now
// }
        await connectdb() 
        const existingUser=await User.findOne({email})
        if(existingUser){
            return NextResponse.json({
                message:"User already with this email exists"
            },{status:400})
        }
        if(password.length<6){
            return NextResponse.json({
                message:"Password must be more then 6 character"
            },{
                status:400
            })
        }
        const bcryptedpass=await bcrypt.hash(password,10)
        const user=await User.create({
            name:name,
            email,
            password:bcryptedpass
        })
        return NextResponse.json(
            user,{status:201}
        )

    } catch (error) {
        return NextResponse.json({
            message:"registed error",error
        },{status:500})
    }
    
}

// sign up steps

//check user exits
// pass check for any condition like  min 6 length
// hash the password 
// create the user
