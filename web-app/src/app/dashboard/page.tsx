import { AppSidebar } from "../../components/app-sidebar";
import { ChartAreaInteractive } from "../../components/chart-area-interactive";
import { DataTable } from "../../components/data-table";
import { SectionCards } from "../../components/section-cards";
import { SiteHeader } from "../../components/site-header";
import { SidebarInset, SidebarProvider } from "../../components/ui/sidebar";
import { ChartDataPoint } from "../types/chart";

import data from "./data.json";

export default function Page() {

  const cpuChartData: ChartDataPoint[] = [
    { date: "2024-09-01T00:00:00", cpu: 10 },
    { date: "2024-09-01T00:00:05", cpu: 15 },
    { date: "2024-09-01T00:00:10", cpu: 12 },
    { date: "2024-09-01T00:00:15", cpu: 30 },
    { date: "2024-09-01T00:00:20", cpu: 25 },
    { date: "2024-09-01T00:00:25", cpu: 40 },
    { date: "2024-09-01T00:00:30", cpu: 35 },
    { date: "2024-09-01T00:00:35", cpu: 60 },
    { date: "2024-09-01T00:00:40", cpu: 55 },
    { date: "2024-09-01T00:00:45", cpu: 70 },
    { date: "2024-09-01T00:00:50", cpu: 65 },
    { date: "2024-09-01T00:00:55", cpu: 50 },
    { date: "2024-09-01T00:01:00", cpu: 10 },
    { date: "2024-09-01T00:01:05", cpu: 15 },
    { date: "2024-09-01T00:01:10", cpu: 12 },
    { date: "2024-09-01T00:01:15", cpu: 30 },
    { date: "2024-09-01T00:01:20", cpu: 25 },
    { date: "2024-09-01T00:01:25", cpu: 40 },
    { date: "2024-09-01T00:01:30", cpu: 35 },
    { date: "2024-09-01T00:01:35", cpu: 60 },
    { date: "2024-09-01T00:01:40", cpu: 55 },
    { date: "2024-09-01T00:01:45", cpu: 70 },
    { date: "2024-09-01T00:01:50", cpu: 65 },
    { date: "2024-09-01T00:01:55", cpu: 50 },
  ];

  const config = {
    cpu: { label: "CPU", color: "var(--primary)" },
    memory: { label: "Memory", color: "var(--secondary)" },
    disk: { label: "Disk", color: "var(--tertiary)" },
  };

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards />
              <div className="px-4 lg:px-6">
                <ChartAreaInteractive
                  chartData={cpuChartData}
                  chartConfig={config}
                  resourceKey="cpu"
                />
                <ChartAreaInteractive
                  chartData={cpuChartData}
                  chartConfig={config}
                  resourceKey="memory"
                />
                <ChartAreaInteractive
                  chartData={cpuChartData}
                  chartConfig={config}
                  resourceKey="disk"
                />
                ;
              </div>
              <DataTable data={data} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
