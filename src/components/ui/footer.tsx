// src/components/ui/footer.tsx
import Link from "next/link";
import { Container } from "./container";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-white py-12">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">Nike Shop</h3>
            <p className="text-gray-300 text-sm">
              The best place to find authentic Nike shoes at great prices. We
              offer a wide selection of Nike footwear for all your athletic and
              casual needs.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Shop</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/products"
                  className="text-gray-300 hover:text-white text-sm"
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  href="/products?featured=true"
                  className="text-gray-300 hover:text-white text-sm"
                >
                  Featured
                </Link>
              </li>
              <li>
                <Link
                  href="/products?new=true"
                  className="text-gray-300 hover:text-white text-sm"
                >
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link
                  href="/products?bestseller=true"
                  className="text-gray-300 hover:text-white text-sm"
                >
                  Best Sellers
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/help"
                  className="text-gray-300 hover:text-white text-sm"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping"
                  className="text-gray-300 hover:text-white text-sm"
                >
                  Shipping Information
                </Link>
              </li>
              <li>
                <Link
                  href="/returns"
                  className="text-gray-300 hover:text-white text-sm"
                >
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-300 hover:text-white text-sm"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/privacy"
                  className="text-gray-300 hover:text-white text-sm"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-gray-300 hover:text-white text-sm"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/refund"
                  className="text-gray-300 hover:text-white text-sm"
                >
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/cookie"
                  className="text-gray-300 hover:text-white text-sm"
                >
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-300 text-sm">
              &copy; {currentYear} Nike Shop. All rights reserved.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white"
              >
                Facebook
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white"
              >
                Twitter
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white"
              >
                Instagram
              </a>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
