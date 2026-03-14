"use client";

import SectionReveal from "./SectionReveal";
import styles from "./Diferenciais.module.css";

const items = [
  {
    title: "Segurança em primeiro lugar",
    text: "Protocolos rigorosos e embarcações preparadas para garantir sua tranquilidade.",
  },
  {
    title: "Grupos reduzidos",
    text: "Experiência mais intimista e atenção dedicada a cada passageiro.",
  },
  {
    title: "Compromisso com a natureza",
    text: "Operação alinhada à conservação marinha e ao turismo responsável.",
  },
];

export default function Diferenciais() {
  return (
    <SectionReveal as="section" className={styles.section} id="diferenciais">
      <div className="section-inner">
        <header className={styles.header}>
          <span className={styles.label}>Por que nos escolher</span>
          <h2 className={styles.title}>Diferenciais que fazem a diferença</h2>
        </header>
        <ul className={styles.grid}>
          {items.map((item, i) => (
            <li key={i} className={styles.card}>
              <span className={styles.number}>0{i + 1}</span>
              <h3 className={styles.cardTitle}>{item.title}</h3>
              <p className={styles.cardText}>{item.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </SectionReveal>
  );
}
