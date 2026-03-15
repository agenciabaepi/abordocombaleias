"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./HeroFramesBackground.module.css";

// Mesma sequência: 1_00000 … 1_00263 (264 frames)
const TOTAL_FRAMES = 264;
const FPS = 20;
const FRAME_PREFIX = "1_";

function padFrameNum(n: number): string {
  return String(n).padStart(5, "0");
}

function getFramePath(index: number, ext: string): string {
  return `/frame-video/${FRAME_PREFIX}${padFrameNum(index)}${ext}`;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load ${src}`));
    img.src = src;
  });
}

// Tenta .webp; se falhar, usa .png (para funcionar com os dois formatos)
async function loadFirstFrame(
  onSuccess: (img: HTMLImageElement, ext: string) => void,
  onNoFrames: () => void
) {
  try {
    const img = await loadImage(getFramePath(0, ".webp"));
    onSuccess(img, ".webp");
    return;
  } catch {
    // ignore
  }
  try {
    const img = await loadImage(getFramePath(0, ".png"));
    onSuccess(img, ".png");
    return;
  } catch {
    // ignore
  }
  onNoFrames();
}

function drawFrameCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  w: number,
  h: number
): void {
  const iw = img.naturalWidth;
  const ih = img.naturalHeight;
  const scale = Math.max(w / iw, h / ih);
  const sw = iw * scale;
  const sh = ih * scale;
  const sx = (w - sw) / 2;
  const sy = (h - sh) / 2;
  ctx.drawImage(img, 0, 0, iw, ih, sx, sy, sw, sh);
}

export default function HeroFramesBackground() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[] | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const [ready, setReady] = useState(false);

  // Carrega frame 0 primeiro (.webp ou .png); depois o restante em background
  useEffect(() => {
    const images: (HTMLImageElement | null)[] = Array(TOTAL_FRAMES).fill(null);
    imagesRef.current = images;

    loadFirstFrame(
      (img, ext) => {
        if (imagesRef.current) {
          imagesRef.current[0] = img;
          setReady(true);
        }
        for (let i = 1; i < TOTAL_FRAMES; i++) {
          const index = i;
          loadImage(getFramePath(index, ext)).then((loadedImg) => {
            if (imagesRef.current && index < imagesRef.current.length) {
              imagesRef.current[index] = loadedImg;
            }
          }).catch(() => {});
        }
      },
      () => setReady(true)
    );
  }, []);

  const scheduleDraw = useRef(() => {});
  const doResizeAndDraw = useRef<() => void>(() => {});

  doResizeAndDraw.current = () => {
    const canvas = canvasRef.current;
    const images = imagesRef.current;
    if (!canvas || !images) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = wrapperRef.current?.clientWidth ?? window.innerWidth;
    const h = wrapperRef.current?.clientHeight ?? window.innerHeight;
    if (w <= 0 || h <= 0) return;

    const displayW = Math.round(w * dpr);
    const displayH = Math.round(h * dpr);

    if (canvas.width !== displayW || canvas.height !== displayH) {
      canvas.width = displayW;
      canvas.height = displayH;
    }

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const now = performance.now();
    if (startTimeRef.current == null) startTimeRef.current = now;
    const elapsed = (now - startTimeRef.current) / 1000;
    const frameDuration = 1 / FPS;
    const loopDuration = TOTAL_FRAMES * frameDuration;
    const loopTime = elapsed % loopDuration;
    const frameIndex = Math.min(
      Math.floor(loopTime / frameDuration),
      TOTAL_FRAMES - 1
    );

    const getImg = (index: number): HTMLImageElement | null => {
      let img = images[index] ?? null;
      if (!img) {
        for (let i = index; i >= 0; i--) {
          if (images[i]) return images[i];
        }
        for (let i = index + 1; i < images.length; i++) {
          if (images[i]) return images[i];
        }
      }
      return img;
    };

    const img = getImg(frameIndex);
    if (!img) return;

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, w, h);
    drawFrameCover(ctx, img, w, h);
    ctx.restore();
  };

  // Loop de animação (time-based)
  useEffect(() => {
    if (!ready) return;

    const tick = () => {
      doResizeAndDraw.current();
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    const onResize = () => {
      doResizeAndDraw.current();
    };
    window.addEventListener("resize", onResize);

    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
    };
  }, [ready]);

  if (!ready) return null;

  return (
    <div ref={wrapperRef} className={styles.wrapper} aria-hidden>
      <canvas
        ref={canvasRef}
        className={styles.canvas}
        width={1}
        height={1}
      />
    </div>
  );
}
