import { useEffect, useState } from "react";


/**
 *  useScrollPosition that gives a number from 0 to 1 of the position of the view window
 */
export function useScrollPosition() {
  const [scrollPosition, setScrollPosition] = useState(0);
  
  const refreshScrollPosition = () => {
    const screen = document.documentElement;
    const scroll = screen.scrollTop / (screen.scrollHeight - screen.clientHeight)
    setScrollPosition(scroll)
  }

  useEffect(() => {
    window.addEventListener("scroll", refreshScrollPosition, {passive: true});

    return () => {
      window.removeEventListener("scroll", refreshScrollPosition);
    }
  }, []);

  return scrollPosition;
}