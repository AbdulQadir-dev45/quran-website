/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, Bookmark, ListFilter, Trash2, Search, Volume2, RefreshCw } from "lucide-react";
import { Surah, Ayah, TranslationAyah } from "../types";

interface SurahTranslationViewerProps {
  initialLanguage: "urdu" | "english"|"dual";
  onPlaySingleAudio: (url: string, title?: string) => void;
  currentlyPlayingUrl: string | null;
  audioState: "playing" | "paused" | "stopped";
  targetSurahNumber?: number; // Passed from search context navigation
}

export default function SurahTranslationViewer({
  initialLanguage,
  onPlaySingleAudio,
  currentlyPlayingUrl,
  audioState,
  targetSurahNumber,
}: SurahTranslationViewerProps) {
  const [language, setLanguage] = useState<"urdu" | "english" | "dual">(initialLanguage);
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [selectedSurahNum, setSelectedSurahNum] = useState<number>(targetSurahNumber || 1);
  const [searchSurahQuery, setSearchSurahQuery] = useState("");
  
  // Content states
  const [arabicAyahs, setArabicAyahs] = useState<Ayah[]>([]);
  const [translationAyahs, setTranslationAyahs] = useState<TranslationAyah[]>([]);
  const [secondaryTranslationAyahs, setSecondaryTranslationAyahs] = useState<TranslationAyah[]>([]); // For Dual mode
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Bookmarks state
  const [bookmarkedVerses, setBookmarkedVerses] = useState<string[]>([]);
  const [showBookmarks, setShowBookmarks] = useState(false);

  // Fetch Surah list on mount
  useEffect(() => {
    const fetchSurahs = async () => {
      try {
        const res = await fetch("https://api.alquran.cloud/v1/surah");
        const data = await res.json();
        if (data && data.data) {
          setSurahs(data.data);
        }
      } catch (err) {
        console.error("Error loading surah list", err);
        setErrorMsg("Error downloading Surah index. Please check your internet connection.");
      }
    };
    fetchSurahs();
  }, []);

  // Update selected surah if requested from navigation search
  useEffect(() => {
    if (targetSurahNumber) {
      setSelectedSurahNum(targetSurahNumber);
    }
  }, [targetSurahNumber]);

  // Read saved bookmarks
  useEffect(() => {
    const saved = localStorage.getItem("quran_app_ayah_bookmarks");
    if (saved) {
      try {
        setBookmarkedVerses(JSON.parse(saved));
      } catch (e) {
        // ignore
      }
    }
  }, []);

  // Fetch selected Surah content (Urdu and/or English alongside Arabic)
  useEffect(() => {
    const fetchContent = async () => {
      setIsLoading(true);
      setErrorMsg(null);
      try {
        // Translation codes
        // Fateh Muhammad Jalandhry: ur.jalandhry
        // Muhammd Asad: en.asad
        const transCode = language === "urdu" ? "ur.jalandhry" : "en.asad";
        
        const [arabicRes, transRes] = await Promise.all([
          fetch(`https://api.alquran.cloud/v1/surah/${selectedSurahNum}`),
          fetch(`https://api.alquran.cloud/v1/surah/${selectedSurahNum}/${transCode}`)
        ]);

        const arabicJson = await arabicRes.json();
        const transJson = await transRes.json();

        if (arabicJson && arabicJson.data && transJson && transJson.data) {
          setArabicAyahs(arabicJson.data.ayahs);
          setTranslationAyahs(transJson.data.ayahs);
        }

        // If 'dual' mode, download the second translation too!
        if (language === "dual") {
          const secondRes = await fetch(`https://api.alquran.cloud/v1/surah/${selectedSurahNum}/ur.jalandhry`);
          const secondJson = await secondRes.json();
          if (secondJson && secondJson.data) {
            setSecondaryTranslationAyahs(secondJson.data.ayahs);
          }
        }
      } catch (err) {
        console.error("Content fetch failed", err);
        setErrorMsg("Quran content download failed. Check connection.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, [selectedSurahNum, language]);

  // Handle bookmark click
  const handleToggleBookmark = (ayahGlobalNum: number, numberInSurah: number) => {
    const key = `bm-${selectedSurahNum}-${numberInSurah}`;
    let updated;
    if (bookmarkedVerses.includes(key)) {
      updated = bookmarkedVerses.filter((k) => k !== key);
    } else {
      updated = [...bookmarkedVerses, key];
    }
    setBookmarkedVerses(updated);
    localStorage.setItem("quran_app_ayah_bookmarks", JSON.stringify(updated));
  };

  const removeBookmarkByKey = (key: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = bookmarkedVerses.filter((k) => k !== key);
    setBookmarkedVerses(updated);
    localStorage.setItem("quran_app_ayah_bookmarks", JSON.stringify(updated));
  };

  const getSurahNameByNumber = (num: number) => {
    const s = surahs.find((surah) => surah.number === num);
    return s ? `${s.englishName} (${s.name})` : `Surah ${num}`;
  };

  const getAyahAudioUrl = (ayahGlobalNum: number) => {
    return `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${ayahGlobalNum}.mp3`;
  };

  // List filtered surahs for quick selection
  const filteredSurahs = surahs.filter((s) =>
    s.englishName.toLowerCase().includes(searchSurahQuery.toLowerCase()) ||
    s.number.toString() === searchSurahQuery.trim()
  );

  return (
    <div className="space-y-6 animate-fade-in relative z-10">
      
      {/* Search Header layout */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-natural-text flex items-center gap-1.5 font-serif">
            <Volume2 className="h-6 w-6 text-natural-moss" />
            Translation & Recitation Comparisons
          </h2>
          <p className="text-xs text-natural-text-sub">
            Compare translations side-by-side and play audio recitations ayah-by-ayah.
          </p>
        </div>

        {/* Translation Mode button triggers */}
        <div className="inline-flex rounded-xl bg-natural-card border border-natural-border/50 p-1 text-natural-text-sub self-stretch md:self-auto">
          {[
            { id: "urdu", label: "Urdu (جالندھری)" },
            { id: "english", label: "English (Asad)" },
            { id: "dual", label: "Dual Comparison" },
          ].map((mode) => (
            <button
              key={mode.id}
              onClick={() => setLanguage(mode.id as any)}
              className={`flex-1 md:flex-none px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                language === mode.id
                  ? "bg-natural-moss text-white shadow-xs"
                  : "hover:text-natural-text"
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      {/* Surah dropdown selector row style */}
      <div className="grid md:grid-cols-12 gap-4 bg-natural-card border border-natural-border/50 p-4 rounded-3xl items-center shadow-xs">
        
        {/* Selecting Dropdown */}
        <div className="md:col-span-5 flex items-center gap-2">
          <label className="text-xs font-bold font-mono text-natural-text-sub uppercase">Select Surah:</label>
          <select
            value={selectedSurahNum}
            onChange={(e) => setSelectedSurahNum(parseInt(e.target.value))}
            className="flex-1 py-2 px-3 hover:bg-natural-bg border border-natural-border/55 bg-natural-bg text-natural-text rounded-xl text-xs font-bold focus:outline-hidden focus:ring-1 focus:ring-natural-moss cursor-pointer"
          >
            {surahs.map((surah) => (
              <option key={surah.number} value={surah.number}>
                {surah.number}. {surah.englishName} ({surah.name})
              </option>
            ))}
          </select>
        </div>

        {/* Quick Surah Text Filter */}
        <div className="md:col-span-4 relative">
          <input
            type="text"
            placeholder="Type Surah English Name (e.g. Yaseen)..."
            value={searchSurahQuery}
            onChange={(e) => setSearchSurahQuery(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-natural-border/50 bg-natural-bg text-natural-text placeholder:text-natural-text-sub/50 focus:outline-hidden focus:ring-1 focus:ring-natural-moss"
          />
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-natural-text-sub/50" />
        </div>

        {/* Bookmarked ayahs toggler */}
        <div className="md:col-span-3 lg:flex justify-end gap-2">
          <button
            onClick={() => setShowBookmarks(!showBookmarks)}
            className="w-full lg:w-fit px-4 py-2 bg-natural-bg hover:bg-natural-moss/10 text-natural-text rounded-xl text-xs font-bold cursor-pointer inline-flex items-center justify-center gap-1.5 transition-colors border border-natural-border/50"
          >
            <ListFilter className="h-4 w-4" />
            <span>Show Bookmarks ({bookmarkedVerses.length})</span>
          </button>
        </div>
      </div>

      {/* Embedded Search results lists */}
      {searchSurahQuery.trim() !== "" && filteredSurahs.length > 0 && (
        <div className="p-3 bg-natural-bg rounded-2xl border border-natural-border/40 animate-fade-in text-xs max-h-36 overflow-y-auto">
          <h4 className="font-bold text-natural-text-sub uppercase tracking-widest text-[9px] mb-2 font-mono">Quick Search Results:</h4>
          <div className="flex flex-wrap gap-1.5">
            {filteredSurahs.map((s) => (
              <button
                key={s.number}
                onClick={() => {
                  setSelectedSurahNum(s.number);
                  setSearchSurahQuery("");
                }}
                className="px-2.5 py-1 rounded-md bg-natural-card border border-natural-border/40 text-natural-text hover:border-natural-gold font-bold transition-all cursor-pointer"
              >
                {s.englishName}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Bookmarked verses list */}
      {showBookmarks && (
        <div className="bg-natural-gold/15 p-4 rounded-3xl border border-natural-gold/30 space-y-4 animate-fade-in-up">
          <h3 className="text-xs font-bold uppercase text-[#9e7a36] tracking-wider font-mono">Bookmarked Verses ({bookmarkedVerses.length})</h3>
          {bookmarkedVerses.length === 0 ? (
            <p className="text-xs text-natural-text-sub italic">No bookmarks saved yet. Click the star icon on any ayah card below to save bookmark!</p>
          ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2">
              {bookmarkedVerses.map((key) => {
                const parts = key.split("-");
                const sNum = parseInt(parts[1]);
                const aNum = parseInt(parts[2]);
                return (
                  <div
                    key={key}
                    onClick={() => {
                      setSelectedSurahNum(sNum);
                      setShowBookmarks(false);
                    }}
                    className="p-3 bg-natural-card border border-natural-border/50 rounded-xl flex justify-between items-center cursor-pointer hover:border-natural-gold group transition-all"
                  >
                    <div>
                      <p className="font-bold text-xs text-natural-text">
                        {getSurahNameByNumber(sNum)}
                      </p>
                      <span className="text-[10px] text-natural-text-sub font-semibold font-mono">
                        Verse/Ayah {aNum}
                      </span>
                    </div>
                    <button
                      onClick={(e) => removeBookmarkByKey(key, e)}
                      className="p-1 hover:bg-rose-50/50 text-natural-text-sub hover:text-rose-600 rounded-lg transition-colors"
                      title="Delete Bookmark"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Errors or loadings */}
      {isLoading ? (
        <div className="bg-natural-card border border-natural-border/50 rounded-3xl p-16 flex flex-col items-center justify-center space-y-3">
          <RefreshCw className="h-8 w-8 text-natural-moss animate-spin" />
          <p className="text-xs font-semibold font-mono text-natural-text-sub">Downloading Surah verses alongside {language} translations...</p>
        </div>
      ) : errorMsg ? (
        <div className="p-12 text-center rounded-3xl bg-natural-gold/10 text-natural-gold text-sm border border-natural-border/30">
          ⚠️ {errorMsg}
        </div>
      ) : (
        <div className="space-y-4">
          
          {/* Header Bismillah Banner */}
          <div className="p-6 md:p-8 bg-linear-to-br from-natural-forest to-natural-pine text-white text-center rounded-[32px] border border-natural-border/20 shadow-sm space-y-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-natural-moss/10 opacity-10 pointer-events-none" />
            
            <div className="space-y-1 relative z-10">
              <span className="text-[10px] uppercase font-bold tracking-widest text-natural-gold font-mono">Now Reading</span>
              <h3 className="text-xl md:text-3xl font-bold tracking-tight font-serif">
                {getSurahNameByNumber(selectedSurahNum)}
              </h3>
              {surahs.find(s => s.number === selectedSurahNum) && (
                <p className="text-xs text-natural-bg/90 font-mono">
                  {surahs.find(s => s.number === selectedSurahNum)?.revelationType} Revelation • {surahs.find(s => s.number === selectedSurahNum)?.numberOfAyahs} Complete Verses
                </p>
              )}
            </div>

            {/* Bismillah (except Surah At-Tawbah (9)) */}
            {selectedSurahNum !== 9 && (
              <div className="text-center pt-2 border-t border-white/20">
                <span className="font-arabic text-3xl md:text-4xl text-natural-gold">
                  بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                </span>
                <p className="text-[10px] text-natural-bg/50 uppercase tracking-widest mt-1 font-mono">
                  "In the name of Allah, the Entirely Merciful, the Especially Merciful"
                </p>
              </div>
            )}
          </div>

          {/* Verses rendering */}
          <div className="space-y-4">
            {arabicAyahs.map((ayah, idx) => {
              const transAyah = translationAyahs[idx];
              const secTransAyah = secondaryTranslationAyahs[idx];
              const isPlaying = currentlyPlayingUrl === getAyahAudioUrl(ayah.number) && audioState === "playing";
              
              const isBookmarked = bookmarkedVerses.includes(`bm-${selectedSurahNum}-${ayah.numberInSurah}`);
              
              return (
                <div
                  key={ayah.number}
                  className={`p-5 md:p-6 rounded-[32px] border transition-all space-y-4 relative overflow-hidden bg-natural-card ${
                    isPlaying 
                      ? "ring-2 ring-natural-moss border-transparent shadow-xs" 
                      : "border-natural-border/50"
                  }`}
                >
                  {/* Playing Highlight Background subtle indicator */}
                  {isPlaying && (
                    <div className="absolute inset-0 bg-natural-moss/5 pointer-events-none-infinite animate-pulse-slow" />
                  )}

                  {/* Card Controls top header row */}
                  <div className="flex justify-between items-center relative z-10">
                    <div className="flex items-center gap-1.5">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-natural-bg text-natural-text text-xs font-bold font-mono">
                        {ayah.numberInSurah}
                      </span>
                      <span className="text-[10px] text-natural-text-sub font-semibold uppercase tracking-wider font-mono">
                        Juz {ayah.juz} • Page {ayah.page}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Play Ayah Audio trigger */}
                      <button
                        onClick={() => {
                          onPlaySingleAudio(
                            getAyahAudioUrl(ayah.number),
                            `Surah ${getSurahNameByNumber(selectedSurahNum)} [Ayah ${ayah.numberInSurah}]`
                          );
                        }}
                        className={`p-2 rounded-xl transition-all cursor-pointer ${
                          isPlaying 
                            ? "bg-natural-moss text-white" 
                            : "bg-natural-bg hover:bg-natural-moss/10 hover:text-natural-moss text-natural-text-sub"
                        }`}
                        title="Listen to this verse"
                      >
                        {isPlaying ? (
                          <Pause className="h-4 w-4 fill-white text-white" />
                        ) : (
                          <Play className="h-4 w-4 fill-current text-natural-moss animate-pulse-slow" />
                        )}
                      </button>

                      {/* Bookmark Button */}
                      <button
                        onClick={() => handleToggleBookmark(ayah.number, ayah.numberInSurah)}
                        className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                          isBookmarked 
                            ? "bg-natural-gold/15 border-natural-gold/30 text-[#9e7a36]" 
                            : "bg-natural-bg hover:bg-natural-moss/10 hover:text-natural-gold border-transparent text-natural-text-sub"
                        }`}
                        title="Bookmark Ayah"
                      >
                        <Bookmark className={`h-4 w-4 ${isBookmarked ? "fill-natural-gold text-natural-gold" : ""}`} />
                      </button>
                    </div>
                  </div>

                  {/* Arabic text with beautiful Amiri Font layout */}
                  <div className="text-right leading-loose pt-2 relative z-10" dir="rtl">
                    <span className="font-arabic text-3xl md:text-4xl text-natural-text tracking-wider">
                      {ayah.text}
                    </span>
                  </div>

                  {/* Urdu & English Translations Side or Column */}
                  <div className="border-t border-natural-border/30 pt-4 space-y-3 relative z-10">
                    
                    {/* Urdu Block */}
                    {(language === "urdu" || language === "dual") && transAyah && (
                      <div className="space-y-1">
                        <span className="text-[9px] font-semibold text-natural-forest uppercase tracking-widest font-mono">Urdu Translation</span>
                        <p className="text-lg font-sans font-semibold text-natural-forest leading-relaxed text-right md:text-left">
                          {language === "urdu" ? transAyah.text : secTransAyah?.text}
                        </p>
                      </div>
                    )}

                    {/* English Block */}
                    {(language === "english" || language === "dual") && transAyah && (
                      <div className="space-y-1 bg-natural-bg/60 p-3 rounded-2xl">
                        <span className="text-[9px] font-semibold text-natural-text-sub uppercase tracking-widest font-mono">English (Muhammad Asad)</span>
                        <p className="text-sm text-natural-text-sub leading-relaxed italic">
                          "{language === "english" ? transAyah.text : transAyah.text}"
                        </p>
                      </div>
                    )}

                  </div>

                </div>
              );
            })}
          </div>

        </div>
      )}

    </div>
  );
}
