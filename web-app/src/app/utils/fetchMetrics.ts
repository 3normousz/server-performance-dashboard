export async function fetchMetrics(measurement: string, field: string) {
    try {
      console.log(`Fetching /api/metrics?measurement=${measurement}&field=${field}...`);
      const res = await fetch(`/api/metrics?measurement=${measurement}&field=${field}`);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      console.log(`Fetched data for ${measurement}:`, data);
      return data.map((point: any) => ({
        date: point._time,
        value: point._value,
      }));
    } catch (err) {
      console.error("Fetch error:", err);
      return [];
    }
  }