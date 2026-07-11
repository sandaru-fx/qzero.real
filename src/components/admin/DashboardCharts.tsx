'use client';

import { useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { VehicleView } from '@/types/vehicle';

type DashboardChartsProps = {
  vehicles: VehicleView[];
};

export default function DashboardCharts({ vehicles }: DashboardChartsProps) {
  const data = useMemo(() => {
    // Group vehicles by month added
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentYear = new Date().getFullYear();
    
    // Initialize data array with 0s for the last 6 months
    const currentMonth = new Date().getMonth();
    const result = [];
    
    for (let i = 5; i >= 0; i--) {
      let m = currentMonth - i;
      let y = currentYear;
      if (m < 0) {
        m += 12;
        y -= 1;
      }
      result.push({
        name: `${months[m]} ${y}`,
        monthIndex: m,
        year: y,
        count: 0,
      });
    }

    // Count vehicles
    vehicles.forEach(v => {
      if (!v.createdAt) return;
      const date = new Date(v.createdAt);
      const m = date.getMonth();
      const y = date.getFullYear();
      
      const target = result.find(r => r.monthIndex === m && r.year === y);
      if (target) {
        target.count += 1;
      }
    });

    return result;
  }, [vehicles]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-xl border border-white/10 bg-[#111111] p-3 shadow-xl">
          <p className="text-xs font-medium text-brand-muted">{label}</p>
          <p className="mt-1 text-lg font-bold text-brand-gold">
            {payload[0].value} <span className="text-xs font-normal text-white">Vehicles Added</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#242424" vertical={false} />
          <XAxis 
            dataKey="name" 
            stroke="#9CA3AF" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
            dy={10}
          />
          <YAxis 
            stroke="#9CA3AF" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
            allowDecimals={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#242424', strokeWidth: 1, strokeDasharray: '3 3' }} />
          <Area
            type="monotone"
            dataKey="count"
            stroke="#D4AF37"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorCount)"
            activeDot={{ r: 6, fill: '#D4AF37', stroke: '#111111', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
