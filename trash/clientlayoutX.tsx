// trash/clientlayoutX.tsx
"use client"

import type React from "react"
import { Inter } from "next/font/google"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { OrganizationSwitcher } from "@/components/organization-switcher"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
//import { AppSidebar } from "@/components/app-sidebar"
import {
  Home,
  Users,
  Clock,
  Calendar,
  DollarSign,
  TrendingUp,
  Settings,
  Bell,
  Search,
  Menu,
  Shield,
  Building,
  UserPlus,
  CreditCard,
  BarChart3,
  LogOut,
  User,
  X,
} from "lucide-react"
import { getCurrentUser } from "@/lib/dummy-data"

const inter = Inter({ subsets: ["latin"] })

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Employees", href: "/employees", icon: Users },
  { name: "Recruitment", href: "/recruitment", icon: UserPlus },
  { name: "Attendance", href: "/attendance", icon: Clock },
  { name: "Leave Management", href: "/leave", icon: Calendar },
  { name: "Performance", href: "/performance", icon: TrendingUp },
  { name: "Payroll", href: "/payroll", icon: DollarSign },
  { name: "Expenses", href: "/expenses", icon: CreditCard },
  { name: "Reports", href: "/reports", icon: BarChart3 },
  { name: "Organization", href: "/organization", icon: Building },
]

const adminNavigation = [
  { name: "Roles & Permissions", href: "/admin/roles", icon: Shield },
  { name: "System Settings", href: "/admin/settings", icon: Settings },
]

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const CURRENT_USER = getCurrentUser();
  
  return (
    <SidebarProvider>
      {/* <AppSidebar /> */}
      <SidebarInset>
        <div className="flex h-screen">
          {/* Mobile sidebar overlay */}
          {/* Sidebar */}
          <div
            className={cn(
              "fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-200 ease-in-out md:relative md:translate-x-0",
            )}
          >
            <div className="flex flex-col flex-grow h-full pt-5 overflow-y-auto bg-white border-r">
              <div className="flex items-center justify-between flex-shrink-0 px-4 mb-4">
                <h1 className="text-xl font-bold text-gray-900">HRMS Pro</h1>
                <Button variant="ghost" size="sm" className="md:hidden">
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Organization Switcher */}
              <div className="px-2 mb-4">
                <OrganizationSwitcher />
              </div>

              <div className="flex-grow flex flex-col">
                <nav className="flex-1 px-2 space-y-1">
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    >
                      <item.icon className="mr-3 h-5 w-5" />
                      {item.name}
                    </a>
                  ))}

                  <div className="pt-4">
                    <p className="px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Administration</p>
                    <div className="mt-2 space-y-1">
                      {adminNavigation.map((item) => (
                        <a
                          key={item.name}
                          href={item.href}
                          className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        >
                          <item.icon className="mr-3 h-5 w-5" />
                          {item.name}
                        </a>
                      ))}
                    </div>
                  </div>
                </nav>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="flex flex-col flex-1 overflow-hidden">
            {/* Top navigation */}
            <header className="bg-white shadow-sm border-b">
              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center">
                  <Button variant="ghost" size="sm" className="md:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                  <div className="hidden md:block ml-4 md:ml-0">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <input
                        type="text"
                        placeholder="Search..."
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <Button variant="ghost" size="sm">
                    <Bell className="h-5 w-5" />
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={CURRENT_USER.avatar || "/placeholder.svg"} alt="User" />
                          <AvatarFallback>
                            {CURRENT_USER.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">{CURRENT_USER.name}</p>
                          <p className="text-xs leading-none text-muted-foreground">{CURRENT_USER.personalEmail}</p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </header>

            {/* Page content */}
            <main className="flex-1 overflow-y-auto">
              <div className="p-6">{children}</div>
            </main>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
