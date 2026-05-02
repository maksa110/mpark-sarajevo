import "../globals.css";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-montserrat",
});

export const metadata = {
  title: "Admin",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
};

export const viewport = {
  themeColor: "#fafafa",
  width: "device-width",
  initialScale: 1,
};

export default function AdminRootLayout({ children }) {
  return (
    <html lang="bs" className={montserrat.variable}>
      <body className="min-h-screen bg-zinc-100 font-sans text-zinc-900 antialiased">
        {children}
      </body>
    </html>
  );
}
