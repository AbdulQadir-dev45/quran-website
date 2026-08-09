import React, { useState } from "react";
import { Share2 } from "lucide-react";
import ShareTemplateModal from "./ShareTemplateModal";

interface ShareButtonProps {
  arabic: string;
  urdu: string;
  english: string;
  surahName: string;
  surahNumber: number;
  ayahNumber: number;
}

export default function ShareButton({
  arabic,
  urdu,
  english,
  surahName,
  surahNumber,
  ayahNumber,
}: ShareButtonProps) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="relative inline-block z-[9999]">
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="sm:w-auto flex items-center gap-2 rounded-xl bg-natural-moss hover:bg-natural-forest text-white px-5 py-2 font-semibold shadow-lg transition-all"
        >
          <Share2 className="h-4 w-4" />
          Share
        </button>
      </div>

      {showModal && (
        <ShareTemplateModal
          arabic={arabic}
          urdu={urdu}
          english={english}
          surahName={surahName}
          surahNumber={surahNumber}
          ayahNumber={ayahNumber}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}