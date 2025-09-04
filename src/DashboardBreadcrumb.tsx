import React from "react";
import { useParams, useLocation } from "react-router-dom";

export function DashboardBreadcrumb() {
  const params = useParams<{ groupId?: string }>();
  const groupId = params.groupId;
  const location = useLocation();
  const path = location.pathname;
  
  // Để debug
  console.log("DashboardBreadcrumb - params:", params);
  console.log("DashboardBreadcrumb - path:", path);
  
  // Xác định tiêu đề hiển thị dựa trên đường dẫn
  let title = "Ghi chú";
  
  if (path.includes("/dashboard/starred")) {
    title = "Ghi chú đánh dấu";
  } else if (path.includes("/dashboard/recent")) {
    title = "Ghi chú gần đây";
  } else if (path.includes("/dashboard/groups/new")) {
    title = "Thêm nhóm mới";
  } else if (groupId && path.includes("/dashboard/groups/")) {
    title = decodeURIComponent(groupId);
  } else if (path.includes("/dashboard/settings")) {
    title = "Cài đặt";
  }
  
  return <span>{title}</span>;
}
