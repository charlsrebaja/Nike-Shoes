// src/components/ui/navbar.tsx
"use client";

import Link from "next/link";
import { useState, useEffect, memo } from "react";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import { FaShoppingCart } from "react-icons/fa";
import { Container } from "./container";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Badge } from "./badge";
import { useCartStore } from "@/store/cart-store";

interface NavItem {
  label: string;
  href: string;
  protected?: boolean;
  adminOnly?: boolean;
}

// Navigation items configuration
const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Categories", href: "/categories" },
  { label: "Cart", href: "/cart" },
  { label: "Orders", href: "/orders", protected: true },
  { label: "Admin", href: "/admin", adminOnly: true },
];

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();
  const isAdmin = session?.user.role === "ADMIN";
  const { getItemCount, setUser } = useCartStore();

  // Calculate total cart items count
  const cartItemCount = getItemCount();

  // Update cart store when user changes
  useEffect(() => {
    setUser(session?.user?.id || null);
  }, [session?.user?.id, setUser]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const filteredNavItems = navItems.filter((item) => {
    if (item.adminOnly && !isAdmin) return false;
    if (item.protected && !session) return false;
    return true;
  });

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <Container>
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link
              href="/"
              className="flex items-center text-xl font-bold text-black"
            >
              <Image
                src="/logo.jpg"
                alt="Nike Shop"
                width={36}
                height={36}
                className="object-contain mr-2"
              />
             
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {filteredNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-gray-700 hover:text-black relative flex items-center",
                  pathname === item.href && "font-medium text-black"
                )}
              >
                {item.label === "Cart" ? (
                  <>
                    <FaShoppingCart className="h-5 w-5" />
                    {cartItemCount > 0 && (
                      <Badge
                        variant="destructive"
                        className="absolute -top-2 -right-3 h-5 w-5 flex items-center justify-center p-0 text-xs"
                      >
                        {cartItemCount > 99 ? "99+" : cartItemCount}
                      </Badge>
                    )}
                  </>
                ) : (
                  item.label
                )}
              </Link>
            ))}
          </nav>

          {/* Auth Buttons - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {session ? (
              <div className="flex items-center space-x-4">
                <Link href="/profile">
                  <div className="flex items-center space-x-2 cursor-pointer">
                    {session.user.image ? (
                      <Image
                        src={session.user.image}
                        alt={session.user.name || "User"}
                        width={32}
                        height={32}
                        className="h-8 w-8 rounded-full cursor-pointer"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer">
                        <span className="text-sm font-medium text-gray-600">
                          {session.user.name?.charAt(0) || "U"}
                        </span>
                      </div>
                    )}
                  </div>
                </Link>
                <Button
                  variant="secondary"
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="cursor-pointer"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="secondary" className="cursor-pointer">
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="cursor-pointer">Sign Up</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-gray-700 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4">
              {filteredNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "text-gray-700 hover:text-black cursor-pointer relative",
                    pathname === item.href && "font-medium text-black"
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="flex items-center">
                    {item.label === "Cart" ? (
                      <>
                        <FaShoppingCart className="h-5 w-5 mr-2" />
                        <span>Cart</span>
                        {cartItemCount > 0 && (
                          <Badge
                            variant="destructive"
                            className="ml-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                          >
                            {cartItemCount > 99 ? "99+" : cartItemCount}
                          </Badge>
                        )}
                      </>
                    ) : (
                      item.label
                    )}
                  </span>
                </Link>
              ))}

              {!session ? (
                <div className="flex flex-col space-y-2 pt-4 border-t border-gray-100">
                  <Link
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="cursor-pointer"
                  >
                    <Button
                      variant="secondary"
                      fullWidth
                      className="cursor-pointer"
                    >
                      Login
                    </Button>
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="cursor-pointer"
                  >
                    <Button fullWidth className="cursor-pointer">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              ) : (
                <div>
                  <Link
                    href="/profile"
                    className="pt-4 border-t border-gray-100 block cursor-pointer"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className="flex items-center space-x-2">
                      {session.user.image ? (
                        <Image
                          src={session.user.image}
                          alt={session.user.name || "User"}
                          width={32}
                          height={32}
                          className="h-8 w-8 rounded-full cursor-pointer"
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer">
                          <span className="text-sm font-medium text-gray-600">
                            {session.user.name?.charAt(0) || "U"}
                          </span>
                        </div>
                      )}
                      <span className="text-gray-700 cursor-pointer">
                        {session.user.name || session.user.email}
                      </span>
                    </div>
                  </Link>

                  <div className="pt-4 border-t border-gray-100">
                    <Button
                      variant="secondary"
                      fullWidth
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        signOut({ callbackUrl: "/" });
                      }}
                      className="cursor-pointer"
                    >
                      Logout
                    </Button>
                  </div>
                </div>
              )}
            </nav>
          </div>
        )}
      </Container>
    </header>
  );
}

// Memoize the component to prevent unnecessary re-renders
export default memo(Navbar);
