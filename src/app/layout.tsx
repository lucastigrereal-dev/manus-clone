import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Manus — Hands On AI",
  description:
    "Manus is the action engine that goes beyond answers to execute tasks, automate workflows, and extend your human reach.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches))document.documentElement.classList.add('dark')}catch(e){}})();`,
          }}
        />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="OMNIS" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
