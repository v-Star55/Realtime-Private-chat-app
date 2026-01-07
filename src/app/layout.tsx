import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { JetBrains_Mono } from "next/font/google";
import { Providers } from "@/components/providers";
import { Toaster } from "react-hot-toast";

const jetbrainsMono= JetBrains_Mono({
  variable:"--font-jetbrains-mono",
  subsets:["latin"],
})


export const metadata: Metadata = {
  title: "Private Chat",
  description: "Private Chat App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${jetbrainsMono.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <Providers>
          {children}
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
