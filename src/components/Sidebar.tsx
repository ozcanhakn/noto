import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { toast } from "sonner";

interface SidebarProps {
  selectedDocumentId: Id<"documents"> | null;
  onSelectDocument: (id: Id<"documents"> | null) => void;
}

export function Sidebar({ selectedDocumentId, onSelectDocument }: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newDocTitle, setNewDocTitle] = useState("");
  const [newDocIsPublic, setNewDocIsPublic] = useState(false);

  const documents = useQuery(api.documents.list);
  const searchResults = useQuery(api.documents.search, 
    searchQuery.trim() ? { query: searchQuery } : "skip"
  );
  const createDocument = useMutation(api.documents.create);
  const deleteDocument = useMutation(api.documents.deleteDocument);

  const displayedDocuments = searchQuery.trim() ? searchResults : documents;

  const handleCreateDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocTitle.trim()) return;

    try {
      const docId = await createDocument({
        title: newDocTitle.trim(),
        isPublic: newDocIsPublic,
      });
      setNewDocTitle("");
      setNewDocIsPublic(false);
      setShowCreateForm(false);
      onSelectDocument(docId);
      toast.success("Document created successfully");
    } catch (error) {
      toast.error("Failed to create document");
    }
  };

  const handleDeleteDocument = async (docId: Id<"documents">) => {
    if (!confirm("Are you sure you want to delete this document?")) return;

    try {
      await deleteDocument({ id: docId });
      if (selectedDocumentId === docId) {
        onSelectDocument(null);
      }
      toast.success("Document deleted successfully");
    } catch (error) {
      toast.error("Failed to delete document");
    }
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Documents</h2>
        
        {/* Search */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Create Document Button */}
        <button
          onClick={() => setShowCreateForm(true)}
          className="w-full px-3 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          + New Document
        </button>
      </div>

      {/* Create Document Form */}
      {showCreateForm && (
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <form onSubmit={handleCreateDocument} className="space-y-3">
            <input
              type="text"
              placeholder="Document title"
              value={newDocTitle}
              onChange={(e) => setNewDocTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isPublic"
                checked={newDocIsPublic}
                onChange={(e) => setNewDocIsPublic(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="isPublic" className="text-sm text-gray-700">
                Make public
              </label>
            </div>
            <div className="flex space-x-2">
              <button
                type="submit"
                className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
              >
                Create
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCreateForm(false);
                  setNewDocTitle("");
                  setNewDocIsPublic(false);
                }}
                className="flex-1 px-3 py-2 bg-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Documents List */}
      <div className="flex-1 overflow-y-auto">
        {displayedDocuments === undefined ? (
          <div className="p-4 text-center text-gray-500">Loading...</div>
        ) : displayedDocuments.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            {searchQuery.trim() ? "No documents found" : "No documents yet"}
          </div>
        ) : (
          <div className="p-2">
            {displayedDocuments.map((doc) => (
              <div
                key={doc._id}
                className={`group p-3 rounded-md cursor-pointer transition-colors ${
                  selectedDocumentId === doc._id
                    ? "bg-blue-50 border border-blue-200"
                    : "hover:bg-gray-50"
                }`}
                onClick={() => onSelectDocument(doc._id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {doc.title}
                    </h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs text-gray-500">
                        by {doc.creatorName}
                      </span>
                      {doc.isPublic && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                          Public
                        </span>
                      )}
                      {!doc.isPublic && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                          Private
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(doc.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                  {doc.isOwner && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteDocument(doc._id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-600 transition-all"
                      title="Delete document"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
