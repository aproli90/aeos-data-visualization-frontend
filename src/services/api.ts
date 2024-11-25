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

    const data = await response.json();

    // Validate response data
    if (!data.dataPoints || !Array.isArray(data.dataPoints) || data.dataPoints.length === 0) {
      throw new Error('Could not extract data points from the text. Please try rephrasing with clearer numerical values.');
    }

    if (!data.recommendedChartType) {
      throw new Error('Could not determine the best chart type for this data. Please try rephrasing your text.');
    }

    // Validate each data point
    const invalidPoints = data.dataPoints.some(point => 
      !point.name || typeof point.value !== 'number' || isNaN(point.value)
    );

    if (invalidPoints) {
      throw new Error('Some data points are invalid. Please ensure your text contains clear numerical values with proper context.');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error instanceof Error ? error : new Error('Failed to analyze text');
  }
};