export const ANIMATION_STYLES = {
  line: {
    smooth: { type: 'linear', easing: 'linear', duration: 4000, delay: 200, name: 'Smooth Flow' },
    bounce: { type: 'linear', easing: 'bounceOut', duration: 4500, delay: 200, name: 'Bouncy Draw' },
    elastic: { type: 'linear', easing: 'elasticInOut', duration: 3500, delay: 200, name: 'Elastic Stretch' },
    wave: { type: 'linear', easing: 'bounceInOut', duration: 4000, delay: 300, name: 'Wave Motion' },
    sequential: { type: 'linear', easing: 'quadraticInOut', duration: 4000, delay: 400, name: 'Sequential Draw' }
  },
  area: {
    smooth: { type: 'linear', easing: 'linear', duration: 4000, delay: 200, name: 'Smooth Flow' },
    bounce: { type: 'linear', easing: 'bounceOut', duration: 4500, delay: 200, name: 'Bouncy Draw' },
    elastic: { type: 'linear', easing: 'elasticInOut', duration: 3500, delay: 200, name: 'Elastic Stretch' },
    wave: { type: 'linear', easing: 'bounceInOut', duration: 4000, delay: 300, name: 'Wave Motion' },
    sequential: { type: 'linear', easing: 'quadraticInOut', duration: 4000, delay: 400, name: 'Sequential Draw' }
  },
  pie: {
    popOut: { type: 'scale', easing: 'elasticOut', duration: 3500, delay: 150, centerPop: true, name: 'Pop Out' },
    bounce: { type: 'scale', easing: 'bounceOut', duration: 3200, delay: 100, startAngle: 90, clockwise: true, name: 'Bounce' },
    expand: { type: 'scale', easing: 'cubicInOut', duration: 3500, delay: 100, rotate: 720, clockwise: false, name: 'Expand' },
    rotate: { type: 'expansion', easing: 'bounceOut', duration: 3500, delay: 150, name: 'Rotate' }
  },
  donut: {
    popOut: { type: 'scale', easing: 'elasticOut', duration: 3500, delay: 150, centerPop: true, name: 'Pop Out' },
    bounce: { type: 'scale', easing: 'bounceOut', duration: 3200, delay: 100, startAngle: 90, clockwise: true, name: 'Bounce' },
    expand: { type: 'scale', easing: 'cubicInOut', duration: 3500, delay: 100, rotate: 720, clockwise: false, name: 'Expand' },
    rotate: { type: 'expansion', easing: 'bounceOut', duration: 3500, delay: 150, name: 'Rotate' }
  },
  vertical_bar: {
    basic: { type: 'linear', easing: 'bounceOut', duration: 3500, delay: 100, name: 'Basic Rise' },
    sequential: { type: 'linear', easing: 'cubicOut', duration: 4000, delay: 200, sequence: true, name: 'Sequential' },
    elastic: { type: 'linear', easing: 'elasticOut', duration: 4000, delay: 150, name: 'Elastic' },
    wave: { type: 'linear', easing: 'circularInOut', duration: 4000, delay: 300, wave: true, name: 'Wave' },
    bounce: { type: 'linear', easing: 'bounceOut', duration: 4500, delay: 200, bounce: true, name: 'Bounce' }
  },
  horizontal_bar: {
    basic: { type: 'linear', easing: 'bounceOut', duration: 3500, delay: 100, name: 'Basic Extend' },
    sequential: { type: 'linear', easing: 'cubicOut', duration: 4000, delay: 200, sequence: true, name: 'Sequential' },
    elastic: { type: 'linear', easing: 'elasticOut', duration: 4000, delay: 150, name: 'Elastic' },
    wave: { type: 'linear', easing: 'circularInOut', duration: 4000, delay: 300, wave: true, name: 'Wave' },
    bounce: { type: 'linear', easing: 'bounceOut', duration: 4500, delay: 200, bounce: true, name: 'Bounce' }
  },
  bar_race: {
    smooth: { 
      type: 'race', 
      easing: 'linear', 
      duration: 4000, 
      delay: 100, 
      name: 'Smooth Race',
      updateDuration: 500,
      labelEffect: 'fade'
    },
    elastic: { 
      type: 'race', 
      easing: 'elasticOut', 
      duration: 4500, 
      delay: 150, 
      name: 'Elastic Race',
      updateDuration: 500,
      labelEffect: 'bounce',
      barEffect: 'stretch'
    },
    dramatic: { 
      type: 'race', 
      easing: 'cubicInOut', 
      duration: 5000, 
      delay: 200, 
      name: 'Dramatic Race',
      updateDuration: 500,
      labelEffect: 'slide',
      barEffect: 'wave',
      pauseOnUpdate: true
    },
    energetic: { 
      type: 'race', 
      easing: 'bounceOut', 
      duration: 4000, 
      delay: 150, 
      name: 'Energetic Race',
      updateDuration: 500,
      labelEffect: 'pop',
      barEffect: 'pulse',
      emphasizeLeader: true
    }
  }
} as const;

export type ChartType = keyof typeof ANIMATION_STYLES;
export type AnimationStyle<T extends ChartType> = keyof typeof ANIMATION_STYLES[T];