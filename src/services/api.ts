export interface DataPoint {
  name: string;
  value: number;
}

export interface DataSeries {
  name: string;
  dataPoints: DataPoint[];
}

export interface ChartData {
  dataSeries: DataSeries[];
  recommendedChartType: 'bar' | 'line' | 'pie' | 'scatter' | 'area' | 'vertical_bar' | 'horizontal_bar' | 'donut';
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
      const errorData = await response.json();
      
      // Handle nested error structure
      if (errorData.details) {
        try {
          const detailsError = JSON.parse(errorData.details.split(' ')[1]);
          if (detailsError.error?.type === 'overloaded_error') {
            throw new Error('The service is currently experiencing high load. Please try again in a few moments.');
          }
        } catch (parseError) {
          // If parsing details fails, fall back to main error message
          throw new Error(errorData.error || 'Failed to analyze text');
        }
      }
      
      // Handle direct error structure
      if (errorData.error?.type === 'overloaded_error') {
        throw new Error('The service is currently experiencing high load. Please try again in a few moments.');
      }
      
      if (response.status === 529) {
        throw new Error('Too many requests. Please wait a moment before trying again.');
      }

      throw new Error(errorData.error?.message || errorData.error || 'Failed to analyze text');
    }

    const data = await response.json();

    // Check if data series exists and has valid points
    if (!data.dataSeries || !Array.isArray(data.dataSeries)) {
      throw new Error('Could not extract data points from the text. Please try rephrasing with clearer numerical values.');
    }

    // Check if any series has valid numerical data
    const hasValidData = data.dataSeries.some(series => 
      series.dataPoints && 
      Array.isArray(series.dataPoints) && 
      series.dataPoints.length > 0 && 
      series.dataPoints.some(point => point.value !== null && point.value !== undefined && !isNaN(point.value))
    );

    if (!hasValidData) {
      throw new Error('No valid numerical data found. Please provide text with clear numerical values.');
    }

    if (!data.recommendedChartType) {
      throw new Error('Could not determine the best chart type for this data. Please try rephrasing your text.');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('fetch')) {
        throw new Error('Unable to connect to the service. Please check your internet connection and try again.');
      }
      throw error;
    }
    
    throw new Error('An unexpected error occurred while analyzing the text. Please try again.');
  }
};