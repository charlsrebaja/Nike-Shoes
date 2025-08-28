// src/app/(auth)/layout.tsx
import Link from "next/link";
import Image from "next/image";
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
          <Link
            href="/"
            className="flex items-center gap-2 text-xl font-bold text-black"
          >
            <Image
              src="/logo.jpg"
              alt="Nike Shop"
              width={32}
              height={32}
              className="object-contain"
            />
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
