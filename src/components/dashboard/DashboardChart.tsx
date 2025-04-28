
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const data = [
  { name: 'Jan', earnings: 3400, messages: 2400 },
  { name: 'Feb', earnings: 4200, messages: 3800 },
  { name: 'Mar', earnings: 5000, messages: 4300 },
  { name: 'Apr', earnings: 6700, messages: 5100 },
  { name: 'May', earnings: 7500, messages: 5900 },
  { name: 'Jun', earnings: 9000, messages: 6800 },
  { name: 'Jul', earnings: 12582, messages: 8429 },
];

const chartConfig = {
  earnings: {
    label: "Earnings",
    color: "#10b981",
  },
};

const DashboardChart = () => {
  return (
    <div className="glass-card p-4 rounded-xl mb-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-medium text-gray-300">Growth Overview</h4>
        <p className="text-xs text-emerald-500 font-medium">+32% this quarter</p>
      </div>
      <div className="h-[180px] w-full">
        <ChartContainer config={chartConfig}>
          <AreaChart
            data={data}
            margin={{ top: 5, right: 0, left: 0, bottom: 5 }}
          >
            <defs>
              <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#9ca3af', fontSize: 12 }}
              dy={5}
            />
            <YAxis hide={true} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area 
              type="monotone" 
              dataKey="earnings" 
              stroke="#10b981" 
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorEarnings)" 
            />
          </AreaChart>
        </ChartContainer>
      </div>
    </div>
  );
};

export default DashboardChart;
