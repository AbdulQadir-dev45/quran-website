/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Bookmark,
  Maximize,
  Minimize,
  ListFilter,
  Trash2,
  BookOpen,
  Search,
  Check,
  ZoomIn,
  ZoomOut,
  RotateCcw,
} from "lucide-react";

interface Ayah {
  number: number;
  text: string;
  numberInSurah: number;
  juz: number;
  manzil: number;
  page: number;
  ruku: number;
  hizbQuarter: number;
  sajda: boolean | object;
  surah: {
    number: number;
    name: string;
    englishName: string;
    englishNameTranslation: string;
    revelationType: string;
    numberOfAyahs: number;
  };
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [jumpPageInput, setJumpPageInput] = useState<string>("");
  const [bookmarks, setBookmarks] = useState<number[]>([]);
  const [showBookmarksList, setShowBookmarksList] = useState(false);
  const [copiedNotification, setCopiedNotification] = useState<string | null>(null);

  // Custom reading mode: "image" or "text" or "both"
  const [viewMode, setViewMode] = useState<"image" | "text" | "both">("image");
  const [pageAyahs, setPageAyahs] = useState<Ayah[]>([]);
  const [isLoadingText, setIsLoadingText] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState<number>(100);

  // Image source with automated CDN fallbacks if local file fails
  const [imgSrc, setImgSrc] = useState<string>("");
  const [imgErrorCount, setImgErrorCount] = useState<number>(0);

  const containerRef = useRef<HTMLDivElement>(null);

  // Load bookmarks on mount
  useEffect(() => {
    const saved = localStorage.getItem("mushaf_bookmarked_pages");
    if (saved) {
      try {
        setBookmarks(JSON.parse(saved));
      } catch (e) {
        // ignore invalid JSON
      }
    }
  }, []);

  // Update image path and fallback reset whenever currentPage changes
  useEffect(() => {
    setImgErrorCount(0);
    setImgSrc(
      `/quran-pages/06 Al-madina Quran - Beautiful Fonts [www.Momeen.blogspot.com]_page-${String(
        currentPage
      ).padStart(4, "0")}.jpg`
    );
  }, [currentPage]);

  // Image loading fallback chain
  const handleImageError = () => {
    if (imgErrorCount === 0) {
      // High-resolution Islamic Network CDN
      setImgSrc(`https://cdn.islamic.network/quran/images/high-resolution/${currentPage}.png`);
      setImgErrorCount(1);
    } else if (imgErrorCount === 1) {
      // Quran.com Android 1024 CDN
      setImgSrc(
        `https://android.quran.com/data/width_1024/page${String(currentPage).padStart(3, "0")}.png`
      );
      setImgErrorCount(2);
    } else if (imgErrorCount === 2) {
      // EveryAyah PNG CDN
      setImgSrc(`https://everyayah.com/data/images_png/${currentPage}.png`);
      setImgErrorCount(3);
    }
  };

  // Fetch page text if viewMode is 'text' or 'both', or for header info
  useEffect(() => {
    const fetchPageText = async () => {
      setIsLoadingText(true);
      try {
        const res = await fetch(`https://api.alquran.cloud/v1/page/${currentPage}/quran-uthmani`);
        const data = await res.json();
        if (data && data.data && data.data.ayahs) {
          setPageAyahs(data.data.ayahs);
        }
      } catch (err) {
        console.error("Error fetching page text:", err);
      } finally {
        setIsLoadingText(false);
      }
    };

    fetchPageText();
  }, [currentPage]);

  // Handle bookmark trigger
  const handleToggleBookmark = () => {
    let updated: number[];
    if (bookmarks.includes(currentPage)) {
      updated = bookmarks.filter((p) => p !== currentPage);
    } else {
      updated = [...bookmarks, currentPage].sort((a, b) => a - b);
    }
    setBookmarks(updated);
    localStorage.setItem("mushaf_bookmarked_pages", JSON.stringify(updated));
  };

