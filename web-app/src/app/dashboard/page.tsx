"use client";

import { SiteHeader } from "@/components/site-header";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { ServerHealthGrid } from "@/components/health-heatmap";
import { useState, useEffect } from "react";
import { Server, ServerWithHealth } from "@/app/types/server";

export default function DashboardPage() {

  const [serverLists, setServerLists] = useState<ServerWithHealth[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchServers = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/users/server-lists?include_health=true');
        if (!response.ok) throw new Error('Failed to fetch servers');
        const data = await response.json();
        console.log(data);
        setServerLists(data);
      } catch (error) {
        console.error('Error fetching servers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServers();
  }, []);

  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "calc(var(--spacing) * 72)",
        "--header-height": "calc(var(--spacing) * 12)",
      } as React.CSSProperties}
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="container mx-auto p-6">
          <ServerHealthGrid
            servers={serverLists.map(server => ({
                id: server.id,
                name: server.name,
                health: "healthy",
                timestamp: new Date().toISOString(),
                metrics: {
                  cpu: parseFloat(server.health.cpu) * 100,
                  memory: parseFloat(server.health.memory),
                  disk: 0
                }
              }))}
            />
          {loading ? (
            <p className="text-muted-foreground mt-4 text-center">Loading servers...</p>
          ) : (
            <p className="text-muted-foreground mt-4 text-center">
              Select a server to view its detailed dashboard
            </p>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}