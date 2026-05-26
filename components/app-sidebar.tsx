"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  Store, 
  Tag, 
  FolderOpen, 
  Users, 
  ShieldAlert
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@/components/ui/sidebar"

const items = [
  {
    title: "Бошқарув панели",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Сотувчилар",
    url: "/sellers",
    icon: Store,
  },
  {
    title: "Чегирма ва Маҳсулотлар",
    url: "/sales",
    icon: Tag,
  },
  {
    title: "Категориялар",
    url: "/categories",
    icon: FolderOpen,
  },
  {
    title: "Фойдаланувчилар",
    url: "/users",
    icon: Users,
  },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar variant="sidebar" collapsible="icon" className="border-r border-slate-100 bg-white">
      <SidebarHeader className="h-20 border-b border-slate-100 px-6 flex flex-row items-center gap-3 bg-white">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white font-black text-xl shadow-lg shadow-indigo-100 select-none">
          E
        </div>
        <div className="flex flex-col overflow-hidden group-data-[collapsible=icon]:hidden">
          <span className="font-black text-slate-900 tracking-tight text-base leading-none">ELON TИЗИМИ</span>
          <span className="text-[9px] text-indigo-600 font-extrabold tracking-widest mt-1.5 uppercase">Администратор</span>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="py-6 px-3 bg-white">
        <SidebarGroup>
          <SidebarGroupLabel className="px-3 text-[9px] font-bold uppercase tracking-widest text-slate-400 group-data-[collapsible=icon]:hidden">
            МЕНЮ
          </SidebarGroupLabel>
          <SidebarGroupContent className="mt-4">
            <SidebarMenu className="space-y-1">
              {items.map((item) => {
                const isActive = pathname === item.url
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={isActive}
                      tooltip={item.title}
                      className={`flex items-center gap-3 px-3 py-2.5 transition-all duration-200 rounded-xl ${
                        isActive 
                          ? "bg-indigo-50 text-indigo-600 font-bold" 
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      <Link href={item.url} className="flex items-center w-full gap-3">
                        <item.icon className={`h-4 w-4 shrink-0 transition-colors ${isActive ? "text-indigo-600" : "text-slate-400"}`} />
                        <span className="group-data-[collapsible=icon]:hidden text-xs font-semibold tracking-wide">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-slate-100 p-4 bg-white">
        <div className="flex items-center gap-3 p-1">
          <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-50 border border-slate-100 text-slate-700 font-black text-xs">
            АД
            <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
          </div>
          <div className="flex flex-col overflow-hidden group-data-[collapsible=icon]:hidden">
            <span className="truncate text-xs font-bold text-slate-800">Администратор</span>
            <div className="flex items-center gap-1 text-[9px] text-emerald-600 font-extrabold uppercase tracking-wide mt-0.5">
              Тизимда фаол
            </div>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
