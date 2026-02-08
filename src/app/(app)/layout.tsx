import { Sidebar } from "@/components/layout/sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="md:ml-64">
        <div className="container py-6 px-4 md:px-8 max-w-7xl">{children}</div>
      </main>
    </div>
  );
}
