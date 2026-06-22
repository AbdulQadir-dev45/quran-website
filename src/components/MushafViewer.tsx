/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Bookmark, Maximize, Minimize, ListFilter, Trash2, ArrowRight } from "lucide-react";
import { Ayah } from "../types";

export default function MushafViewer() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [jumpPageInput, setJumpPageInput] = useState<string>("");
  const [bookmarks, setBookmarks] = useState<number[]>([]);
  const [showBookmarksList, setShowBookmarksList] = useState(false);
  
  // Custom reading mode: "image" or "text" or "both"
  const [viewMode, setViewMode] = useState<"image" | "text" | "both">("image");
  const [pageAyahs, setPageAyahs] = useState<any[]>([]);
  const [isLoadingText, setIsLoadingText] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load bookmarks on mount
  useEffect(() => {
    const saved = localStorage.getItem("mushaf_bookmarked_pages");
    if (saved) {
      try {
        setBookmarks(JSON.parse(saved));
      } catch (e) {
        // ignore
      }
    }
  }, []);

  // Fetch page text if viewMode is 'text' or 'both'
  useEffect(() => {
    if (viewMode === "image") return;

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
  }, [currentPage, viewMode]);

  // Handle bookmark trigger
  const handleToggleBookmark = () => {
    let updated;
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

  // Turn pages
  const handleNextPage = () => {
    if (currentPage > 1) { // Mushaf pages typically order right-to-left, so page 1 is on the right
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage < 604) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  // Jump page
  const handleJump = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseInt(jumpPageInput);
    if (!isNaN(parsed) && parsed >= 1 && parsed <= 604) {
      setCurrentPage(parsed);
      setJumpPageInput("");
    }
  };

  // Handle Fullscreen request
  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen()
        .then(() => setIsFullscreen(true))
        .catch((err) => console.error(err));
    } else {
      document.exitFullscreen()
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

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-natural-text font-serif">
            Mushaf Al-Sharif
          </h2>
          <p className="text-xs text-natural-text-sub">
            Read complete Quran pages in the authentic 15-line Madinah Mushaf layout.
          </p>
        </div>

        {/* View Mode selecting controller */}
        <div className="inline-flex rounded-xl bg-natural-card border border-natural-border/50 p-1 text-natural-text-sub">
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
      <div className="grid md:grid-cols-12 gap-4 items-center bg-natural-card border border-natural-border/50 p-4 rounded-3xl">
        {/* Navigation jump */}
        <form onSubmit={handleJump} className="md:col-span-4 flex gap-2">
          <input
            type="number"
            min="1"
            max="604"
            placeholder="Jump to Page (1-604)..."
            value={jumpPageInput}
            onChange={(e) => setJumpPageInput(e.target.value)}
            className="flex-1 text-xs px-3 py-2 rounded-xl border border-natural-border/50 bg-natural-bg text-natural-text placeholder:text-natural-text-sub/50 focus:outline-hidden focus:ring-2 focus:ring-natural-moss"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-natural-moss hover:bg-natural-forest text-white rounded-xl text-xs font-semibold cursor-pointer"
          >
            Jump
          </button>
        </form>

        {/* Bookmarks tools */}
        <div className="md:col-span-8 flex flex-wrap justify-end gap-2 text-xs">
          <button
            onClick={handleToggleBookmark}
            className={`px-4 py-2 bg-natural-bg hover:bg-natural-moss/10 border border-natural-border/50 rounded-xl font-semibold flex items-center gap-1.5 cursor-pointer text-natural-text transition-colors ${
              bookmarks.includes(currentPage) ? "border-natural-gold bg-natural-gold/15 text-[#9e7a36]" : ""
            }`}
          >
            <Bookmark className={`h-4 w-4 ${bookmarks.includes(currentPage) ? "fill-natural-gold text-natural-gold" : ""}`} />
            <span>{bookmarks.includes(currentPage) ? "Bookmarked" : "Bookmark Page"}</span>
          </button>

          <button
            onClick={() => setShowBookmarksList(!showBookmarksList)}
            className="px-4 py-2 bg-natural-bg hover:bg-natural-moss/10 border border-natural-border/50 rounded-xl font-semibold flex items-center gap-1.5 cursor-pointer text-natural-text transition-all"
          >
            <ListFilter className="h-4 w-4" />
            <span>Show Bookmarks ({bookmarks.length})</span>
          </button>

          <button
            onClick={toggleFullscreen}
            className="px-4 py-2 bg-natural-bg hover:bg-natural-moss/10 border border-natural-border/50 rounded-xl font-semibold flex items-center gap-1.5 cursor-pointer text-natural-text transition-all"
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

      {/* Bookmarks Overlay List panel */}
      {showBookmarksList && (
        <div className="bg-natural-bg p-4 rounded-3xl border border-natural-border/50 space-y-3 animate-fade-in-up">
          <h3 className="text-xs font-bold uppercase text-natural-text-sub tracking-wider">Bookmarked Pages</h3>
          {bookmarks.length === 0 ? (
            <p className="text-xs text-natural-text-sub italic">No bookmarks saved yet. Click the Bookmark button above to save this page!</p>
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
                      : "bg-natural-card border-natural-border/50 text-natural-text hover:border-natural-gold"
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
        className={`relative grid gap-6 ${isFullscreen ? "bg-[#33373e] p-6 overflow-auto h-screen" : ""} ${
          viewMode === "both" ? "lg:grid-cols-2" : "grid-cols-1"
        }`}
      >
        {/* VIEW 1: Image Mushaf Page */}
        {(viewMode === "image" || viewMode === "both") && (
          <div className="flex flex-col items-center bg-[#fbf9f4] rounded-3xl border border-[#efe9dc] p-6 relative group shadow-xs">
            {/* Islamic border decor representation */}
            <div className="absolute inset-4 border border-[#e8dfc7] pointer-events-none rounded-2xl" />
            <div className="absolute inset-5 border-2 border-double border-[#ebdcb3] pointer-events-none rounded-2xl" />

            {/* Core Image */}
            <div className="relative z-10 w-full max-w-lg mt-4 mb-4 select-none">
              <img
                src={`/quran-pages/06 Al-madina Quran - Beautiful Fonts [www.Momeen.blogspot.com]_page-${String(currentPage).padStart(4, "0")}.jpg`}
                alt={`Madinah Mushaf Page ${currentPage}`}
                className="w-full mix-blend-darken filter brightness-[0.98] contrast-[1.05]"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="relative z-10 text-xs text-[#8c745c] font-bold font-mono border-t border-[#ebdcb3] pt-3 w-full text-center">
              PAGE {currentPage}
            </div>
          </div>
        )}

        {/* VIEW 2: High-Contrast Text Renderer */}
        {(viewMode === "text" || viewMode === "both") && (
          <div className="bg-natural-card p-6 md:p-8 border border-natural-border/50 rounded-3xl shadow-xs space-y-6">
            <div className="flex justify-between items-center border-b border-natural-border/40 pb-4">
              <span className="text-xs font-bold font-mono text-natural-moss uppercase tracking-wide">
                Arabic Uthmani Text • Page {currentPage}
              </span>
              <span className="text-xs text-natural-text-sub">Centered Uthmani Format</span>
            </div>

            {isLoadingText ? (
              <div className="py-24 text-center space-y-2">
                <div className="h-6 w-6 border-2 border-natural-moss border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs text-natural-text-sub font-medium font-mono">Loading Uthmani text...</p>
              </div>
            ) : (
              <div className="space-y-6 text-right" dir="rtl">
                {pageAyahs.map((ayah, i) => {
                  const isSajda = !!ayah.sajda;
                  return (
                    <div
                      key={i}
                      className={`p-4 rounded-2xl transition-colors leading-loose hover:bg-natural-bg ${
                        isSajda ? "border-r-4 border-natural-gold bg-natural-gold/10" : "border-r-4 border-natural-border/30"
                      }`}
                    >
                      <span className="font-arabic text-3xl font-bold font-medium text-natural-text tracking-wide">
                        {ayah.text}
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-natural-gold/30 bg-natural-gold/10 text-natural-text text-xs font-semibold font-mono mx-2" dir="ltr">
                          {ayah.numberInSurah}
                        </span>
                      </span>
                      
                      {isSajda && (
                        <div className="text-[10px] text-natural-gold font-bold uppercase font-sans mt-2 tracking-widest text-left" dir="ltr">
                          ۩ Sajda (Prostration Required)
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Page Turning Buttons control widget */}
      <div className="flex justify-between items-center bg-natural-card border border-natural-border/50 p-4 rounded-3xl shadow-xs">
        <button
          onClick={handleNextPage}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-natural-bg hover:bg-natural-moss/10 disabled:opacity-50 text-natural-text rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer select-none border border-natural-border/30"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Next Page (Left)</span>
        </button>

        <span className="text-xs font-bold text-natural-text-sub font-mono tracking-widest">
          PAGE {currentPage} / 604
        </span>

        <button
          onClick={handlePrevPage}
          disabled={currentPage === 604}
          className="px-4 py-2 bg-natural-bg hover:bg-natural-moss/10 disabled:opacity-50 text-natural-text rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer select-none border border-natural-border/30"
        >
          <span>Previous Page (Right)</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

    </div>
  );
}
