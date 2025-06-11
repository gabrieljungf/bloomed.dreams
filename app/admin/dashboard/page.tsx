// FILE: src/app/admin/dashboard/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { RefreshCw, User, MessageSquare, AlertTriangle, ListChecks, ZapOff } from "lucide-react"; // Adicionado ZapOff para rate limit
import { cn } from "@/lib/utils";

interface Metrics {
  totalUniqueUsers: number;
  totalMessages: number;
  totalErrors: number;
  totalWaitlist: number;
  totalRateLimited: number; // Nova métrica
}

export default function AdminDashboard() {
  const [data, setData] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/metrics");
      if (!res.ok) {
        const errorBody = await res.json().catch(() => ({ message: `Request failed: ${res.status}` }));
        throw new Error(errorBody.message || `Request failed: ${res.status}`);
      }
      const json: Metrics = await res.json();
      setData(json);
    } catch (e: any) {
      setError(e.message || "Failed to fetch metrics");
      setData(null); // Limpar dados em caso de erro para não mostrar dados antigos
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  const Item = ({
    label,
    value,
    icon: Icon,
    iconColorClass = "text-primary", // Cor padrão pode ser ajustada
   }: {
    label: string;
    value: number;
    icon?: React.ElementType; // LucideReact.LucideIcon ou similar
    iconColorClass?: string;
   }) => (
    <Card className="shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {label}
        </CardTitle>
        {Icon && <Icon className={cn("h-5 w-5 text-muted-foreground", iconColorClass)} />}
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-10 w-24 rounded-md" /> // Ajustado tamanho do skeleton
        ) : (
          <div className="text-3xl font-bold">{value?.toLocaleString() ?? "0"}</div> // Formatado e com fallback
        )}
      </CardContent>
    </Card>
  );

  return (
    <main className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dream Decoder · Admin Dashboard</h1>
        <Button
          variant="outline" // Mudei para outline para menos destaque
          size="icon"
          onClick={fetchMetrics}
          disabled={loading}
          className={cn(loading && "animate-spin")}
          aria-label="Refresh metrics"
        >
          <RefreshCw className="w-5 h-5" />
        </Button>
      </div>

      {error && (
        <div className="text-red-600 bg-red-100 border border-red-400 rounded-md p-3 text-sm">
          <strong>Error:</strong> {error}
        </div>
      )}

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"> {/* Ajustado para lg:grid-cols-3 */}
        <Item label="Unique Users" value={data?.totalUniqueUsers || 0} icon={User} />
        <Item label="Total Messages" value={data?.totalMessages || 0} icon={MessageSquare} />
        <Item label="Rate Limited" value={data?.totalRateLimited || 0} icon={ZapOff} iconColorClass="text-yellow-500" />
        <Item label="Errors" value={data?.totalErrors || 0} icon={AlertTriangle} iconColorClass="text-red-500" />
        <Item label="Waitlist" value={data?.totalWaitlist || 0} icon={ListChecks} />
        {/* Você pode adicionar mais itens ou reorganizar */}
      </section>
    </main>
  );
}