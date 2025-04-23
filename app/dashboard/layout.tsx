import type React from "react"
import { UserButton } from "@clerk/nextjs"
import { DashboardNav } from "@/components/dashboard/nav"
import { UserNav } from "@/components/dashboard/user-nav"
import { Icons } from "@/components/icons"
import { MobileNav } from "@/components/dashboard/mobile-nav"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-950">
      <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950">
        <div className="flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Icons.logo className="h-6 w-6 text-emerald-500" />
            <span className="text-lg font-bold text-white">CodeCollab</span>
          </div>
          <div className="hidden md:flex md:items-center md:gap-4">
            <UserNav />
            <UserButton afterSignOutUrl="/" />
          </div>
          <MobileNav />
        </div>
      </header>
      <div className="flex flex-1">
        <aside className="hidden w-64 border-r border-slate-800 bg-slate-900 md:block">
          <DashboardNav />
        </aside>
        <main className="flex-1 bg-slate-950">{children}</main>
      </div>
    </div>
  )
}
