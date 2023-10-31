import clientPromise from "@/lib/mongodb";
import { MongoDBAdapter } from "@auth/mongodb-adapter"; 
import NextAuth, { getServerSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";



const adminEmail = ['nandhakish2001@gmail.com'];


const authOption = {
  secret: process.env.SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  callbacks : {
    session: ({session,token,user}) => { 
        if(session?.user?.email){
        return session;
      }else{
        return false;
      }

      }
    } 
  }

export default NextAuth(authOption);

export async function isAdminRequest(req, res, authOption) {
  try {
    const session = await getServerSession(req, res, authOption);

    if (!adminEmail.includes(session?.user?.email)) {
      throw new Error('NOT AN ADMIN');
    }
  } catch (error){
  }
}