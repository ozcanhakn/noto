import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const create = mutation({
  args: {
    title: v.string(),
    isPublic: v.boolean(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const now = Date.now();
    return await ctx.db.insert("documents", {
      title: args.title,
      isPublic: args.isPublic,
      createdBy: userId,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    // Get user's private documents
    const privateDocuments = await ctx.db
      .query("documents")
      .withIndex("by_creator", (q) => q.eq("createdBy", userId))
      .filter((q) => q.eq(q.field("isPublic"), false))
      .order("desc")
      .collect();

    // Get all public documents
    const publicDocuments = await ctx.db
      .query("documents")
      .withIndex("by_public", (q) => q.eq("isPublic", true))
      .order("desc")
      .collect();

    // Combine and add creator info
    const allDocuments = [...privateDocuments, ...publicDocuments];
    
    return await Promise.all(
      allDocuments.map(async (doc) => {
        const creator = await ctx.db.get(doc.createdBy);
        return {
          ...doc,
          creatorName: creator?.name || creator?.email || "Unknown",
          isOwner: doc.createdBy === userId,
        };
      })
    );
  },
});

export const get = query({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    const document = await ctx.db.get(args.id);
    
    if (!document) {
      return null;
    }

    // Check permissions
    if (!document.isPublic && document.createdBy !== userId) {
      throw new Error("Not authorized to view this document");
    }

    const creator = await ctx.db.get(document.createdBy);
    return {
      ...document,
      creatorName: creator?.name || creator?.email || "Unknown",
      isOwner: document.createdBy === userId,
    };
  },
});

export const updateTitle = mutation({
  args: {
    id: v.id("documents"),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const document = await ctx.db.get(args.id);
    if (!document) {
      throw new Error("Document not found");
    }

    if (document.createdBy !== userId) {
      throw new Error("Not authorized to edit this document");
    }

    await ctx.db.patch(args.id, {
      title: args.title,
      updatedAt: Date.now(),
    });
  },
});

export const updateVisibility = mutation({
  args: {
    id: v.id("documents"),
    isPublic: v.boolean(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const document = await ctx.db.get(args.id);
    if (!document) {
      throw new Error("Document not found");
    }

    if (document.createdBy !== userId) {
      throw new Error("Not authorized to edit this document");
    }

    await ctx.db.patch(args.id, {
      isPublic: args.isPublic,
      updatedAt: Date.now(),
    });
  },
});

export const deleteDocument = mutation({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const document = await ctx.db.get(args.id);
    if (!document) {
      throw new Error("Document not found");
    }

    if (document.createdBy !== userId) {
      throw new Error("Not authorized to delete this document");
    }

    await ctx.db.delete(args.id);
  },
});

export const search = query({
  args: { query: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    if (!args.query.trim()) {
      return [];
    }

    const results = await ctx.db
      .query("documents")
      .withSearchIndex("search_title", (q) => q.search("title", args.query))
      .collect();

    // Filter results based on permissions
    const filteredResults = results.filter((doc) => 
      doc.isPublic || doc.createdBy === userId
    );

    return await Promise.all(
      filteredResults.map(async (doc) => {
        const creator = await ctx.db.get(doc.createdBy);
        return {
          ...doc,
          creatorName: creator?.name || creator?.email || "Unknown",
          isOwner: doc.createdBy === userId,
        };
      })
    );
  },
});
