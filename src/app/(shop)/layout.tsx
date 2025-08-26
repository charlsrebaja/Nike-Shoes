// src/app/(shop)/layout.tsx
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </>
  );
}
