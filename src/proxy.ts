import {NextRequest, NextResponse }from "next/server"
import { getToken } from "next-auth/jwt";

export async function proxy(req:NextRequest){
    const {pathname}=req.nextUrl
    const publicroutes=[
        "/login",
        "/register",
        "/api/auth"
    ]
    if(publicroutes.some(path=>pathname.startsWith(path))){
        return NextResponse.next()
    }

    const token=await getToken({req,secret:process.env.SECRET_KEY="harish123"})
    if(!token){
        const loginUrl=new URL("/login",req.url)
        loginUrl.searchParams.set("callbackUrl",req.url)
        return NextResponse.redirect(loginUrl)
    }
    return NextResponse.next()
}

export const config ={
matcher:"/((?!api|_next/static|_next/image|favicon.ico|node_modules).*)"
}