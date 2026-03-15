"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
import styles from "./Header.module.css";
import logoImg from "@/assets/logo.png";

const NAV_LINKS: Array<{ href: string; label: string; cta?: boolean }> = [
  { href: "#experiencia", label: "Experiência" },
  { href: "#diferenciais", label: "Diferenciais" },
  { href: "#temporada", label: "Temporada" },
  { href: "#contato", label: "Contato", cta: true },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [highlightVisible, setHighlightVisible] = useState(false);
  const scrollYRef = useRef(0);
  const toggleLockRef = useRef(false);
  const navWrapperRef = useRef<HTMLDivElement>(null);
  const highlightRef = useRef<HTMLSpanElement>(null);

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

  // Highlight deslizante no menu desktop (hover)
  useEffect(() => {
    const wrapper = navWrapperRef.current;
    const highlight = highlightRef.current;
    if (!wrapper || !highlight) return;

    const links = wrapper.querySelectorAll("a");
    if (!links.length) return;

    const paddingX = 12;
    const paddingY = 6;

    const getRect = (el: Element) => {
      const r = el.getBoundingClientRect();
      const w = wrapper.getBoundingClientRect();
      return {
        left: r.left - w.left,
        top: r.top - w.top,
        width: r.width,
        height: r.height,
      };
    };

    const moveHighlight = (el: Element) => {
      const r = getRect(el);
      highlight.style.width = `${r.width + paddingX * 2}px`;
      highlight.style.height = `${r.height + paddingY * 2}px`;
      highlight.style.transform = `translate(${r.left - paddingX}px, ${r.top - paddingY}px)`;
      setHighlightVisible(true);
    };

    moveHighlight(links[0]);

    const onResize = () => moveHighlight(links[0]);
    window.addEventListener("resize", onResize);

    links.forEach((link) => {
      link.addEventListener("mouseenter", () => moveHighlight(link));
    });
    wrapper.addEventListener("mouseleave", () => moveHighlight(links[0]));

    return () => {
      window.removeEventListener("resize", onResize);
    };
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
          <Image
            src={logoImg}
            alt="Abordo com Baleias"
            className={styles.logoImg}
            width={160}
            height={48}
            priority
          />
        </a>
        <nav className={styles.nav} aria-label="Navegação principal">
          <div ref={navWrapperRef} className={styles.navWrapper}>
            <span
              ref={highlightRef}
              className={`${styles.menuHighlight} ${highlightVisible ? styles.menuHighlightVisible : ""}`}
              aria-hidden
            />
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
          </div>
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
