import React, { useRef, useState, useEffect } from "react";
import {
  X,
  Download,
  Share2,
  Copy,
  Link2,
  Check,
  Type,
  Palette,
  Sparkles,
  Sliders,
  Eye,
  FileText,
} from "lucide-react";
import { toPng } from "html-to-image";
import TemplateRenderer from "./TemplateRenderer";

export interface ShareTemplateModalProps {
  arabic: string;
  urdu: string;
  english: string;

  surahName: string;
  surahNumber: number;
  ayahNumber: number;

  onClose: () => void;
}

const ShareTemplateModal: React.FC<ShareTemplateModalProps> = ({
  arabic,
  urdu,
  english,
  surahName,
  surahNumber,
  ayahNumber,
  onClose,
}) => {
  const previewRef = useRef<HTMLDivElement>(null);

  // Customization states
  const [selectedTemplate, setSelectedTemplate] = useState<number>(1);
  const [arabicFontSize, setArabicFontSize] = useState<number>(54);
  const [urduFontSize, setUrduFontSize] = useState<number>(30);
  const [englishFontSize, setEnglishFontSize] = useState<number>(26);

  // Optional toggles
  const [showUrdu, setShowUrdu] = useState<boolean>(true);
  const [showEnglish, setShowEnglish] = useState<boolean>(true);
  const [showBismillah, setShowBismillah] = useState<boolean>(true);
  const [showWatermark, setShowWatermark] = useState<boolean>(true);

  // Status & Feedback states
  const [loading, setLoading] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedType, setCopiedType] = useState<"text" | "image" | "link" | null>(null);

  // Mobile Tab View State ("preview" | "controls")
  const [mobileTab, setMobileTab] = useState<"preview" | "controls">("controls");

  // Dynamic preview container scaling calculation for responsiveness
  const [scale, setScale] = useState<number>(0.32);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateScale = () => {
      if (!containerRef.current) return;
      const containerWidth = containerRef.current.clientWidth;
      const containerHeight = containerRef.current.clientHeight;

      // Card is 1080x1080
      const targetWidth = 1080;
      const targetHeight = 1350;


      const padding = 0;
      const availableWidth = containerWidth - padding;
      const availableHeight = containerHeight - padding;

      const scaleW = availableWidth / targetWidth;
      const scaleH = availableHeight / targetHeight;

      let newScale = Math.min(scaleW, scaleH);
      // Bound the scale for clarity
      if (newScale > 0.5) newScale = 0.5;
      if (newScale < 0.18) newScale = 0.18;

      setScale(newScale);
    };

    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, [mobileTab]);

  const WEBSITE_URL = typeof window !== "undefined" ? window.location.origin : "";
  const shareUrl = `${WEBSITE_URL}/?surah=${surahNumber}&ayah=${ayahNumber}`;

  // Toast auto-hide helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  /* ================= IMAGE GENERATOR ================= */
  const generateImage = async () => {
    const exportNode = document.getElementById("ayah-card-export");
    if (!exportNode) return null;

    try {
      const dataUrl = await toPng(exportNode, {
        cacheBust: true,
        pixelRatio: 2.5,
        backgroundColor: "#000000",
      });

      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const file = new File([blob], `Surah-${surahNumber}-${ayahNumber}.png`, {
        type: "image/png",
      });

      return { dataUrl, blob, file };
    } catch (err) {
      console.error("Failed to generate image:", err);
      showToast("Could not generate image. Please try again.");
      return null;
    }
  };

  /* ================= DOWNLOAD ================= */
  const handleDownload = async () => {
    try {
      setLoading(true);
      const image = await generateImage();
      if (!image) return;

      const a = document.createElement("a");
      a.href = image.dataUrl;
      a.download = `Surah-${surahName}-${surahNumber}_${ayahNumber}.png`;
      a.click();
      showToast("Image downloaded successfully!");
    } finally {
      setLoading(false);
    }
  };

  /* ================= SHARE ================= */
  const handleShare = async () => {
    setLoading(true);
    try {
      const image = await generateImage();
      if (!image) return;

      if (navigator.canShare && navigator.canShare({ files: [image.file] })) {
        await navigator.share({
          title: `Surah ${surahName} (${surahNumber}:${ayahNumber})`,
          text: `Read Surah ${surahName} [${surahNumber}:${ayahNumber}]\n${shareUrl}`,
          files: [image.file],
        });
      } else {
        await handleDownload();
      }
    } catch (e) {
      // User cancelled share or browser not supported
      console.log("Share skipped or unsupported", e);
    } finally {
      setLoading(false);
    }
  };

  /* ================= COPY IMAGE TO CLIPBOARD ================= */
  const handleCopyImage = async () => {
    setLoading(true);
    try {
      const image = await generateImage();
      if (!image) return;

      if (navigator.clipboard && typeof ClipboardItem !== "undefined") {
        await navigator.clipboard.write([
          new ClipboardItem({
            "image/png": image.blob,
          }),
        ]);
        setCopiedType("image");
        showToast("Image copied to clipboard!");
        setTimeout(() => setCopiedType(null), 2500);
      } else {
        // Fallback to downloading
        await handleDownload();
      }
    } catch (err) {
      console.error("Clipboard copy error:", err);
      showToast("Copy image restricted in preview. Downloading image instead...");
      await handleDownload();
    } finally {
      setLoading(false);
    }
  };

  /* ================= COPY LINK TO CLIPBOARD ================= */
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedType("link");
      showToast("Verse link copied to clipboard!");
      setTimeout(() => setCopiedType(null), 2500);
    } catch (err) {
      showToast("Failed to copy link");
    }
  };

  /* ================= COPY FULL VERSE TEXT ================= */
  const handleCopyText = async () => {
    try {
      const fullText = `${arabic}\n\n${urdu ? `Urdu: ${urdu}\n` : ""}${
        english ? `English: "${english}"\n` : ""
      }\n— Quran ${surahName} (${surahNumber}:${ayahNumber})\n${shareUrl}`;

      await navigator.clipboard.writeText(fullText);
      setCopiedType("text");
      showToast("Full Ayah text copied to clipboard!");
      setTimeout(() => setCopiedType(null), 2500);
    } catch (err) {
      showToast("Failed to copy text");
    }
  };

  const templateOptions = [
    {
      id: 1,
      name: "Emerald",
      desc: "Deep Islamic Green & Gold",
      color: "from-emerald-900 to-teal-800 border-amber-400",
    },
    {
      id: 2,
      name: "Royal",
      desc: "Midnight Velvet & Gold",
      color: "from-slate-950 via-neutral-900 to-amber-900 border-amber-500",
    },
    {
      id: 3,
      name: "Glass",
      desc: "Ocean Sapphire Frost",
      color: "from-sky-900 to-indigo-950 border-sky-400",
    },
    {
      id: 4,
      name: "Sandstone",
      desc: "Warm Parchment",
      color: "from-amber-100 to-orange-100 text-amber-950 border-amber-700",
    },
  ];

  return (
    <div className="fixed inset-0 z-[9999] bg-slate-950 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-22 left-1/2 -translate-x-1/2 z-[100000] bg-slate-900 text-amber-300 border border-amber-500/40 px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-sm font-semibold animate-fade-in">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container */}
      <div className="w-full max-w-5xl h-[80vh] sm:h-[76vh] bg-slate-900 border border-slate-800 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col lg:grid lg:grid-cols-12 text-slate-100">
        
        {/* MOBILE HEADER (Tabs & Close) */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/90 shrink-0">
          <div className="flex bg-slate-800 p-1 rounded-xl gap-1">
            <button
              onClick={() => setMobileTab("controls")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                mobileTab === "controls"
                  ? "bg-amber-500 text-slate-950 shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Sliders className="w-3 h-3" />
              <span>Customize</span>
            </button>
            <button
              onClick={() => setMobileTab("preview")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                mobileTab === "preview"
                  ? "bg-amber-500 text-slate-950 shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Eye className="w-3 h-3" />
              <span>Preview Card</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            title="Close modal"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* LEFT COLUMN: PREVIEW AREA (Responsive Grid Column 1-5 or 1-6) */}
        <div
          ref={containerRef}
          className={`lg:col-span-5 xl:col-span-6 bg-slate-950/80 p-4 sm:p-6 lg:p-8 flex flex-col items-center justify-center relative overflow-hidden min-h-[320px] sm:min-h-[420px] lg:min-h-full border-b lg:border-b-0 lg:border-r border-slate-800 ${
            mobileTab === "preview" ? "flex" : "hidden lg:flex"
          }`}
        >
          {/* Subtle Ambient Background Glow */}
          <div className="absolute inset-0 bg-radial from-amber-500/10 via-transparent to-transparent pointer-events-none" />

          {/* Scaled Preview Frame Wrapper */}
          <div className="relative flex items-center justify-center w-full h-full">
            <div
              style={{
                width: `${1080 * scale}px`,
                height: `${1350 * scale}px`,
              }}
              className="relative shadow-2xl rounded-2xl overflow-hidden border border-slate-700/60 ring-1 ring-white/10"
            >
              <div
                id="ayah-card-export"
                ref={previewRef}
                style={{
                  transform: `scale(${scale})`,
                  transformOrigin: "top left",
                  width: `${1080 * scale}px`,
                  height: `${1350 * scale}px`,
                }}
                className="absolute top-0 left-0"
              >
                <TemplateRenderer
                  template={selectedTemplate}
                  arabic={arabic}
                  urdu={urdu}
                  english={english}
                  surahName={surahName}
                  surahNumber={surahNumber}
                  ayahNumber={ayahNumber}
                  arabicFontSize={arabicFontSize}
                  urduFontSize={urduFontSize}
                  englishFontSize={englishFontSize}
                  showUrdu={showUrdu}
                  showEnglish={showEnglish}
                  showBismillah={showBismillah}
                />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: CONTROLS & ACTIONS (Responsive Grid Column 6-12 or 7-12) */}
        <div
          className={`lg:col-span-7 xl:col-span-6 bg-slate-900 p-5 sm:p-6 lg:p-6 overflow-y-auto flex-1 flex flex-col justify-between ${
            mobileTab === "controls" ? "flex" : "hidden lg:flex"
          }`}
        >
          <div>
            {/* Desktop Modal Header */}
            <div className="hidden lg:flex justify-between items-center pb-2 border-b border-slate-800">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-amber-400" />
                  <span>Customize</span>
                </h2>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* ================= TEMPLATE SELECTION ================= */}
            <div className="mt-3">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                  <Palette className="w-4 h-4" />
                  <span>Choose Template Theme</span>
                </h3>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {templateOptions.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => setSelectedTemplate(template.id)}
                    className={`rounded-xl border p-2.5 text-left transition-all duration-200 flex flex-col justify-between relative overflow-hidden group ${
                      selectedTemplate === template.id
                        ? "border-amber-400 bg-amber-400/10 ring-2 ring-amber-400/30 shadow-lg scale-[1.02]"
                        : "border-slate-800 hover:border-slate-700 bg-slate-800/40 hover:bg-slate-800"
                    }`}
                  >
                    <div
                      className={`h-12 sm:h-14 rounded-lg bg-gradient-to-br ${template.color} mb-2 shadow-inner border border-white/10`}
                    />

                    <div>
                      <div className="text-xs sm:text-sm font-semibold text-white flex items-center justify-between">
                        <span>{template.name}</span>
                        {selectedTemplate === template.id && (
                          <Check className="w-3.5 h-3.5 text-amber-400" />
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate mt-0.5">
                        {template.desc}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* ================= FONT & SIZE CONTROLS ================= */}
            <div className="mt-3 border-t border-slate-800/80 pt-2">
              <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2 mb-4">
                <Type className="w-4 h-4" />
                <span>Typography & Font Sizes</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-950/40 p-4 rounded-2xl border border-slate-800/80">
                
                {/* Arabic */}
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-300 mb-2">
                    <span className="font-arabic">Arabic</span>
                    <span className="text-amber-400 font-mono">{arabicFontSize}px</span>
                  </div>
                  <input
                    type="range"
                    min={40}
                    max={70}
                    value={arabicFontSize}
                    onChange={(e) => setArabicFontSize(Number(e.target.value))}
                    className="w-full accent-amber-400 bg-slate-800 rounded-lg h-2 cursor-pointer"
                  />
                </div>

                {/* Urdu */}
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-300 mb-2">
                    <span>Urdu</span>
                    <span className="text-amber-400 font-mono">{urduFontSize}px</span>
                  </div>
                  <input
                    type="range"
                    min={18}
                    max={46}
                    value={urduFontSize}
                    onChange={(e) => setUrduFontSize(Number(e.target.value))}
                    className="w-full accent-amber-400 bg-slate-800 rounded-lg h-2 cursor-pointer"
                  />
                </div>

                {/* English */}
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-300 mb-2">
                    <span>English</span>
                    <span className="text-amber-400 font-mono">{englishFontSize}px</span>
                  </div>
                  <input
                    type="range"
                    min={16}
                    max={36}
                    value={englishFontSize}
                    onChange={(e) => setEnglishFontSize(Number(e.target.value))}
                    className="w-full accent-amber-400 bg-slate-800 rounded-lg h-2 cursor-pointer"
                  />
                </div>

              </div>
            </div>

            {/* ================= DISPLAY TOGGLES ================= */}
            <div className="mt-3 border-t border-slate-800/80 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Element Toggles
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 text-xs">
                <button
                  onClick={() => setShowUrdu(!showUrdu)}
                  className={`px-3 py-2 rounded-xl border font-medium flex items-center justify-between transition-colors ${
                    showUrdu
                      ? "border-amber-400/50 bg-amber-400/10 text-amber-300"
                      : "border-slate-800 bg-slate-800/40 text-slate-400"
                  }`}
                >
                  <span>Urdu</span>
                  <div className={`w-2 h-2 rounded-full ${showUrdu ? "bg-amber-400" : "bg-slate-600"}`} />
                </button>

                <button
                  onClick={() => setShowEnglish(!showEnglish)}
                  className={`px-3 py-2 rounded-xl border font-medium flex items-center justify-between transition-colors ${
                    showEnglish
                      ? "border-amber-400/50 bg-amber-400/10 text-amber-300"
                      : "border-slate-800 bg-slate-800/40 text-slate-400"
                  }`}
                >
                  <span>English</span>
                  <div className={`w-2 h-2 rounded-full ${showEnglish ? "bg-amber-400" : "bg-slate-600"}`} />
                </button>
              </div>
            </div>
          </div>

          {/* ================= ACTION BUTTONS ================= */}
          <div className="mt-3 pt-3 border-t border-slate-800 space-y-3">
            {/* Primary Action Row: Download & Native Share */}
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-3">
              <button
                onClick={handleDownload}
                disabled={loading}
                className="w-full rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold py-3 px-4 flex justify-center items-center gap-2 shadow-lg shadow-emerald-950/40 transition-all active:scale-[0.98] disabled:opacity-60"
              >
                <Download size={18} />
                <span>{loading ? "Generating Image..." : "Download"}</span>
              </button>

              <button
                onClick={handleShare}
                disabled={loading}
                className="w-full rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold py-3 px-4 flex justify-center items-center gap-2 shadow-lg shadow-amber-950/40 transition-all active:scale-[0.98] disabled:opacity-60"
              >
                <Share2 size={18} />
                <span>Share</span>
              </button>
            </div>

            {/* Copy Actions Row (Copy-to-clipboard buttons) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {/* COPY IMAGE */}
              <button
                onClick={handleCopyImage}
                disabled={loading}
                className="rounded-xl border border-slate-700 hover:border-slate-600 bg-slate-800/80 hover:bg-slate-800 text-slate-200 py-2.5 px-3 text-xs font-medium flex justify-center items-center gap-2 transition-colors active:scale-[0.98]"
              >
                {copiedType === "image" ? (
                  <>
                    <Check size={16} className="text-emerald-400" />
                    <span className="text-emerald-400 font-semibold">Image Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={16} />
                    <span>Copy Image</span>
                  </>
                )}
              </button>

              {/* COPY TEXT */}
              <button
                onClick={handleCopyText}
                className="rounded-xl border border-slate-700 hover:border-slate-600 bg-slate-800/80 hover:bg-slate-800 text-slate-200 py-2.5 px-3 text-xs font-medium flex justify-center items-center gap-2 transition-colors active:scale-[0.98]"
              >
                {copiedType === "text" ? (
                  <>
                    <Check size={16} className="text-emerald-400" />
                    <span className="text-emerald-400 font-semibold">Text Copied!</span>
                  </>
                ) : (
                  <>
                    <FileText size={16} />
                    <span>Copy Ayah Text</span>
                  </>
                )}
              </button>

              {/* COPY LINK */}
              <button
                onClick={handleCopyLink}
                className="rounded-xl border border-slate-700 hover:border-slate-600 bg-slate-800/80 hover:bg-slate-800 text-slate-200 py-2.5 px-3 text-xs font-medium flex justify-center items-center gap-2 transition-colors active:scale-[0.98]"
              >
                {copiedType === "link" ? (
                  <>
                    <Check size={16} className="text-emerald-400" />
                    <span className="text-emerald-400 font-semibold">Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Link2 size={16} />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareTemplateModal;