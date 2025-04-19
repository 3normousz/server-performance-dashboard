import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";

import { Badge } from "./ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

interface SectionCardsProps {
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
}

export function SectionCards({ cpuUsage, memoryUsage, diskUsage }: SectionCardsProps) {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {/* CPU Usage */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>CPU Usage</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {cpuUsage}%
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            CPU usage trending higher <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Monitor for potential bottlenecks
          </div>
        </CardFooter>
      </Card>

      {/* RAM Usage */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>RAM Usage</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {memoryUsage}%
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingDown />
              -10%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Usage decreased this period <IconTrendingDown className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Memory usage under control
          </div>
        </CardFooter>
      </Card>

      {/* Disk Usage */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Disk Usage</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {diskUsage}%
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +2%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Slight increase <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Check for storage expansion soon
          </div>
        </CardFooter>
      </Card>

      {/* Network Usage */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Network Usage</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            100 Mbps
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +10%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Increased traffic <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Throughput nearing capacity
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
