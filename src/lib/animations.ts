// Animation variants for Framer Motion (if using) or CSS classes
export const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } }
};

export const slideUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

export const slideDown = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

export const scaleIn = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } }
};

export const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

export const cardEntrance = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.4,
            ease: "easeOut"
        }
    }
};

// CSS Animation Classes
export const animationClasses = {
    fadeIn: "animate-fade-in",
    slideUp: "animate-slide-up",
    slideDown: "animate-slide-down",
    scaleIn: "animate-scale-in",
    pulse: "animate-pulse",
    spin: "animate-spin",
    bounce: "animate-bounce",
    shimmer: "animate-shimmer"
};

// Transition Classes
export const transitionClasses = {
    default: "transition-all duration-300 ease-in-out",
    fast: "transition-all duration-150 ease-in-out",
    slow: "transition-all duration-500 ease-in-out",
    colors: "transition-colors duration-300 ease-in-out",
    transform: "transition-transform duration-300 ease-in-out",
    opacity: "transition-opacity duration-300 ease-in-out"
};

// Hover Effects
export const hoverEffects = {
    scale: "hover:scale-105 active:scale-95",
    lift: "hover:-translate-y-1 hover:shadow-lg",
    glow: "hover:shadow-xl hover:shadow-primary/20",
    brighten: "hover:brightness-110",
    rotate: "hover:rotate-3"
};
