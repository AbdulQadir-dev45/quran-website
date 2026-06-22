/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Search, Compass, BookOpen, Volume2, Moon, Sun, ArrowRight, Play, Pause, MapPin, RefreshCw, BookmarkCheck } from "lucide-react";
import { dailyVersesList, DailyVerse } from "../data/dailyVerses";
import { defaultCitiesPrayerTimes, CityPrayerTimes } from "../data/prayerTimes";
import { PrayerTimes, SearchResult } from "../types";

interface HomeDashboardProps {
  onNavigate: (tab: "home" | "mushaf" | "urdu" | "english" | "tilawat", params?: any) => void;
  darkMode: boolean;
  onToggleTheme: () => void;
  onPlaySingleAudio: (url: string, title?: string) => void;
  currentlyPlayingUrl: string | null;
  audioState: "playing" | "paused" | "stopped";
  lyricsText?: string;
}

export default function HomeDashboard({
  onNavigate,
  darkMode,
  onToggleTheme,
  onPlaySingleAudio,
  currentlyPlayingUrl,
  audioState,
}: HomeDashboardProps) {
  // Daily Verse states
  const [dailyVerse, setDailyVerse] = useState<DailyVerse>(dailyVersesList[0]);
  const [isVersePlaying, setIsVersePlaying] = useState(false);
  
  // Choose daily verse based on current date
  useEffect(() => {
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
    const index = dayOfYear % dailyVersesList.length;
    setDailyVerse(dailyVersesList[index]);
  }, []);

  // Sync verse play state with global audio player state
  useEffect(() => {
    if (currentlyPlayingUrl === dailyVerse.audioUrl && audioState === "playing") {
      setIsVersePlaying(true);
    } else {
      setIsVersePlaying(false);
    }
  }, [currentlyPlayingUrl, audioState, dailyVerse.audioUrl]);

  const handlePlayVerse = () => {
    onPlaySingleAudio(
      dailyVerse.audioUrl,
      `Verse of the Day • Surah ${dailyVerse.surahName} [${dailyVerse.surahNumber}:${dailyVerse.ayahNumber}]`
    );
  };

  // Prayer times state
  const [selectedCityInfo, setSelectedCityInfo] = useState<CityPrayerTimes>(defaultCitiesPrayerTimes[0]);
  const [customCity, setCustomCity] = useState("");
  const [customCountry, setCustomCountry] = useState("");
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes>(defaultCitiesPrayerTimes[0].times);
  const [isFetchingPrayer, setIsFetchingPrayer] = useState(false);
  const [prayerError, setPrayerError] = useState<string | null>(null);
  const [nextPrayerInfo, setNextPrayerInfo] = useState<{ name: string; time: string; minutesLeft: number } | null>(null);

  // Load saved city on mount
  useEffect(() => {
    const savedCityStr = localStorage.getItem("quran_app_city_info");
    if (savedCityStr) {
      try {
        const saved = JSON.parse(savedCityStr);
        setSelectedCityInfo(saved);
        setPrayerTimes(saved.times);
      } catch (e) {
        // ignore
      }
    }
  }, []);

  // Fetch real prayer times if possible
  const fetchRealPrayerTimes = async (city: string, country: string) => {
    setIsFetchingPrayer(true);
    setPrayerError(null);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000); // 6 Sec timeout
      
      const res = await fetch(
        `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&method=1`,
        { signal: controller.signal }
      );
      clearTimeout(timeoutId);

      if (!res.ok) throw new Error("Could not find prayer times for this location.");
      const data = await res.json();
      
      if (data && data.data && data.data.timings) {
        const timings: PrayerTimes = data.data.timings;
        const newCityInfo: CityPrayerTimes = {
          city,
          country,
          times: timings,
        };
        setSelectedCityInfo(newCityInfo);
        setPrayerTimes(timings);
        localStorage.setItem("quran_app_city_info", JSON.stringify(newCityInfo));
      } else {
        throw new Error("Invalid response form from weather server.");
      }
    } catch (err: any) {
      console.warn("Prayer times API fetch failed", err);
      setPrayerError("Live timing offline. Displaying local offline schedules.");
      // Fallback to static lists matching or default
      const matched = defaultCitiesPrayerTimes.find(c => c.city.toLowerCase() === city.toLowerCase());
      if (matched) {
        setSelectedCityInfo(matched);
        setPrayerTimes(matched.times);
      }
    } finally {
      setIsFetchingPrayer(false);
    }
  };

  useEffect(() => {
    if (selectedCityInfo.city !== defaultCitiesPrayerTimes[0].city) {
      fetchRealPrayerTimes(selectedCityInfo.city, selectedCityInfo.country);
    } else {
      setPrayerTimes(selectedCityInfo.times);
    }
  }, [selectedCityInfo.city, selectedCityInfo.country]);

  // Handle manual city update
  const handleCitySearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customCity.trim()) return;
    const countryVal = customCountry.trim() || "Pakistan";
    fetchRealPrayerTimes(customCity.trim(), countryVal);
    setCustomCity("");
    setCustomCountry("");
  };

  // Try geo location
  const handleGeoLocation = () => {
    if (!navigator.geolocation) {
      setPrayerError("Geolocation is not supported by your browser.");
      return;
    }
    setIsFetchingPrayer(true);
    setPrayerError(null);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`);
          const geoData = await res.json();
          const city = geoData.city || geoData.locality || "Mecca";
          const country = geoData.countryName || "Saudi Arabia";
          fetchRealPrayerTimes(city, country);
        } catch (e) {
          setPrayerError("Error finding city from GPS. Fallbacking to standard.");
          setIsFetchingPrayer(false);
        }
      },
      () => {
        setPrayerError("Location access denied. Please type your city.");
        setIsFetchingPrayer(false);
      }
    );
  };

  // Solve Countdown to next prayer
  useEffect(() => {
    const calculateNextPrayer = () => {
      if (!prayerTimes) return;
      const now = new Date();
      const currentHours = now.getHours();
      const currentMinutes = now.getMinutes();
      const currentTotalMin = currentHours * 60 + currentMinutes;

      const prayers = [
        { name: "Fajr", time: prayerTimes.Fajr },
        { name: "Sunrise", time: prayerTimes.Sunrise, isSunrise: true },
        { name: "Dhuhr", time: prayerTimes.Dhuhr },
        { name: "Asr", time: prayerTimes.Asr },
        { name: "Maghrib", time: prayerTimes.Maghrib },
        { name: "Isha", time: prayerTimes.Isha }
      ];

      let next = null;
      let minDiff = Infinity;

      for (const pr of prayers) {
        const parts = pr.time.split(":");
        const prMin = parseInt(parts[0]) * 60 + parseInt(parts[1]);
        let diff = prMin - currentTotalMin;
        if (diff > 0 && diff < minDiff) {
          minDiff = diff;
          next = { ...pr, minutesLeft: diff };
        }
      }

      // If no prayer left today, next prayer is tomorrow's Fajr
      if (!next) {
        const parts = prayerTimes.Fajr.split(":");
        const prMin = parseInt(parts[0]) * 60 + parseInt(parts[1]);
        const diff = (24 * 60 - currentTotalMin) + prMin;
        next = { name: "Fajr", time: prayerTimes.Fajr, minutesLeft: diff };
      }

      setNextPrayerInfo(next);
    };

    calculateNextPrayer();
    const interval = setInterval(calculateNextPrayer, 60000); // update every minute
    return () => clearInterval(interval);
  }, [prayerTimes]);

  // Global Quran Search Bar logic
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchFeedback, setSearchFeedback] = useState<string | null>(null);

  const handleGlobalSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    setSearchFeedback(null);
    setSearchResults([]);

    try {
      // Fetch English matching verses
      const response = await fetch(`https://api.alquran.cloud/v1/search/${encodeURIComponent(searchQuery)}/all/en`);
      const data = await response.json();
      
      if (data && data.data && data.data.matchCount > 0) {
        // Grab top 10 results for rich user experience and fast rendering
        const matches = data.data.matches.slice(0, 10);
        
        const resultsPromises = matches.map(async (match: any) => {
          // Fetch Arabic original text & Urdu translation for matching ayahs
          const [arabicRes, urduRes] = await Promise.all([
            fetch(`https://api.alquran.cloud/v1/ayah/${match.number}`),
            fetch(`https://api.alquran.cloud/v1/ayah/${match.number}/ur.jalandhry`)
          ]);

          const arabicJson = await arabicRes.json();
          const urduJson = await urduRes.json();

          return {
            surahNumber: match.surah.number,
            surahName: `${match.surah.englishName} (${match.surah.name})`,
            ayahNumber: match.numberInSurah,
            arabicText: arabicJson.data.text,
            englishTranslation: match.text,
            urduTranslation: urduJson.data.text,
          };
        });

        const resolved = await Promise.all(resultsPromises);
        setSearchResults(resolved);
        if (resolved.length === 0) {
          setSearchFeedback("No verses match your search. Try other keywords like 'mercy', 'praise', or 'soul'.");
        }
      } else {
        setSearchFeedback("No verses match your search. Try keywords like 'heaven', 'peace', 'patience', or 'forgive'.");
      }
    } catch (err) {
      console.error(err);
      setSearchFeedback("Could not complete the search. Please verify your connection.");
    } finally {
      setIsSearching(false);
    }
  };

  const getNextPrayerCountdownStr = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    if (h > 0) return `${h} hour${h > 1 ? 's' : ''} ${m} min${m > 1 ? 's' : ''}`;
    return `${m} minute${m > 1 ? 's' : ''}`;
  };

  // Load Gregorian Date
  const getGregorianDateString = () => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date().toLocaleDateString('en-US', options);
  };

  return (
    <div className="space-y-8 animate-fade-in relative">
      {/* Dynamic Background Pattern overlay */}
      <div className="absolute inset-0 arabesque-bg opacity-5 pointer-events-none z-0" />

      {/* Hero Welcome banner */}
      <section className="relative overflow-hidden rounded-[32px] bg-linear-to-br from-natural-forest to-natural-pine border border-natural-border/20 px-6 py-12 text-white shadow-xl md:px-12 md:py-16">
        {/* Abstract shapes representing majestic lights */}
        <div className="absolute top-0 right-0 h-96 w-96 -translate-y-20 translate-x-20 rounded-full bg-natural-moss/20 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-64 w-64 translate-y-20 -translate-x-20 rounded-full bg-natural-gold/10 blur-2xl" />

        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center space-x-2 rounded-full border border-natural-gold/30 bg-black/20 px-3 py-1 text-xs font-semibold backdrop-blur-md text-natural-gold">
            <Compass className="h-3 w-3 animate-spin-slow" />
            <span>Islamic Hub & Al-Quran Explorer</span>
          </div>
          
          <h1 className="text-3xl font-bold tracking-tight md:text-5xl font-sans">
            Explore the Wisdom <br/>
            <span className="text-natural-gold font-serif">of the Holy Qur'an</span>
          </h1>
          
          <p className="text-sm text-natural-bg/90 md:text-base leading-relaxed">
            Read complete Mushaf pages, listen to master reciters, explore translation comparisons in Urdu & English, and keep updated with precise daily prayer timings.
          </p>

          <p className="text-xs text-natural-bg/80 font-mono tracking-wide">
            {getGregorianDateString()}
          </p>

          {/* Quick Stats/Dua banner in Arabic */}
          <div className="pt-2 text-right">
            <span className="font-arabic text-2xl md:text-3xl text-natural-gold/90 hover:text-white transition-colors block">
              اللّهُمَّ اجْعَلِ القُرْآنَ رَبِيعَ قُلُوبِنَا
            </span>
            <span className="text-[10px] text-natural-bg/50 uppercase tracking-widest block font-mono">
              "O Allah, make the Quran the spring of our hearts"
            </span>
          </div>
        </div>
      </section>

      {/* Main Global Search Engine Panel */}
      <section className="bg-natural-card border border-natural-border/50 rounded-[32px] p-6 md:p-8 shadow-xs relative z-10">
        <h3 className="text-lg font-bold text-natural-text flex items-center gap-2 mb-2">
          <Search className="h-5 w-5 text-natural-moss" />
          Search Across The Entire Quran
        </h3>
        <p className="text-xs text-natural-text-sub mb-6">
          Find matching verses instantaneously by entering any topic or English key phrases (e.g., "patience", "praise", "forgiveness").
        </p>

        <form onSubmit={handleGlobalSearch} className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search verses (e.g., patience, mercy, paradise)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-natural-border/60 bg-natural-bg text-natural-text placeholder:text-natural-text-sub/50 focus:outline-hidden focus:ring-2 focus:ring-natural-moss h-12"
            />
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-natural-text-sub/50" />
          </div>
          <button
            type="submit"
            disabled={isSearching}
            className="px-6 py-3 bg-natural-moss hover:bg-natural-forest disabled:bg-natural-moss/50 text-white rounded-xl font-semibold transition-colors shadow-sm cursor-pointer h-12 inline-flex items-center gap-2"
          >
            {isSearching ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Searching...</span>
              </>
            ) : (
              <span>Search</span>
            )}
          </button>
        </form>

        {/* Global Search Results List */}
        {searchResults.length > 0 && (
          <div className="mt-6 space-y-4 border-t border-natural-border pt-6 animate-fade-in-up">
            <h4 className="text-xs font-semibold uppercase text-natural-text-sub tracking-wider">
              Search Results ({searchResults.length})
            </h4>
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
              {searchResults.map((result, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl border border-natural-border/40 bg-natural-bg/50 hover:shadow-xs transition-shadow space-y-3 relative group"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-natural-moss bg-natural-card px-3 py-1 rounded-full border border-natural-border/30">
                      Surah {result.surahName} [Verse {result.ayahNumber}]
                    </span>
                    <button
                      onClick={() => onNavigate("english", { surah: result.surahNumber })}
                      className="text-xs font-medium text-natural-text-sub hover:text-natural-moss flex items-center gap-1 transition-colors"
                    >
                      <span>Read in Context</span>
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                  
                  {/* Arabic original */}
                  <p className="font-arabic text-2xl text-right text-natural-text leading-wider">
                    {result.arabicText}
                  </p>

                  <div className="grid md:grid-cols-2 gap-4 border-t border-natural-border/30 pt-3">
                    {/* Urdu Translation */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-semibold text-[#8a8170] uppercase tracking-widest font-mono">Urdu Translation</span>
                      <p className="text-sm text-natural-forest leading-relaxed font-sans font-medium">
                        {result.urduTranslation}
                      </p>
                    </div>

                    {/* English Translation */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-semibold text-natural-text-sub uppercase tracking-widest font-mono">English Translation</span>
                      <p className="text-sm text-natural-text-sub leading-relaxed italic">
                        "{result.englishTranslation}"
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {searchFeedback && (
          <div className="mt-4 p-4 text-center rounded-xl bg-amber-50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-300 text-sm border border-amber-100 dark:border-amber-900/30">
            {searchFeedback}
          </div>
        )}
      </section>

      {/* Featured Widgets Grids (Daily Verses + Prayer times) */}
      <div className="grid lg:grid-cols-12 gap-6 relative z-10">
        
        {/* Daily Verses card widget */}
        <section className="lg:col-span-7 bg-natural-card border border-natural-border/50 rounded-[32px] p-6 md:p-8 flex flex-col justify-between shadow-xs relative overflow-hidden group">
          <div className="absolute top-0 right-0 h-32 w-32 bg-natural-moss/10 rounded-full blur-2xl -translate-y-10 translate-x-10 group-hover:bg-natural-moss/20 transition-colors" />
          
          <div className="space-y-5 relative z-10">
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-natural-forest bg-natural-moss/10 border border-natural-moss/20 px-3 py-1 rounded-full uppercase tracking-wider font-mono">
                Ayah of the Day
              </span>
              <span className="text-xs font-medium text-natural-text-sub">
                Random daily wisdom
              </span>
            </div>

            {/* Arabic Verse */}
            <blockquote className="space-y-4">
              <p className="font-arabic text-3xl font-medium text-right text-natural-text leading-loose">
                {dailyVerse.arabic}
              </p>
              
              {/* Translations Divider */}
              <div className="border-t border-natural-border pt-4 space-y-3">
                {/* Urdu */}
                <div className="space-y-1 bg-natural-moss/5 p-3 rounded-xl border border-natural-moss/15">
                  <span className="text-[9px] font-semibold text-natural-forest uppercase tracking-widest font-mono block">Urdu Translation</span>
                  <p className="text-sm md:text-base font-sans font-semibold text-natural-forest leading-relaxed">
                    {dailyVerse.urdu}
                  </p>
                </div>

                {/* English */}
                <div className="space-y-1 p-3 rounded-xl bg-natural-bg/50">
                  <span className="text-[9px] font-semibold text-natural-text-sub uppercase tracking-widest font-mono block">English Translation</span>
                  <p className="text-sm text-natural-text-sub leading-relaxed italic">
                    "{dailyVerse.english}"
                  </p>
                </div>
              </div>
            </blockquote>

            <p className="text-xs font-semibold text-natural-text-sub flex items-center gap-1.5 font-mono">
              <span>Surah {dailyVerse.surahName}</span>
              <span>•</span>
              <span>Ayah [ {dailyVerse.surahNumber} : {dailyVerse.ayahNumber} ]</span>
            </p>
          </div>

          <div className="mt-6 flex flex-wrap justify-between items-center gap-4 pt-4 border-t border-natural-border/40 relative z-10">
            <button
              onClick={handlePlayVerse}
              className="px-5 py-2.5 bg-natural-moss hover:bg-natural-forest text-white rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
            >
              {isVersePlaying ? (
                <>
                  <Pause className="h-4 w-4 fill-white text-white" />
                  <span>Pause Recitation</span>
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 fill-white text-white" />
                  <span>Listen Ayah</span>
                </>
              )}
            </button>

            <button
              onClick={() => {
                // Determine layout or transition and navigate to compilation surah context
                onNavigate("english", { surah: dailyVerse.surahNumber });
              }}
              className="text-xs font-semibold text-natural-text-sub hover:text-natural-moss flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-natural-bg transition-colors"
            >
              <span>Explore Surah Context</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </section>

        {/* Dynamic Prayer Times card widget */}
        <section className="lg:col-span-5 bg-natural-card border border-natural-border/50 rounded-[32px] p-6 md:p-8 flex flex-col justify-between shadow-xs relative">
          
          <div className="space-y-4">
            <div className="flex justify-between items-center flex-wrap gap-2">
              <span className="text-xs font-semibold text-natural-gold bg-natural-moss/10 border border-natural-gold/20 px-3 py-1 rounded-full uppercase tracking-wider font-mono flex items-center gap-1">
                <Compass className="h-3 w-3" />
                Prayer Timings
              </span>
              
              <button
                onClick={handleGeoLocation}
                title="Use current GPS location"
                className="p-1 px-2.5 text-xs text-natural-text-sub hover:text-natural-moss hover:bg-natural-bg rounded-lg flex items-center gap-1 transition-colors border border-natural-border/40 cursor-pointer animate-pulse-slow"
              >
                <MapPin className="h-3 w-3" />
                <span>Auto GPS</span>
              </button>
            </div>

            {/* Timings summary */}
            <div className="bg-linear-to-b from-natural-bg/50 to-natural-moss/5 p-4 rounded-2xl border border-natural-border/40 text-center space-y-2">
              <p className="text-xs font-semibold font-mono uppercase tracking-wider text-natural-text-sub">
                Location: <span className="text-natural-text font-sans font-bold">{selectedCityInfo.city}, {selectedCityInfo.country}</span>
              </p>
              
              {nextPrayerInfo && (
                <div className="space-y-1">
                  <h4 className="text-xs font-medium text-natural-text-sub">
                    Next Prayer: <span className="font-bold text-natural-moss">{nextPrayerInfo.name}</span> at <span className="font-bold">{nextPrayerInfo.time}</span>
                  </h4>
                  <p className="text-xl font-extrabold tracking-tight text-natural-text font-mono animate-pulse">
                    in {getNextPrayerCountdownStr(nextPrayerInfo.minutesLeft)}
                  </p>
                </div>
              )}
            </div>

            {/* Input to change city */}
            <form onSubmit={handleCitySearch} className="flex gap-1">
              <input
                type="text"
                placeholder="City (e.g., Mecca)..."
                required
                value={customCity}
                onChange={(e) => setCustomCity(e.target.value)}
                className="flex-1 text-xs px-3 py-2 rounded-lg border border-natural-border/50 bg-natural-bg text-natural-text placeholder:text-natural-text-sub/50 focus:outline-hidden focus:ring-1 focus:ring-natural-moss h-9"
              />
              <input
                type="text"
                placeholder="Country (optional)..."
                value={customCountry}
                onChange={(e) => setCustomCountry(e.target.value)}
                className="w-1/3 text-xs px-3 py-2 rounded-lg border border-natural-border/50 bg-natural-bg text-natural-text placeholder:text-natural-text-sub/50 focus:outline-hidden focus:ring-1 focus:ring-natural-moss h-9"
              />
              <button
                type="submit"
                className="p-2 bg-natural-moss text-white rounded-lg hover:bg-natural-forest transition-colors cursor-pointer text-xs font-semibold h-9"
              >
                Go
              </button>
            </form>

            {prayerError && (
              <p className="text-[11px] text-natural-gold text-center leading-relaxed">
                ⚠️ {prayerError}
              </p>
            )}

            {/* List with times */}
            {isFetchingPrayer ? (
              <div className="py-12 flex flex-col items-center justify-center gap-2">
                <RefreshCw className="h-6 w-6 text-natural-moss animate-spin" />
                <span className="text-xs text-natural-text-sub font-medium">Syncing live prayer schedules...</span>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 text-xs pt-2">
                {[
                  { name: "Fajr", time: prayerTimes.Fajr },
                  { name: "Sunrise", time: prayerTimes.Sunrise, highlight: true },
                  { name: "Dhuhr", time: prayerTimes.Dhuhr },
                  { name: "Asr", time: prayerTimes.Asr },
                  { name: "Maghrib", time: prayerTimes.Maghrib },
                  { name: "Isha", time: prayerTimes.Isha }
                ].map((pr, idx) => (
                  <div
                    key={idx}
                    className={`flex justify-between items-center p-2.5 rounded-xl border ${
                      nextPrayerInfo?.name === pr.name
                        ? "bg-natural-moss/15 border-natural-moss/45 text-natural-text font-bold"
                        : pr.highlight
                        ? "bg-natural-gold/15 border-natural-gold/35 text-natural-text"
                        : "bg-natural-bg border-natural-border/30 text-natural-text-sub"
                    }`}
                  >
                    <span>{pr.name}</span>
                    <span className="font-mono">{pr.time}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <p className="mt-4 text-[10px] text-center text-natural-text-sub leading-tight">
            *Method calculated according to Islamic Society of North America (ISNA).
          </p>
        </section>

      </div>

      {/* Pages Navigation and Quick Links featured section */}
      <section className="space-y-4 relative z-10 px-1">
        <h3 className="text-lg font-bold text-natural-text flex items-center gap-2">
          <BookmarkCheck className="h-5 w-5 text-natural-gold animate-pulse" />
          Quick Pages Access
        </h3>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Quick link: Mushaf */}
          <div
            onClick={() => onNavigate("mushaf")}
            className="group relative overflow-hidden bg-natural-card border border-natural-border/50 p-6 rounded-2xl shadow-xs hover:shadow-md hover:border-natural-gold transition-all cursor-pointer hover:scale-[1.01]"
          >
            <div className="absolute top-0 right-0 h-24 w-24 bg-natural-moss/10 rounded-full blur-xl translate-x-5 -translate-y-5 group-hover:bg-natural-moss/20 transition-colors" />
            <div className="space-y-4 relative z-10">
              <div className="p-3 bg-natural-moss/10 rounded-xl w-fit text-natural-moss">
                <BookOpen className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-bold text-natural-text group-hover:text-natural-moss transition-colors flex items-center gap-1.5">
                  Complete Mushaf
                  <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </h4>
                <p className="text-xs text-natural-text-sub mt-1 leading-relaxed">
                  Read complete Quran pages in real Madinah Mushaf layout (Page 1 - 604) with bookmarks and fullscreen capabilities.
                </p>
              </div>
            </div>
          </div>

          {/* Quick link: Urdu Translation */}
          <div
            onClick={() => onNavigate("urdu")}
            className="group relative overflow-hidden bg-natural-card border border-natural-border/50 p-6 rounded-2xl shadow-xs hover:shadow-md hover:border-natural-gold transition-all cursor-pointer hover:scale-[1.01]"
          >
            <div className="absolute top-0 right-0 h-24 w-24 bg-natural-moss/10 rounded-full blur-xl translate-x-5 -translate-y-5 group-hover:bg-natural-moss/20 transition-colors" />
            <div className="space-y-4 relative z-10">
              <div className="p-3 bg-natural-moss/10 rounded-xl w-fit text-natural-moss">
                <span className="font-bold font-serif text-lg tracking-wide">اردو</span>
              </div>
              <div>
                <h4 className="font-bold text-natural-text group-hover:text-natural-moss transition-colors flex items-center gap-1.5">
                  Urdu Translation
                  <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </h4>
                <p className="text-xs text-natural-text-sub mt-1 leading-relaxed">
                  Read Quran side-by-side with translation from Jalandhry, highlighting active verses with micro-audios.
                </p>
              </div>
            </div>
          </div>

          {/* Quick link: English Translation */}
          <div
            onClick={() => onNavigate("english")}
            className="group relative overflow-hidden bg-natural-card border border-natural-border/50 p-6 rounded-2xl shadow-xs hover:shadow-md hover:border-natural-gold transition-all cursor-pointer hover:scale-[1.01]"
          >
            <div className="absolute top-0 right-0 h-24 w-24 bg-natural-moss/10 rounded-full blur-xl translate-x-5 -translate-y-5 group-hover:bg-natural-moss/20 transition-colors" />
            <div className="space-y-4 relative z-10">
              <div className="p-3 bg-natural-moss/10 rounded-xl w-fit text-natural-moss">
                <span className="font-bold text-base tracking-wide font-mono">ENG</span>
              </div>
              <div>
                <h4 className="font-bold text-natural-text group-hover:text-natural-moss transition-colors flex items-center gap-1.5">
                  English Translation
                  <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </h4>
                <p className="text-xs text-natural-text-sub mt-1 leading-relaxed">
                  Analyse English translation alongside Uthmani Arabic text with interactive playback features.
                </p>
              </div>
            </div>
          </div>

          {/* Quick link: Tilawat */}
          <div
            onClick={() => onNavigate("tilawat")}
            className="group relative overflow-hidden bg-natural-card border border-natural-border/50 p-6 rounded-2xl shadow-xs hover:shadow-md hover:border-natural-gold transition-all cursor-pointer hover:scale-[1.01]"
          >
            <div className="absolute top-0 right-0 h-24 w-24 bg-natural-moss/10 rounded-full blur-xl translate-x-5 -translate-y-5 group-hover:bg-natural-moss/20 transition-colors" />
            <div className="space-y-4 relative z-10">
              <div className="p-3 bg-natural-moss/10 rounded-xl w-fit text-natural-moss">
                <Volume2 className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-bold text-natural-text group-hover:text-natural-moss transition-colors flex items-center gap-1.5">
                  Tilawat MP3 Audio
                  <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </h4>
                <p className="text-xs text-natural-text-sub mt-1 leading-relaxed">
                  Stream complete high-fidelity surah recitations by top Qaris with persistent players.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
