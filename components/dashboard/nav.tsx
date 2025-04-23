"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Icons } from "@/components/icons"

const navItems = [
  {
    title: "Projects",
    href: "/dashboard",
    icon: <Icons.folder className="mr-2 h-4 w-4" />,
  },
  {
    title: "Code Editor",
    href: "/editor/new",
    icon: <Icons.code className="mr-2 h-4 w-4" />,
  },
  {
    title: "Live Share",
    href: "/live-share",
    icon: <Icons.share className="mr-2 h-4 w-4" />,
  },
  {
    title: "AI Chat",
    href: "/ai-chat",
    icon: <Icons.messageSquare className="mr-2 h-4 w-4" />,
  },
  {
    title: "Collaborators",
    href: "/dashboard/collaborators/new",
    icon: <Icons.users className="mr-2 h-4 w-4" />,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: <Icons.settings className="mr-2 h-4 w-4" />,
  },
]

export function DashboardNav() {
  const pathname = usePathname()

  return (
    <nav className="flex flex-col space-y-2 p-4">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors
            ${
              pathname === item.href ? "bg-slate-800 text-white" : "text-slate-400 hover:bg-slate-800 hover:text-white"
            }`}
        >
          {item.icon}
          {item.title}
        </Link>
      ))}
    </nav>
  )
}
