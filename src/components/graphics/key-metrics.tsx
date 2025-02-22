import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Target, TrendingUp, DollarSign } from "lucide-react";

// Interfaces
interface Opportunity {
  id: string;
  estimatedValue: string | number;
  status: string;
}

interface Client {
  id: number;
  name: string;
  active: boolean;
}

export function KeyMetrics() { 
  const [totalClients, setTotalClients] = useState(0);
  const [openOpportunities, setOpenOpportunities] = useState(0);
  const [conversionRate, setConversionRate] = useState(0);
  const [projectedRevenue, setProjectedRevenue] = useState(0);

  useEffect(() => {
    async function fetchMetrics() {
      try {
        const [clientsResponse, opportunitiesResponse] = await Promise.all([
          fetch("https://web-fe-react-prj3-api-lebw.onrender.com/clients"),
          fetch("https://web-fe-react-prj3-api-lebw.onrender.com/opportunities"),
        ]);

        const clients: Client[] = await clientsResponse.json();
        const opportunities: Opportunity[] = await opportunitiesResponse.json();

        // Total de clientes
        setTotalClients(clients.length);

        // Total de oportunidades abiertas
        const openOps = opportunities.filter((opp) => opp.status === "Apertura").length;
        setOpenOpportunities(openOps);

        // Tasa de conversión
        const closedOps = opportunities.filter((opp) => opp.status === "Ejecutada").length;
        const conversionRate = opportunities.length > 0 ? (closedOps / opportunities.length) * 100 : 0;
        setConversionRate(Number(conversionRate.toFixed(2)));

        // Ingresos proyectados (suma del valor estimado de todas las oportunidades)
        const revenue = opportunities.reduce((sum, opp) => {
          // Verificar si `opp.estimatedValue` es una cadena y convertirla a número
          const value = typeof opp.estimatedValue === "string"
            ? Number(opp.estimatedValue.replace(/[^0-9.-]+/g, ""))
            : opp.estimatedValue;
          return sum + (isNaN(value) ? 0 : value); // Ignorar valores no numéricos
        }, 0);
        setProjectedRevenue(revenue);
      } catch (error) {
        console.error("Error fetching metrics:", error);
      }
    }

    fetchMetrics();
  }, []);

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Clientes</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalClients}</div>
          <p className="text-xs text-muted-foreground">Número total de clientes registrados</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Oportunidades Abiertas</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{openOpportunities}</div>
          <p className="text-xs text-muted-foreground">Número total de oportunidades abiertas</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tasa de Conversión</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{conversionRate}%</div>
          <p className="text-xs text-muted-foreground">Porcentaje de oportunidades cerradas con éxito</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Ingresos Proyectados</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${(projectedRevenue / 1_000_000).toFixed(2)}M</div>
          <p className="text-xs text-muted-foreground">Suma estimada de todas las oportunidades</p>
        </CardContent>
      </Card>
    </div>
  );
}
