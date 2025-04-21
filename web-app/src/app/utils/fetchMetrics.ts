/*export async function fetchMetrics(measurement: string, field: string) {
    try {
      //console.log(`Fetching /api/metrics?measurement=${measurement}&field=${field}...`);
      const res = await fetch(`/api/metrics?measurement=${measurement}&field=${field}`);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      //console.log(`Fetched data for ${measurement}:`, data);
      return data.map((point: any) => ({
        date: point._time,
        value: point._value,
        device: point.device,
      }));
    } catch (err) {
      console.error("Fetch error:", err);
      return [];
    }
  }*/

import { ChartDataPoint } from "../types/chart";

export async function fetchMetrics(promQL: string): Promise<ChartDataPoint[]> {
  try {
    const res = await fetch(`/api/metrics?query=${encodeURIComponent(promQL)}`);
    const json = await res.json();

    if (!json.data?.result) return [];

    return json.data.result.map((entry: any) => {
      const [ts, val] = entry.value;
      return {
        timestamp: new Date(ts * 1000).toISOString(),
        value: parseFloat(val),
        ...entry.metric,
      };
    });
  } catch (err) {
    console.error("Fetch error:", err);
    return [];
  }
}

    