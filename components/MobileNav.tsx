"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Bell, Route, Settings } from "lucide-react";

const items = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/alerts", label: "Alerts", icon: Bell },
  { href: "/trips", label: "Trips", icon: Route },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function MobileNav() {
  const path = usePathname();

  return (
    <nav className="md:hidden shrink-0 border-t border-bg-border/60 bg-bg-soft/70 backdrop-blur-xl safe-bottom">
      <div className="grid grid-cols-4 px-1">
        {items.map(({ href, label, icon: Icon }) => {
          const active = path === href || path.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className="relative flex flex-col items-center justify-center gap-0.5 py-2.5 active:scale-95 transition"
            >
              {active && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 h-0.5 w-8 rounded-b-full bg-brand shadow-glow-sm" />
              )}
              <Icon
                className={`h-5 w-5 transition ${
                  active ? "text-brand" : "text-slate-500"
                }`}
              />
              <span
                className={`text-[10px] font-medium transition ${
                  active ? "text-brand" : "text-slate-500"
                }`}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}