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
    color: "#10b981"
  }
};
const DashboardChart = () => {
  return;
};
export default DashboardChart;