  const handleRemoveBookmark = (page: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = bookmarks.filter((p) => p !== page);
    setBookmarks(updated);
    localStorage.setItem("mushaf_bookmarked_pages", JSON.stringify(updated));
  };

  // Turn pages (Mushaf pages order right-to-left: page 1 is on the right)
  const handleNextPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  }, [currentPage]);

  const handlePrevPage = useCallback(() => {
    if (currentPage < 604) {
      setCurrentPage((prev) => prev + 1);
    }
  }, [currentPage]);

  // Keyboard arrow keys page turning
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Avoid intercepting input fields
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }

      if (e.key === "ArrowLeft") {
        // Next page in traditional RTL Mushaf
        handleNextPage();
      } else if (e.key === "ArrowRight") {
        // Previous page
        handlePrevPage();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNextPage, handlePrevPage]);

  // Jump page
  const handleJump = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseInt(jumpPageInput, 10);
    if (!isNaN(parsed) && parsed >= 1 && parsed <= 604) {
      setCurrentPage(parsed);
      setJumpPageInput("");
    }
  };

  // Handle Fullscreen request
  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current
        .requestFullscreen()
        .then(() => setIsFullscreen(true))
        .catch((err) => console.error(err));
    } else {
      document
        .exitFullscreen()
        .then(() => setIsFullscreen(false))
        .catch((err) => console.error(err));
    }
  };

  // Detect fullscreen change
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFsChange);
    return () => document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  // Copy Ayah Text
  const handleCopyAyah = (text: string, numberInSurah: number, surahName: string) => {
    const fullAyah = `${text} (${surahName} : ${numberInSurah})`;
    navigator.clipboard.writeText(fullAyah);
    setCopiedNotification(`Ayah ${numberInSurah} copied to clipboard!`);
    setTimeout(() => setCopiedNotification(null), 2500);
  };
  
  return (
    <div className="min-h-screen bg-natural-bg text-natural-text p-4 sm:p-6 lg:p-2 selection:bg-natural-moss selection:text-white">
      <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
        {/* Header Title & Mode Selector */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 bg-natural-moss/10 text-natural-moss rounded-2xl">
                <BookOpen className="h-5 w-5" />
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-natural-text font-serif">
                Mushaf Al-Sharif
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-natural-text-sub mt-1">
              Read complete Quran in the authentic 15-line Madinah Mushaf layout.
            </p>
          </div>

          {/* View Mode selecting controller */}
          <div className="inline-flex rounded-xl bg-natural-card border border-natural-border/60 p-1 text-natural-text-sub">
            {[
              { id: "image", label: "Mushaf Image" },
              { id: "text", label: "High-Contrast Text" },
              { id: "both", label: "Split View" },
            ].map((mode) => (
              <button
                key={mode.id}
                onClick={() => setViewMode(mode.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                  viewMode === mode.id
                    ? "bg-natural-moss text-white shadow-xs"
                    : "hover:text-natural-text"
                }`}
              >
                {mode.label}
              </button>
            ))}
          </div>
        </div>

        {/* Control Tools Bar */}
        <div className="grid md:grid-cols-12 gap-4 items-center bg-natural-card border border-natural-border/60 p-4 rounded-3xl shadow-xs">
          {/* Navigation jump */}
          <form onSubmit={handleJump} className="md:col-span-5 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-natural-text-sub/60" />
              <input
                type="number"
                min="1"
                max="604"
                placeholder="Jump to Page (1-604)..."
                value={jumpPageInput}
                onChange={(e) => setJumpPageInput(e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-natural-border/60 bg-natural-bg text-natural-text placeholder:text-natural-text-sub/50 focus:outline-hidden focus:ring-2 focus:ring-natural-moss"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-natural-moss hover:bg-natural-forest text-white rounded-xl text-xs font-semibold cursor-pointer transition-colors"
            >
              Jump
            </button>
          </form>

          {/* Bookmarks & Zoom Tools */}
          <div className="md:col-span-7 flex flex-wrap justify-start md:justify-end gap-2 text-xs">
            {/* Zoom Controls */}
            {(viewMode === "image" || viewMode === "both") && (
              <div className="inline-flex items-center rounded-xl bg-natural-bg border border-natural-border/60 p-0.5">
                <button
                  onClick={() => setZoomLevel((z) => Math.max(70, z - 10))}
                  className="p-1.5 hover:text-natural-moss rounded-lg transition-colors cursor-pointer"
                  title="Zoom Out"
                >
                  <ZoomOut className="h-3.5 w-3.5" />
                </button>
                <span className="px-2 font-mono text-[11px] font-semibold text-natural-text-sub">
                  {zoomLevel}%
                </span>
                <button
                  onClick={() => setZoomLevel((z) => Math.min(160, z + 10))}
                  className="p-1.5 hover:text-natural-moss rounded-lg transition-colors cursor-pointer"
                  title="Zoom In"
                >
                  <ZoomIn className="h-3.5 w-3.5" />
                </button>
                {zoomLevel !== 100 && (
                  <button
                    onClick={() => setZoomLevel(100)}
                    className="p-1.5 text-natural-gold hover:text-natural-moss rounded-lg transition-colors cursor-pointer"
                    title="Reset Zoom"
                  >
                    <RotateCcw className="h-3 w-3" />
                  </button>
                )}
              </div>
            )}

            <button
              onClick={handleToggleBookmark}
              className={`px-4 py-2 bg-natural-bg hover:bg-natural-moss/10 border border-natural-border/60 rounded-xl font-semibold flex items-center gap-1.5 cursor-pointer text-natural-text transition-colors ${
                bookmarks.includes(currentPage)
                  ? "border-natural-gold bg-natural-gold/15 text-[#9e7a36]"
                  : ""
              }`}
            >
              <Bookmark
                className={`h-4 w-4 ${
                  bookmarks.includes(currentPage)
                    ? "fill-natural-gold text-natural-gold"
                    : ""
                }`}
              />
              <span>
                {bookmarks.includes(currentPage) ? "Bookmarked" : "Bookmark Page"}
              </span>
            </button>

            <button
              onClick={() => {
                setShowBookmarksList(!showBookmarksList);
              }}
              className="px-4 py-2 bg-natural-bg hover:bg-natural-moss/10 border border-natural-border/60 rounded-xl font-semibold flex items-center gap-1.5 cursor-pointer text-natural-text transition-all"
            >
              <ListFilter className="h-4 w-4" />
              <span>Bookmarks ({bookmarks.length})</span>
            </button>

            <button
              onClick={toggleFullscreen}
              className="px-4 py-2 bg-natural-bg hover:bg-natural-moss/10 border border-natural-border/60 rounded-xl font-semibold flex items-center gap-1.5 cursor-pointer text-natural-text transition-all"
            >
              {isFullscreen ? (
                <>
                  <Minimize className="h-4 w-4" />
                  <span>Exit Fullscreen</span>
                </>
              ) : (
                <>
                  <Maximize className="h-4 w-4" />
                  <span>Fullscreen</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Notification Toast */}
        {copiedNotification && (
          <div className="fixed bottom-6 right-6 z-50 bg-natural-moss text-white px-4 py-3 rounded-2xl shadow-lg border border-emerald-400/30 flex items-center gap-2 text-xs font-semibold animate-fade-in-up">
            <Check className="h-4 w-4 text-emerald-300" />
            <span>{copiedNotification}</span>
          </div>
        )}

        {/* Bookmarks Overlay List panel */}
        {showBookmarksList && (
          <div className="bg-natural-card p-4 rounded-3xl border border-natural-border/60 space-y-3 animate-fade-in-up shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase text-natural-text-sub tracking-wider">
                Bookmarked Pages
              </h3>
              <button
                onClick={() => setShowBookmarksList(false)}
                className="text-xs text-natural-text-sub hover:text-natural-text"
              >
                Close
              </button>
            </div>
            {bookmarks.length === 0 ? (
              <p className="text-xs text-natural-text-sub italic">
                No bookmarks saved yet. Click the "Bookmark Page" button above to save this page!
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {bookmarks.map((p) => (
                  <div
                    key={p}
                    onClick={() => {
                      setCurrentPage(p);
                      setShowBookmarksList(false);
                    }}
                    className={`px-3 py-1.5 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                      currentPage === p
                        ? "bg-natural-moss border-natural-moss text-white"
                        : "bg-natural-bg border-natural-border/50 text-natural-text hover:border-natural-gold"
                    }`}
                  >
                    <Bookmark className="h-3.5 w-3.5 fill-current" />
                    <span className="font-semibold text-xs font-mono">Page {p}</span>
                    <button
                      onClick={(e) => handleRemoveBookmark(p, e)}
                      className="p-0.5 hover:bg-rose-50 hover:text-rose-600 rounded-md transition-colors"
                      title="Remove Bookmark"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Reading Canvas Screen */}
        <div
          ref={containerRef}
          className={`relative grid gap-6 ${
            isFullscreen ? "bg-[#25282e] p-6 overflow-auto h-screen rounded-none" : ""
          } ${viewMode === "both" ? "lg:grid-cols-2" : "grid-cols-1"}`}
        >
          {/* VIEW 1: Image Mushaf Page */}
          {(viewMode === "image" || viewMode === "both") && (
            <div className="flex flex-col items-center bg-[#fbf9f4] rounded-3xl border border-[#efe9dc] p-6 relative group shadow-sm overflow-hidden">
              {/* Islamic border decor representation */}
              <div className="absolute inset-3 border border-[#e8dfc7] pointer-events-none rounded-2xl" />
              <div className="absolute inset-4 border-2 border-double border-[#ebdcb3] pointer-events-none rounded-2xl" />

              {/* Core Image container with zoom support */}
              <div className="relative z-10 w-full max-w-xl my-4 select-none flex justify-center overflow-auto">
                <div
                  style={{
                    transform: `scale(${zoomLevel / 100})`,
                    transformOrigin: "top center",
                    transition: "transform 0.2s ease-out",
                  }}
                  className="w-full flex justify-center"
                >
                  <img
                    src={imgSrc}
                    alt={`Madinah Mushaf Page ${currentPage}`}
                    onError={handleImageError}
                    className="w-full h-auto max-h-[800px] object-contain mix-blend-darken filter brightness-[0.98] contrast-[1.05]"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>

              <div className="relative z-10 text-xs text-[#8c745c] font-bold font-mono border-t border-[#ebdcb3] pt-3 w-full text-center">
                PAGE {currentPage}
              </div>
            </div>
          )}

          {/* VIEW 2: High-Contrast Text Renderer */}
          {(viewMode === "text" || viewMode === "both") && (
            <div className="relative overflow-y-auto rounded-3xl bg-natural-card border border-emerald-500/20 shadow-sm flex flex-col justify-between">
              {/* Inner subtle border */}
              <div className="absolute inset-0 pointer-events-none border border-white/[0.02] rounded-3xl" />

              {/* Header */}
              <div className="relative z-10 flex items-center justify-between px-5 sm:px-7 py-4 border-b border-natural-border/50 bg-natural-card">
                <div>
                  <h3 className="text-sm sm:text-base font-semibold text-natural-text">
                    High-Contrast Text
                  </h3>
                  <p className="text-[10px] sm:text-xs text-natural-text-sub mt-0.5">
                    Arabic Uthmani Script • Page {currentPage}
                  </p>
                </div>

                <span className="hidden sm:block text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-700">
                  Uthmani Format
                </span>
              </div>

              {/* Quran Reading Area */}
              <div className="relative px-4 sm:px-8 md:px-10 py-8 sm:py-10 flex-1">
                {/* Loading State */}
                {isLoadingText ? (
                  <div className="py-32 text-center">
                    <div className="w-9 h-9 mx-auto rounded-full border-4 border-emerald-500/20 border-t-emerald-600 animate-spin" />
                    <p className="mt-4 text-xs text-natural-text-sub">
                      Loading Uthmani text...
                    </p>
                  </div>
                ) : pageAyahs.length === 0 ? (
                  /* Empty State */
                  <div className="py-32 text-center">
                    <p className="text-sm text-natural-text-sub">
                      No Quran text available for this page.
                    </p>
                  </div>
                ) : (
                  /* Quran Text Container */
                  <div
                    dir="rtl"
                    className="
                      mx-auto
                      w-full
                      max-w-5xl
                      text-right
                      font-arabic
                      text-[28px]
                      sm:text-[32px]
                      md:text-[36px]
                      lg:text-[40px]
                      leading-[2.1]
                      sm:leading-[2.2]
                      md:leading-[2.4]
                      font-medium
                      text-natural-text
                    "
                  >
                    {pageAyahs.map((ayah, index) => {
                      const isSajda = !!ayah.sajda;
                      const surahName = ayah.surah?.name || "";

                      return (
                        <span
                          key={ayah.number ?? index}
                          onClick={() =>
                            handleCopyAyah(
                              ayah.text,
                              ayah.numberInSurah,
                              ayah.surah?.englishName || "Surah"
                            )
                          }
                          title={`Click to copy Ayah ${ayah.numberInSurah}`}
                          className="
                            group
                            inline
                            cursor-pointer
                            transition-colors
                            duration-200
                          "
                        >
                          {/* Ayah Text */}
                          <span
                            className="
                              group-hover:text-emerald-700
                              transition-colors
                              duration-200
                            "
                          >
                            {ayah.text}
                          </span>

                          {/* Ayah Number Badge */}
                          <span
                            dir="ltr"
                            className="
                              inline-flex
                              items-center
                              justify-center
                              align-middle
                              mx-2
                              sm:mx-3
                              w-7
                              h-7
                              sm:w-8
                              sm:h-8
                              rounded-full
                              border
                              border-emerald-600/40
                              bg-emerald-500/10
                              text-emerald-800
                              group-hover:border-emerald-600
                              group-hover:bg-emerald-600
                              group-hover:text-white
                              text-[10px]
                              sm:text-[11px]
                              font-mono
                              font-semibold
                              leading-none
                              relative
                              -top-[2px]
                              transition-all
                              duration-200
                            "
                          >
                            {ayah.numberInSurah}
                          </span>

                          {/* Sajda Indicator */}
                          {isSajda && (
                            <span
                              dir="ltr"
                              className="
                                inline-flex
                                items-center
                                mx-2
                                text-[10px]
                                sm:text-xs
                                font-sans
                                font-bold
                                text-amber-600
                                align-middle
                                transition-colors
                                duration-200
                              "
                              title="Sajda"
                            >
                              ۩ Sajda
                            </span>
                          )}
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="relative z-10 flex items-center justify-between px-5 sm:px-7 py-4 border-t border-natural-border/50 bg-natural-card">
                <span className="text-[10px] sm:text-xs text-natural-text-sub font-mono">
                  ARABIC UTHMANI SCRIPT
                </span>

                <span className="text-[10px] sm:text-xs text-emerald-700 font-mono font-semibold">
                  PAGE {currentPage} / 604
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Page Turning Buttons control widget */}
        <div className="flex justify-between items-center bg-natural-card border border-natural-border/60 p-4 rounded-3xl shadow-xs">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 604}
            className="px-4 py-2.5 bg-natural-bg hover:bg-natural-moss/10 disabled:opacity-40 text-natural-text rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer select-none border border-natural-border/50 transition-colors"
          >
            <span>Next Page</span>
            <ChevronRight className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-natural-text-sub font-mono tracking-widest">
              PAGE {currentPage} / 604
            </span>
          </div>

          <button
            onClick={handleNextPage}
            disabled={currentPage === 1}
            className="px-4 py-2.5 bg-natural-bg hover:bg-natural-moss/10 disabled:opacity-40 text-natural-text rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer select-none border border-natural-border/50 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Previous Page</span>
          </button>
        </div>
      </div>
    </div>
  );
}
