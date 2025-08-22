import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const list = query({
  args: {
    filter: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }
    
    let notesQuery = ctx.db
      .query("notes")
      .withIndex("by_author", (q) => q.eq("authorId", userId));
      
    // Apply filter if provided
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
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("notes"),
    content: v.string(),
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
