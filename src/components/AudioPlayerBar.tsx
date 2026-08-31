/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, Square, Volume2, VolumeX, RefreshCw, AudioLines } from "lucide-react";

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

  // Initialize and reload audio element when audioUrl changes
  useEffect(() => {
    if (!audioUrl) return;

    if (!audioRef.current) {
      audioRef.current = new Audio(audioUrl);
    } else {
      audioRef.current.src = audioUrl;
    }

    const audio = audioRef.current;
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

  // Sync state prop with HTMLAudioElement
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

  // Sync volume & mute
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
    <div className="fixed bottom-0 left-0 w-full bg-stone-900 border-t border-emerald-900/40 text-stone-100 z-50 px-4 py-3 md:py-4 shadow-2xl">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Title description with wave icon */}
        <div className="flex items-center gap-3 w-full md:w-1/3 min-w-0">
          <div className="p-2.5 bg-emerald-950 text-amber-400 border border-emerald-800 rounded-xl flex-shrink-0 animate-pulse">
            {isLoading ? (
              <RefreshCw className="h-5 w-5 animate-spin text-amber-400" />
            ) : (
              <AudioLines className="h-5 w-5 text-amber-400" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold text-amber-400 font-mono tracking-wide uppercase">
              Streaming Recitation
            </p>
            <h4 className="text-sm font-bold text-stone-100 truncate mt-0.5 leading-snug font-serif" title={title}>
              {title}
            </h4>
          </div>
        </div>

        {/* Timeline scrubber */}
        <div className=" flex min-w-0 w-full items-center gap-2">
            <span className=" w-10 shrink-0 text-[10px] text-stone-300 font-mono text-left sm:w-12 sm:text-[11px]" >
              {formatTime(currentTime)}
            </span>

            <input
              type="range"
              min="0"
              max={duration || 100}
              value={currentTime}
              onChange={handleScrubChange}
              onMouseUp={handleScrubEnd}
              onTouchEnd={handleScrubEnd}
              className=" min-w-0 flex-1 cursor-pointer accent-amber-400"
            />

            <span className=" w-10 shrink-0 text-right text-[10px] text-stone-300 font-mono sm:w-12 sm:text-[11px]" >
              {formatTime(duration)}
            </span>
          </div>

        {/* Controls */}
        <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-1/4">
          <div className="flex items-center gap-3">
            <button
              onClick={handlePlayPause}
              className="h-10 w-10 flex items-center justify-center rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-transform cursor-pointer hover:scale-105 active:scale-95"
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
              className="h-10 w-10 flex items-center justify-center rounded-xl bg-stone-800 hover:bg-rose-950 text-stone-300 hover:text-rose-400 transition-colors border border-stone-700 cursor-pointer"
              title="Stop playback"
            >
              <Square className="h-4.5 w-4.5 fill-current" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleMute}
              className="p-2 text-amber-400 hover:text-white transition-colors cursor-pointer"
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? (
                <VolumeX className="h-4.5 w-4.5 text-rose-400" />
              ) : (
                <Volume2 className="h-4.5 w-4.5 text-stone-300" />
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
              className="w-20 accent-amber-400 h-1 bg-stone-800 rounded-lg cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
