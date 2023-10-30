//first iteration

import NextAuth from "next-auth";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import GoogleProvider from "next-auth/providers/google";
import clientPromise from "@/lib/mongodb";

const adminEmails = ["ednahakoth21@gmail.com"];
export default NextAuth({
  providers: [
    // OAuth authentication providers...

    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  adapter: MongoDBAdapter(clientPromise), //uses active connection if available else creates connection. check the lib/mongodb file
  // only admin emails should login to the admin dashboard
  callbacks: {
    session: ({ session, token, user }) => {
      if (adminEmails.includes(session?.user?.email)) {
        return session;
      } else {
        return session;
      }
    },
  },
});


// second iteration
// import NextAuth, { getServerSession } from "next-auth";
// import GoogleProvider from "next-auth/providers/google";
// import { MongoDBAdapter } from "@auth/mongodb-adapter";
// import clientPromise from "@/lib/mongodb";

// const adminEmails = ["ednahakoth21@gmail.com"];

// export const authOptions = {
//   secret: process.env.SECRET,
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_ID,
//       clientSecret: process.env.GOOGLE_SECRET,
//     }),
//   ],
//   adapter: MongoDBAdapter(clientPromise),
//   callbacks: {
//     session: ({ session, token, user }) => {
//       if (adminEmails.includes(session?.user?.email)) {
//         return session;
//       } else {
//         return false;
//       }
//     },
//   },
// };

// export default NextAuth(authOptions);

// export async function isAdminRequest(req, res) {
//   const session = await getServerSession(req, res, authOptions);
//   if (!adminEmails.includes(session?.user?.email)) {
//     res.status(401);
//     res.end();
//     throw "not an admin";
//   }
// }
