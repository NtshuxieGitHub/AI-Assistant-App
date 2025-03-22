import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const addSelectedAssistants = mutation({
  args: {
    records: v.any(),
    uid: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if records is not empty and contains valid objects
    if (
      !args.records ||
      !Array.isArray(args.records) ||
      args.records.length === 0
    ) {
      throw new Error("🚨 Records are missing or invalid!");
    }

    // Ensure records are well-formed
    const validatedRecords = args.records.map((record, index) => {
      if (!record || !record.id || !record.name || !record.title) {
        console.error(`🚨 Invalid record at index ${index}:`, record);
        throw new Error(
          `🚨 Invalid record at index ${index}. It must have valid id, name, and title.`
        );
      }

      // Ensure uid is added to each record
      return { ...record, uid: args.uid };
    });

    // Insert each validated record
    const assistantId = await Promise.all(
      validatedRecords.map(async (record) => {
        return await ctx.db.insert("assistants", record);
      })
    );

    return assistantId;
  },
});

export const getAllUserAssistants = query({
  args: {
    uid: v.string(),
  },
  handler: async (ctx, args) => {
    const output = await ctx.db
      .query("assistants")
      .filter((q) => q.eq(q.field("uid"), args.uid))
      .collect();

    return output;
  },
});
