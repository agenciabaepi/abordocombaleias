"use client";

import SectionReveal from "./SectionReveal";
import { contact } from "@/config/contact";
import styles from "./CTA.module.css";

export default function CTA() {
  return (
    <SectionReveal as="section" className={styles.section} id="contato">
      <div className="section-inner">
        <div className={styles.block}>
          <h2 className={styles.title}>Reserve sua experiência</h2>
          <p className={styles.text}>
            Entre em contato para saber datas, valores e como garantir sua vaga
            na próxima temporada de baleias.
          </p>
          <div className={styles.actions}>
            <a href={`mailto:${contact.email}`} className={styles.primary}>
              Falar com a equipe
            </a>
            <a href={`tel:${contact.phone}`} className={styles.secondary}>
              {contact.phoneDisplay}
            </a>
          </div>
        </div>
      </div>
    </SectionReveal>
  );
}
