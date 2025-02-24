import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import localFont from "next/font/local";

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Socio Point",
  description: "",
};

const bely = localFont({
  src: "./fonts/bely-display.ttf",
  display: "swap",
  variable: "--font-bely",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable}  ${bely.variable} ${poppins.className} font-poppins bg-neutral-50 antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
