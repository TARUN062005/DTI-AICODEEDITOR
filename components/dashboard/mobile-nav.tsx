"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Icons } from "@/components/icons"
import { DashboardNav } from "./nav"
import { UserNav } from "./user-nav"

export function MobileNav() {
  const [open, setOpen] = useState(false)

  return (
    <div className="md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="text-white">
            <Icons.menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 border-r border-slate-800 bg-slate-900 p-0">
          <div className="flex h-16 items-center border-b border-slate-800 px-6">
            <Icons.logo className="h-6 w-6 text-emerald-500" />
            <span className="ml-2 text-lg font-bold text-white">CodeCollab</span>
          </div>
          <div className="px-2 py-4">
            <DashboardNav />
          </div>
          <div className="absolute bottom-4 left-4">
            <UserNav />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
