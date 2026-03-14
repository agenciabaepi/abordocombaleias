"use client";

import { useRef } from "react";
import ScrollFramesBackground from "./ScrollFramesBackground";
import styles from "./ScrollFramesSection.module.css";

export default function ScrollFramesSection() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      ref={sectionRef}
      className={styles.section}
      id="animacao"
      aria-label="Animação da temporada de baleias"
    >
      <ScrollFramesBackground variant="section" triggerRef={sectionRef} />
    </section>
  );
}
