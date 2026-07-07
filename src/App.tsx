/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { BookOpen, Compass, Search, Volume2, Globe, Moon, Sun, Menu, X, Landmark, Heart } from "lucide-react";
import HomeDashboard from "./components/HomeDashboard";
import MushafViewer from "./components/MushafViewer";
import SurahTranslationViewer from "./components/SurahTranslationViewer";
import TilawatPlayer from "./components/TilawatPlayer";
import AudioPlayerBar from "./components/AudioPlayerBar";

type Tab = "home" | "mushaf" | "urdu" | "english" | "tilawat";

export default function App() {
  // Navigation & parameter states
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [navParams, setNavParams] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Global Theme config
  const [darkMode, setDarkMode] = useState<boolean>(false);

  // Load theme preference on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("quran_app_theme");

    if (savedTheme === "dark") {
      setDarkMode(true);
    } else {
      setDarkMode(false); // Default Light Mode
    }
  }, []);

  // Sync theme changes with body element classes
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const handleToggleTheme = () => {
    const newVal = !darkMode;
    setDarkMode(newVal);
    localStorage.setItem("quran_app_theme", newVal ? "dark" : "light");
  };

  // Persistent audio playback engine states
  const [audioUrl, setAudioUrl] = useState<string>("");
  const [audioTitle, setAudioTitle] = useState<string>("");
  const [audioState, setAudioState] = useState<"playing" | "paused" | "stopped">("stopped");

  const handlePlaySingleAudio = (url: string, title?: string) => {
    // If clicking on already playing audio, toggle it!
    if (audioUrl === url) {
      if (audioState === "playing") {
        setAudioState("paused");
      } else {
        setAudioState("playing");
      }
      return;
    }

    setAudioUrl(url);
    setAudioTitle(title || "Quran Recitation");
    setAudioState("playing");
  };

  const handlePauseAudio = () => {
    setAudioState("paused");
  };

  const handleResumeAudio = () => {
    setAudioState("playing");
  };

  const handleStopAudio = () => {
    setAudioState("stopped");
    setAudioUrl("");
    setAudioTitle("");
  };

  // Navigational wrapper to support subparams
  const handleNavigate = (tab: Tab, params?: any) => {
    setActiveTab(tab);
    setNavParams(params || null);
    setMobileMenuOpen(false);
    // Smooth scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300 font-sans bg-natural-bg text-natural-text">
      
      {/* Dynamic Arabesque texture background overlay */}
      <div className="absolute inset-0 arabesque-bg opacity-5 pointer-events-none z-0" />

      {/* HEADER NAVBAR */}
      <header className="sticky top-0 z-40 bg-natural-forest/95 text-white backdrop-blur-md border-b border-natural-border/20 shadow-lg px-4 md:px-8 py-4 transition-colors">
        <div className="max-w-7xl mx-auto flex justify-between items-center relative z-10">
          
          {/* Decorative launcher logo representing Islamic Geometrics */}
          <div
            onClick={() => handleNavigate("home")}
            className="flex items-center space-x-3 cursor-pointer select-none group"
          >
            <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl bg-linear-to-br from-natural-bg to-natural-card text-natural-forest flex items-center justify-center font-bold tracking-tight shadow-md transition-transform group-hover:scale-105">
              <span className="font-arabic text-xl md:text-2.5xl leading-none">قرآن</span>
            </div>
            <div>
              <h1 className="text-sm md:text-lg font-extrabold tracking-tight font-sans leading-none text-white">
                Al-Quran Website
              </h1>
              <p className="text-[10px] text-natural-bg/90 font-mono tracking-widest uppercase mt-0.5">
                Urdu & English Hub
              </p>
            </div>
          </div>

          {/* Desktop Links navbar */}
          <nav className="hidden md:flex items-center space-x-1.5 text-xs font-semibold">
            {[
              { id: "home", label: "Home", icon: Compass },
              { id: "mushaf", label: "Mushaf", icon: BookOpen },
              { id: "urdu", label: "Urdu (اردو)", icon: Globe },
              { id: "english", label: "English Translation", icon: Globe },
              { id: "tilawat", label: "Tilawat reciter", icon: Volume2 },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleNavigate(tab.id as Tab)}
                  className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center space-x-1.5 ${
                    isActive
                      ? "bg-white/15 text-white shadow-xs"
                      : "hover:bg-white/10 text-natural-bg/85 hover:text-white"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}

            {/* Dark & Light toggle */}
            <button
              onClick={handleToggleTheme}
              className="p-2.5 rounded-xl hover:bg-white/10 text-natural-bg/85 hover:text-white transition-colors cursor-pointer ml-4"
              title="Toggle Light/Dark Theme"
            >
              {darkMode ? (
                <Sun className="h-4.5 w-4.5 text-amber-350 animate-pulse" />
              ) : (
                <Moon className="h-4.5 w-4.5 text-natural-gold" />
              )}
            </button>
          </nav>

          {/* Mobile responsive hamburger menu trigger */}
          <div className="flex items-center space-x-2 md:hidden">
            <button
              onClick={handleToggleTheme}
              className="p-2 rounded-lg hover:bg-natural-moss/80 text-white cursor-pointer"
            >
              {darkMode ? <Sun className="h-5 w-5 text-amber-300" /> : <Moon className="h-5 w-5" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-natural-moss/80 text-white cursor-pointer"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

        </div>

        {/* Mobile menu panel overlay drawer */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-natural-forest border-b border-natural-border/20 shadow-2xl py-4 space-y-1 z-30 md:hidden animate-fade-in">
            {[
              { id: "home", label: "Home Base Dashboard", icon: Compass },
              { id: "mushaf", label: "Real Madinah Mushaf", icon: BookOpen },
              { id: "urdu", label: "Urdu translation (اردو)", icon: Globe },
              { id: "english", label: "English translation (Asad)", icon: Globe },
              { id: "tilawat", label: "Muktadi Tilawat MP3", icon: Volume2 },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleNavigate(tab.id as Tab)}
                  className={`w-full text-left px-6 py-3 font-semibold text-sm flex items-center space-x-3 cursor-pointer ${
                    isActive
                      ? "bg-natural-moss border-l-4 border-natural-gold text-white"
                      : "text-natural-bg/90 hover:bg-natural-moss/40 hover:text-white"
                  }`}
                >
                  <Icon className="h-5 w-5 text-natural-gold" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </header>

      {/* CORE VIEWPORT MAIN CONTAINER */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-8 relative z-10 select-text">
        {activeTab === "home" && (
          <HomeDashboard
            onNavigate={handleNavigate}
            darkMode={darkMode}
            onToggleTheme={handleToggleTheme}
            onPlaySingleAudio={handlePlaySingleAudio}
            currentlyPlayingUrl={audioUrl}
            audioState={audioState}
          />
        )}

        {activeTab === "mushaf" && <MushafViewer />}

        {activeTab === "urdu" && (
          <SurahTranslationViewer
            initialLanguage="urdu"
            onPlaySingleAudio={handlePlaySingleAudio}
            currentlyPlayingUrl={audioUrl}
            audioState={audioState}
            targetSurahNumber={navParams?.surah}
          />
        )}

        {activeTab === "english" && (
          <SurahTranslationViewer
            initialLanguage="english"
            onPlaySingleAudio={handlePlaySingleAudio}
            currentlyPlayingUrl={audioUrl}
            audioState={audioState}
            targetSurahNumber={navParams?.surah}
          />
        )}

        {activeTab === "tilawat" && (
          <TilawatPlayer
            onPlaySurahAudio={handlePlaySingleAudio}
            currentlyPlayingUrl={audioUrl}
            audioState={audioState}
          />
        )}
      </main>

      {/* FOOTER AREA */}
      <footer className="w-full bg-natural-forest text-natural-bg/90 border-t border-natural-border/20 py-10 px-4 mt-16 pb-28 md:pb-8 relative overflow-hidden">
        {/* Foot arabesque background subtle decor */}
        <div className="absolute inset-0 arabesque-bg opacity-5 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 relative z-10 text-xs text-[#c2baa9]">
          
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center space-x-2">
              <Landmark className="h-5 w-5 text-natural-gold" />
              <span className="text-base font-extrabold text-white tracking-wide">Holy Qur'an Online website</span>
            </div>
            <p className="leading-relaxed">
              Read and listen to the Holy Qur'an with absolute precision in layout, translations, and sound recitations. May Allah reward the development of Islamic technology and keep us all guided to the right path.
            </p>
          </div>

          <div className="md:col-span-3 space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px] text-natural-gold">Quick Navigation Pages</h4>
            <div className="grid grid-cols-2 gap-2 text-[12px]">
              <button onClick={() => handleNavigate("home")} className="text-left hover:text-white transition-colors cursor-pointer">Home</button>
              <button onClick={() => handleNavigate("mushaf")} className="text-left hover:text-white transition-colors cursor-pointer">Mushaf Pages</button>
              <button onClick={() => handleNavigate("urdu")} className="text-left hover:text-white transition-colors cursor-pointer">Urdu (اردو)</button>
              <button onClick={() => handleNavigate("english")} className="text-left hover:text-white transition-colors cursor-pointer">English Text</button>
              <button onClick={() => handleNavigate("tilawat")} className="text-left hover:text-white transition-colors cursor-pointer col-span-2">Tilawat (MP3 Reciter)</button>
            </div>
          </div>

          <div className="md:col-span-5 text-right space-y-3 font-arabic">
            <h4 className="font-bold text-white uppercase tracking-widest text-[11px] text-natural-gold font-sans">Quranic Supplication (Dua)</h4>
            <span className="text-2xl md:text-3xl text-natural-gold font-medium block leading-normal pt-1 hover:text-white transition-colors">
              اللّهُمَّ اجْعَلِ القُرْآنَ رَبِيعَ قُلُوبِنَا وَنُورَ صُدُورِنَا
            </span>
            <p className="text-[10.5px] text-[#a69d8a] font-sans uppercase tracking-widest mt-1 block">
              "O Allah, make the Quran the spring of our hearts and the light of our chests"
            </p>
          </div>

        </div>

        <div className="max-w-7xl mx-auto border-t border-[#3d4f3e] mt-6 pt-6 text-center text-[12px] text-[#a69d8a] tracking-wider relative z-10 flex flex-col sm:flex-col justify-between items-center gap-4">
          <p>© 2026 Al-Quran Website • Holy Quran Translation & Recitals Hub.</p>
          <p className="flex items-center gap-1.5 font-sans justify-center">
            Developed with dedication & <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500 animate-pulse" /> for the Global Islamic Ummah.
          </p>
        </div>
      </footer>

      {/* Persistent global audio stream controller widget */}
      <AudioPlayerBar
        audioUrl={audioUrl}
        title={audioTitle}
        audioState={audioState}
        onPause={handlePauseAudio}
        onPlay={handleResumeAudio}
        onStop={handleStopAudio}
      />

    </div>
  );
}
