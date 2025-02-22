import { useEffect, useState } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface ChartData {
  name: string;
  value: number;
}

const StatusPieChart = () => {
  const [data, setData] = useState<ChartData[]>([]);

  useEffect(() => {
    axios
      .get("https://web-fe-react-prj3-api.onrender.com/opportunities")
      .then((response) => {
        const opportunities = response.data;
        const groupedData = opportunities.reduce(
          (acc: Record<string, number>, curr: any) => {
            acc[curr.status] = (acc[curr.status] || 0) + 1;
            return acc;
          },
          {}
        );
        const chartData: ChartData[] = Object.keys(groupedData).map((key) => ({
          name: key,
          value: groupedData[key],
        }));
        setData(chartData);
      })
      .catch((error) => console.error("Error fetching opportunities:", error));
  }, []);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#FF6384"];

  return (
    <div className="flex flex-col items-center w-full h-[400px] md:h-[500px]">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">
        Total de Oportunidades por Estado
      </h2>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) =>
              `${name}: ${(percent * 100).toFixed(0)}%`
            }
            outerRadius="70%"
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StatusPieChart;
