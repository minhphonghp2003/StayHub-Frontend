"use client";

import { useSidebar } from "@/context/SidebarContext";
import { MenuGroup } from "@/core/model/RBAC/Menu";
import { propertyService } from "@/core/service/pmm/property-service";
import MenuService from "@/core/service/RBAC/menu-service";
import { getAuthInfo } from "@/core/service/RBAC/token-service";
import AppHeader from "@/layout/AppHeader";
import AppSidebar from "@/layout/AppSidebar";
import Backdrop from "@/layout/Backdrop";
import { setPropertyList } from "@/redux/features/property/PropertySlice";
import { setUser } from "@/redux/features/RBAC/UserSlice";
import { RootState } from "@/redux/store";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  let [menus, setMenus] = useState<MenuGroup[]>([]);
  let [loadingProperty, setLoadingProperty] = useState(true);
  const dispatch = useDispatch()
  const currentProperty = useSelector((state: RootState) => state.property.selectedPropertyId)
  let fetchMenus = async (propertyId?: number) => {

    setMenus([])
    let result = await MenuService.getMyMenus(propertyId);
    setMenus(result);
  }
  let fetchProperty = async () => {
    setLoadingProperty(true);
    let result = await propertyService.getMyProperties();
    dispatch(setPropertyList(result ?? []))
    setLoadingProperty(false);
  }
  useEffect(() => {
    dispatch(setUser(getAuthInfo().user))
    fetchProperty()
  }, [])
  useEffect(() => {
    if (!loadingProperty) {
      fetchMenus(currentProperty ?? undefined)
    }
  }, [currentProperty, loadingProperty])



  // Dynamic class for main content margin based on sidebar state
  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
      ? "lg:ml-[290px]"
      : "lg:ml-[90px]";

  return (

    <div className="min-h-screen xl:flex bg-bg-white dark:bg-bg-black">
      {/* Sidebar and Backdrop */}
      <AppSidebar menuGroups={menus} />
      <Backdrop />
      {/* Main Content Area */}
      <div
        className={`flex-1 transition-all  duration-300 ease-in-out ${mainContentMargin}`}
      >
        {/* Header */}
        <AppHeader />
        {/* Page Content */}
        <div className="p-4 mx-auto md:p-6">{children}</div>
      </div>
    </div>
  );
}
