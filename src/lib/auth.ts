import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import connectdb from "./dbconnection";
import User from "@/model/user.model";
import bcrypt from "bcryptjs";
import Google from "next-auth/providers/google";
import type { GoogleProfile } from "next-auth/providers/google"; // added

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(credentials, req) {
        const email = credentials?.email;
        const password = credentials?.password;
        if (!email || !password) {
          throw new Error("email or password not found");
        }
        await connectdb();
        const user = await User.findOne({ email });
        if (!user) {
          throw new Error("User not found");
        }
        const ispassMatch = await bcrypt.compare(password, user.password);
        if (!ispassMatch) {
          throw new Error("password is incorrect");
        }
        return {
          id: user._id,
          name: user.name,
          email: user.email,
          image: user.image,
        };
      },
    }),

    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    // signin using google(only works for google)
    // this signIn used for google etc not credentials(email,pass) bcz we signing user above using credentials now for google we need to take data when clicked on google and create the user if he doesnot exists
   async signIn({ account, user, profile }) {
  if (account?.provider === "google") {
    await connectdb();

    const googleProfile = profile as GoogleProfile;
    const googleImage = googleProfile?.picture;

    let exituser = await User.findOne({ email: user?.email });

    if (!exituser) {
      exituser = await User.create({
        name: user.name,
        email: user?.email,
        image: googleImage,
      });
    } else {
      // typed update object instead of `any`
      const updatedFields: { name?: string; image?: string } = {};

      if (googleImage && exituser.image !== googleImage) {
        updatedFields.image = googleImage;
      }
      if (user?.name && exituser.name !== user.name) {
        updatedFields.name = user.name;
      }

      if (Object.keys(updatedFields).length) {
        await User.findByIdAndUpdate(exituser._id, { $set: updatedFields });
        exituser = await User.findById(exituser._id);
      }
    }

    user.id = exituser._id.toString();
  }
  return true;
},
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.image = user.image;
        return token;
      }
      if (!user && token?.id) {
        try {
          await connectdb();
          const dbUser = await User.findById(token.id).lean();
          if (dbUser) {
            token.name = dbUser.name;
            token.email = dbUser.email;
            token.image = dbUser.image;
          }
        } catch (err) {
          console.log("DB refresh error:", err);
        }
      }

      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.image as string;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  secret: process.env.SECRET_KEY,
};

export default authOptions;
