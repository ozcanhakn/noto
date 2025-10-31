import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { useBlockNoteSync } from "@convex-dev/prosemirror-sync/blocknote";
import { BlockNoteView } from "@blocknote/mantine";
import { BlockNoteEditor } from "@blocknote/core";
import { PresenceIndicator } from "./PresenceIndicator";
import { DocumentSettings } from "./DocumentSettings";
import { useState } from "react";
import { toast } from "sonner";

// Import BlockNote styles
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";

interface DocumentEditorProps {
  documentId: Id<"documents">;
}

export function DocumentEditor({ documentId }: DocumentEditorProps) {
  const [showSettings, setShowSettings] = useState(false);
  const document = useQuery(api.documents.get, { id: documentId });
  const userId = useQuery(api.presence.getUserId);
  const updateTitle = useMutation(api.documents.updateTitle);
  
  const sync = useBlockNoteSync<BlockNoteEditor>(
    api.prosemirror, 
    documentId,
    {
      snapshotDebounceMs: 1000,
    }
  );

  const handleTitleChange = async (newTitle: string) => {
    if (!document?.isOwner) return;
    
    try {
      await updateTitle({ id: documentId, title: newTitle });
      toast.success("Title updated");
    } catch (error) {
      toast.error("Failed to update title");
    }
  };

  if (document === undefined) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (document === null) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Document not found</h2>
          <p className="text-gray-600">This document may have been deleted or you don't have permission to view it.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Document Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            {document.isOwner ? (
              <input
                type="text"
                value={document.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="text-2xl font-bold text-gray-900 bg-transparent border-none outline-none focus:ring-0 p-0 w-full"
                placeholder="Untitled Document"
              />
            ) : (
              <h1 className="text-2xl font-bold text-gray-900">{document.title}</h1>
            )}
            <div className="flex items-center space-x-4 mt-2">
              <span className="text-sm text-gray-500">
                Created by {document.creatorName}
              </span>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                document.isPublic 
                  ? "bg-green-100 text-green-800" 
                  : "bg-gray-100 text-gray-800"
              }`}>
                {document.isPublic ? "Public" : "Private"}
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {userId && <PresenceIndicator documentId={documentId} userId={userId} />}
            {document.isOwner && (
              <button
                onClick={() => setShowSettings(true)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                title="Document settings"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-hidden">
        {sync.isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : sync.editor ? (
          <div className="h-full overflow-y-auto">
            <div className="max-w-4xl mx-auto px-6 py-8">
              <BlockNoteView 
                editor={sync.editor} 
                theme="light"
              />
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <button 
              onClick={() => sync.create({ type: "doc", content: [] })}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Create Document Content
            </button>
          </div>
        )}
      </div>

      {/* Document Settings Modal */}
      {showSettings && document.isOwner && (
        <DocumentSettings
          document={document}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}
