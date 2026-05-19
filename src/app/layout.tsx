import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { QuizProvider } from "@/context/QuizContext";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-geist-sans" });

export const metadata: Metadata = {
  title: "BeeWise Quiz Review",
  description: "Review and validate BeeWise quiz questions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body className={`${inter.variable} font-sans`}>
        <QuizProvider>{children}</QuizProvider>
      </body>
    </html>
  );
}
