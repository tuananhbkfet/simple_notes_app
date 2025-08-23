import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const list = query({
  args: {
    filter: v.optional(v.string()),
    group: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }
    
    let notesQuery;
    
    // Xử lý lọc theo nhóm
    if (args.group) {
      if (args.group === "no_group") {
        notesQuery = ctx.db
          .query("notes")
          .withIndex("by_author", (q) => q.eq("authorId", userId))
          .filter((q) => q.or(
            q.eq(q.field("group"), undefined),
            q.eq(q.field("group"), "")
          ));
      } else {
        notesQuery = ctx.db
          .query("notes")
          .withIndex("by_author_and_group", (q) => q.eq("authorId", userId).eq("group", args.group));
      }
    } else {
      notesQuery = ctx.db
        .query("notes")
        .withIndex("by_author", (q) => q.eq("authorId", userId));
    }
      
    // Apply status filter if provided
    if (args.filter === "completed") {
      notesQuery = notesQuery.filter((q) => q.eq(q.field("completed"), true));
    } else if (args.filter === "incomplete") {
      notesQuery = notesQuery.filter((q) => 
        q.or(
          q.eq(q.field("completed"), false),
          q.eq(q.field("completed"), undefined)
        )
      );
    }
    
    return await notesQuery.order("desc").collect();
  },
});

export const create = mutation({
  args: {
    content: v.string(),
    group: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Must be logged in to create notes");
    }
    
    if (args.content.trim() === "") {
      throw new Error("Note content cannot be empty");
    }
    
    return await ctx.db.insert("notes", {
      content: args.content.trim(),
      authorId: userId,
      completed: false,
      group: args.group && args.group.trim() !== "" ? args.group.trim() : undefined,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("notes"),
    content: v.string(),
    group: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Must be logged in to update notes");
    }
    
    const note = await ctx.db.get(args.id);
    if (!note) {
      throw new Error("Note not found");
    }
    
    if (note.authorId !== userId) {
      throw new Error("Cannot update another user's note");
    }
    
    if (args.content.trim() === "") {
      throw new Error("Note content cannot be empty");
    }
    
    await ctx.db.patch(args.id, {
      content: args.content.trim(),
      group: args.group !== undefined ? (args.group.trim() !== "" ? args.group.trim() : undefined) : note.group,
    });
  },
});

export const remove = mutation({
  args: {
    id: v.id("notes"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Must be logged in to delete notes");
    }
    
    const note = await ctx.db.get(args.id);
    if (!note) {
      throw new Error("Note not found");
    }
    
    if (note.authorId !== userId) {
      throw new Error("Cannot delete another user's note");
    }
    
    await ctx.db.delete(args.id);
  },
});

export const toggleCompleted = mutation({
  args: {
    id: v.id("notes"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Must be logged in to update notes");
    }
    
    const note = await ctx.db.get(args.id);
    if (!note) {
      throw new Error("Note not found");
    }
    
    if (note.authorId !== userId) {
      throw new Error("Cannot update another user's note");
    }
    
    const newCompletedStatus = !(note.completed ?? false);
    await ctx.db.patch(args.id, {
      completed: newCompletedStatus,
    });
    
    return newCompletedStatus;
  },
});

// Thêm một query mới để lấy tất cả các nhóm đã được tạo
export const listGroups = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }
    
    const notes = await ctx.db
      .query("notes")
      .withIndex("by_author", (q) => q.eq("authorId", userId))
      .collect();
    
    // Lấy danh sách các nhóm và loại bỏ giá trị trùng lặp, undefined, hoặc chuỗi rỗng
    const groups = new Set();
    notes.forEach(note => {
      if (note.group && note.group.trim() !== "") {
        groups.add(note.group);
      }
    });
    
    return Array.from(groups).sort();
  },
});

export const renameGroup = mutation({
  args: {
    oldGroupName: v.string(),
    newGroupName: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Must be logged in to rename groups");
    }
    
    if (args.newGroupName.trim() === "") {
      throw new Error("New group name cannot be empty");
    }
    
    // Lấy tất cả các ghi chú thuộc nhóm cũ
    const notes = await ctx.db
      .query("notes")
      .withIndex("by_author_and_group", (q) => q.eq("authorId", userId).eq("group", args.oldGroupName))
      .collect();
    
    // Cập nhật từng ghi chú với tên nhóm mới
    for (const note of notes) {
      await ctx.db.patch(note._id, {
        group: args.newGroupName.trim(),
      });
    }
    
    return notes.length; // Trả về số lượng ghi chú đã được cập nhật
  },
});
