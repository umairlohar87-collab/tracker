import Sidebar from "./Sidebar";
import MobileNav from "./MobileNav";
import Topbar from "./Topbar";

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex h-[100dvh] bg-bg text-slate-100 overflow-hidden">
      {/* Desktop / tablet sidebar */}
      <Sidebar />

      {/* Main column */}
      <div className="flex flex-1 flex-col min-w-0 min-h-0">
        <Topbar />

        {/* Scrollable content area */}
        <main className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden">
          {children}
        </main>

        {/* Mobile bottom nav (hidden on lg+) */}
        <MobileNav />
      </div>
    </div>
  );
}