import "../globals.css";

export const metadata = {
  title: "Partner",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
};

export const viewport = {
  themeColor: "#f4f4f5",
  width: "device-width",
  initialScale: 1,
};

export default function PartnerRootLayout({ children }) {
  return (
    <html lang="bs">
      <body className="min-h-screen bg-zinc-100 font-sans text-zinc-900 antialiased">
        {children}
      </body>
    </html>
  );
}
