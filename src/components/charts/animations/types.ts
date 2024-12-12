export interface AnimationConfig {
  duration: number;
  updateDuration?: number;
  easing: string;
  emphasizeLeader?: boolean;
}

export interface TimePoint {
  time: string;
  values: Array<{
    name: string;
    value: number;
  }>;
}

export interface AnimationState {
  isPlaying: boolean;
  currentIndex: number;
  timerId: number | null;
  cycleCount: number;
  maxCycles: number;
}