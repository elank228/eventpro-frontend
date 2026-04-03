import api from './axios'
import type { AuthResponse, Event, EventsResponse, EventQueryParams } from '../types'

// Auth
export const register = (data: { nom: string; email: string; motDePasse: string }) =>
  api.post<AuthResponse>('/auth/register', data)

export const login = (data: { email: string; motDePasse: string }) =>
  api.post<AuthResponse>('/auth/login', data)

// Events
export const getEvents = (params?: EventQueryParams) =>
  api.get<EventsResponse>('/events', { params })

export const getEvent = (id: number) =>
  api.get<Event>(`/events/${id}`)

export const createEvent = (data: Omit<Event, 'id' | 'nombreInscrits' | 'createur'>) =>
  api.post<Event>('/events', data)

export const updateEvent = (id: number, data: Partial<Omit<Event, 'id' | 'nombreInscrits' | 'createur'>>) =>
  api.put<Event>(`/events/${id}`, data)

export const deleteEvent = (id: number) =>
  api.delete(`/events/${id}`)

// Registrations
export const registerToEvent = (eventId: number) =>
  api.post(`/events/${eventId}/registrations`)

export const unregisterFromEvent = (eventId: number) =>
  api.delete(`/events/${eventId}/registrations`)

export const getParticipants = (eventId: number) =>
  api.get<{ id: number; nom: string; email: string }[]>(`/events/${eventId}/registrations`)
