'use client';
import React, { useEffect, useRef } from 'react';
import videojs from 'video.js';
type VideoPlayerProps = {
  src: string;
};

const VideoPlayer = ({ src }: VideoPlayerProps) => {
  const videoRef = useRef(null);
  const isMobile = typeof window !== "undefined" && window.innerWidth < 700;
  useEffect(() => {
    if (videoRef.current && src) {
      videojs(videoRef.current, {
        width: isMobile ? 340 : 360,
        height: 230,
        theme: "videojs-theme-city",
        sources: [
          {
            src: src,
            type: "video/mp4"
          }
        ]
      });
    }
  }, [src]);

  return (
    <div>
      <video controls ref={videoRef} className="video-js vjs-theme-forest" />
    </div>)
};

export default VideoPlayer;
