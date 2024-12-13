import type { EChartsInstance } from 'echarts';
import type { AnimationConfig, TimePoint, AnimationState } from './types';
import { BarRaceDataManager } from './barRaceDataManager';
import { ColorManager } from './colorManager';
import { TextStyle } from '../chartConfig';

export class BarRaceAnimator {
  private state: AnimationState = {
    isPlaying: false,
    currentIndex: 0,
    timerId: null,
    cycleCount: 0,
    maxCycles: 1
  };
  private colorManager: ColorManager;

  constructor(
    private chart: EChartsInstance,
    private dataManager: BarRaceDataManager,
    colors: string[] | undefined,
    private config: AnimationConfig,
    private isDark: boolean,
    private font: string
  ) {
    // Initialize color manager with validation
    this.colorManager = new ColorManager(colors);
    
    // Log color initialization for debugging
    console.debug('[BarRaceAnimator] Initialized with colors:', {
      provided: colors,
      available: this.colorManager.getAllColors()
    });
  }

  start(fromBeginning: boolean = true) {
    this.stop();
    
    if (fromBeginning) {
      this.state.currentIndex = 0;
      this.state.cycleCount = 0;
      this.colorManager.reset();
    }
    
    this.state.isPlaying = true;
    this.animate();
  }

  stop() {
    if (this.state.timerId !== null) {
      window.clearTimeout(this.state.timerId);
      this.state.timerId = null;
    }
    this.state.isPlaying = false;
  }

  private animate() {
    if (!this.state.isPlaying) return;

    const timePoint = this.dataManager.getDataAtIndex(this.state.currentIndex);
    if (!timePoint) return;

    this.updateChart(timePoint);

    // Calculate next frame timing
    const updateInterval = this.config.updateDuration || 
      Math.max(1000, this.config.duration / this.dataManager.getTotalPoints());
    
    this.state.timerId = window.setTimeout(() => {
      this.state.currentIndex++;
      
      // Check if we've completed a cycle
      if (this.state.currentIndex >= this.dataManager.getTotalPoints()) {
        this.state.cycleCount++;
        
        // Stop if we've completed the maximum number of cycles
        if (this.state.cycleCount >= this.state.maxCycles) {
          this.stop();
          return;
        }
        
        // Reset for next cycle
        this.state.currentIndex = 0;
      }
      
      this.animate();
    }, updateInterval);
  }

  private updateChart(timePoint: TimePoint) {
    const cornerRadius = 6;

    this.chart.setOption({
      yAxis: {
        data: timePoint.values.map(v => v.name)
      },
      series: [{
        data: timePoint.values.map((item, index) => {
          const [gradientStart, gradientEnd] = this.colorManager.getGradient(item.name);
          const isLeader = index === 0 && this.config.emphasizeLeader;

          return {
            value: item.value,
            itemStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0.5,
                x2: 1,
                y2: 0.5,
                colorStops: [{
                  offset: 0,
                  color: gradientStart
                }, {
                  offset: 1,
                  color: gradientEnd
                }]
              },
              borderRadius: isLeader ? cornerRadius * 1.5 : cornerRadius,
              shadowBlur: isLeader ? 10 : 0,
              shadowColor: isLeader ? 'rgba(0,0,0,0.2)' : 'transparent'
            }
          };
        })
      }],
      graphic: [{
        type: 'text',
        left: 'center',
        top: 10,
        style: {
          text: timePoint.time,
          fontSize: 16,
          fontWeight: 'bold',
          fill: this.isDark ? '#e5e7eb' : '#374151',
          fontFamily: this.font || 'Default',
        }
      }]
    });
  }
}