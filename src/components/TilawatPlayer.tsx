/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Play, Pause, Search, UserCheck, Disc, Globe2, RefreshCw, Volume2 } from "lucide-react";
import { recitersList } from "../data/reciters";
import { Surah, Reciter } from "../types";

interface TilawatPlayerProps {
  onPlaySurahAudio: (url: string, title?: string) => void;
  currentlyPlayingUrl: string | null;
  audioState: "playing" | "paused" | "stopped";
}

export default function TilawatPlayer({
  onPlaySurahAudio,
  currentlyPlayingUrl,
  audioState,
}: TilawatPlayerProps) {
  const [selectedQari, setSelectedQari] = useState<string>("ar.alafasy");
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Download Surah schema on mount
  useEffect(() => {
    const fetchSurahs = async () => {
      setIsLoading(true);
      setErrorMsg(null);
      try {
        const res = await fetch("https://api.alquran.cloud/v1/surah");
        const data = await res.json();
        if (data && data.data) {
          setSurahs(data.data);
        }
      } catch (err) {
        console.error(err);
        setErrorMsg("Downloaded Surah metadata failed. Check internet connectivity.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSurahs();
  }, []);

  const getQariAudioUrl = (surahNum: number) => {
    return `https://cdn.islamic.network/quran/audio-surah/128/${selectedQari}/${surahNum}.mp3`;
  };

  const currentQariInfo = recitersList.find(q => q.id === selectedQari) || recitersList[0];

  const handlePlayClick = (surah: Surah) => {
    const url = getQariAudioUrl(surah.number);
    onPlaySurahAudio(
      url,
      `Full Surah ${surah.englishName} • Reciter: ${currentQariInfo.englishName} (${currentQariInfo.style || 'Haramain'})`
    );
  };

  const filteredSurahs = surahs.filter((surah) =>
    surah.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    surah.englishNameTranslation.toLowerCase().includes(searchQuery.toLowerCase()) ||
    surah.number.toString() === searchQuery.trim()
  );

  return (
    <div className="space-y-6 animate-fade-in relative z-10">
           {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-natural-text flex items-center gap-2 font-serif">
            <Volume2 className="h-6 w-6 text-natural-moss animate-pulse" />
            Tilawat (Audio MP3 Recitations)
          </h2>
          <p className="text-xs text-natural-text-sub">
            Listen to complete full-surah high fidelity audio recitations by world-famous Qaris.
          </p>
        </div>
      </div>

      {/* Reciter locator and searcher grid bar */}
      <div className="grid md:grid-cols-12 gap-4 bg-natural-card border border-natural-border/50 p-5 rounded-3xl shadow-xs items-center">
        
        {/* Reciter selection dropdown */}
        <div className="md:col-span-6 flex flex-col gap-2">
          <label className="text-xs font-bold font-mono text-natural-text flex items-center gap-1 uppercase tracking-wider">
            <UserCheck className="h-4 w-4 text-natural-moss" />
            Select Reciter (Qari):
          </label>
          <select
            value={selectedQari}
            onChange={(e) => setSelectedQari(e.target.value)}
            className="flex-1 py-2 px-3 hover:bg-natural-bg border border-natural-border/50 bg-natural-bg text-natural-text rounded-xl text-xs font-bold focus:outline-hidden focus:ring-1 focus:ring-natural-moss cursor-pointer"
          >
            {recitersList.map((qari) => (
              <option key={qari.id} value={qari.id}>
                {qari.englishName} ({qari.name})
              </option>
            ))}
          </select>
        </div>

        {/* Searching input bar */}
        <div className="md:col-span-6 relative mt-6">
          <input
            type="text"
            placeholder="Search within Surahs (e.g., Al-Kahf, Ar-Rahman)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-10 pr-4 py-2 rounded-xl border border-natural-border/50 bg-natural-bg text-natural-text placeholder:text-natural-text-sub/50 focus:outline-hidden focus:ring-1 focus:ring-natural-moss"
          />
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-natural-text-sub/50" />
        </div>
      </div>

      {/* Active Qari Biography badge */}
      <div className="p-4 rounded-2xl bg-natural-gold/15 border border-natural-gold/30 text-xs flex items-center justify-between flex-wrap gap-2 animate-pulse-slow">
        <div className="flex items-center gap-2">
          <Disc className="h-4 w-4 text-natural-gold animate-spin-slow" />
          <p className="font-bold text-natural-text">
            Selected Stream Reciter: <span className="text-[#9e7a36] font-sans font-bold">{currentQariInfo.englishName}</span>
          </p>
        </div>
        <div className="flex items-center gap-3 text-natural-text-sub font-mono">
          <span className="bg-natural-bg/60 border border-natural-border/30 px-2 py-0.5 rounded-sm">128 KBPS Stereo</span>
          <span className="bg-natural-bg/60 border border-natural-border/30 px-2 py-0.5 rounded-sm">{currentQariInfo.style || 'Murattal'} Style</span>
        </div>
      </div>

      {/* Grid List cards */}
      {isLoading ? (
        <div className="py-24 flex flex-col items-center justify-center space-y-3 bg-natural-card border border-natural-border/50 rounded-3xl shadow-xs">
          <RefreshCw className="h-8 w-8 text-natural-moss animate-spin" />
          <p className="text-xs font-bold font-mono text-natural-text-sub">Downloading Surahs metadata archive...</p>
        </div>
      ) : errorMsg ? (
        <div className="p-12 text-center rounded-3xl bg-natural-gold/15 text-natural-gold border border-natural-border/30">
          ⚠️ {errorMsg}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredSurahs.map((surah) => {
            const url = getQariAudioUrl(surah.number);
            const isPlaying = currentlyPlayingUrl === url && audioState === "playing";
            
            return (
              <div
                key={surah.number}
                className={`p-5 rounded-[32px] border bg-natural-card transition-all flex justify-between items-center group relative overflow-hidden ${
                  isPlaying 
                    ? "ring-2 ring-natural-moss border-transparent shadow-xs bg-natural-moss/5" 
                    : "border-natural-border/50 hover:border-natural-gold"
                }`}
              >
                {/* Background ambient number tag */}
                <div className="absolute right-0 bottom-0 text-7xl font-extrabold translate-y-4 translate-x-2 text-natural-text-sub/5 select-none font-mono">
                  {surah.number}
                </div>

                <div className="space-y-1 pr-6 relative z-10 text-left">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold font-mono text-natural-text-sub bg-natural-bg px-1.5 py-0.5 rounded-md border border-natural-border/20">
                      #{surah.number}
                    </span>
                    <span className="text-[10px] font-semibold text-natural-moss uppercase tracking-widest font-mono">
                      {surah.revelationType}
                    </span>
                  </div>
                  <h4 className="font-bold text-natural-text font-serif group-hover:text-natural-moss transition-colors">
                    {surah.englishName}
                  </h4>
                  <p className="text-[11px] text-natural-text-sub font-mono">
                    {surah.englishNameTranslation}
                  </p>
                  <p className="text-[10px] text-[#8C8474]/80 font-mono tracking-wide">
                    {surah.numberOfAyahs} Complete Verses
                  </p>
                </div>

                {/* Circular Play Button controller */}
                <button
                  onClick={() => handlePlayClick(surah)}
                  className={`h-11 w-11 rounded-full cursor-pointer flex items-center justify-center shadow-xs transition-transform hover:scale-105 active:scale-95 border relative z-10 ${
                    isPlaying 
                      ? "bg-natural-moss border-natural-moss text-white animate-pulse" 
                      : "bg-natural-bg hover:bg-natural-moss border-natural-border/40 text-natural-moss hover:text-white"
                  }`}
                  title={isPlaying ? "Pause Recitation" : "Listen Surah"}
                >
                  {isPlaying ? (
                    <Pause className="h-5 w-5 fill-current" />
                  ) : (
                    <Play className="h-5 w-5 fill-current ml-0.5" />
                  )}
                </button>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
