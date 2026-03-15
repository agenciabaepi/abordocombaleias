"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import HeroFramesBackground from "./HeroFramesBackground";
import styles from "./Hero.module.css";

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(
        titleRef.current,
        { y: 32, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9 }
      )
        .fromTo(
          lineRef.current,
          { scaleX: 0 },
          { scaleX: 1, duration: 0.6 },
          "-=0.5"
        )
        .fromTo(
          subtitleRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7 },
          "-=0.4"
        )
        .fromTo(
          ctaRef.current,
          { y: 16, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5 },
          "-=0.3"
        );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className={styles.hero} id="hero">
      <div className={styles.bg}>
        <HeroFramesBackground />
        <div className={styles.videoOverlay} aria-hidden />
        <div className={styles.gradient} />
        <div className={styles.wave} aria-hidden />
      </div>
      <div className={`section-inner ${styles.inner}`}>
        <h1 ref={titleRef} className={styles.title}>
          Temporada de Baleias 2026
        </h1>
        <div ref={lineRef} className={styles.line} />
        <p ref={subtitleRef} className={styles.subtitle}>
          Viva a experiência de encontrar as baleias em seu habitat natural.
          <br />
          Passeios exclusivos com conforto e segurança.
        </p>
        <div ref={ctaRef} className={styles.ctaWrap}>
          <a href="#contato" className={styles.cta}>
            Garantir minha vaga
          </a>
        </div>
      </div>
      <div className={styles.scrollHint} aria-hidden>
        <span>Role para descobrir</span>
      </div>
    </section>
  );
}
