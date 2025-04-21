"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { useIsMobile } from "../hooks/use-mobile";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "./ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import { ChartDataPoint } from "../app/types/chart";

export const description = "Resource usage over time";

interface ChartAreaInteractiveProps {
  chartData: ChartDataPoint[];
  chartConfig: {
    [key: string]: { label: string; color: string };
  };
  resourceKey: string;
}

export function ChartAreaInteractive({
  chartData,
  chartConfig,
  resourceKey,
}: ChartAreaInteractiveProps) {
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = React.useState("5m");
  const [drive, setDrive] = React.useState("C:");

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("5m");
    }
  }, [isMobile]);

  /*const filteredData = chartData.filter((item) => {
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
  });*/

  //console.log("ORG Chart Data: ", chartData);
  
  const filteredData = React.useMemo(() => {
    const now = new Date();
    const rangeInMinutes = timeRange === "5m" ? 5 : 60;
    const startTime = new Date(now.getTime() - rangeInMinutes * 60 * 1000);
  
    return chartData
      .filter((item) => new Date(item.timestamp) >= startTime)
      .map((item) => ({
        date: item.date,
        value: item.value,
        device: item.device,
      }));
  }, [chartData, timeRange]);

  const mappedData = filteredData.map((item) => ({
    date: item.date,
    [resourceKey]: item.value,
  }));

  const mappedDataWithDrive = chartData
    .filter((item) => item.device === drive)
    .map((item) => ({
      date: item.date,
      [resourceKey]: item.value,
    }));

  //console.log("Data for ", resourceKey);
  //console.log("Chart Data: ", chartData);
  //console.log("Filtered Data:", filteredData);
  //console.log("Mapped Data with Drive:", mappedDataWithDrive);

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>{chartConfig[resourceKey].label} Resource Usage</CardTitle>
        { ( resourceKey === "cpu" || resourceKey === "memory" ) && (
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={(v) => v && setTimeRange(v)}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="5m">Last 5 minutes</ToggleGroupItem>
            <ToggleGroupItem value="1h">Last 1 hour</ToggleGroupItem>
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
              <SelectItem value="5m" className="rounded-lg">
                Last 5 minutes
              </SelectItem>
              <SelectItem value="1h" className="rounded-lg">
                Last 1 hour
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
        )}
        {  resourceKey === "disk"  && (
        <CardAction>
          <ToggleGroup
            type="single"
            value={drive}
            onValueChange={(v) => v && setDrive(v)}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="C:">C:</ToggleGroupItem>
            <ToggleGroupItem value="D:">D:</ToggleGroupItem>
            <ToggleGroupItem value="E:">E:</ToggleGroupItem>
          </ToggleGroup>
          <Select value={drive} onValueChange={setDrive}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select a time range"
            >
              <SelectValue placeholder="Last 7 days" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="C:" className="rounded-lg">
                C:
              </SelectItem>
              <SelectItem value="D:" className="rounded-lg">
                D:
              </SelectItem>
              <SelectItem value="E:" className="rounded-lg">
                E:
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
        )}
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={resourceKey === "disk" ? mappedDataWithDrive : mappedData}>
            <defs>
              {Object.keys(chartConfig).map((key) => (
                <linearGradient
                  key={key}
                  id={`fill${key}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor={chartConfig[key].color}
                    stopOpacity={1.0}
                  />
                  <stop
                    offset="95%"
                    stopColor={chartConfig[key].color}
                    stopOpacity={0.1}
                  />
                </linearGradient>
              ))}
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
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                domain={[0, 100]}
                tickFormatter={(value) => `${value}%`}
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
            {Object.keys(chartConfig).map((key) => (
              <Area
                key={key}
                dataKey={key}
                stackId="server"
                type="monotone"
                fill={`url(#fill${key})`}
                stroke={chartConfig[key].color}
              />
            ))}
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
