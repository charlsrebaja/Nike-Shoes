// src/lib/auth/next-auth.d.ts
import "next-auth";
import { Role } from "../../generated/prisma";

declare module "next-auth" {
  interface User {
    id: string;
    role: Role;
  }

  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      image: string;
      role: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: Role;
  }
}
