'use client';

import { useEffect, useRef, useState } from 'react';
import { photos } from './wedding-data';

const SECONDS_PER_PHOTO = 8;

export default function MomentsExperience({
  onPhoto,
  images = photos,
  label = 'Our moments photo gallery',
}: {
  onPhoto?: (index: number) => void;
  images?: readonly { id: string; alt: string }[];
  label?: string;
}) {
  const stage = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLButtonElement | null)[]>([]);
  const position = useRef(0);
  const target = useRef(0);
  const dragging = useRef(false);
  const lastX = useRef(0);
  const travel = useRef(0);
  const focused = useRef(false);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setPlaying(!preference.matches);
    sync();
    preference.addEventListener('change', sync);
    return () => preference.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    const element = stage.current;
    if (!element) return;
    let width = element.clientWidth;
    const resize = new ResizeObserver(() => {
      width = element.clientWidth;
    });
    resize.observe(element);
    let inView = false;
    const visibility = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
    });
    visibility.observe(element);
    let frame = 0;
    let previous = 0;
    const draw = (now: number) => {
      const dt = previous ? Math.min((now - previous) / 1000, 0.05) : 0;
      previous = now;
      if (!document.hidden && inView) {
        if (playing && !focused.current && !dragging.current) {
          target.current += dt / SECONDS_PER_PHOTO;
        }
        // Constant drift; only user gestures use a short, gentle catch-up.
        const difference = target.current - position.current;
        position.current +=
          Math.abs(difference) < 0.015
            ? difference
            : difference * (1 - Math.exp(-dt * 10));
        const cardWidth = Math.min(width * (width < 700 ? 0.64 : 0.3), 390);
        const radius = cardWidth * 1.85;
        cards.current.forEach((card, index) => {
          if (!card) return;
          const distance =
            ((index -
              position.current +
              images.length * 1000 +
              images.length / 2) %
              images.length) -
            images.length / 2;
          const angle = distance * 0.6;
          const visible = Math.abs(distance) < 3;
          card.style.visibility = visible ? 'visible' : 'hidden';
          card.style.transform = `translate(-50%, -50%) translate3d(${Math.sin(angle) * radius}px, 0, ${(Math.cos(angle) - 1) * radius}px) rotateY(${-angle}rad)`;
          card.style.opacity = String(
            Math.max(0, 1 - Math.max(0, Math.abs(distance) - 1) * 0.42),
          );
          card.style.zIndex = String(100 - Math.round(Math.abs(distance) * 10));
          card.tabIndex = Math.abs(distance) < 0.55 ? 0 : -1;
        });
        // Keep long-running loops numerically bounded, without a visible reset.
        if (
          target.current > images.length * 100 ||
          target.current < -images.length * 100
        ) {
          const cycles =
            Math.trunc(target.current / images.length) * images.length;
          target.current -= cycles;
          position.current -= cycles;
        }
      }
      frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      visibility.disconnect();
    };
  }, [playing, images]);

  const move = (step: number) => {
    target.current = Math.round(target.current) + step;
  };

  return (
    <div className="moments-experience">
      <div
        ref={stage}
        className="moments-orbit"
        role="region"
        aria-label={label + '. Drag or use the arrow keys to browse.'}
        tabIndex={0}
        onFocus={() => {
          focused.current = true;
        }}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget))
            focused.current = false;
        }}
        onKeyDown={(event) => {
          if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
            event.preventDefault();
            move(event.key === 'ArrowRight' ? 1 : -1);
          }
        }}
        onPointerDown={(event) => {
          if (event.button !== 0) return;
          dragging.current = true;
          travel.current = 0;
          lastX.current = event.clientX;
        }}
        onPointerMove={(event) => {
          if (!dragging.current) return;
          const delta = event.clientX - lastX.current;
          travel.current += Math.abs(delta);
          target.current -=
            delta / Math.min(event.currentTarget.clientWidth * 0.64, 390);
          lastX.current = event.clientX;
          if (
            travel.current > 8 &&
            !event.currentTarget.hasPointerCapture(event.pointerId)
          )
            event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerUp={(event) => {
          dragging.current = false;
          if (event.currentTarget.hasPointerCapture(event.pointerId))
            event.currentTarget.releasePointerCapture(event.pointerId);
        }}
        onPointerCancel={() => {
          dragging.current = false;
        }}
        onLostPointerCapture={() => {
          dragging.current = false;
        }}
      >
        {images.map((image, index) => (
          <button
            key={image.id}
            ref={(element) => {
              cards.current[index] = element;
            }}
            className="moments-orbit-photo"
            aria-label={
              (onPhoto ? 'View photo: ' : 'Browse to photo: ') + image.alt
            }
            onClick={() => {
              if (travel.current > 8) return;
              if (onPhoto) onPhoto(index);
              else {
                const current = Math.round(target.current);
                const distance =
                  ((index -
                    current +
                    images.length * 1000 +
                    images.length / 2) %
                    images.length) -
                  images.length / 2;
                target.current = current + distance;
              }
            }}
          >
            <img
              src={'/photos/' + image.id + '.webp'}
              alt={image.alt}
              draggable={false}
              decoding="async"
              loading={
                index < 3 || index > images.length - 3 ? 'eager' : 'lazy'
              }
            />
          </button>
        ))}
      </div>
      <div className="moments-orbit-controls">
        <button aria-label="Previous photo" onClick={() => move(-1)}>
          ←
        </button>
        <button
          aria-label={
            playing ? 'Pause photo scrolling' : 'Play photo scrolling'
          }
          aria-pressed={playing}
          onClick={() => setPlaying((value) => !value)}
        >
          {playing ? 'Pause' : 'Play'}
        </button>
        <button aria-label="Next photo" onClick={() => move(1)}>
          →
        </button>
      </div>
    </div>
  );
}
