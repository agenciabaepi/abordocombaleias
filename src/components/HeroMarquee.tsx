"use client";

import styles from "./HeroMarquee.module.css";

const ITEMS = [
  "Temporada de Baleias 2026",
  "Passeios exclusivos ao mar",
  "Avistagem responsável",
  "Experiência inesquecível",
  "Reserve sua vaga",
  "Conforto e segurança",
  "Encontro com as baleias",
  "Próxima temporada",
];

export default function HeroMarquee() {
  return (
    <div className={styles.wrapper} aria-hidden>
      <div className={styles.container}>
        <div className={styles.list}>
          {ITEMS.map((text, i) => (
            <span key={`a-${i}`} className={styles.item}>
              {text}
            </span>
          ))}
          {ITEMS.map((text, i) => (
            <span key={`b-${i}`} className={styles.item}>
              {text}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
