import React from 'react';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

interface DonutChartProps {
  title: string;
  labels: string[];
  series: number[];
  colors?: string[];
  isRed?: boolean;
  height?: number;
  legendPosition?: 'bottom' | 'right' | 'top' | 'left';
}

const DonutChart: React.FC<DonutChartProps> = ({
  title,
  labels,
  series,
  colors,
  isRed,
  height = 400,
  legendPosition = 'bottom'
}) => {
  const options: ApexOptions = {
    chart: {
      type: 'donut',
      animations: { enabled: true, easing: 'easeinout', speed: 1000 },
      fontFamily: '"Plus Jakarta Sans", sans-serif',
    },
    labels: labels,
    colors: colors || (isRed
      ? ['#DC2626', '#EF4444', '#B91C1C', '#991B1B', '#FCA5A5', '#7F1D1D', '#F87171']
      : ['#2563EB', '#3B82F6', '#1E40AF', '#60A5FA', '#93C5FD', '#1D4ED8', '#60A5FA']),
    stroke: { show: true, width: 2, colors: ['#fff'] },
    legend: {
      show: true,
      position: legendPosition,
      horizontalAlign: 'center',
      fontSize: '14px',
      fontWeight: 600,
      fontFamily: 'Plus Jakarta Sans',
      width: legendPosition === 'right' ? 250 : undefined,
      markers: { radius: 12, width: 12, height: 12 },
      itemMargin: { vertical: 5, horizontal: 10 },
      formatter: function(val, opts) {
        return val + ": " + opts.w.globals.series[opts.seriesIndex];
      }
    },
    dataLabels: {
      enabled: true,
      style: { fontSize: '13px', fontWeight: 800 },
      dropShadow: { enabled: false }
    },
    plotOptions: {
      pie: {
        donut: {
          size: '65%',
          labels: {
            show: true,
            name: { show: true, fontSize: '14px', fontWeight: 600, offsetY: -10 },
            value: {
              show: true,
              fontSize: '30px',
              fontWeight: 900,
              color: '#1e293b',
              offsetY: 10,
              formatter: (val) => val
            },
            total: {
              show: true,
              label: 'ЖАМИ',
              fontSize: '12px',
              fontWeight: 800,
              color: '#64748b',
              //@ts-ignore
              formatter: (w) => w.globals.seriesTotals.reduce((a, b) => a + b, 0)
            }
          }
        }
      }
    },
    responsive: [{
      breakpoint: 1024,
      options: {
        legend: { position: 'bottom', width: undefined }
      }
    }]
  };

  if (series.length === 0) {
    return (
      <div className={`bg-white border-2 ${isRed ? 'border-red-100' : 'border-blue-100'} shadow-lg rounded-[2.5rem] p-10 text-center`}>
         <h3 className="text-lg font-black text-slate-400 uppercase tracking-widest">{title}</h3>
         <p className="mt-4 text-slate-300 font-bold italic">Маъlumot topilmadi</p>
      </div>
    );
  }

  return (
    <div className={`bg-white border-2 ${isRed ? 'border-red-100' : 'border-blue-100'} shadow-lg rounded-[2.5rem] p-6 md:p-10 transition-all hover:shadow-2xl w-full`}>
      <h3 className={`text-xl md:text-2xl font-black mb-8 border-l-8 ${isRed ? 'border-red-600' : 'border-blue-600'} pl-4 uppercase tracking-tight text-slate-800`}>
        {title}
      </h3>
      <div className="w-full">
        <Chart
          options={options}
          series={series}
          type="donut"
          width="100%"
          height={height}
        />
      </div>
    </div>
  );
};

export default DonutChart;
