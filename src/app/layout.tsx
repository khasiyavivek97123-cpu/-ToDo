import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "!todo - Minimalist Productivity Engine",
  description: "A minimalist, keyboard-first task manager designed for deep work and complete task clarity.",
  icons: {
    icon: "/assets/images/logo-mark.png",
    shortcut: "/assets/images/logo-mark.png",
    apple: "/assets/images/logo-mark.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} font-sans h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
