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
  const [cpuPercentage, setCpuPercentage] = useState<ChartDataPoint[]>([]);
  const [memoryChartData, setMemoryChartData] = useState<ChartDataPoint[]>([]);
  const [usedMemoryCardData, setUsedMemoryCardData] = useState<ChartDataPoint[]>([]);
  const [totalMemoryCardData, setTotalMemoryCardData] = useState<ChartDataPoint[]>([]);
  const [diskChartData, setDiskChartData] = useState<ChartDataPoint[]>([]);
  const [diskUsedPercentage, setDiskUsedPercentage] = useState<ChartDataPoint[]>([]);
  
  const fetchAll = async () => {
    //const cpu = await fetchMetrics(`100 * (1 - avg(rate(node_cpu_seconds_total{mode="idle", instance="45.91.133.137:9100"}[30s])))`);
    const cpuUsage = await fetchMetrics(`sum by (mode)(irate(node_cpu_seconds_total{instance="45.91.133.137:9100", job="linux"}[15s]))
      / scalar(count(count(node_cpu_seconds_total{instance="45.91.133.137:9100", job="linux"}) by (cpu)))* 100`);
    const cpuIdlePercentage = await fetchMetrics(`100 * (1 - avg(rate(node_cpu_seconds_total{mode="idle", instance="45.91.133.137:9100"}[15s])))`);
    const mem = await fetchMetrics(`(1 - (node_memory_MemAvailable_bytes{instance="45.91.133.137:9100", job="linux"} / node_memory_MemTotal_bytes{instance="45.91.133.137:9100", job="linux"})) * 100`);
    const totalMem = await fetchMetrics(`node_memory_MemTotal_bytes{instance="45.91.133.137:9100",job="linux"}`);
    const diskUsage = await fetchMetrics(`100 - ((node_filesystem_avail_bytes{instance="45.91.133.137:9100",job="linux",device!~'rootfs'} * 100) / node_filesystem_size_bytes{instance="45.91.133.137:9100",job="linux",device!~'rootfs'})`);
    const diskUsedPercentage = await fetchMetrics(`100 - ((node_filesystem_avail_bytes{instance="45.91.133.137:9100",job="linux",mountpoint="/",fstype!="rootfs"} * 100) / node_filesystem_size_bytes{instance="45.91.133.137:9100",job="linux",mountpoint="/",fstype!="rootfs"})`);
  
    setCpuChartData(cpuUsage);
    setCpuPercentage(cpuIdlePercentage);
    setMemoryChartData(mem);
    setUsedMemoryCardData(mem);
    setTotalMemoryCardData(totalMem);
    setDiskChartData(diskUsage);
    setDiskUsedPercentage(diskUsedPercentage);
  };
  
  useEffect(() => {

    fetchAll();
  
    const interval = setInterval(() => {
      fetchAll();
    }, 30000);
  
    return () => clearInterval(interval);
  }, []);
  
  //console.log("CPU Chart Data:", cpuChartData);
  //console.log("Memory Chart Data:", memoryChartData);
  //console.log("Disk Chart Data:", diskChartData);

  const lastCpuPercentage = cpuPercentage.length > 0 && cpuPercentage[cpuPercentage.length - 1].value != null
    ? Math.round((cpuPercentage[cpuPercentage.length - 1].value ?? 0) * 100) / 100 : 0;
  const lastMemoryPercentage = memoryChartData[0] ? Math.round(memoryChartData[0].value! * 100) / 100 : 0;
  const lastDiskUsedPercentage = diskUsedPercentage[0] ? Math.round(diskUsedPercentage[0].value! * 100) / 100 : 0;
  
  const groupedDiskByTimestamp = new Map<string, Record<string, any>>();
  const groupedCPUByTimestamp = new Map<string, Record<string, any>>();

  diskChartData.forEach(({ timestamp, value, mountpoint }) => {
    if (!groupedDiskByTimestamp.has(timestamp)) {
      groupedDiskByTimestamp.set(timestamp, { timestamp });
    }
    groupedDiskByTimestamp.get(timestamp)![mountpoint!] = value;
  });

  cpuChartData.forEach(({ timestamp, value, mode }) => {
    if (!groupedCPUByTimestamp.has(timestamp)) {
      groupedCPUByTimestamp.set(timestamp, { timestamp });
    }
    groupedCPUByTimestamp.get(timestamp)![mode!] = value;
  });

  const stackedDiskData: ChartDataPoint[] = Array.from(groupedDiskByTimestamp.values()).map((entry) => ({
    timestamp: entry.timestamp as string,
    ...entry,
  }));

  const stackedCPUData: ChartDataPoint[] = Array.from(groupedCPUByTimestamp.values()).map((entry) => ({
    timestamp: entry.timestamp as string,
    ...entry,
  }));

  // console.log("Stacked CPU Data:", stackedCPUData);

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
                cpuUsage={lastCpuPercentage}
                memoryUsage={lastMemoryPercentage}
                totalMemory={lastCpuPercentage}
                diskUsage={lastDiskUsedPercentage}
              />
              <div className="px-4 lg:px-6">
                <div className="mb-4">
                  <ChartAreaInteractive
                    chartData={stackedCPUData}
                    chartConfig={{
                      "idle": { label: "Idle", color: "#82ca9d" },
                      "iowait": { label: "Iowait", color: "#8884d8" },
                      "irq": { label: "Irq", color: "#ffc658" },
                      "nice": { label: "Nice", color: "#ff8042" },
                      "softirq": { label: "Softirq", color: "#d0ed57" },
                      "steal": { label: "Steal", color: "#a4de6c" },
                      "system": { label: "System", color: "#3498db" },
                      "user": { label: "User", color: "#e74c3c" },
                    }}
                    resourceKey="user"
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
                    chartData={stackedDiskData}
                    chartConfig={{
                      "/": { label: "/", color: "#82ca9d" },
                      "/boot": { label: "/boot", color: "#8884d8" },
                      "/boot/efi": { label: "/boot/efi", color: "#ffc658" },
                      "/run": { label: "/run", color: "#ff8042" },
                      "/run/lock": { label: "/run/lock", color: "#d0ed57" },
                      "/run/user/0": { label: "/run/user/0", color: "#a4de6c" },
                    }}
                    resourceKey="/"
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
