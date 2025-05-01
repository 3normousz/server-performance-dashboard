import { Dashboard } from "@/components/dashboard";
import { SiteHeader } from "@/components/site-header";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

export default async function ServerDashboardPage({ 
  params 
}: { 
  params: { serverId: string } 
}) {
  const supabase = createServerComponentClient({ cookies });
  
  const { data: server } = await supabase
    .from("servers")
    .select("*")
    .eq("id", params.serverId)
    .single();

  if (!server) {
    return notFound();
  }

  return (
        <Dashboard serverAddress={server.address} />
  );
}