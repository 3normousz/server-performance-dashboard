import { ChartDataPoint } from "../types/chart";

export async function fetchMetrics(promQL: string): Promise<ChartDataPoint[]> {
  try {
    const res = await fetch(`/api/metrics?query=${encodeURIComponent(promQL)}`);
    const json = await res.json();

    if (!json.data?.result) return [];

    // console.log("Fetched data:", json.data.result);

    return json.data.result.flatMap((entry: any) =>
      entry.values.map(([ts, val]: [number, string]) => ({
        timestamp: new Date(ts * 1000).toISOString(),
        value: parseFloat(val),
        ...entry.metric,
      }))
    );
  } catch (err) {
    console.error("Fetch error:", err);
    return [];
  }
}

    