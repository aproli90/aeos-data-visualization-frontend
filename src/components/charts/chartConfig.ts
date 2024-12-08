export const commonChartOptions = {
  textStyle: {
    fontSize: 14,
    fontWeight: 500,
    color: 'inherit'
  },
  tooltip: {
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
  },
  emphasis: {
    focus: 'series',
    scale: true,
    scaleSize: 10,
    shadowBlur: 10,
    shadowColor: 'rgba(0, 0, 0, 0.3)',
    shadowOffsetX: 0,
    shadowOffsetY: 5,
    transition: 'all 0.3s'
  },
  dataLabel: {
    show: true,
    position: 'top',
    distance: 10,
    fontSize: 14,
    fontWeight: 500,
    padding: [4, 8],
    borderRadius: 4,
    textBorderColor: 'transparent',
    textShadowColor: 'rgba(0, 0, 0, 0.15)',
    textShadowBlur: 3
  }
};