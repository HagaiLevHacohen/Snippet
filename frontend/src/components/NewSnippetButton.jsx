import { useState } from "react";
import NewSnippetDialog from "./NewSnippetDialog";

function NewSnippetButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating button */}
      <button
        className="absolute bottom-10 right-10 w-16 h-16 bg-violet-500 hover:bg-violet-600 text-white rounded-full shadow-lg flex items-center justify-center text-4xl font-bold hover:scale-110 transition-transform duration-200"
        onClick={() => setIsOpen(true)}
      >
        +
      </button>

      {/* Dialog */}
      {isOpen && <NewSnippetDialog onClose={() => setIsOpen(false)} />}
    </>
  );
}

export default NewSnippetButton;