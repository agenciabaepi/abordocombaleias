"use client";

import HeroFramesBackground from "./HeroFramesBackground";
import styles from "./ScrollFramesSection.module.css";

export default function ScrollFramesSection() {
  return (
    <section
      className={styles.section}
      id="animacao"
      aria-label="Animação da temporada de baleias"
    >
      <HeroFramesBackground />
    </section>
  );
}
