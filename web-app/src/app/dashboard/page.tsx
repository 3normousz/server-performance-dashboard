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
  const [usedMemoryCardData, setUsedMemoryCardData] = useState<ChartDataPoint[]>([]);
  const [totalMemoryCardData, setTotalMemoryCardData] = useState<ChartDataPoint[]>([]);
  const [diskChartData, setDiskChartData] = useState<ChartDataPoint[]>([]);
  
  const fetchAll = async () => {
    const cpu = await fetchMetrics(`100 * (1 - avg(rate(node_cpu_seconds_total{mode="idle", instance="45.91.133.137:9100"}[30s])))`);
    const mem = await fetchMetrics(`(1 - (node_memory_MemAvailable_bytes{instance="45.91.133.137:9100", job="linux"} / node_memory_MemTotal_bytes{instance="45.91.133.137:9100", job="linux"})) * 100`);
    const totalMem = await fetchMetrics(`node_memory_MemTotal_bytes`);
    const disk = await fetchMetrics(`node_filesystem_avail_bytes{mountpoint="/"}`);
  
    setCpuChartData(cpu);
    setMemoryChartData(mem);
    setUsedMemoryCardData(mem);
    setTotalMemoryCardData(totalMem);
    setDiskChartData(disk);
  };
  
  useEffect(() => {

    fetchAll();
  
    const interval = setInterval(() => {
      fetchAll();
    }, 30000);
  
    return () => clearInterval(interval);
  }, []);
  
  console.log("CPU Chart Data:", cpuChartData);
  console.log("Memory Chart Data:", memoryChartData);

  const cpuData = cpuChartData[0] ? Math.round(cpuChartData[0].value * 100) / 100 : 0;
  const memoryData = memoryChartData[0] ? Math.round(memoryChartData[0].value * 100) / 100 : 0;
  
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
                cpuUsage={cpuData}
                memoryUsage={memoryData}
                totalMemory={cpuData}
                diskUsage={cpuData}
              />
              <div className="px-4 lg:px-6">
                <div className="mb-4">
                  <ChartAreaInteractive
                    chartData={cpuChartData}
                    chartConfig={config}
                    resourceKey="cpu"
                  />
                </div>
                <div className="mb-4">
                  <ChartAreaInteractive
                    chartData={memoryChartData}
                    chartConfig={config}
                    resourceKey="memory"
                  />
                </div>
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
