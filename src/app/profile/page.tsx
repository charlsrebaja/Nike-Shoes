// src/app/profile/page.tsx
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth/auth-options";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold">Profile</h1>
      <p className="mt-4">Name: {session?.user?.name}</p>
      <p>Email: {session?.user?.email}</p>
    </div>
  );
}
