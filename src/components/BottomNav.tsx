"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { href: "/dashboard",     icon: "🏠", label: "Inicio"     },
  { href: "/mis-figuritas", icon: "🃏", label: "Mis figus"  },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50"
         style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
      <div className="flex">
        {ITEMS.map(({ href, icon, label }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={`flex-1 flex flex-col items-center py-3 gap-0.5 transition-colors ${
                active ? "text-green-600" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <span className="text-2xl">{icon}</span>
              <span className={`text-xs font-bold ${active ? "text-green-600" : "text-gray-400"}`}>
                {label}
              </span>
              {active && (
                <span className="absolute bottom-0 w-12 h-0.5 bg-green-500 rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
