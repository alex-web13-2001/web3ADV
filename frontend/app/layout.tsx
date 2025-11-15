import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Wildberries Ads Analytics Dashboard",
  description: "Analytics dashboard for Wildberries advertising campaigns",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
