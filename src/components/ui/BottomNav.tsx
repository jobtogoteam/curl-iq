"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Home, TrendingUp, Camera, ShoppingBag } from "lucide-react";

const TABS = [
  { href: "/home",     Icon: Home,        label: "Home" },
  { href: "/history",  Icon: TrendingUp,  label: "Progress" },
  { href: "/scan",     Icon: Camera,      label: "Scan",    isScan: true },
  { href: "/products", Icon: ShoppingBag, label: "Products" },
];

export function BottomNav() {
  const pathname = usePathname();

  const activeIndex = TABS.findIndex(({ href, isScan }) =>
    isScan
      ? pathname === href || pathname.startsWith("/scan/")
      : pathname === href || (href !== "/home" && pathname.startsWith(href))
  );

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 max-w-app mx-auto z-50 safe-bottom"
      style={{
        background: "rgba(19, 16, 9, 0.88)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        borderTop: "1px solid rgba(255,255,255,0.07)",
        boxShadow: "0 -4px 24px rgba(0,0,0,0.4)",
      }}
    >
      <div className="flex items-end justify-around px-3 pt-2 pb-2.5">
        {TABS.map(({ href, Icon, label, isScan }, i) => {
          const isActive = i === activeIndex;

          if (isScan) {
            return (
              <div key={href} className="flex flex-col items-center relative">
                <Link href={href} className="flex flex-col items-center absolute -top-3">
                  <motion.span
                    whileTap={{ scale: 0.88 }}
                    className="flex items-center justify-center w-[54px] h-[54px] rounded-full"
                    style={{
                      background: isActive
                        ? "linear-gradient(135deg, var(--primary-dark), var(--primary))"
                        : "linear-gradient(135deg, var(--primary), var(--primary-dark))",
                      boxShadow: "0 4px 20px var(--primary-glow), 0 0 0 1px color-mix(in srgb, var(--primary) 25%, transparent)",
                    }}
                  >
                    <Icon size={22} className="text-white" strokeWidth={1.8} />
                  </motion.span>
                </Link>
                <div className="w-[54px] h-[54px]" />
                <span
                  className="text-[10px] font-medium tracking-wide"
                  style={{ color: isActive ? "var(--primary)" : "var(--text-tertiary)" }}
                >
                  {label}
                </span>
              </div>
            );
          }

          return (
            <Link
              key={href}
              href={href}
              className="relative flex flex-col items-center gap-1 py-1 px-3 min-w-[56px]"
            >
              {isActive && (
                <motion.span
                  layoutId="nav-indicator"
                  className="absolute -top-1 w-5 h-[2px] rounded-full"
                  style={{ background: "var(--primary)" }}
                  transition={{ type: "spring", stiffness: 500, damping: 40 }}
                />
              )}
              <motion.div
                whileTap={{ scale: 0.82 }}
                transition={{ type: "spring", stiffness: 700, damping: 30 }}
              >
                <Icon
                  size={21}
                  strokeWidth={isActive ? 2 : 1.5}
                  style={{
                    color: isActive ? "var(--primary)" : "var(--text-tertiary)",
                    transition: "color 0.2s, stroke-width 0.2s",
                  }}
                />
              </motion.div>
              <span
                className="text-[10px] font-medium tracking-wide transition-colors"
                style={{ color: isActive ? "var(--primary)" : "var(--text-tertiary)" }}
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
