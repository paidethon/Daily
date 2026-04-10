const API_BASE = '/api'

async function fetchJSON<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${url}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  })
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}

export const api = {
  records: {
    list: (params?: { start?: string; end?: string; limit?: number; offset?: number }) => {
      const sp = new URLSearchParams()
      if (params?.start) sp.set('start', params.start)
      if (params?.end) sp.set('end', params.end)
      if (params?.limit) sp.set('limit', String(params.limit))
      if (params?.offset) sp.set('offset', String(params.offset))
      return fetchJSON<{ records: any[] }>(`/records?${sp}`)
    },
    get: (id: string) => fetchJSON<{ record: any; photos: any[] }>(`/records/${id}`),
    create: (data: any) => fetchJSON<{ id: string; success: boolean }>('/records', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => fetchJSON<{ success: boolean }>(`/records/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => fetchJSON<{ success: boolean }>(`/records/${id}`, { method: 'DELETE' }),
  },
  gallery: {
    list: (limit = 100, offset = 0) => fetchJSON<{ photos: any[]; total: number }>(`/gallery?limit=${limit}&offset=${offset}`),
  },
  recall: {
    random: () => fetchJSON<{ record: any }>('/recall/random'),
  },
  albums: {
    list: () => fetchJSON<{ albums: any[] }>('/albums'),
  },
  calendar: {
    get: (year: number, month?: number) => {
      let url = `/calendar?year=${year}`
      if (month) url += `&month=${month}`
      return fetchJSON<{ dates: any[] }>(url)
    },
  },
  stats: {
    get: () => fetchJSON<any>('/stats'),
  },
}
