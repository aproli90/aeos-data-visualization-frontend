export const ANIMATION_STYLES = {
  line: {
    smooth: { type: 'linear', easing: 'linear', duration: 2000, delay: 200, name: 'Smooth Flow' },
    bounce: { type: 'linear', easing: 'bounceOut', duration: 2500, delay: 200, name: 'Bouncy Draw' },
    elastic: { type: 'linear', easing: 'elasticInOut', duration: 3500, delay: 200, name: 'Elastic Stretch' },
    wave: { type: 'linear', easing: 'bounceInOut', duration: 2000, delay: 300, name: 'Wave Motion' },
    sequential: { type: 'linear', easing: 'quadraticInOut', duration: 2000, delay: 400, name: 'Sequential Draw' }
  },
  area: {
    smooth: { type: 'linear', easing: 'linear', duration: 2000, delay: 200, name: 'Smooth Flow' },
    bounce: { type: 'linear', easing: 'bounceOut', duration: 2500, delay: 200, name: 'Bouncy Draw' },
    elastic: { type: 'linear', easing: 'elasticInOut', duration: 3500, delay: 200, name: 'Elastic Stretch' },
    wave: { type: 'linear', easing: 'bounceInOut', duration: 2000, delay: 300, name: 'Wave Motion' },
    sequential: { type: 'linear', easing: 'quadraticInOut', duration: 2000, delay: 400, name: 'Sequential Draw' }
  },
  pie: {
    popOut: { type: 'scale', easing: 'elasticOut', duration: 1500, delay: 150, centerPop: true, name: 'Pop Out' },
    bounce: { type: 'scale', easing: 'bounceOut', duration: 1200, delay: 100, startAngle: 90, clockwise: true, name: 'Bounce' },
    expand: { type: 'scale', easing: 'cubicInOut', duration: 1500, delay: 100, rotate: 720, clockwise: false, name: 'Expand' },
    rotate: { type: 'expansion', easing: 'bounceOut', duration: 1500, delay: 150, name: 'Rotate' }
  },
  donut: {
    popOut: { type: 'scale', easing: 'elasticOut', duration: 1500, delay: 150, centerPop: true, name: 'Pop Out' },
    bounce: { type: 'scale', easing: 'bounceOut', duration: 1200, delay: 100, startAngle: 90, clockwise: true, name: 'Bounce' },
    expand: { type: 'scale', easing: 'cubicInOut', duration: 1500, delay: 100, rotate: 720, clockwise: false, name: 'Expand' },
    rotate: { type: 'expansion', easing: 'bounceOut', duration: 1500, delay: 150, name: 'Rotate' }
  },
  vertical_bar: {
    basic: { type: 'linear', easing: 'bounceOut', duration: 1500, delay: 100, name: 'Basic Rise' },
    sequential: { type: 'linear', easing: 'cubicOut', duration: 2000, delay: 200, sequence: true, name: 'Sequential' },
    elastic: { type: 'linear', easing: 'elasticOut', duration: 2000, delay: 150, name: 'Elastic' },
    wave: { type: 'linear', easing: 'circularInOut', duration: 2000, delay: 300, wave: true, name: 'Wave' },
    bounce: { type: 'linear', easing: 'bounceOut', duration: 2500, delay: 200, bounce: true, name: 'Bounce' }
  },
  horizontal_bar: {
    basic: { type: 'linear', easing: 'bounceOut', duration: 1500, delay: 100, name: 'Basic Extend' },
    sequential: { type: 'linear', easing: 'cubicOut', duration: 2000, delay: 200, sequence: true, name: 'Sequential' },
    elastic: { type: 'linear', easing: 'elasticOut', duration: 2000, delay: 150, name: 'Elastic' },
    wave: { type: 'linear', easing: 'circularInOut', duration: 2000, delay: 300, wave: true, name: 'Wave' },
    bounce: { type: 'linear', easing: 'bounceOut', duration: 2500, delay: 200, bounce: true, name: 'Bounce' }
  }
} as const;

export type ChartType = keyof typeof ANIMATION_STYLES;
export type AnimationStyle<T extends ChartType> = keyof typeof ANIMATION_STYLES[T];