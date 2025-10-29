import { Toaster } from "@/components/ui/sonner";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";

export default function HotelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <div className="bg-slate-800 min-h-screen">
        <main>{children}</main>
        <Toaster />
      </div>
    </ClerkProvider>
  );
}
