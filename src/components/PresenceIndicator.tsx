import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import usePresence from "@convex-dev/presence/react";
import FacePile from "@convex-dev/presence/facepile";

interface PresenceIndicatorProps {
  documentId: Id<"documents">;
  userId: string;
}

export function PresenceIndicator({ documentId, userId }: PresenceIndicatorProps) {
  const presenceState = usePresence(api.presence, documentId, userId);
  
  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-gray-500">Active users:</span>
      <FacePile presenceState={presenceState ?? []} />
    </div>
  );
}
