import React from "react";

export const useMeasure = <T extends HTMLElement>() => {
  const elementRef = React.useRef<T>(null);
  const [height, setHeight] = React.useState(0);

  React.useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const rect = entry.target.getBoundingClientRect();

        setHeight(rect.height);
      }
    });

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return [elementRef, height] as [React.MutableRefObject<T | null>, number];
};
