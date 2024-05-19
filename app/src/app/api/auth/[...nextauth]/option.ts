import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from 'next-auth/providers/google'
import { db } from "@/lib/db";
import { compare,hash } from "bcrypt";

export const options: NextAuthOptions = {
  secret: process.env.NEXT_PUBLIC_AUTH_SECRET,
  pages: {
    signIn: "/signin",
  },
  session: {
    strategy: "jwt",
  },
  providers: [

    CredentialsProvider({
      name:"Credentials",
      credentials:{
        email:{},
        password:{},
      },
      //@ts-ignore
      async authorize(credentials) {
        try {
          console.log(credentials);
      
          if (credentials?.email && credentials?.password) {
            const isUserExists = await db.user.findUnique({ where: { email: credentials?.email } });
            console.log(isUserExists);
      
            if (!isUserExists) {
              console.log("User does not exist, creating new user", credentials.email, credentials.password);
              const hashedPassword = await hash(credentials.password, 10);
      
              const newUser = await db.user.create({
                data: {
                  email: credentials.email,
                  password: hashedPassword,
                  type: 1,
                  provider: "credentials",
                },
              });
      
              console.log('New user created', newUser);
              return newUser;
            } else {
              if (isUserExists.password && isUserExists.provider === 'credentials') {
                const passwordMatch = await compare(credentials.password, isUserExists.password);
                if (passwordMatch) {
                  return isUserExists;
                }
              } else if (isUserExists.provider === 'google') {
                return isUserExists;
              }
            }
            return null;
          }
        } catch (error) {
          console.error("Error in authorization", error);
          throw new Error("Authorization failed");
        }
      }
      
    }),
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET!,
    })
  ],

  callbacks: {
    async jwt({ token, user, trigger, session,account }) {
      const email = user?.email
      if( typeof email === 'string'){
      if(account?.provider === 'google'  && user){
        const isUserExists = await db.user.findUnique({where: { email: email }})
        if(!isUserExists){
         const newUser =  await db.user.create({
            data: {
              email: email,
              type: 1,
              profilePic: user.image,
              provider: 'google'
            }
          })

          token.email = newUser.email
          token.id = newUser.id
          token.onboarded = newUser.onboarded
          token.picture = newUser.profilePic 
          token.role = newUser.type.toString()
        }
        else{
          token.email = isUserExists.email
          token.id = isUserExists.id
          token.picture = isUserExists.profilePic ? isUserExists.profilePic : null
          token.role = isUserExists.type.toString()
        }
      }
      else if(account?.provider === 'credentials' && user){
        //@ts-ignore
        token.onboarded = user.onboarded
        token.email = user.email
        token.id = user.id
        //@ts-ignore
        token.picture = user.profilePic ? user.profilePic : null
        //@ts-ignore
        token.role = user.type.toString()
        console.log("user" , user)
        
      }
    }
     return token
    },
    async session({ session, token }) {
      session.user.onboarded = token.onboarded as boolean;
      session.user.id = token.id;
      session.user.role = token.role;
      session.user.image = token.picture ? token.picture : null;
      console.log('session' , session)
      return session;
    },
  },
};
