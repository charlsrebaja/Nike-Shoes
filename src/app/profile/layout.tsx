// src/app/profile/layout.tsx
import { Container } from "@/components/ui/container";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <div className="bg-gray-50 min-h-screen">
        <Container className="py-6">
          <main className="bg-white rounded-lg shadow-sm p-6">{children}</main>
        </Container>
      </div>
      <Footer />
    </>
  );
}
