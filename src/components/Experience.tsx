"use client";

import SectionReveal from "./SectionReveal";
import styles from "./Experience.module.css";

export default function Experience() {
  return (
    <SectionReveal as="section" className={styles.section} id="experiencia">
      <div className="section-inner">
        <div className={styles.grid}>
          <header className={styles.header}>
            <span className={styles.label}>A experiência</span>
            <h2 className={styles.title}>
              Um encontro único com o oceano
            </h2>
            <p className={styles.lead}>
              Nossos passeios são pensados para quem busca mais do que um tour:
              uma conexão genuína com a natureza e momentos que ficam na memória.
            </p>
          </header>
          <ul className={styles.list}>
            <li className={styles.item}>
              <span className={styles.icon} aria-hidden>
                —
              </span>
              <div>
                <strong>Embarcação adequada</strong>
                <p>Conforto e segurança em cada saída ao mar.</p>
              </div>
            </li>
            <li className={styles.item}>
              <span className={styles.icon} aria-hidden>
                —
              </span>
              <div>
                <strong>Respeito ao habitat</strong>
                <p>Práticas responsáveis para preservar as baleias e o ecossistema.</p>
              </div>
            </li>
            <li className={styles.item}>
              <span className={styles.icon} aria-hidden>
                —
              </span>
              <div>
                <strong>Equipe especializada</strong>
                <p>Guias e tripulação com experiência na temporada de baleias.</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </SectionReveal>
  );
}
