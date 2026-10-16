"use client";

import Link from "next/link";
import { BriefcaseBusiness, Building2, CreditCard, Flame, House, LayoutDashboard, Menu, Settings, Sparkles, Users, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const navigation = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/reservations", label: "Reservations", icon: BriefcaseBusiness },
  { href: "/admin/rooms", label: "Rooms", icon: Building2 },
  { href: "/admin/guests", label: "Guests", icon: Users },
  { href: "/admin/housekeeping", label: "Housekeeping", icon: Sparkles },
  { href: "/admin/payments", label: "Payments", icon: CreditCard },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!sidebarOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSidebarOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [sidebarOpen]);

  return (
    <div className="admin-shell">
      <aside className={`admin-sidebar ${collapsed ? "is-collapsed" : ""} ${sidebarOpen ? "is-open" : ""}`}>
        <div className="admin-sidebar-header">
          <div className="admin-brand">
            <span className="admin-brand-mark">S</span>
            {!collapsed && (
              <div className="admin-brand-copy">
                <strong>Solavéra Hotel</strong>
                <small>Management</small>
              </div>
            )}
          </div>
          <button type="button" className="admin-collapse-btn" aria-label={collapsed ? "Expand admin navigation" : "Collapse admin navigation"} aria-controls="admin-nav" aria-expanded={!collapsed} onClick={() => setCollapsed((state) => !state)}>
            {collapsed ? <Flame size={16} /> : <X size={16} />}
          </button>
        </div>

        <nav id="admin-nav" className="admin-nav" aria-label="Admin navigation">
          {navigation.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href || (href !== "/admin" && pathname.startsWith(href));
            return (
              <Link key={href} href={href} className={`admin-nav-link ${isActive ? "active" : ""}`} onClick={() => setSidebarOpen(false)}>
                <Icon size={18} />
                {!collapsed && <span>{label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="admin-sidebar-footer">
          <Link href="/" className="admin-back-link">
            <House size={16} />
            {!collapsed && <span>Back to Hotel Website</span>}
          </Link>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-header">
          <div className="admin-header-left">
            <button ref={menuButtonRef} type="button" className="admin-menu-btn" aria-label={sidebarOpen ? "Close navigation" : "Open navigation"} aria-controls="admin-nav" aria-expanded={sidebarOpen} onClick={() => setSidebarOpen((state) => !state)}>
              {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
            <div className="admin-header-title">
              <span className="eyebrow with-line">Operations</span>
              <h1>Solavéra Hotel</h1>
            </div>
          </div>
          <div className="admin-header-actions">
            <span className="admin-chip">PMS Demo</span>
          </div>
        </header>

        <main className="admin-page">{children}</main>
      </div>

      {sidebarOpen && <button type="button" className="admin-drawer-backdrop visible" aria-label="Close navigation" onClick={() => setSidebarOpen(false)} />}
    </div>
  );
}
