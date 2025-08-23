import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  notes: defineTable({
    content: v.string(),
    authorId: v.id("users"),
    completed: v.optional(v.boolean()),
    group: v.optional(v.string()),
  }).index("by_author", ["authorId"])
    .index("by_author_and_group", ["authorId", "group"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
