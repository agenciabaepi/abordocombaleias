"use client";

import SectionReveal from "./SectionReveal";
import styles from "./Experience.module.css";

export default function Experience() {
  return (
    <SectionReveal as="section" className={styles.section} id="experiencia">
      <div className="section-inner">
        <div className={styles.grid}>
          <div className={styles.media} aria-hidden>
            <picture>
              <source media="(min-width: 901px)" srcSet="/imagens/cardbaleiadesktop.png" />
              <img src="/imagens/cardbaleia.png" alt="" className={styles.image} />
            </picture>
          </div>
          <div className={styles.content}>
            <div className={styles.ctaWrap}>
              <a href="#contato" className={styles.cta}>
                Garantir minha vaga
              </a>
            </div>
          </div>
        </div>
      </div>
    </SectionReveal>
  );
}
