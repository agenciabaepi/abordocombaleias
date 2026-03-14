"use client";

import { useEffect, useRef, ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Props = {
  children: ReactNode;
  className?: string;
  as?: "section" | "div";
  delay?: number;
} & React.ComponentPropsWithoutRef<"section">;

export default function SectionReveal({
  children,
  className = "",
  as: Component = "section",
  delay = 0,
  ...rest
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { y: 48, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          delay,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            end: "top 60%",
            toggleActions: "play none none none",
          },
        }
      );
    }, ref);
    return () => ctx.revert();
  }, [delay]);

  return (
    <Component className={className} {...rest}>
      <div ref={ref}>{children}</div>
    </Component>
  );
}
