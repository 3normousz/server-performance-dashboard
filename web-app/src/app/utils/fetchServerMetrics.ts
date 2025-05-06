export interface ServerMetrics {
    cpu: string
    memory: string
    disk?: string
}

export async function fetchServerMetrics(serverAddress: string): Promise<ServerMetrics> {
    try {
        const cpuResponse = await fetch(`${process.env.PROMETHEUS_URL}/api/v1/query?query=(100 * (1 - avg(rate(node_cpu_seconds_total{mode="idle", instance="${serverAddress}"}[30s]))))`);
        const memoryResponse = await fetch(`${process.env.PROMETHEUS_URL}/api/v1/query?query=(1 - (node_memory_MemAvailable_bytes{instance="${serverAddress}", job="linux"} 
            / node_memory_MemTotal_bytes{instance="${serverAddress}", job="linux"})) * 100`);
        
        const cpu = await cpuResponse.json();
        const memory = await memoryResponse.json();

        return {
        cpu: cpu.data?.result[0].value[1] || [],
        memory: memory.data?.result[0].value[1] || [],
        }
    } catch (error) {
        console.error(`Failed to fetch metrics for ${process.env.PROMETHEUS_URL}:`, error)
            return {
            cpu: '0',
            memory: '0',
        }
    }
}

export function determineHealthStatus(metrics: ServerMetrics) {
    const cpuUsage = parseFloat(metrics.cpu)
    const memoryUsage = parseFloat(metrics.memory)

    if (cpuUsage > 90 || memoryUsage > 90) return 'critical'
    if (cpuUsage > 70 || memoryUsage > 70) return 'warning'
    return 'healthy'
}