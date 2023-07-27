import { UserProvider } from "@auth0/nextjs-auth0/client";
import "./globals.css";
import type { Metadata } from "next";
import localFont from "next/font/local";
import { getSession } from "@auth0/nextjs-auth0";
import Link from "next/link";
import { redirect } from "next/navigation";

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

const Header = async () => {
  const session = await getSession();
  const name = session?.user.name;
  return (
    <div className="w-full flex justify-between text-textPrimary">
      <div className="">{name}</div>
      {name ? (
        <a className="text-warning" href="/api/auth/logout">
          Logout
        </a>
      ) : (
        <a className="text-warning" href="/api/auth/login">
          Login
        </a>
      )}
    </div>
  );
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserProvider>
      <html lang="en">
        <head></head>
        <body className={lato.className}>
          <main className="flex min-h-screen flex-col items-center bg-white">
            <div className="w-full min-h-screen pt-10 px-4 md:px-16">
              <Header />
              {children}
            </div>
          </main>
        </body>
      </html>
    </UserProvider>
  );
}
