"use client"

import * as React from "react"
import {
  IconDashboard,
  IconUsers,
  IconMap,
  IconMapSearch,
  IconCalendar,
  IconStar,
  IconUserCircle,
  IconSettings,
  IconHelp,
  IconSearch,
  IconHeart,
  IconPlus,
  IconLayout2,
  IconPackage,
  IconHelpCircle,
  IconShoppingBag,
} from "@tabler/icons-react";

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"
import Image from "next/image"
import logo from "@/images/best-seller-1.png"


import { redirect } from "next/dist/server/api-utils";
import { IUser } from "@/types/user";
import { getMyProfile } from "@/app/utills/auth";


const navData = {
  ADMIN: {
    navMain: [
      { title: "Dashboard", url: "/dashboard/admin", icon: IconLayout2 },
      { title: "Manage Users", url: "/dashboard/admin/users", icon: IconUsers },
      { title: "Manage Products", url: "/dashboard/admin/listings", icon: IconPackage },
      { title: "Orders", url: "/dashboard/admin/orders", icon: IconCalendar },
      { title: "Profile", url: "/dashboard/admin/profile", icon: IconUserCircle },
    ],
    navSecondary: [
      { title: "Settings", url: "/admin/settings", icon: IconSettings },
      { title: "Get Help", url: "/help", icon: IconHelpCircle },
      { title: "Search", url: "/search", icon: IconSearch },
    ],
  },

  SELLER: {
    navMain: [
      { title: "Dashboard", url: "/dashboard/seller", icon: IconLayout2 },
      { title: "My Products", url: "/dashboard/seller/my-products", icon: IconShoppingBag },
      { title: "Create Product", url: "/dashboard/seller/create-product", icon: IconPlus },
      { title: "Orders Requests", url: "/dashboard/seller/orders", icon: IconCalendar },
      { title: "My Reviews", url: "/dashboard/seller/reviews", icon: IconStar },
      { title: "Profile", url: "/dashboard/seller/profile", icon: IconUserCircle },
    ],
    navSecondary: [
      { title: "Settings", url: "/seller/settings", icon: IconSettings },
      { title: "Get Help", url: "/help", icon: IconHelpCircle },
      { title: "Search", url: "/search", icon: IconSearch },
    ],
  },

  CUSTOMER: {
    navMain: [
      { title: "Dashboard", url: "/dashboard/customer", icon: IconLayout2 },
      { title: "Browse Products", url: "/products", icon: IconShoppingBag },
      { title: "My Orders", url: "/dashboard/customer/my-orders", icon: IconCalendar },
      { title: "Favorites", url: "/dashboard/customer/favorites", icon: IconHeart },
      { title: "Profile", url: "/dashboard/customer/profile", icon: IconUserCircle },
    ],
    navSecondary: [
      { title: "Settings", url: "/customer/settings", icon: IconSettings },
      { title: "Get Help", url: "/help", icon: IconHelpCircle },
      { title: "Search", url: "/search", icon: IconSearch },
    ],
  },
};


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

  const [user, setUser] = React.useState<IUser | null>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getMyProfile()

        setUser(res.data || null)

      } catch (err) {
        console.error("Failed to fetch user:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchUser()
  }, [])


  console.log("from dahsboasrd", user)

  const role = user?.role || "ADMIN"

  const data = navData[role]





  return (
    <Sidebar collapsible="offcanvas" {...props} className="bg-white shadow-xl shadow-blue-200">
      <SidebarHeader className="bg-white">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="felx"
            >
             
              <div className="flex items-center">
                <Link href="/" className="flex items-center space-x-2 group">
                  <div className="h-6 w-6 rounded-sm bg-linear-to-br from-primary to-primary/80 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <span className="text-white font-bold text-xl">S</span>
                  </div>
                  <span className="text-xl font-bold text-gray-900 dark:text-white">
                    Shop<span className="text-primary">Cart</span>
                  </span>
                </Link>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="bg-white">
        <NavMain items={data.navMain} />

        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={{
          name: user?.name as string,
          email: user?.email as string,
          profilePhoto: user?.profilePhoto as string
        }} />
      </SidebarFooter>
    </Sidebar>
  )
}