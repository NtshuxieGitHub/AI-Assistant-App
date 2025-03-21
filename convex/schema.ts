import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    given_name: v.string(),
    family_name: v.string(),
    email: v.string(),
    picture: v.string(),
    credits: v.number(),
    date: v.string(),
    time: v.string(),
    orderId: v.optional(v.string()),
  }),
  assistants: defineTable({
    id: v.number(),
    name: v.string(),
    title: v.string(),
    image: v.string(),
    instruction: v.string(),
    userInstruction: v.string(),
    sampleQuestions: v.any(),
  }),
});
