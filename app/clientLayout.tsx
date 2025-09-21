"use client"

import type React from "react"
import { Inter } from "next/font/google"
import { OrganizationSwitcher } from "@/components/organization-switcher"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"

import { AppSidebar } from "@/components/app-sidebar"
import { Header } from "@/components/header"

// Using a const with an arrow function, as per your preference.
const ClientLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  
  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset>
        <SidebarTrigger/>
        <Header/>
        <main className="flex-1 overflow-y-auto">
          <div className="p-6">{children}</div>
        </main>
      </SidebarInset>

    </SidebarProvider>
  )
}

export default ClientLayout