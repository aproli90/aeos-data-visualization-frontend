export interface ChartData {
  dataPoints: Array<{ name: string; value: number }>;
  recommendedChartType: 'bar' | 'line' | 'pie' | 'scatter' | 'area';
  chartTypeExplanation: string;
}

export const analyzeText = async (text: string): Promise<ChartData> => {
  try {
    const response = await fetch('https://aeos-data-visualization.onrender.com/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to analyze text');
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error instanceof Error ? error : new Error('Failed to analyze text');
  }
};