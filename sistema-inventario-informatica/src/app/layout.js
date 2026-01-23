import { Inter } from "next/font/google";
import React from "react";
import ToastProvider from "../components/ToastProvider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Screening ADL",
  description: "Sistema Screening ADL",
  icons: {
    icon: '/favicon.ico',
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

const RootLayout = ({ children }) => {
  return (
    <html lang="es">
      <body
        className={`font-sans ${inter.className} bg-zinc-50 text-gray-800`}
      >
        {/* ENVUELVE EL CONTENIDO CON EL PROVIDER DE CLIENTE */}
        <ToastProvider>
          <main>{children}</main>
        </ToastProvider>
      </body>
    </html>
  );
};

export default RootLayout;