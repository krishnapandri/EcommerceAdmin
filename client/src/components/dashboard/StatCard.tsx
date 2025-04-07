import { ArrowDown, ArrowUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string;
  changeValue: number;
  changeText: string;
  icon: React.ReactNode;
  iconBgColor: string;
  iconColor: string;
}

export default function StatCard({
  title,
  value,
  changeValue,
  changeText,
  icon,
  iconBgColor,
  iconColor,
}: StatCardProps) {
  const isPositive = changeValue >= 0;

  return (
    <Card className="border border-gray-100 shadow-sm">
      <CardContent className="p-5">
        <div className="flex justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
            <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
            <div className="flex items-center mt-2">
              <span className={`${isPositive ? 'text-green-500' : 'text-red-500'} flex items-center text-xs font-medium`}>
                {isPositive ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />} {Math.abs(changeValue)}%
              </span>
              <span className="text-xs text-gray-500 ml-2">{changeText}</span>
            </div>
          </div>
          <div className={`flex items-center justify-center ${iconBgColor} rounded-full h-12 w-12`}>
            <div className={`${iconColor}`}>
              {icon}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
