import { Toaster } from "@/components/ui/sonner";
import { ClerkProvider } from "@clerk/nextjs";

export default function HotelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <div className="bg-slate-800 h-full">
        <main className="min-h-screen w-full">{children}</main>
        <Toaster />
      </div>
    </ClerkProvider>
  );
}
