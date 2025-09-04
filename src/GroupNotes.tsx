import React from "react";
import { useParams } from "react-router-dom";
import { NotesApp } from "./NotesApp";

export function GroupNotes() {
  const { groupId } = useParams<{ groupId: string }>();
  const decodedGroupId = groupId ? decodeURIComponent(groupId) : undefined;
  
  // Để debug
  console.log("GroupNotes - groupId:", groupId);
  console.log("GroupNotes - decodedGroupId:", decodedGroupId);
  
  // Sử dụng lại component NotesApp nhưng với nhóm được chỉ định
  return <NotesApp initialGroup={decodedGroupId} />;
}
