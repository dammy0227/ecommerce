import { useEffect, useRef, useState } from "react";

export const useInView = (options) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current; // store current node
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      options
    );

    observer.observe(node);

    return () => {
      observer.unobserve(node); // safely unobserve the stored node
    };
  }, [options]); // removed 'ref' from deps

  return [ref, isVisible];
};
