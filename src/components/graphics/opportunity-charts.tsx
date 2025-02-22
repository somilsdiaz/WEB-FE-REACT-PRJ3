import { PieChart, Pie, Cell, Legend, ResponsiveContainer, Tooltip } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const stateData = [
  { name: "Apertura", value: 50, color: "#2196F3" },
  { name: "Orden de Compra", value: 25, color: "#00E5B1" },
  { name: "Ejecutada", value: 25, color: "#FFB74D" },
]

const businessLineData = [
  { name: "Consultoría TI", value: 25, color: "#2196F3" },
  { name: "Outsourcing recursos", value: 25, color: "#00E5B1" },
  { name: "Desarrollo web", value: 25, color: "#FFB74D" },
  { name: "Desarrollo mobile", value: 25, color: "#FF7043" },
]


const COLORS = [
  "linear-gradient(90deg, #2196F3, #00E5B1)",
  "linear-gradient(90deg, #FFB74D, #FF7043)",
  "linear-gradient(90deg, #8884d8, #82ca9d)",
  "linear-gradient(90deg, #FF6384, #FF9F40)",
];// Custom Tooltip Component
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip bg-white shadow-lg p-4 rounded-lg border border-gray-200">
        <p className="label text-lg font-bold">{`${payload[0].name}`}</p>
        <p className="value text-gray-600">{`Porcentaje: ${payload[0].value}%`}</p>
      </div>
    );
  }
  return null;
};
  // Interactive Legend
  const renderLegend = (props: any) => {
    const { payload } = props;
    return (
      <ul className="flex flex-wrap justify-center gap-4 mt-4">
        {payload.map((entry: any, index: number) => (
          <li
            key={`legend-item-${index}`}
            className="flex items-center cursor-pointer"
          >
            <span
              className="w-4 h-4 rounded-full mr-2"
              style={{ background: COLORS[index % COLORS.length] }}
            ></span>
            <span className="text-sm font-medium">{entry.value}</span>
          </li>
        ))}
      </ul>
    );
  };

export function OpportunityCharts() {

  return (
    <>
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Total de Oportunidades por Estado</CardTitle>
          <CardDescription>Distribución de oportunidades según su estado actual</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stateData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {stateData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend content={renderLegend} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Porcentaje de Oportunidades por Linea de Negocio</CardTitle>
          <CardDescription>Distribución de oportunidades por área de negocio</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={businessLineData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {businessLineData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend content={renderLegend} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </>
  )
}

