import { useEffect, useRef } from "react";
import * as echarts from 'echarts';

export default function AeScatterplotComponent({ id, sharedPoints, data, shareOptions, clickable, shareModalState }: { id?: any, sharedPoints?: any, data: Array<any>, shareOptions?: any, clickable?: any, shareModalState?: any }) {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chartRef.current && data) {
      const chartInstance = echarts.getInstanceByDom(chartRef.current) || echarts.init(chartRef.current);
      createEScatterPlot(chartInstance, { sharedPoints, data, shareOptions, clickable, shareModalState });

      const resizeListener = () => {
        chartInstance.resize();
      };
      window.addEventListener('resize', resizeListener);

      return () => {
        chartInstance.dispose();
        window.removeEventListener('resize', resizeListener);
      };
    }
  }, [data, shareOptions]);

  return (
    <div
      id={`chart-${id}`}
      ref={chartRef}
      style={{ width: '100%', height: '400px', maxWidth: 'calc(100% - 40px)' }}
    />
  );
}


function createEScatterPlot(ref: any, { sharedPoints, data, shareOptions, clickable, shareModalState }: { sharedPoints?: any, data?: any, shareOptions?: any, clickable?: any, shareModalState?: any }) {
  let series = [];
  const numOfSeries = data[0]?.length - 2;
  const theLabel = shareOptions?.map((d: any) => { return d?.label });
  let markAreaData = [];
  if (numOfSeries > 0) {
    for (let i = 1; i < data[0].length - 1; i++) {
      const seriesName = `${theLabel[i - 1] === undefined ? '' : theLabel[i - 1].toString().toUpperCase()}`;
      const seriesData = [];
      for (let j = 0; j < data.length; j++) {
        const timestamp = data[j][0];
        const value = data[j][i];
        const label = data[j][data[j].length - 1];
        const color = label === 1 ? 'rgb(255, 0, 0)' : undefined;
        seriesData.push([timestamp, value, color, seriesName]);
      }
      const anomalies = seriesData.filter(d => d[2] === 'rgb(255, 0, 0)');
      markAreaData = anomalies.length > 0 ? [
        [
          { xAxis: anomalies[0][0] },
          { xAxis: anomalies[anomalies.length - 1][0] }
        ]
      ] : [];
      series.push({
        name: seriesName,
        type: 'scatter',
        data: seriesData,
        symbolSize: 5,
        z: 1,
        itemStyle: {
          color: (params: any) => {
            const point = params.data;
            const inAnomalyArea = anomalies.some(anomaly => anomaly[0] === point[0] && anomaly[1] === point[1]);
            return inAnomalyArea ? 'rgb(255, 0, 0)' : params.color;
          },
        },
        markArea: {
          z: 2,
          itemStyle: {
            color: 'rgba(255, 0, 0, 0.16)',
          },
          data: markAreaData,
        },
      });
    }
  } else {
    console.info("Else statement");
    const seriesData = data.map((d: any[]) => [d[0], d[1], d[2], 'Series 1']);
    const anomalies = seriesData.filter((d: string[]) => d[2] === 'rgb(255, 0, 0)');
    markAreaData = anomalies.length > 0 ? [
      [
        { xAxis: anomalies[0][0] },
        { xAxis: anomalies[anomalies.length - 1][0] }
      ]
    ] : [];
    series.push({
      name: 'Series 1',
      type: 'scatter',
      data: seriesData,
      symbolSize: 5,
      z: 1,
      itemStyle: {
        color: (params: any) => {
          const point = params.data;
          const inAnomalyArea = anomalies.some((anomaly: any[]) => anomaly[0] === point[0] && anomaly[1] === point[1]);
          return inAnomalyArea ? 'rgb(255, 0, 0)' : params.color;
        },
      },
      markArea: {
        z: 2,
        itemStyle: {
          color: 'rgba(255, 0, 0, 0.16)',
        },
        data: markAreaData,
      },
    });
  }

  const xMin = Math.min(...data.map((d: any) => d[0]));
  const xMax = Math.max(...data.map((d: any) => d[0]));
  const yMin = Math.min(...data.map((d: any) => d[1]));
  const yMax = Math.max(...data.map((d: any) => d[1]));

  const option = {
    dataZoom: [
      {
        show: true,
        realtime: true,
        start: 0,
        end: 100,
      },
      {
        type: 'inside',
      },
    ],
    xAxis: {
      min: xMin,
      max: xMax,
    },
    yAxis: {
      min: yMin,
      max: yMax,
    },
    legend: data.length > 0 ? {
      orient: 'horizontal',
    } : {
      show: false,
    },
    series: series,
  };

  ref.setOption(option);

  let columnsHolder =
    shareOptions === undefined
      ? null
      : shareOptions.map((d: any) => (Array.isArray(d?.label) ? d?.label?.[0] : d?.label));

      if (clickable === true && markAreaData.length > 0) {
        ref.on('click', function (params: any) {
          if (params.componentType === 'markArea' || params.componentType === 'series' && params.data[2] === 'rgb(255, 0, 0)') {
            console.log('Mark area clicked:', params);
            shareModalState(true);
          }
        });
      }
      

}
