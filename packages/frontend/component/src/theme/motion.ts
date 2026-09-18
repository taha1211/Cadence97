type Spring = { duration: string; easing: string };

/**
 * Build a `transition` value that runs every listed property on one spring
 * from the `motion` tokens.
 */
export const springTransition = (spring: Spring, ...properties: string[]) =>
  properties
    .map(property => `${property} ${spring.duration} ${spring.easing}`)
    .join(', ');
