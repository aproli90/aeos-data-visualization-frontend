export const ANIMATION_STYLES = {
  line: {
    smooth: { type: 'linear', easing: 'linear', duration: 2500, delay: 200, name: 'Smooth Flow' },
    bounce: { type: 'linear', easing: 'bounceOut', duration: 2500, delay: 200, name: 'Bouncy Draw' },
    elastic: { type: 'linear', easing: 'elasticInOut', duration: 2500, delay: 200, name: 'Elastic Stretch' },
    wave: { type: 'linear', easing: 'bounceInOut', duration: 2500, delay: 300, name: 'Wave Motion' },
    sequential: { type: 'linear', easing: 'quadraticInOut', duration: 2500, delay: 400, name: 'Sequential Draw' }
  },
  area: {
    smooth: { type: 'linear', easing: 'linear', duration: 2500, delay: 200, name: 'Smooth Flow' },
    bounce: { type: 'linear', easing: 'bounceOut', duration: 2500, delay: 200, name: 'Bouncy Draw' },
    elastic: { type: 'linear', easing: 'elasticInOut', duration: 2500, delay: 200, name: 'Elastic Stretch' },
    wave: { type: 'linear', easing: 'bounceInOut', duration: 2500, delay: 300, name: 'Wave Motion' },
    sequential: { type: 'linear', easing: 'quadraticInOut', duration: 2500, delay: 400, name: 'Sequential Draw' }
  },
  pie: {
    popOut: { type: 'scale', easing: 'elasticOut', duration: 2500, delay: 300, centerPop: true, name: 'Pop Out' },
    bounce: { type: 'scale', easing: 'bounceOut', duration: 2500, delay: 200, startAngle: 90, clockwise: true, name: 'Bounce' },
    expand: { type: 'scale', easing: 'cubicInOut', duration: 2500, delay: 200, rotate: 720, clockwise: false, name: 'Expand' },
    rotate: { type: 'expansion', easing: 'bounceOut', duration: 2500, delay: 300, name: 'Rotate' }
  },
  donut: {
    popOut: { type: 'scale', easing: 'elasticOut', duration: 2500, delay: 300, centerPop: true, name: 'Pop Out' },
    bounce: { type: 'scale', easing: 'bounceOut', duration: 2500, delay: 200, startAngle: 90, clockwise: true, name: 'Bounce' },
    expand: { type: 'scale', easing: 'cubicInOut', duration: 2500, delay: 200, rotate: 720, clockwise: false, name: 'Expand' },
    rotate: { type: 'expansion', easing: 'bounceOut', duration: 2500, delay: 300, name: 'Rotate' }
  },
  vertical_bar: {
    basic: { type: 'linear', easing: 'bounceOut', duration: 2500, delay: 200, name: 'Basic Rise' },
    sequential: { type: 'linear', easing: 'cubicOut', duration: 2500, delay: 400, sequence: true, name: 'Sequential' },
    elastic: { type: 'linear', easing: 'elasticOut', duration: 2500, delay: 300, name: 'Elastic' },
    wave: { type: 'linear', easing: 'circularInOut', duration: 2500, delay: 600, wave: true, name: 'Wave' },
    bounce: { type: 'linear', easing: 'bounceOut', duration: 2500, delay: 400, bounce: true, name: 'Bounce' }
  },
  horizontal_bar: {
    basic: { type: 'linear', easing: 'bounceOut', duration: 2500, delay: 200, name: 'Basic Extend' },
    sequential: { type: 'linear', easing: 'cubicOut', duration: 2500, delay: 400, sequence: true, name: 'Sequential' },
    elastic: { type: 'linear', easing: 'elasticOut', duration: 2500, delay: 300, name: 'Elastic' },
    wave: { type: 'linear', easing: 'circularInOut', duration: 2500, delay: 600, wave: true, name: 'Wave' },
    bounce: { type: 'linear', easing: 'bounceOut', duration: 2500, delay: 400, bounce: true, name: 'Bounce' }
  },
  bar_race: {
    smooth: { 
      type: 'race', 
      easing: 'linear', 
      // duration: 4000,
      updateDuration: 1500,
      name: 'Smooth Race',
    },
    elastic: { 
      type: 'race', 
      easing: 'elasticInOut', 
      // duration: 4000,
      updateDuration: 2000,
      name: 'Elastic Race',
    },
    dramatic: { 
      type: 'race', 
      easing: 'backInOut', 
      // duration: 4000,
      updateDuration: 1500,
      name: 'Dramatic Race',
    },
    energetic: { 
      type: 'race', 
      easing: 'bounceInOut', 
      // duration: 4000,
      updateDuration: 1500,
      name: 'Energetic Race',
      emphasizeLeader: true
    }
  }
} as const;

export type ChartType = keyof typeof ANIMATION_STYLES;
export type AnimationStyle<T extends ChartType> = keyof typeof ANIMATION_STYLES[T];