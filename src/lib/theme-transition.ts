"use client";

import gsap from "gsap";

/**
 * Executes a smooth, GPU-accelerated theme transition animation using GSAP
 * and modern View Transitions with radial circular clip-path expansion.
 */
export function animateThemeTransition(
  targetTheme: "light" | "dark",
  setTheme: (theme: string) => void,
  originEl?: HTMLElement | null,
  mouseEvent?: React.MouseEvent | MouseEvent | null
) {
  if (typeof window === "undefined") {
    setTheme(targetTheme);
    return;
  }

  // Calculate radial origin coordinates from click event or target element
  let x = window.innerWidth / 2;
  let y = 35;

  if (mouseEvent && typeof mouseEvent.clientX === "number" && mouseEvent.clientX > 0) {
    x = mouseEvent.clientX;
    y = mouseEvent.clientY;
  } else if (originEl) {
    const rect = originEl.getBoundingClientRect();
    x = rect.left + rect.width / 2;
    y = rect.top + rect.height / 2;
  }

  // Animate the toggle button with a playful GSAP elastic spring
  if (originEl) {
    gsap.fromTo(
      originEl,
      { rotate: -30, scale: 0.85 },
      { rotate: 0, scale: 1, duration: 0.5, ease: "back.out(2.2)" }
    );
  }

  // Check if browser supports modern View Transitions API
  const doc = document as any;
  if (typeof doc.startViewTransition === "function") {
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    try {
      const transition = doc.startViewTransition(() => {
        setTheme(targetTheme);
      });

      transition.ready
        ?.then(() => {
          document.documentElement.animate(
            {
              clipPath: [
                `circle(0px at ${x}px ${y}px)`,
                `circle(${endRadius}px at ${x}px ${y}px)`,
              ],
            },
            {
              duration: 520,
              easing: "cubic-bezier(0.22, 1, 0.36, 1)",
              pseudoElement: "::view-transition-new(root)",
            }
          );
        })
        .catch(() => {
          setTheme(targetTheme);
        });
      return;
    } catch {
      // Fall through to GSAP ripple if startViewTransition throws
    }
  }

  // GSAP Smooth Radial Ripple Fallback
  const ripple = document.createElement("div");
  ripple.className = "theme-transition-ripple";
  ripple.style.position = "fixed";
  ripple.style.left = `${x}px`;
  ripple.style.top = `${y}px`;
  ripple.style.width = "10px";
  ripple.style.height = "10px";
  ripple.style.borderRadius = "50%";
  ripple.style.transform = "translate(-50%, -50%)";
  ripple.style.backgroundColor = targetTheme === "dark" ? "#111110" : "#faf9f6";
  ripple.style.zIndex = "999998";
  ripple.style.pointerEvents = "none";
  ripple.style.willChange = "transform, opacity";
  document.body.appendChild(ripple);

  const maxRadius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y)
  );

  gsap.to(ripple, {
    width: maxRadius * 2.4,
    height: maxRadius * 2.4,
    duration: 0.48,
    ease: "power2.out",
    onComplete: () => {
      setTheme(targetTheme);
      gsap.to(ripple, {
        opacity: 0,
        duration: 0.28,
        ease: "power2.inOut",
        onComplete: () => {
          ripple.remove();
        },
      });
    },
  });
}
