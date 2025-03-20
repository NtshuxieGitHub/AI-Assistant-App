import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const createUser = mutation({
  args: {
    given_name: v.string(),
    family_name: v.string(),
    email: v.string(),
    picture: v.string(),
    date: v.string(),
    time: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if user already exists
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.email))
      .collect();

    if (user?.length == 0) {
      // If not, create user
      const data = {
        given_name: args.given_name,
        family_name: args.family_name,
        email: args.email,
        picture: args.picture,
        credits: 5000,
        date: args.date,
        time: args.time,
      };

      const result = await ctx.db.insert("users", data);
      return data;
    }

    return user[0];
  },
});
