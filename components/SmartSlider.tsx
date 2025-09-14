import React, { useState, useRef, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'

interface SmartSliderProps {
  images: string[]
  alt?: string
  width?: number
  height?: number
}

const AUTO_PLAY_INTERVAL = 2000

export default function SmartSlider({
  images,
  alt = '',
  width = 400,
  height = 300,
}: SmartSliderProps) {
  const [current, setCurrent] = useState(0)
  const [hovering, setHovering] = useState(false)
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null)
  const touchStartX = useRef<number>(0)

  // advance index (with wrap)
  const next = useCallback(() => {
    setCurrent(i => (i + 1) % images.length)
  }, [images.length])
  const prev = useCallback(() => {
    setCurrent(i => (i - 1 + images.length) % images.length)
  }, [images.length])

  // on hover: start auto-play; on leave: stop & reset
  useEffect(() => {
    if (hovering) {
      autoPlayRef.current = setInterval(next, AUTO_PLAY_INTERVAL)
    } else {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current)
      setCurrent(0)
    }
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current)
    }
  }, [hovering, next])

  // mouse-move scrubbing (optional)
  const onMouseMove = (e: React.MouseEvent) => {
    const rect = (e.target as HTMLDivElement).getBoundingClientRect()
    const pct = (e.clientX - rect.left) / rect.width
    const idx = Math.floor(pct * images.length)
    setCurrent(Math.min(Math.max(idx, 0), images.length - 1))
  }

  // touch support
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }
  const onTouchEnd = (e: React.TouchEvent) => {
    const delta = e.changedTouches[0].clientX - touchStartX.current
    if (Math.abs(delta) > 50) {
      if (delta > 0) {
        prev()
      } else {
        next()
      }
    }
  }
console.log(images, "images");
  return (
    <div
      className="relative overflow-hidden rounded-xl"
      style={{ width, height }}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onMouseMove={onMouseMove}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {images.map((src, i) => (
        <Image
          key={i}
          src={src}
          alt={alt}
          layout="fill"
          objectFit="cover"
          className="absolute transition-transform duration-300"
          style={{ transform: `translateX(${(i - current) * 100}%)` }}
        />
      ))}

      {/* dots */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1.5">
  {images.map((_, i) => (
    <button
      key={i}
      onClick={() => setCurrent(i)}
      className={`block rounded-full transition-all duration-300 ease-out ${
        i === current
          ? 'bg-white scale-125 w-6 h-2 shadow-md'
          : 'bg-white/70 w-2 h-2 hover:bg-white/90'
      }`}
    />
  ))}
</div>

      {/* arrows */}
      {hovering && (
        <>
          <button
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-1 rounded-full"
          >
            <FiChevronLeft />
          </button>
          <button
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-1 rounded-full"
          >
            <FiChevronRight />
          </button>
        </>
      )}
    </div>
  )
}
