import { components } from "./_generated/api";
import { ProsemirrorSync } from "@convex-dev/prosemirror-sync";
import { getAuthUserId } from "@convex-dev/auth/server";
import { GenericQueryCtx, GenericMutationCtx } from "convex/server";
import { DataModel } from "./_generated/dataModel";

const prosemirrorSync = new ProsemirrorSync(components.prosemirrorSync);

async function checkPermissions(ctx: GenericQueryCtx<DataModel>, id: string) {
  const userId = await getAuthUserId(ctx);
  if (!userId) {
    throw new Error("Not authenticated");
  }

  const document = await ctx.db.get(id as any);
  if (!document) {
    throw new Error("Document not found");
  }

  // Check if this is a documents table entry
  if ('isPublic' in document && 'createdBy' in document) {
    // Allow access if document is public or user is the owner
    if (!document.isPublic && document.createdBy !== userId) {
      throw new Error("Not authorized to access this document");
    }
  }
}

async function checkWritePermissions(ctx: GenericMutationCtx<DataModel>, id: string) {
  const userId = await getAuthUserId(ctx);
  if (!userId) {
    throw new Error("Not authenticated");
  }

  const document = await ctx.db.get(id as any);
  if (!document) {
    throw new Error("Document not found");
  }

  // Check if this is a documents table entry
  if ('isPublic' in document && 'createdBy' in document) {
    // Only allow editing if document is public or user is the owner
    if (!document.isPublic && document.createdBy !== userId) {
      throw new Error("Not authorized to edit this document");
    }
  }
}

export const { getSnapshot, submitSnapshot, latestVersion, getSteps, submitSteps } = 
  prosemirrorSync.syncApi<DataModel>({
    checkRead: checkPermissions,
    checkWrite: checkWritePermissions,
    onSnapshot: async (ctx, id, snapshot, version) => {
      // Update the document's updatedAt timestamp when content changes
      await ctx.db.patch(id as any, {
        updatedAt: Date.now(),
      });
    },
  });
