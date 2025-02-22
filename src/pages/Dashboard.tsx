import MainLayout from "../layouts/MainLayout";
import { KeyMetrics } from "../components/graphics/key-metrics"
import { Barchart } from "../components/graphics/Barchart";
import { OpportunityCharts } from "@/components/graphics/opportunity-charts";
const Dashboard = () => {
  return (
    <MainLayout>
    <div className="min-h-screen">
      <div className="flex">
        <main className="flex-1 p-8 space-y-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h2>
            <KeyMetrics />
            <Barchart />
            <div className="grid gap-6 md:grid-flow-col grid-flow-row ">
              <OpportunityCharts />
            </div>
          </main>
          </div>
        </div>
    </MainLayout>
  );
};

export default Dashboard;
