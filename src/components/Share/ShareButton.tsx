import React, { useRef, useState } from "react";
import { toPng } from "html-to-image";
import { Share2} from "lucide-react";
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
  const cardRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Change this to your website URL
  const WEBSITE_URL = window.location.origin;

  const shareUrl = `${WEBSITE_URL}/english?surah=${surahNumber}&ayah=${ayahNumber}`;

  const today = new Date();

  const gregorian = today.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });


  const generateImage = async () => {
    if (!cardRef.current) return null;

    const dataUrl = await toPng(cardRef.current, {
      cacheBust: true,
      pixelRatio: 3,
      backgroundColor: "#14532d",
    });

    const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], "Ayah-of-the-Day.png", {
      type: "image/png",
    });

    return {
      dataUrl,
      blob,
      file,
    };
  };

  const handleDownload = async () => {
    setOpenMenu(false);
    const image = await generateImage();

    if (!image) return;

    const link = document.createElement("a");
    link.href = image.dataUrl;
    link.download = `Surah-${surahNumber}-${ayahNumber}.png`;
    link.click();
  };

  const handleCopyImage = async () => {
    setOpenMenu(false);
    const image = await generateImage();

    if (!image) return;

    await navigator.clipboard.write([
      new ClipboardItem({
        "image/png": image.blob,
      }),
    ]);

    alert("Image Copied");
  };

  const handleCopyLink = async () => {
    setOpenMenu(false);
    await navigator.clipboard.writeText(shareUrl);

    alert("Link Copied");
  };

  const handleWhatsapp = async () => {
    setOpenMenu(false);
    const image = await generateImage();

    if (!image) return;

    if (navigator.canShare?.({ files: [image.file] })) {
      await navigator.share({
        files: [image.file],
        title: "Ayah of the Day",
        text: shareUrl,
      });
    } else {
      window.open(
        `https://wa.me/?text=${encodeURIComponent(shareUrl)}`,
        "_blank"
      );
    }
  };

  const handleTwitter = () => {
    setOpenMenu(false);
    window.open(
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        shareUrl
      )}`,
      "_blank"
    );
  };

  const handleFacebook = () => {
    setOpenMenu(false);
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        shareUrl
      )}`,
      "_blank"
    );
  };

  const handleShare = async () => {
    if (!cardRef.current) return;

    try {
      setLoading(true);

      const image = await generateImage();
      if (!image) return;
      const { dataUrl, file } = image;

      if (
        navigator.canShare &&
        navigator.canShare({ files: [file] })
      ) {
        await navigator.share({
          title: "Ayah of the Day",
          text: `${surahName} ${ayahNumber}`,
          files: [file],
        });
      } else {
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = "Ayah-of-the-Day.png";
        link.click();
      }
    } catch (err) {
      console.error(err);
      alert("Unable to generate image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>

      <div className="relative inline-block z-9999">

        <button
          onClick={() => setShowModal(true)}
          className="sm:w-auto flex items-center gap-2 rounded-xl bg-natural-moss hover:bg-natural-forest text-white px-5 py-2 font-semibold shadow-lg transition-all"
        >
          <Share2 className="h-4 w-4" />
          Share Ayah
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

    </div>
  );
}