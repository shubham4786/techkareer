import type { Metadata } from "next";
import Head from "next/head";
import "./globals.css";
import Providers from "./Providers";



export const metadata: Metadata = {
  title: "Techkareer",
  description: "The only app you need for hiring",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        <link
          rel="icon"
          href="/icon?<generated>"
          type="image/<generated>"
          sizes="<generated>"
        />
        <link
          rel="apple-touch-icon"
          href="/apple-icon?<generated>"
          type="image/<generated>"
          sizes="<generated>"
        />
      </Head>
      <body >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
