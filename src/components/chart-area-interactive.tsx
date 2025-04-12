"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import { useIsMobile } from "@/hooks/use-mobile";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export const description = "Resource usage over time";

const chartData = [
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

const chartConfig = {
  cpu: {
    label: "CPU",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

export function ChartAreaInteractive() {
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = React.useState("30d");

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d");
    }
  }, [isMobile]);

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date);
    const referenceDate = new Date("2024-06-30");
    let daysToSubtract = 30;
    if (timeRange === "30d") {
      daysToSubtract = 30;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    }
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return date >= startDate;
  });

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>CPU Resource Usage</CardTitle>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={(v) => v && setTimeRange(v)}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
            <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select a time range"
            >
              <SelectValue placeholder="Last 7 days" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="30d" className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillCpu" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-cpu)"
                  stopOpacity={1.0}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-cpu)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => {
                const d = new Date(value);
                return d.toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              defaultIndex={isMobile ? -1 : 3}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="cpu"
              stackId="server"
              type="monotone"
              fill="url(#fillDesktop)"
              stroke="var(--color-cpu)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
