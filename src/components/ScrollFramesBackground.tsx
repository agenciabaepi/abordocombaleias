"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./ScrollFramesBackground.module.css";

gsap.registerPlugin(ScrollTrigger);

const TOTAL_FRAMES = 200;
const FRAME_PREFIX = "1_";
const FRAME_EXT = ".webp";

function padFrameNum(n: number): string {
  return String(n).padStart(5, "0");
}

// Carrega de /frames/ — arquivos em public/frames OU public/frames → src/frames (symlink)
function getFramePath(index: number): string {
  return `/frames/${FRAME_PREFIX}${padFrameNum(index)}${FRAME_EXT}`;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load ${src}`));
    img.src = src;
  });
}

function loadFramesProgressive(
  onFrameLoaded: (index: number, img: HTMLImageElement) => void,
  onFirstFrameReady: () => void
): void {
  let firstShown = false;
  loadImage(getFramePath(0))
    .then((img) => {
      onFrameLoaded(0, img);
      if (!firstShown) {
        firstShown = true;
        onFirstFrameReady();
      }
    })
    .catch(() => {});
  for (let i = 1; i < TOTAL_FRAMES; i++) {
    const index = i;
    loadImage(getFramePath(index))
      .then((img) => onFrameLoaded(index, img))
      .catch(() => {});
  }
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

const MOBILE_BREAKPOINT = 768;

type Props = {
  variant?: "fullpage" | "section";
  /** Quando variant="section", ref do elemento que define o scroll (a seção) */
  triggerRef?: React.RefObject<HTMLElement | null>;
};

export default function ScrollFramesBackground({ variant = "fullpage", triggerRef }: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[] | null>(null);
  const progressRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const [ready, setReady] = useState(false);
  const isSection = variant === "section";

  // Carrega frame 0 primeiro e mostra o canvas; depois carrega o restante em background
  useEffect(() => {
    const images: (HTMLImageElement | null)[] = Array(TOTAL_FRAMES).fill(null);
    imagesRef.current = images;

    const onFrameLoaded = (index: number, img: HTMLImageElement) => {
      if (imagesRef.current && index < imagesRef.current.length) {
        imagesRef.current[index] = img;
        scheduleDraw.current();
      }
    };

    const onFirstFrameReady = () => {
      setReady(true);
    };

    loadFramesProgressive(onFrameLoaded, onFirstFrameReady);
  }, []);

  // Redimensionar canvas e desenhar (função estável)
  const doResizeAndDraw = useRef<() => void>(() => {});
  doResizeAndDraw.current = () => {
    const canvas = canvasRef.current;
    const images = imagesRef.current;
    if (!canvas || !images) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const container = isSection ? wrapperRef.current : null;
    const w = container ? container.clientWidth : window.innerWidth;
    const h = container ? container.clientHeight : window.innerHeight;
    if (w <= 0 || h <= 0) return;

    const displayW = Math.round(w * dpr);
    const displayH = Math.round(h * dpr);

    if (canvas.width !== displayW || canvas.height !== displayH) {
      canvas.width = displayW;
      canvas.height = displayH;
    }

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const progress = Math.min(Math.max(progressRef.current, 0), 1);
    const frameIndex = Math.min(
      Math.floor(progress * (TOTAL_FRAMES - 1)),
      TOTAL_FRAMES - 1
    );

    const getImg = (index: number) => {
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

    const isMobile = w < MOBILE_BREAKPOINT;
    const scaleDown = isSection && isMobile ? 0.76 : 1;
    const drawW = w * scaleDown;
    const drawH = h * scaleDown;
    const drawX = (w - drawW) / 2;
    const drawY = (h - drawH) / 2;

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, w, h);
    if (scaleDown < 1) {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, w, h);
      ctx.translate(drawX, drawY);
      drawFrameCover(ctx, img, drawW, drawH);
    } else {
      drawFrameCover(ctx, img, w, h);
    }
    ctx.restore();
  };

  const scheduleDraw = useRef(() => {
    if (rafRef.current != null) return;
    rafRef.current = requestAnimationFrame(() => {
      doResizeAndDraw.current();
      rafRef.current = null;
    });
  });

  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);

  // ScrollTrigger: fullpage = progresso da página; section = progresso só ao rolar dentro da seção
  useEffect(() => {
    if (!ready) return;

    let rafId: number | undefined;

    const setup = () => {
      const trigger = isSection && triggerRef?.current ? triggerRef.current : null;
      if (trigger) {
        const endVh =
          typeof window !== "undefined" && window.innerWidth < MOBILE_BREAKPOINT
            ? 1200
            : 700;
        const tl = gsap.timeline({
          onUpdate: () => {
            progressRef.current = tl.progress();
            scheduleDraw.current();
          },
        });
        tl.to({ p: 0 }, { p: 1, duration: 1, ease: "none" });
        scrollTriggerRef.current = ScrollTrigger.create({
          trigger,
          start: "top top",
          end: `+=${endVh}vh`,
          pin: true,
          animation: tl,
          scrub: 1,
        });
      } else {
        scrollTriggerRef.current = ScrollTrigger.create({
          start: 0,
          end: "max",
          onUpdate: (self) => {
            progressRef.current = self.progress;
            scheduleDraw.current();
          },
        });
      }
    };

    if (isSection && triggerRef) {
      rafId = requestAnimationFrame(() => {
        if (triggerRef?.current) setup();
        scheduleDraw.current();
      });
    } else {
      setup();
    }

    const onResize = () => scheduleDraw.current();
    window.addEventListener("resize", onResize);
    progressRef.current = 0;
    scheduleDraw.current();

    return () => {
      if (rafId != null) cancelAnimationFrame(rafId);
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill();
        scrollTriggerRef.current = null;
      }
      window.removeEventListener("resize", onResize);
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, [ready, isSection, triggerRef]);

  if (!ready) return null;

  return (
    <div
      ref={wrapperRef}
      className={isSection ? styles.wrapperSection : styles.wrapper}
      aria-hidden
    >
      <canvas
        ref={canvasRef}
        className={styles.canvas}
        width={1}
        height={1}
      />
    </div>
  );
}
