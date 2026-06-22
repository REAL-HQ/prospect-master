import { createFileRoute } from "@tanstack/react-router";
import { DashboardShell } from "@/components/pm/DashboardShell";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — ProspectMaster" },
      { name: "description", content: "Your ProspectMaster dashboard." },
    ],
  }),
  component: DashboardShell,
});
