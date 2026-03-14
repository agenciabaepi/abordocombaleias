import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer} role="contentinfo">
      <div className="section-inner">
        <div className={styles.inner}>
          <span className={styles.logo}>Abordo com Baleias</span>
          <p className={styles.copy}>
            © {new Date().getFullYear()} Abordo com Baleias. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
