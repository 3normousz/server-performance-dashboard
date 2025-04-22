import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const query = searchParams.get('query');
  if (!query) {
    return NextResponse.json({ error: 'Missing PromQL query' }, { status: 400 });
  }

  const end = Math.floor(Date.now() / 1000); // now in seconds
  const start = end - 60 * 60; // 1 hour ago
  const step = 15; // 15 seconds

  const PROMETHEUS_BASE_URL = 'http://localhost:9090';
  

  try {
    const res = await fetch(`${PROMETHEUS_BASE_URL}/api/v1/query_range?query=${encodeURIComponent(query)}&start=${start}&end=${end}&step=${step}`);
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
