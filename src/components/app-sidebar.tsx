import * as React from "react";
import { useNavigate } from "react-router-dom";
import {
  BookText, 
  PenSquare, 
  Search, 
  Star, 
  Settings, 
  BookMarked,
  List,
  Folder,
  Plus
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

function GroupList() {
  const navigate = useNavigate();
  const groups = useQuery(api.notes.listGroups) || [];
  
  return (
    <>
      {groups.length === 0 ? (
        <div className="px-3 py-2 text-sm text-muted-foreground italic">
          Chưa có nhóm nào
        </div>
      ) : (
        // Sử dụng kỹ thuật ép kiểu an toàn
        groups.map((group) => {
          const groupName = String(group);
          return (
            <SidebarMenuItem key={groupName}>
              <SidebarMenuButton 
                onClick={() => navigate(`/dashboard/groups/${encodeURIComponent(groupName)}`)}
              >
                <Folder className="mr-2 h-4 w-4" />
                <span>{groupName}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })
      )}
      <SidebarMenuItem>
        <SidebarMenuButton 
          onClick={() => navigate("/dashboard/groups/new")}
          className="text-muted-foreground hover:text-foreground"
        >
          <Plus className="mr-2 h-4 w-4" />
          <span>Thêm nhóm mới</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </>
  );
}

// Import theme toggle component
import { ThemeToggle } from "@/components/theme-toggle";
import { useIsMobile } from "@/hooks/use-mobile";

export function AppSidebar() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  return (
    <SidebarContent className="border-r">
      <SidebarHeader className="flex h-16 items-center px-4 justify-between transition-[width,height] ease-linear">
        <div className="flex items-center gap-2 text-lg font-semibold">
          <BookMarked className="h-6 w-6 text-primary" />
          <span>ANT Notes</span>
        </div>
        <ThemeToggle />
      </SidebarHeader>
      <div className="flex flex-col flex-1">
        <div className="px-2 pb-2 pt-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Tìm kiếm ghi chú..."
              className="w-full pl-8 focus-visible:ring-primary"
            />
          </div>
        </div>
        <SidebarMenu>
          <div className="px-3 py-2">
            <h2 className="text-xs font-semibold tracking-tight">Chính</h2>
          </div>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => navigate("/dashboard")}>
              <BookText className="mr-2 h-4 w-4" />
              <span>Tất cả ghi chú</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => navigate("/dashboard/starred")}>
              <Star className="mr-2 h-4 w-4" />
              <span>Ghi chú đánh dấu</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => navigate("/dashboard/recent")}>
              <PenSquare className="mr-2 h-4 w-4" />
              <span>Gần đây</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <Separator className="my-4" />
        <SidebarMenu>
          <div className="px-3 py-2">
            <h2 className="text-xs font-semibold tracking-tight">Nhóm</h2>
          </div>
          <GroupList />
        </SidebarMenu>
      </div>
      <SidebarFooter>
        <div className="flex items-center justify-between p-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/dashboard/settings")}
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </SidebarFooter>
    </SidebarContent>
  );
}
