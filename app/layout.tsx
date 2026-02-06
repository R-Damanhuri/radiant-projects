import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Radiant Projects - AI-Powered Automation",
    template: "%s | Radiant Projects"
  },
  description: "AI-powered projects for Indonesian market automation. Narralink: Convert links to social media posts. IDN Times Poetry: Full poetry automation.",
  keywords: ["AI", "automation", "Indonesia", "social media", "poetry", "Next.js", "Groq API"],
  authors: [{ name: "Radiant" }],
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://radiant-projects.netlify.app/",
    siteName: "Radiant Projects",
    title: "Radiant Projects - AI-Powered Automation",
    description: "AI-powered projects for Indonesian market automation",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Radiant Projects - AI Automation"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Radiant Projects - AI-Powered Automation",
    description: "AI-powered projects for Indonesian market automation",
    images: ["/og-image.svg"]
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
