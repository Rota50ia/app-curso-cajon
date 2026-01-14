import { useState, useRef, useEffect, useCallback } from "react";

interface UseAudioPlayerReturn {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  playbackRate: number;
  isLooping: boolean;
  play: () => void;
  pause: () => void;
  toggle: () => void;
  seek: (time: number) => void;
  setPlaybackRate: (rate: number) => void;
  toggleLoop: () => void;
  loadTrack: (url: string) => void;
}

export const useAudioPlayer = (): UseAudioPlayerReturn => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRateState] = useState(1);
  const [isLooping, setIsLooping] = useState(true);

  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.loop = true;

    const audio = audioRef.current;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => {
      if (!isLooping) {
        setIsPlaying(false);
      }
    };
    const handleError = (e: Event) => {
      console.error("Audio error:", e);
      setIsPlaying(false);
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
      audio.pause();
      audio.src = "";
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.loop = isLooping;
    }
  }, [isLooping]);

  const loadTrack = useCallback((url: string) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = url;
      audioRef.current.load();
      setCurrentTime(0);
      setIsPlaying(false);
    }
  }, []);

  const play = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(console.error);
    }
  }, []);

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  const toggle = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, play, pause]);

  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  }, []);

  const setPlaybackRate = useCallback((rate: number) => {
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
      setPlaybackRateState(rate);
    }
  }, []);

  const toggleLoop = useCallback(() => {
    setIsLooping(prev => !prev);
  }, []);

  return {
    isPlaying,
    currentTime,
    duration,
    playbackRate,
    isLooping,
    play,
    pause,
    toggle,
    seek,
    setPlaybackRate,
    toggleLoop,
    loadTrack
  };
};
