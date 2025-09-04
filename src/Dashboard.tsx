import React from "react";
import { Routes, Route, useParams } from "react-router-dom";
import { AppSidebar } from "@/components/app-sidebar";
import { NotesApp } from "./NotesApp";
import { GroupNotes } from "./GroupNotes";
import { DashboardBreadcrumb } from "./DashboardBreadcrumb";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { UserAccountMenu } from "./UserAccountMenu";
import {
  Sidebar,
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export function Dashboard() {
  return (
    <SidebarProvider>
      <div className="flex h-screen bg-background">
        <Sidebar>
          <AppSidebar />
        </Sidebar>
        <SidebarInset className="flex flex-col flex-1">
          <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              <Separator
                orientation="vertical"
                className="mx-2 data-[orientation=vertical]:h-4"
              />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage><DashboardBreadcrumb /></BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <UserAccountMenu />
          </header>
          
          <div className="flex-1 overflow-auto p-4">
            <Routes>
              <Route index element={<NotesApp initialGroup={undefined} />} />
              <Route path="starred" element={<div>Starred Notes</div>} />
              <Route path="recent" element={<div>Recent Notes</div>} />
              {/* Đặt route cụ thể trước route có params */}
              <Route path="groups/new" element={<NotesApp initialGroup={undefined} />} />
              <Route path="groups/:groupId" element={<GroupNotes />} />
              <Route path="settings" element={<div>Settings</div>} />
            </Routes>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
