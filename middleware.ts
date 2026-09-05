// middleware.ts
import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

export default NextAuth(authConfig).auth;

export const config = {
  // Yeh un routes ki list hai jinhe protect karna hai
  // Static files, images aur api routes ko chhor kar baqi jagah check lagata hai
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};