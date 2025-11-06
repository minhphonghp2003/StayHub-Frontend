"use client";

import { useSidebar } from "@/context/SidebarContext";
import StoreProvider from "@/context/StoreContext";
import { Menu } from "@/core/model/RBAC/Menu";
import MenuService from "@/core/service/RBAC/MenuService";
import { getAuthInfo } from "@/core/service/RBAC/TokenService";
import AppHeader from "@/layout/AppHeader";
import AppSidebar from "@/layout/AppSidebar";
import Backdrop from "@/layout/Backdrop";
import { setUser } from "@/redux/features/RBAC/UserSlice";
import { AppStore, store } from "@/redux/store";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  let [menus, setMenus] = useState<Menu[]>([]);
  const dispatch = useDispatch()

  let fetchMenus = async () => {
    let result = await MenuService.getMyMenus();
    setMenus(result);
  }
  useEffect(() => {
    dispatch(setUser(getAuthInfo().user))
  }, [])


  // Dynamic class for main content margin based on sidebar state
  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
      ? "lg:ml-[290px]"
      : "lg:ml-[90px]";

  return (

      <div className="min-h-screen xl:flex">
        {/* Sidebar and Backdrop */}
        <AppSidebar />
        <Backdrop />
        {/* Main Content Area */}
        <div
          className={`flex-1 transition-all  duration-300 ease-in-out ${mainContentMargin}`}
        >
          {/* Header */}
          <AppHeader />
          {/* Page Content */}
          <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">{children}</div>
        </div>
      </div>
  );
}
