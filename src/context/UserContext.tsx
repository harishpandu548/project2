"use client"
import axios from 'axios'
import { useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'

type userContextType={
  user:userType | null ,
  setUser:(user:userType | null)=>void
}

type userType={
  name:string,
  email:string,
  id:string,
  image?:string,
}

export const userDataContext=React.createContext<userContextType | undefined>(undefined)

function UserContext({children}:{children:React.ReactNode}) {
  const [user,setUser]=useState<userType | null>(null)
  const { data: session, status } = useSession()
  // const data={
  //   user,setUser
  // }

  // If NextAuth session is available, initialize user from it.
  useEffect(()=>{

      if (status === "authenticated" && session?.user) {
      // session.user fields come from your NextAuth session callback
       Promise.resolve().then(() =>
      setUser({
        id: session.user.id,
        name: session.user.name ?? "",
        email: session.user.email ?? "",
        image: session.user.image ?? undefined,
      })
    )
      return;
    }
    
    async function getUser() {
      try {
        const result=await axios.get("/api/user")
        setUser(result.data)
      } catch (error) {
        console.log(error) 
      }   
    }
    getUser()
  },[session,status])


  return (
    <userDataContext.Provider value={{user,setUser}}>
      {children}
    </userDataContext.Provider>
  )
}

export default UserContext
