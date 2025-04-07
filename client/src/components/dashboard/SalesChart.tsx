import { useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { date: "Jun 1", sales: 4200 },
  { date: "Jun 5", sales: 5800 },
  { date: "Jun 10", sales: 5100 },
  { date: "Jun 15", sales: 6800 },
  { date: "Jun 20", sales: 7400 },
  { date: "Jun 25", sales: 6900 },
  { date: "Jun 30", sales: 8200 },
];

interface SalesChartProps {
  title: string;
}

export default function SalesChart({ title }: SalesChartProps) {
  return (
    <Card className="border border-gray-100 shadow-sm">
      <CardContent className="p-5 pt-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-800">{title}</h3>
          <select className="text-sm border border-gray-300 rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
            <option>Last 7 days</option>
            <option selected>Last 30 days</option>
            <option>Last 90 days</option>
          </select>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0, 0, 0, 0.05)" />
              <XAxis 
                dataKey="date" 
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                tickFormatter={(value) => `$${value.toLocaleString()}`}
                tickLine={false}
                axisLine={false}
                stroke="rgba(0, 0, 0, 0.05)"
              />
              <Tooltip 
                formatter={(value) => [`$${(value as number).toLocaleString()}`, 'Sales']}
                contentStyle={{ 
                  borderRadius: '8px',
                  border: '1px solid rgba(0, 0, 0, 0.05)',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
                }}
              />
              <defs>
                <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="rgba(79, 70, 229, 0.8)" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="rgba(79, 70, 229, 0.1)" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <Line 
                type="monotone" 
                dataKey="sales"
                stroke="rgba(79, 70, 229, 1)" 
                strokeWidth={2}
                activeDot={{ r: 8 }} 
                dot={{ r: 4, fill: "rgba(79, 70, 229, 1)", strokeWidth: 0 }}
                fillOpacity={1}
                fill="url(#salesGradient)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
