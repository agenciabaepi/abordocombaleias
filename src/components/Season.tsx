"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionReveal from "./SectionReveal";
import styles from "./Season.module.css";

gsap.registerPlugin(ScrollTrigger);

export default function Season() {
  const visualRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = visualRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0.6, scale: 1.02 },
        {
          opacity: 1,
          scale: 1,
          duration: 1.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 70%",
            end: "top 30%",
            scrub: 0.8,
          },
        }
      );
    }, visualRef);
    return () => ctx.revert();
  }, []);

  return (
    <SectionReveal as="section" className={styles.section} id="temporada">
      <div className="section-inner">
        <header className={styles.header}>
          <span className={styles.label}>A temporada</span>
          <h2 className={styles.title}>
            O melhor momento para viver essa experiência
          </h2>
          <p className={styles.lead}>
            Todos os anos as baleias visitam nossa costa. Estamos prontos para
            recebê-lo com a estrutura e o cuidado que essa experiência merece.
          </p>
        </header>
      </div>
      {/* Camada visual — preparada para animações de scroll no futuro */}
      <div ref={visualRef} className={styles.visual}>
        <div className={styles.visualBg} />
        <div className={styles.visualOverlay} />
        <div className={styles.visualContent}>
          <p className={styles.visualQuote}>
            “Um encontro que transforma a forma como enxergamos o mar.”
          </p>
        </div>
      </div>
    </SectionReveal>
  );
}
