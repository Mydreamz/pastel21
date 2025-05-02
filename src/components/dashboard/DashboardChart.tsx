
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const data = [{
  name: 'Jan',
  earnings: 3400,
  messages: 2400
}, {
  name: 'Feb',
  earnings: 4200,
  messages: 3800
}, {
  name: 'Mar',
  earnings: 5000,
  messages: 4300
}, {
  name: 'Apr',
  earnings: 6700,
  messages: 5100
}, {
  name: 'May',
  earnings: 7500,
  messages: 5900
}, {
  name: 'Jun',
  earnings: 9000,
  messages: 6800
}, {
  name: 'Jul',
  earnings: 12582,
  messages: 8429
}];

const chartConfig = {
  earnings: {
    label: "Earnings",
    color: "#9b87f5"
  },
  messages: {
    label: "Messages",
    color: "#8271dc"
  }
};

const DashboardChart = () => {
  return (
    <div className="p-4">
      <h4 className="text-sm font-medium mb-4 text-gray-600">Monthly Performance</h4>
      <ChartContainer config={chartConfig} className="h-[250px]">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#9b87f5" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#9b87f5" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="colorMessages" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8271dc" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8271dc" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="name" 
            tick={{ fill: '#6C6C6C', fontSize: 12 }} 
            axisLine={{ stroke: 'rgba(156, 163, 175, 0.4)' }}
          />
          <YAxis 
            tick={{ fill: '#6C6C6C', fontSize: 12 }}
            axisLine={{ stroke: 'rgba(156, 163, 175, 0.4)' }}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Area 
            type="monotone" 
            dataKey="earnings" 
            stroke="#9b87f5" 
            fillOpacity={1} 
            fill="url(#colorEarnings)" 
            strokeWidth={2}
          />
          <Area 
            type="monotone" 
            dataKey="messages" 
            stroke="#8271dc" 
            fillOpacity={1} 
            fill="url(#colorMessages)" 
            strokeWidth={2}
          />
        </AreaChart>
      </ChartContainer>
    </div>
  );
};

export default DashboardChart;
