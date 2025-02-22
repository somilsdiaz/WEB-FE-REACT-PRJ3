import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface Opportunity {
  id: string;
  businessName: string;
  businessLine: string;
  description: string;
  estimatedValue: number;
  estimatedDate: string;
  status: string;
}

interface Client {
  id: number;
  nit: string;
  name: string;
  address: string;
  city: string;
  country: string;
  phone: string;
  email: string;
  active: boolean;
  opportunities: string[];
  contacts: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  }[];
}

interface ChartData {
  name: string;
  estimated: number;
  executed: number;
}

export function Barchart() {
  const [data, setData] = useState<ChartData[]>([]);

  const fetchData = async () => {
    try {
      const [clientsResponse, opportunitiesResponse] = await Promise.all([
        fetch("https://web-fe-react-prj3-api-lebw.onrender.com/clients"),
        fetch("https://web-fe-react-prj3-api-lebw.onrender.com/opportunities"),
      ]);

      const clients: Client[] = await clientsResponse.json();
      const opportunities: Opportunity[] = await opportunitiesResponse.json();

      const chartData: ChartData[] = clients.map((client: Client) => {
        const clientOpportunities = client.opportunities.map((oppId: string) =>
          opportunities.find((opp: Opportunity) => opp.id === oppId)
        );

        const totalEstimated = clientOpportunities.reduce((sum: number, opp) => {
          return sum + (opp ? opp.estimatedValue : 0);
        }, 0);

        const totalExecuted = clientOpportunities.reduce((sum: number, opp) => {
          return sum + (opp && opp.status === "Ejecutada" ? opp.estimatedValue : 0);
        }, 0);

        return {
          name: client.name,
          estimated: totalEstimated,
          executed: totalExecuted,
        };
      });

      setData(chartData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // useEffect con polling cada 10 segundos
  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 10000); // Repetir cada 10 segundos

    return () => clearInterval(intervalId); // el intervalo se limpia al desmontar el componente
  }, []);

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Clientes: Valor Total Estimado vs Ejecutado</CardTitle>
        <CardDescription>
          Comparación entre el valor total estimado y el valor total ejecutado de oportunidades por cliente.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-2">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="estimated" fill="#2196F3" name="Valor Estimado" />
            <Bar dataKey="executed" fill="#FF7043" name="Valor Ejecutado" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
