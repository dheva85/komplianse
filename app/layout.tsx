import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KomplianSE — SME Compliance & Onboarding for Malaysia",
  description:
    "Streamline employee onboarding and statutory compliance (EPF, SOCSO, EIS, LHDN) for Malaysian SMEs. Automate checklists, track deadlines, and stay compliant.",
  keywords: ["compliance", "onboarding", "Malaysia", "SME", "EPF", "SOCSO", "HR", "payroll"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
