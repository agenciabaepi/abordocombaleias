"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import styles from "./Header.module.css";

const NAV_LINKS: Array<{ href: string; label: string; cta?: boolean }> = [
  { href: "#experiencia", label: "Experiência" },
  { href: "#diferenciais", label: "Diferenciais" },
  { href: "#temporada", label: "Temporada" },
  { href: "#contato", label: "Contato", cta: true },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const scrollYRef = useRef(0);
  const toggleLockRef = useRef(false);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
  }, []);

  const toggleMenu = useCallback(() => {
    if (toggleLockRef.current) return;
    toggleLockRef.current = true;
    setMenuOpen((prev) => !prev);
    setTimeout(() => {
      toggleLockRef.current = false;
    }, 350);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    scrollYRef.current = window.scrollY;
    const onEscape = (e: KeyboardEvent) => e.key === "Escape" && closeMenu();
    document.addEventListener("keydown", onEscape);
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.top = `-${scrollYRef.current}px`;
    return () => {
      document.removeEventListener("keydown", onEscape);
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.top = "";
      window.scrollTo(0, scrollYRef.current);
    };
  }, [menuOpen, closeMenu]);

  const handleLinkClick = useCallback(
    (e: React.MouseEvent) => {
      closeMenu();
    },
    [closeMenu]
  );

  return (
    <header
      className={`${styles.header} ${scrolled ? styles.scrolled : ""} ${menuOpen ? styles.menuOpen : ""}`}
      role="banner"
    >
      <div className={styles.inner}>
        <a
          href="#"
          className={styles.logo}
          onClick={closeMenu}
          aria-label="Abordo com Baleias - início"
        >
          Abordo com Baleias
        </a>
        <nav className={styles.nav} aria-label="Navegação principal">
          {NAV_LINKS.map(({ href, label, cta }) => (
            <a
              key={href}
              href={href}
              className={cta ? styles.cta : undefined}
              onClick={closeMenu}
            >
              {label}
            </a>
          ))}
        </nav>
        <button
          type="button"
          className={styles.menuButton}
          aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={toggleMenu}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <div
        id="mobile-menu"
        className={styles.mobileMenu}
        aria-hidden={!menuOpen}
      >
        <div className={styles.menuBackdrop} onClick={closeMenu} aria-hidden />
        <nav
          className={styles.mobileNav}
          aria-label="Menu mobile"
          onClick={(e) => e.stopPropagation()}
        >
          {NAV_LINKS.map(({ href, label, cta }) => (
            <a
              key={href}
              href={href}
              className={cta ? styles.mobileCta : undefined}
              onClick={handleLinkClick}
            >
              {label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
