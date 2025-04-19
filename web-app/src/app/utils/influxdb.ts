import { InfluxDB } from "@influxdata/influxdb-client";

const url = process.env.INFLUXDB_URL!;
const token = process.env.INFLUXDB_TOKEN!;
const org = process.env.INFLUXDB_ORG!;
const bucket = process.env.INFLUXDB_BUCKET!;

if (!url || !token || !org || !bucket) {
  throw new Error("Missing InfluxDB environment variables");
}

const queryApi = new InfluxDB({ url, token }).getQueryApi(org);

export async function queryInfluxDB(measurement: string, field: string, range: string = "-1h") {
  const cpuFilter = measurement === "cpu" ? '|> filter(fn: (r) => r.cpu == "cpu-total")' : "";
  const diskFilter = measurement === "disk" ? '|> filter(fn: (r) => r.device == "C:")' : "";
  
  const fluxQuery = `
    from(bucket: "${bucket}")
      |> range(start: ${range})
      |> filter(fn: (r) => r._measurement == "${measurement}")
      |> filter(fn: (r) => r._field == "${field}")
      ${cpuFilter}
      |> aggregateWindow(every: 1m, fn: mean)
      |> yield(name: "mean")
  `;
    
  console.log("Executing InfluxDB Query:", fluxQuery);
  console.log("Query API:", queryApi);
  
  const rows: any[] = [];
  return new Promise<any[]>((resolve, reject) => {
    queryApi.queryRows(fluxQuery, {
      next(row, tableMeta) {
        rows.push(tableMeta.toObject(row));
      },
      error(error) {
        console.error("InfluxDB Query Error:", error.message);
        reject(error);
      },
      complete() {
        resolve(rows);
      },
    });
  });
}