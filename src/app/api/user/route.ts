import authOptions from "@/lib/auth";
import connectdb from "@/lib/dbconnection";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import User from "@/model/user.model";

export async function GET(req:NextRequest) {
    try {
        await connectdb()
        const session=await getServerSession(authOptions)
        if(!session || !session.user.email || !session.user.id){
            return NextResponse.json({message:"user doesnot have any session"},{status:400})
        }
        const user=await User.findById(session.user.id).select("-password")
        if(!user){
            return NextResponse.json({message:"User not found"},{status:400})
        }

        return NextResponse.json(
            user,{status:200}
        )
    } catch (error) {
         return NextResponse.json(
            {message:`Error while getting user data ${error}`},{status:500}
        )   
    }    
}