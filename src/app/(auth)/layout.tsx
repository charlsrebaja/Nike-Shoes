// src/app/(auth)/layout.tsx
import Link from "next/link";
import { Container } from "@/components/ui/container";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="py-4 border-b border-gray-200 bg-white">
        <Container>
          <Link href="/" className="text-xl font-bold text-black">
            Nike Shop
          </Link>
        </Container>
      </header>
      <main className="flex-grow flex items-center justify-center py-12">
        {children}
      </main>
    </div>
  );
}
