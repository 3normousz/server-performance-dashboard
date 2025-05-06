"use client"

import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip"

type ServerHealth = {
  id: string
  name: string
  health: 'healthy' | 'warning' | 'critical' | 'offline'
  timestamp: string
  metrics: {
    cpu: number
    memory: number
    disk: number
  }
}

const healthColors = {
  healthy: "bg-green-500 hover:bg-green-400",
  warning: "bg-yellow-500 hover:bg-yellow-400",
  critical: "bg-red-500 hover:bg-red-400",
  offline: "bg-gray-300 hover:bg-gray-200"
}

export function ServerHealthGrid({ servers }: { servers: ServerHealth[] }) {
  const minSize = 30
  const serverCount = servers.length
  const gridSize = Math.max(minSize, Math.ceil(Math.sqrt(serverCount)))

  return (
    <div className="rounded-lg border bg-card p-6">
      <h2 className="font-semibold mb-4">Server Health Overview</h2>
      <TooltipProvider>
        <div 
          className="grid gap-1"
          style={{
            gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`
          }}
        >
          {servers.map((server) => (
            <Tooltip key={server.id}>
              <TooltipTrigger asChild>
                <div
                  className={cn(
                    "aspect-square w-full rounded-sm cursor-pointer",
                    healthColors[server.health]
                  )}
                />
              </TooltipTrigger>
              <TooltipContent>
                <div className="space-y-1">
                  <p className="font-semibold">{server.name}</p>
                  <p className="text-xs">CPU: {server.metrics.cpu}%</p>
                  <p className="text-xs">Memory: {server.metrics.memory}%</p>
                  <p className="text-xs">Disk: {server.metrics.disk}%</p>
                </div>
              </TooltipContent>
            </Tooltip>
          ))}
          {/* Fill remaining grid spaces with empty cells */}
          {Array.from({ length: Math.pow(gridSize, 2) - serverCount }).map((_, i) => (
            <div 
              key={`empty-${i}`}
              className="aspect-square w-full rounded-sm bg-muted/20"
            />
          ))}
        </div>
      </TooltipProvider>
    </div>
  )
}