import { Card, CardContent } from "@/components/ui/card";
import { MoreVertical } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Button } from "../ui/button";

const data = [
  { name: "Electronics", value: 35 },
  { name: "Clothing", value: 25 },
  { name: "Furniture", value: 15 },
  { name: "Accessories", value: 15 },
  { name: "Other", value: 10 },
];

const COLORS = [
  "rgba(79, 70, 229, 0.8)",   // primary
  "rgba(14, 165, 233, 0.8)",  // secondary
  "rgba(139, 92, 246, 0.8)",  // accent
  "rgba(34, 197, 94, 0.8)",   // green
  "rgba(249, 115, 22, 0.8)",  // orange
];

interface RevenueChartProps {
  title: string;
}

export default function RevenueChart({ title }: RevenueChartProps) {
  return (
    <Card className="border border-gray-100 shadow-sm">
      <CardContent className="p-5 pt-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-800">{title}</h3>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-5 w-5 text-gray-400" />
          </Button>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="45%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => `${value}%`}
                contentStyle={{ 
                  borderRadius: '8px',
                  border: '1px solid rgba(0, 0, 0, 0.05)',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
                }}
              />
              <Legend 
                layout="horizontal" 
                verticalAlign="bottom" 
                align="center"
                wrapperStyle={{
                  paddingTop: '20px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
