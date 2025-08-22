import type { Metadata } from "next";
import localFont from "next/font/local";
import { Toaster } from "react-hot-toast";
import { Provider } from "@/components/ui/provider";
import { QueryProvider } from "@/components/provider/QueryProvider";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "RegistroMarca | Proyecto realizado por Jose Feliciano",
  description: "RegistroMarca creado con Next.js",
};

export default async function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <QueryProvider>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <Provider>
            {children}
            {modal}
            <Toaster position="top-right" reverseOrder={false} />
          </Provider>
        </body>
      </QueryProvider>
    </html>
  );
}
