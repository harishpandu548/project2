import authOptions from "@/lib/auth";
import uploadOnCloudinary from "@/lib/cloudinary";
import connectdb from "@/lib/dbconnection";
import User from "@/model/user.model";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest) {
    try {
        await connectdb()
        const session=await getServerSession(authOptions)
        if(!session || !session.user.email || !session.user.id){
            return NextResponse.json(
                {message:"user does not have session"},
                {status:400}
            )
        }

      const formData=await req.formData()
      const name=formData.get("name") as string
      const file=formData.get("file") as Blob | null

      let imageUrl;

      if(file){
        imageUrl=await uploadOnCloudinary(file)
      }

   const user = await User.findByIdAndUpdate(session.user.id,{
    name,image:imageUrl
   },{new:true})

   if(!user){
     return NextResponse.json(
                {message:"user not found"},
                {status:400}
            )
   }

   return NextResponse.json(
                user,
                {status:200}
            )

    } catch (error) {
          return NextResponse.json(
                {message:`edit error ${error}`},
                {status:500}
            )
    }
}