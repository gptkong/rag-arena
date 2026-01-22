import { useState, useRef } from 'react'

export function useCitationAudio(totalDuration: number) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [currentTime, setCurrentTime] = useState(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const seek = (seconds: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = seconds
      setCurrentTime(seconds)
    }
  }

  const stepBackward = () => {
    if (audioRef.current) {
      const newTime = Math.max(0, audioRef.current.currentTime - 10)
      audioRef.current.currentTime = newTime
      setCurrentTime(newTime)
    }
  }

  const stepForward = () => {
    if (audioRef.current) {
      const newTime = Math.min(
        totalDuration,
        (audioRef.current.currentTime || 0) + 10
      )
      audioRef.current.currentTime = newTime
      setCurrentTime(newTime)
    }
  }

  const changePlaybackRate = (rate: number) => {
    setPlaybackRate(rate)
    if (audioRef.current) {
      audioRef.current.playbackRate = rate
    }
  }

  const reset = () => {
    setIsPlaying(false)
    setCurrentTime(0)
    setPlaybackRate(1)
    if (audioRef.current) {
      audioRef.current.currentTime = 0
      audioRef.current.playbackRate = 1
    }
  }

  return {
    audioRef,
    isPlaying,
    setIsPlaying,
    playbackRate,
    currentTime,
    setCurrentTime,
    togglePlay,
    seek,
    stepBackward,
    stepForward,
    changePlaybackRate,
    reset,
  }
}
