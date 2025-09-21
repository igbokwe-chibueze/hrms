// components/app-sidebar.tsx
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

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
import { OrganizationSwitcher } from "./organization-switcher"

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

export function AppSidebar() {
  return (
    <Sidebar>
        <SidebarHeader />
        <SidebarContent>
            {/* Organization Switcher */}
            <div className="px-2 mb-4">
                <OrganizationSwitcher />
            </div>
            
            <SidebarGroup>
                <SidebarGroupLabel>Application</SidebarGroupLabel>
                <SidebarGroupContent>
                    <SidebarMenu>
                        {navigation.map((item) => (
                            <SidebarMenuItem key={item.name}>
                                <SidebarMenuButton asChild>
                                    <a href={item.href}>
                                        <item.icon />
                                        <span>{item.name}</span>
                                    </a>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
                <SidebarGroupLabel>Admi</SidebarGroupLabel>
                <SidebarGroupContent>
                    <SidebarMenu>
                        {adminNavigation.map((item) => (
                            <SidebarMenuItem key={item.name}>
                                <SidebarMenuButton asChild>
                                    <a href={item.href}>
                                        <item.icon />
                                        <span>{item.name}</span>
                                    </a>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroupContent>
            </SidebarGroup>
        </SidebarContent>
        <SidebarFooter />
    </Sidebar>
  )
}