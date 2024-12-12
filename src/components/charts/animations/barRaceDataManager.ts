import type { DataSeries } from '../../../services/api';

export interface TimePoint {
  time: string;
  values: Array<{
    name: string;
    value: number;
  }>;
}

export class BarRaceDataManager {
  private timePoints: TimePoint[] = [];

  constructor(dataSeries: DataSeries[]) {
    this.initializeTimePoints(dataSeries);
  }

  private initializeTimePoints(dataSeries: DataSeries[]) {
    // Get unique time points
    const times = Array.from(new Set(
      dataSeries.flatMap(series => series.dataPoints.map(point => point.name))
    )).sort();

    // Create data for each time point
    this.timePoints = times.map(time => ({
      time,
      values: dataSeries.map(series => {
        const point = series.dataPoints.find(p => p.name === time);
        return {
          name: series.name,
          value: point?.value || 0
        };
      }).sort((a, b) => b.value - a.value) // Pre-sort values
    }));
  }

  getTimePoints(): string[] {
    return this.timePoints.map(point => point.time);
  }

  getDataAtIndex(index: number): TimePoint | null {
    return this.timePoints[index] || null;
  }

  getTotalPoints(): number {
    return this.timePoints.length;
  }
}