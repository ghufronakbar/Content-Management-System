import { RefObject, useEffect } from "react";

export const useOutsideClick = (
  ref: RefObject<HTMLDivElement | null>,
  callback: (event: MouseEvent | TouchEvent) => void
) => {
  useEffect(() => {
    const listener = (event: Event) => {
      if (!ref) {
        return;
      }
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      callback(event as MouseEvent | TouchEvent);
    };

    document.addEventListener("mousedown", listener as EventListener);
    document.addEventListener("touchstart", listener as EventListener);

    return () => {
      document.removeEventListener("mousedown", listener as EventListener);
      document.removeEventListener("touchstart", listener as EventListener);
    };
  }, [ref, callback]);
};
