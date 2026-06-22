/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, Square, Volume2, VolumeX, SkipForward, RefreshCw, AudioLines } from "lucide-react";

interface AudioPlayerBarProps {
  audioUrl: string;
  title: string;
  audioState: "playing" | "paused" | "stopped";
  onPause: () => void;
  onPlay: () => void;
  onStop: () => void;
}

export default function AudioPlayerBar({
  audioUrl,
  title,
  audioState,
  onPause,
  onPlay,
  onStop,
}: AudioPlayerBarProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [duration, setDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [volume, setVolume] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isSeeking, setIsSeeking] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Re-initialize audio on url modification
  useEffect(() => {
    if (!audioUrl) return;

    if (!audioRef.current) {
      audioRef.current = new Audio(audioUrl);
    } else {
      audioRef.current.src = audioUrl;
    }

    const audio = audioRef.current;
    
    // Set parameters
    audio.volume = isMuted ? 0 : volume;
    
    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
      setIsLoading(false);
    };

    const handleTimeUpdate = () => {
      if (!isSeeking) {
        setCurrentTime(audio.currentTime);
      }
    };

    const handleAudioEnded = () => {
      onStop();
      setCurrentTime(0);
    };

    const handleWaiting = () => {
      setIsLoading(true);
    };

    const handleCanPlay = () => {
      setIsLoading(false);
    };

    setIsLoading(true);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleAudioEnded);
    audio.addEventListener("waiting", handleWaiting);
    audio.addEventListener("canplay", handleCanPlay);

    if (audioState === "playing") {
      audio.play().catch((err) => {
        console.warn("Autoplay or play blocked", err);
        onPause();
      });
    }

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleAudioEnded);
      audio.removeEventListener("waiting", handleWaiting);
      audio.removeEventListener("canplay", handleCanPlay);
      audio.pause();
    };
  }, [audioUrl]);

  // Handle Play / Pause commands from prop triggers
  useEffect(() => {
    if (!audioRef.current) return;
    const audio = audioRef.current;

    if (audioState === "playing") {
      audio.play().catch(() => onPause());
    } else if (audioState === "paused") {
      audio.pause();
    } else if (audioState === "stopped") {
      audio.pause();
      audio.currentTime = 0;
      setCurrentTime(0);
    }
  }, [audioState]);

  // Adjust volume
  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  const handlePlayPause = () => {
    if (audioState === "playing") {
      onPause();
    } else {
      onPlay();
    }
  };

  const handleScrubChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setCurrentTime(val);
    setIsSeeking(true);
  };

  const handleScrubEnd = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = currentTime;
    }
    setIsSeeking(false);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const formatTime = (timeInSecs: number) => {
    if (isNaN(timeInSecs) || timeInSecs === Infinity) return "00:00";
    const minutes = Math.floor(timeInSecs / 60);
    const seconds = Math.floor(timeInSecs % 60);
    const minStr = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const secStr = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${minStr}:${secStr}`;
  };

  if (!audioUrl || audioState === "stopped") return null;

  return (
    <div className="fixed bottom-0 left-0 w-full bg-[#3c3836] border-t border-[#8c8474]/20 text-[#FAF6EC] z-50 px-4 py-3 md:py-4 shadow-2xl animate-fade-in-up">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Info label description with Wave representation */}
        <div className="flex items-center gap-3 w-full md:w-1/3 min-w-0">
          <div className="p-2.5 bg-natural-moss/20 text-natural-gold border border-natural-moss/40 rounded-xl flex-shrink-0 animate-pulse">
            {isLoading ? (
              <RefreshCw className="h-5 w-5 animate-spin text-natural-gold" />
            ) : (
              <AudioLines className="h-5 w-5 text-natural-gold" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-natural-gold font-mono tracking-wide uppercase">Streaming Recitation</p>
            <h4 className="text-sm font-bold text-white truncate mt-0.5 leading-snug font-serif" title={title}>
              {title}
            </h4>
          </div>
        </div>

        {/* Timeline controller slide */}
        <div className="flex items-center gap-3 w-full md:w-2/5 flex-col sm:flex-row">
          <span className="text-[11px] font-mono text-[#FAF6EC]/80 select-none">
            {formatTime(currentTime)}
          </span>
          <div className="relative flex-1 w-full flex items-center">
            <input
              type="range"
              min="0"
              max={duration || 100}
              value={currentTime}
              onChange={handleScrubChange}
              onMouseUp={handleScrubEnd}
              onTouchEnd={handleScrubEnd}
              className="w-full accent-natural-gold h-1.5 rounded-lg bg-natural-forest cursor-pointer focus:outline-hidden"
            />
          </div>
          <span className="text-[11px] font-mono text-[#FAF6EC]/80 select-none">
            {formatTime(duration)}
          </span>
        </div>

        {/* Global physical buttons control */}
        <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-1/4">
          
          {/* Main triggers: Play Pause Stop */}
          <div className="flex items-center gap-3">
            <button
              onClick={handlePlayPause}
              className="h-10 w-10 flex items-center justify-center rounded-xl bg-natural-moss hover:bg-natural-forest text-white shadow-sm transition-transform cursor-pointer hover:scale-105 active:scale-95"
              title={audioState === "playing" ? "Pause" : "Play"}
            >
              {audioState === "playing" ? (
                <Pause className="h-4.5 w-4.5 fill-white" />
              ) : (
                <Play className="h-4.5 w-4.5 fill-white ml-0.5" />
              )}
            </button>

            <button
              onClick={onStop}
              className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-rose-950/20 text-[#FAF6EC]/80 hover:text-rose-500 transition-colors border border-[#8c8474]/35 cursor-pointer"
              title="Stop playback"
            >
              <Square className="h-4.5 w-4.5 fill-current" />
            </button>
          </div>

          {/* Volume control slide controller */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleMute}
              className="p-2 text-natural-gold hover:text-white transition-colors cursor-pointer"
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? (
                <VolumeX className="h-4.5 w-4.5 text-rose-400" />
              ) : (
                <Volume2 className="h-4.5 w-4.5 text-[#E0D8CC]" />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={(e) => {
                setVolume(parseFloat(e.target.value));
                if (isMuted) setIsMuted(false);
              }}
              className="w-20 accent-natural-gold h-1 bg-natural-forest rounded-lg cursor-pointer"
            />
          </div>

        </div>

      </div>
    </div>
  );
}
