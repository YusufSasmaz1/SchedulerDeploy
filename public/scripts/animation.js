export function waitForAnimationsToFinish(element) {
    const animationPromises = element.getAnimations().map(animation => animation.finished);

    return Promise.allSettled(animationPromises);
    }