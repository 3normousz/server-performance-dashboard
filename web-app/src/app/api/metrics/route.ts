/*import { NextResponse } from "next/server";
import { queryInfluxDB } from "../../utils/influxdb";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const measurement = searchParams.get("measurement") || "cpu";
  const field = searchParams.get("field") || "usage_active";

  if (!measurement || !field) {
    return NextResponse.json(
      { error: "Missing measurement or field" },
      { status: 400 }
    );
  }

  console.log(
    `Fetching metrics for measurement: ${measurement}, field: ${field}`
  );
  
  try {
    const rows = await queryInfluxDB(measurement, field);
    return NextResponse.json(rows);
  } catch (error: any) {
    console.error("API Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}*/

import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const query = searchParams.get('query');
  if (!query) {
    return NextResponse.json({ error: 'Missing PromQL query' }, { status: 400 });
  }

  const PROMETHEUS_BASE_URL = 'http://localhost:9090';

  try {
    const res = await fetch(`${PROMETHEUS_BASE_URL}/api/v1/query?query=${encodeURIComponent(query)}`);
    const json = await res.json();

    if (json.status !== 'success') {
      throw new Error('Prometheus query failed');
    }

    return NextResponse.json(json);
  } catch (error: any) {
    console.error('Prometheus API Error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
