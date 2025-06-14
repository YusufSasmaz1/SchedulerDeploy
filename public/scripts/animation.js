/**
 * Waits for all animations on an element to finish
 * @param {HTMLElement} element - The element whose animations to wait for
 * @returns {Promise} A promise that resolves when all animations are complete
 */
export function waitForAnimationsToFinish(element) {
    const animationPromises = element.getAnimations().map(animation => animation.finished);

    return Promise.allSettled(animationPromises);
}