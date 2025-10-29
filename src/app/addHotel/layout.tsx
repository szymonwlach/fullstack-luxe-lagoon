export default function PodstronaLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <div className="bg-slate-800 min-h-screen h-auto">{children}</div>;
}
