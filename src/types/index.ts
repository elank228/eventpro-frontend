export interface User {
  id: number
  nom: string
  email: string
  role: string
}

export interface Event {
  id: number
  titre: string
  description: string
  date: string
  lieu: string
  nombreDePlaces: number | null
  nombreInscrits: number
  createur: User
}

export interface EventsResponse {
  total: number
  page: number
  pageSize: number
  items: Event[]
}

export interface AuthResponse {
  token: string
  user: User
}

export interface EventQueryParams {
  lieu?: string
  dateDebut?: string
  dateFin?: string
  page?: number
  pageSize?: number
}
