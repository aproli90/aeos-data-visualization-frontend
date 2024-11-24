import React, { useEffect, useRef } from 'react';
import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';

interface EChartsRendererProps {
  data: Array<{ name: string; value: number }>;
  chartType: string;
  animationKey: number;
  colors: string[];
  whiteBackground: boolean;
  animationStyle: {
    type: string;
    easing: string;
    duration: number;
    delay?: number;
    rotate?: number;
    centerPop?: boolean;
    startAngle?: number;
    clockwise?: boolean;
  };
  smoothPoints: boolean;
}

export const EChartsRenderer: React.FC<EChartsRendererProps> = ({ 
  data, 
  chartType,
  animationKey,
  colors,
  whiteBackground,
  animationStyle,
  smoothPoints
}) => {
  const chartRef = useRef<ReactECharts>(null);

  useEffect(() => {
    if (chartRef.current) {
      const chart = chartRef.current.getEchartsInstance();
      chart.clear();
      chart.setOption(getOption());
    }
  }, [animationKey, chartType, colors, whiteBackground, animationStyle, smoothPoints, data]);

  const getOption = (): EChartsOption => {
    const commonTextStyle = {
      fontSize: 14,
      fontWeight: 500
    };

    const commonAnimation = {
      animationDuration: animationStyle.duration,
      animationEasing: animationStyle.easing,
      animationDelay: (idx: number) => idx * (animationStyle.delay || 100)
    };

    const commonTooltip = {
      trigger: 'item',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: 'rgba(0, 0, 0, 0.1)',
      borderWidth: 1,
      padding: [8, 12],
      textStyle: {
        fontSize: 14,
        color: '#333'
      },
      extraCssText: 'box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15); border-radius: 4px;'
    };

    const commonEmphasis = {
      focus: 'series',
      scale: true,
      scaleSize: 10,
      shadowBlur: 10,
      shadowColor: 'rgba(0, 0, 0, 0.3)',
      shadowOffsetX: 0,
      shadowOffsetY: 5,
      transition: 'all 0.3s'
    };

    switch (chartType.toLowerCase()) {
      case 'line':
        return {
          backgroundColor: whiteBackground ? '#ffffff' : 'transparent',
          grid: { bottom: 80, left: 80, right: 20, top: 20 },
          xAxis: {
            type: 'category',
            data: data.map(item => item.name),
            axisLabel: { 
              rotate: 45,
              ...commonTextStyle
            }
          },
          yAxis: { 
            type: 'value',
            axisLabel: commonTextStyle
          },
          series: [{
            data: data.map(item => item.value),
            type: 'line',
            smooth: smoothPoints,
            symbolSize: 8,
            lineStyle: {
              width: 3,
              color: colors[0]
            },
            itemStyle: {
              color: colors[0],
              borderWidth: 2,
              borderColor: '#fff'
            },
            emphasis: {
              ...commonEmphasis,
              itemStyle: {
                borderWidth: 3,
                borderColor: '#fff'
              },
              lineStyle: {
                width: 5
              }
            },
            ...commonAnimation
          }],
          tooltip: { 
            ...commonTooltip,
            trigger: 'axis',
            formatter: '{b}: {c}'
          }
        };

      case 'area':
        return {
          backgroundColor: whiteBackground ? '#ffffff' : 'transparent',
          grid: { bottom: 80, left: 80, right: 20, top: 20 },
          xAxis: {
            type: 'category',
            data: data.map(item => item.name),
            axisLabel: { 
              rotate: 45,
              ...commonTextStyle
            }
          },
          yAxis: { 
            type: 'value',
            axisLabel: commonTextStyle
          },
          series: [{
            data: data.map(item => item.value),
            type: 'line',
            smooth: smoothPoints,
            areaStyle: {
              opacity: 0.3,
              color: colors[0]
            },
            symbolSize: 8,
            lineStyle: {
              width: 3,
              color: colors[0]
            },
            itemStyle: {
              color: colors[0],
              borderWidth: 2,
              borderColor: '#fff'
            },
            emphasis: {
              ...commonEmphasis,
              areaStyle: {
                opacity: 0.5
              },
              itemStyle: {
                borderWidth: 3,
                borderColor: '#fff'
              },
              lineStyle: {
                width: 5
              }
            },
            ...commonAnimation
          }],
          tooltip: { 
            ...commonTooltip,
            trigger: 'axis',
            formatter: '{b}: {c}'
          }
        };

      case 'pie':
      case 'donut':
        const isPie = chartType.toLowerCase() === 'pie';
        return {
          backgroundColor: whiteBackground ? '#ffffff' : 'transparent',
          tooltip: {
            ...commonTooltip,
            formatter: '{b}: {c} ({d}%)'
          },
          series: [{
            type: 'pie',
            radius: isPie ? '70%' : ['40%', '70%'],
            center: ['50%', '50%'],
            startAngle: animationStyle.startAngle || 0,
            clockwise: animationStyle.clockwise !== undefined ? animationStyle.clockwise : true,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: true,
              formatter: '{b}: {d}%',
              position: 'outside',
              fontSize: 14,
              fontWeight: 500,
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
              padding: [4, 8],
              borderRadius: 4
            },
            labelLine: {
              show: true,
              length: 20,
              length2: 30,
              smooth: true
            },
            emphasis: {
              scale: true,
              scaleSize: 15,
              label: {
                show: true,
                fontSize: 16,
                fontWeight: 'bold',
                backgroundColor: '#fff',
                padding: [6, 10],
                borderRadius: 4,
                shadowBlur: 4,
                shadowColor: 'rgba(0, 0, 0, 0.1)'
              },
              itemStyle: {
                shadowBlur: 20,
                shadowColor: 'rgba(0, 0, 0, 0.2)'
              }
            },
            data: data.map((item, index) => ({
              ...item,
              itemStyle: { color: colors[index % colors.length] }
            })),
            animationType: animationStyle.centerPop ? 'scale' : animationStyle.type,
            animationDuration: animationStyle.duration,
            animationEasing: animationStyle.centerPop ? 'elasticOut' : animationStyle.easing,
            animationDelay: (idx: number) => {
              if (animationStyle.centerPop) {
                return idx * (animationStyle.duration / data.length);
              }
              return animationStyle.delay ? idx * animationStyle.delay : 0;
            },
            animationRotate: animationStyle.centerPop ? undefined : animationStyle.rotate
          }]
        };

      case 'vertical_bar':
        return {
          backgroundColor: whiteBackground ? '#ffffff' : 'transparent',
          grid: { bottom: 80, left: 80, right: 20, top: 20 },
          xAxis: {
            type: 'category',
            data: data.map(item => item.name),
            axisLabel: { 
              rotate: 45,
              ...commonTextStyle
            }
          },
          yAxis: { 
            type: 'value',
            axisLabel: commonTextStyle
          },
          series: [{
            data: data.map((item, index) => ({
              value: item.value,
              itemStyle: { color: colors[index % colors.length] }
            })),
            type: 'bar',
            barWidth: '50%',
            itemStyle: {
              borderRadius: [4, 4, 0, 0]
            },
            emphasis: {
              ...commonEmphasis,
              itemStyle: {
                borderRadius: [8, 8, 0, 0],
                borderWidth: 2,
                borderColor: '#fff'
              }
            },
            ...commonAnimation
          }],
          tooltip: { 
            ...commonTooltip,
            trigger: 'axis',
            formatter: '{b}: {c}'
          }
        };

      case 'horizontal_bar':
        return {
          backgroundColor: whiteBackground ? '#ffffff' : 'transparent',
          grid: { left: 150, right: 20, top: 20, bottom: 20 },
          yAxis: {
            type: 'category',
            data: data.map(item => item.name),
            axisLabel: { 
              width: 120,
              ...commonTextStyle
            }
          },
          xAxis: { 
            type: 'value',
            axisLabel: commonTextStyle
          },
          series: [{
            data: data.map((item, index) => ({
              value: item.value,
              itemStyle: { color: colors[index % colors.length] }
            })),
            type: 'bar',
            barWidth: '50%',
            itemStyle: {
              borderRadius: [0, 4, 4, 0]
            },
            emphasis: {
              ...commonEmphasis,
              itemStyle: {
                borderRadius: [0, 8, 8, 0],
                borderWidth: 2,
                borderColor: '#fff'
              }
            },
            ...commonAnimation
          }],
          tooltip: { 
            ...commonTooltip,
            trigger: 'axis',
            formatter: '{b}: {c}'
          }
        };

      default:
        return {};
    }
  };

  return (
    <ReactECharts
      ref={chartRef}
      option={getOption()}
      style={{ height: '100%', width: '100%' }}
      opts={{ renderer: 'svg' }}
      notMerge={true}
      lazyUpdate={false}
    />
  );
};