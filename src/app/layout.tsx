import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
export const metadata: Metadata = {
  title: "Welcome | Luxe Lagoon",
  description:
    "Luxe Lagoon is a premium website where you can effortlessly plan and book your dream vacations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" style={{ height: "100%", overflow: "hidden" }}>
        <body
          style={{
            backgroundImage: "url('background.jpeg')",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            height: "100vh",
            margin: 0,
          }}
        >
          <div className="absolute inset-0 bg-black opacity-30 w-full h-full"></div>
          <div className="relative z-10">{children}</div>
        </body>
      </html>
    </ClerkProvider>
  );
}
