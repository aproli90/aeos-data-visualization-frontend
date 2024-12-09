export const ANIMATION_STYLES = {
  line: {
    smooth: { type: 'linear', easing: 'linear', duration: 800, delay: 100, name: 'Smooth Flow' },
    bounce: { type: 'linear', easing: 'bounceOut', duration: 800, delay: 100, name: 'Bouncy Draw' },
    elastic: { type: 'linear', easing: 'elasticInOut', duration: 800, delay: 100, name: 'Elastic Stretch' },
    wave: { type: 'linear', easing: 'bounceInOut', duration: 800, delay: 150, name: 'Wave Motion' },
    sequential: { type: 'linear', easing: 'quadraticInOut', duration: 800, delay: 200, name: 'Sequential Draw' }
  },
  area: {
    smooth: { type: 'linear', easing: 'linear', duration: 800, delay: 100, name: 'Smooth Flow' },
    bounce: { type: 'linear', easing: 'bounceOut', duration: 800, delay: 100, name: 'Bouncy Draw' },
    elastic: { type: 'linear', easing: 'elasticInOut', duration: 800, delay: 100, name: 'Elastic Stretch' },
    wave: { type: 'linear', easing: 'bounceInOut', duration: 800, delay: 150, name: 'Wave Motion' },
    sequential: { type: 'linear', easing: 'quadraticInOut', duration: 800, delay: 200, name: 'Sequential Draw' }
  },
  pie: {
    popOut: { type: 'scale', easing: 'elasticOut', duration: 800, delay: 150, centerPop: true, name: 'Pop Out' },
    bounce: { type: 'scale', easing: 'bounceOut', duration: 800, delay: 100, startAngle: 90, clockwise: true, name: 'Bounce' },
    expand: { type: 'scale', easing: 'cubicInOut', duration: 800, delay: 100, rotate: 720, clockwise: false, name: 'Expand' },
    rotate: { type: 'expansion', easing: 'bounceOut', duration: 800, delay: 150, name: 'Rotate' }
  },
  donut: {
    popOut: { type: 'scale', easing: 'elasticOut', duration: 800, delay: 150, centerPop: true, name: 'Pop Out' },
    bounce: { type: 'scale', easing: 'bounceOut', duration: 800, delay: 100, startAngle: 90, clockwise: true, name: 'Bounce' },
    expand: { type: 'scale', easing: 'cubicInOut', duration: 800, delay: 100, rotate: 720, clockwise: false, name: 'Expand' },
    rotate: { type: 'expansion', easing: 'bounceOut', duration: 800, delay: 150, name: 'Rotate' }
  },
  vertical_bar: {
    basic: { type: 'linear', easing: 'bounceOut', duration: 800, delay: 100, name: 'Basic Rise' },
    sequential: { type: 'linear', easing: 'cubicOut', duration: 800, delay: 200, sequence: true, name: 'Sequential' },
    elastic: { type: 'linear', easing: 'elasticOut', duration: 800, delay: 150, name: 'Elastic' },
    wave: { type: 'linear', easing: 'circularInOut', duration: 800, delay: 300, wave: true, name: 'Wave' },
    bounce: { type: 'linear', easing: 'bounceOut', duration: 800, delay: 200, bounce: true, name: 'Bounce' }
  },
  horizontal_bar: {
    basic: { type: 'linear', easing: 'bounceOut', duration: 800, delay: 100, name: 'Basic Extend' },
    sequential: { type: 'linear', easing: 'cubicOut', duration: 800, delay: 200, sequence: true, name: 'Sequential' },
    elastic: { type: 'linear', easing: 'elasticOut', duration: 800, delay: 150, name: 'Elastic' },
    wave: { type: 'linear', easing: 'circularInOut', duration: 800, delay: 300, wave: true, name: 'Wave' },
    bounce: { type: 'linear', easing: 'bounceOut', duration: 800, delay: 200, bounce: true, name: 'Bounce' }
  },
  bar_race: {
    smooth: { 
      type: 'race', 
      easing: 'linear', 
      duration: 2000, 
      name: 'Smooth Race',
    },
    elastic: { 
      type: 'race', 
      easing: 'elasticOut', 
      duration: 2000, 
      name: 'Elastic Race',
    },
    dramatic: { 
      type: 'race', 
      easing: 'cubicInOut', 
      duration: 2000, 
      name: 'Dramatic Race',
    },
    energetic: { 
      type: 'race', 
      easing: 'bounceInOut', 
      duration: 2000, 
      name: 'Energetic Race',
      emphasizeLeader: true
    }
  }
} as const;

export type ChartType = keyof typeof ANIMATION_STYLES;
export type AnimationStyle<T extends ChartType> = keyof typeof ANIMATION_STYLES[T];