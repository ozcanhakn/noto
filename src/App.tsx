import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { useState } from "react";
import { Toaster } from "sonner";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";
import { DocumentEditor } from "./components/DocumentEditor";
import { LandingPage } from "./components/LandingPage";
import { Sidebar } from "./components/Sidebar";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";

export default function App() {
  const [showLanding, setShowLanding] = useState(true);

  if (showLanding) {
    return (
      <LandingPage onSignInClick={() => setShowLanding(false)} />
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Unauthenticated>
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-md mx-auto p-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Collaborative Editor</h1>
              <p className="text-gray-600">Sign in to start creating and editing documents</p>
            </div>
            <SignInForm />
            <div className="mt-4 text-center">
              <button
                onClick={() => setShowLanding(true)}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Back to home
              </button>
            </div>
          </div>
        </div>
      </Unauthenticated>
      
      <Authenticated>
        <MainApp />
      </Authenticated>
      
      <Toaster />
    </div>
  );
}

function MainApp() {
  const [selectedDocumentId, setSelectedDocumentId] = useState<Id<"documents"> | null>(null);
  const loggedInUser = useQuery(api.auth.loggedInUser);

  if (loggedInUser === undefined) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      <Sidebar 
        selectedDocumentId={selectedDocumentId}
        onSelectDocument={setSelectedDocumentId}
      />
      
      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold text-gray-900">
              {selectedDocumentId ? "Document Editor" : "Welcome"}
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              {loggedInUser?.name || loggedInUser?.email}
            </span>
            <SignOutButton />
          </div>
        </header>
        
        <main className="flex-1 overflow-hidden">
          {selectedDocumentId ? (
            <DocumentEditor 
              key={selectedDocumentId}
              documentId={selectedDocumentId} 
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                  Select a document to start editing
                </h2>
                <p className="text-gray-600">
                  Choose a document from the sidebar or create a new one
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}