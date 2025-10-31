import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";

interface DocumentSettingsProps {
  document: {
    _id: string;
    title: string;
    isPublic: boolean;
    isOwner: boolean;
  };
  onClose: () => void;
}

export function DocumentSettings({ document, onClose }: DocumentSettingsProps) {
  const [isPublic, setIsPublic] = useState(document.isPublic);
  const [isLoading, setIsLoading] = useState(false);
  
  const updateVisibility = useMutation(api.documents.updateVisibility);

  const handleSave = async () => {
    if (isPublic === document.isPublic) {
      onClose();
      return;
    }

    setIsLoading(true);
    try {
      await updateVisibility({ 
        id: document._id as any, 
        isPublic 
      });
      toast.success("Document settings updated");
      onClose();
    } catch (error) {
      toast.error("Failed to update document settings");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Document Settings</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-2">Visibility</h3>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="visibility"
                  checked={!isPublic}
                  onChange={() => setIsPublic(false)}
                  className="mr-2"
                />
                <div>
                  <div className="text-sm font-medium text-gray-900">Private</div>
                  <div className="text-xs text-gray-500">Only you can view and edit this document</div>
                </div>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="visibility"
                  checked={isPublic}
                  onChange={() => setIsPublic(true)}
                  className="mr-2"
                />
                <div>
                  <div className="text-sm font-medium text-gray-900">Public</div>
                  <div className="text-xs text-gray-500">Anyone can view and edit this document</div>
                </div>
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
