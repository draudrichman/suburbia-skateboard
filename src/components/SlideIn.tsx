'use client'

import { useRef, useEffect } from "react";

type SlideInProps = {
    children: React.ReactNode;
    delay?: number;
    duration?: number;
}

const SlideIn = ({ children, delay = 0, duration = 0.6 }: SlideInProps) => {
    const elementRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const element = elementRef.current;
        if (!element) return;

        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                element.style.animation = `slide-in ${duration}s ease ${delay}s forwards`;
                observer.unobserve(element);
            }
        }, { threshold: 0, rootMargin: "-150px" });

        observer.observe(element);

        return () => observer.disconnect();
    }, [delay, duration])

    return (
        <div ref={elementRef} className="slide-in-hidden">
            {children}
        </div>
    );
}

export default SlideIn;