
export type Server = {
  id: string
  name: string
  address: string
  user_id: string
  created_at: string
}

export type ServerWithHealth = Server & {
  health: {
    cpu: string
    memory: string
    disk?: string
    status: 'healthy' | 'warning' | 'critical' | 'offline'
  }
}