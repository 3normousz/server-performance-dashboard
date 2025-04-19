"use client";

import { useEffect, useState } from "react";
import { AppSidebar } from "../../components/app-sidebar";
import { ChartAreaInteractive } from "../../components/chart-area-interactive";
import { DataTable } from "../../components/data-table";
import { SectionCards } from "../../components/section-cards";
import { SiteHeader } from "../../components/site-header";
import { SidebarInset, SidebarProvider } from "../../components/ui/sidebar";
import { ChartDataPoint } from "../types/chart";
import { fetchMetrics } from "../utils/fetchMetrics";

import data from "./data.json";

export default function Page() {

  const [cpuChartData, setCpuChartData] = useState<ChartDataPoint[]>([]);
  const [memoryChartData, setMemoryChartData] = useState<ChartDataPoint[]>([]);
  const [diskChartData, setDiskChartData] = useState<ChartDataPoint[]>([]);
  
  useEffect(() => {
    fetchMetrics("cpu", "usage_active").then((data) => setCpuChartData(data));
    fetchMetrics("mem", "used_percent").then((data) => setMemoryChartData(data));
    fetchMetrics("disk", "used_percent").then((data) => setDiskChartData(data));
  }, []);

  const lastCpuData = cpuChartData[cpuChartData.length - 1] || { value: "0" };
  const lastMemoryData = memoryChartData[memoryChartData.length - 1] || { value: "0" };
  const lastDiskData = diskChartData[diskChartData.length - 1] || { value: "0" };

  const config = {
    cpu: { label: "CPU", color: "var(--primary)" },
    memory: { label: "Memory", color: "var(--primary)" },
    disk: { label: "Disk", color: "var(--primary)" },
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
              <SectionCards
                cpuUsage={Math.round(parseFloat(lastCpuData.value))}
                memoryUsage={Math.round(parseFloat(lastMemoryData.value))}
                diskUsage={Math.round(parseFloat(lastDiskData.value))}
              />
              <div className="px-4 lg:px-6">
                <ChartAreaInteractive
                  chartData={cpuChartData}
                  chartConfig={config}
                  resourceKey="cpu"
                />
                <ChartAreaInteractive
                  chartData={memoryChartData}
                  chartConfig={config}
                  resourceKey="memory"
                />
                <ChartAreaInteractive
                  chartData={diskChartData}
                  chartConfig={config}
                  resourceKey="disk"
                />
              </div>
              <DataTable data={data} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
