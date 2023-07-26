import "./globals.css";
import type { Metadata } from "next";
import localFont from "next/font/local";

export const metadata: Metadata = {
  title: "RestApp",
  description: "Generated by create next app",
};

const lato = localFont({
  src: [
    {
      path: "../../public/fonts/Lato/Lato-Thin.ttf",
      weight: "100",
    },
    {
      path: "../../public/fonts/Lato/Lato-Light.ttf",
      weight: "300",
    },
    {
      path: "../../public/fonts/Lato/Lato-Regular.ttf",
      weight: "400",
    },
    {
      path: "../../public/fonts/Lato/Lato-Bold.ttf",
      weight: "700",
    },
    {
      path: "../../public/fonts/Lato/Lato-Black.ttf",
      weight: "900",
    },
  ],
  variable: "--font-lato",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head></head>
      <body className={lato.className}>
        <main className="flex min-h-screen flex-col items-center bg-white">
          <div className="w-full min-h-screen pt-10 px-4 md:px-16">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
