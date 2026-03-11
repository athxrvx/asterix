import { supabase } from '@/lib/supabase'
import { articles as fallbackArticles, events as fallbackEvents } from '@/lib/data'

export type BlogListItem = {
  id: number
  slug: string
  title: string
  type: string
  date: string
  excerpt: string
  author: string
  readTime: string
  coverImage: string
  markdownUrl: string
}

export type EventItem = {
  id: number
  slug: string
  date: string
  title: string
  type: string
  seats: 'OPEN' | 'FULL' | 'LIMITED'
  venue: string
  time: string
  summary: string
  details: string[]
  registerUrl: string
}

export type ProjectItem = {
  id: number
  projectName: string
  summary: string
  githubLink: string | null
}

type BlogRow = {
  id: number
  slug: string
  title: string
  type: string
  date: string
  excerpt: string
  author: string
  read_time: string
  cover_image: string
  markdown_url: string
}

type EventRow = {
  id: number
  slug: string | null
  date: string
  title: string
  type: string
  seats: 'OPEN' | 'FULL' | 'LIMITED'
  venue: string
  time: string
  summary: string
  details: string[]
  register_url: string
}

type ProjectRow = {
  id: number
  project_name: string
  summary: string
  github_link: string | null
}

const fallbackBlogs: BlogListItem[] = fallbackArticles.map((article, index) => ({
  id: index + 1,
  slug: article.slug,
  title: article.title,
  type: article.type,
  date: article.date,
  excerpt: article.excerpt,
  author: article.author,
  readTime: article.readTime,
  coverImage: article.coverImage,
  markdownUrl: '',
}))

const fallbackEventItems: EventItem[] = fallbackEvents.map((event) => ({
  id: event.id,
  slug: event.slug,
  date: event.date,
  title: event.title,
  type: event.type,
  seats: event.seats,
  venue: event.venue,
  time: event.time,
  summary: event.summary,
  details: event.details,
  registerUrl: event.registerUrl,
}))

async function withTimeout<T>(promiseLike: PromiseLike<T>, ms: number): Promise<T | null> {
  let timeoutId: ReturnType<typeof setTimeout> | undefined
  const timeoutPromise = new Promise<null>((resolve) => {
    timeoutId = setTimeout(() => resolve(null), ms)
  })

  const result = await Promise.race([Promise.resolve(promiseLike), timeoutPromise])
  if (timeoutId) clearTimeout(timeoutId)
  return result as T | null
}

function mapBlogRow(row: BlogRow): BlogListItem {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    type: row.type,
    date: row.date,
    excerpt: row.excerpt,
    author: row.author,
    readTime: row.read_time,
    coverImage: row.cover_image,
    markdownUrl: row.markdown_url,
  }
}

function mapEventRow(row: EventRow): EventItem {
  return {
    id: row.id,
    slug: row.slug ?? '',
    date: row.date,
    title: row.title,
    type: row.type,
    seats: row.seats,
    venue: row.venue,
    time: row.time,
    summary: row.summary,
    details: Array.isArray(row.details) ? row.details : [],
    registerUrl: row.register_url,
  }
}

function mapProjectRow(row: ProjectRow): ProjectItem {
  return {
    id: row.id,
    projectName: row.project_name,
    summary: row.summary,
    githubLink: row.github_link,
  }
}

function normalizeIdentifier(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function githubToRawUrl(url: string) {
  if (!url.includes('github.com') || !url.includes('/blob/')) return url
  return url
    .replace('https://github.com/', 'https://raw.githubusercontent.com/')
    .replace('/blob/', '/')
}

export async function fetchMarkdownFromUrl(url: string) {
  if (!url) return ''

  const resolvedUrl = githubToRawUrl(url)
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 8000)

  try {
    const response = await fetch(resolvedUrl, {
      next: { revalidate: 300 },
      signal: controller.signal,
    })
    if (!response.ok) return ''
    return await response.text()
  } catch {
    return ''
  } finally {
    clearTimeout(timeoutId)
  }
}

export async function getLatestBlogs(limit = 3): Promise<BlogListItem[]> {
  const { data, error } = await supabase
    .from('blogs')
    .select('id, slug, title, type, date, excerpt, author, read_time, cover_image, markdown_url')
    .order('id', { ascending: false })
    .limit(limit)

  if (error || !data || data.length === 0) {
    return fallbackBlogs.slice(0, limit)
  }

  return (data as BlogRow[]).map(mapBlogRow)
}

export async function getAllBlogs(): Promise<BlogListItem[]> {
  const { data, error } = await supabase
    .from('blogs')
    .select('id, slug, title, type, date, excerpt, author, read_time, cover_image, markdown_url')
    .order('id', { ascending: false })

  if (error || !data || data.length === 0) {
    return fallbackBlogs
  }

  return (data as BlogRow[]).map(mapBlogRow)
}

export async function getBlogBySlug(slug: string): Promise<BlogListItem | null> {
  const { data, error } = await supabase
    .from('blogs')
    .select('id, slug, title, type, date, excerpt, author, read_time, cover_image, markdown_url')
    .eq('slug', slug)
    .maybeSingle()

  if (error) {
    return fallbackBlogs.find((item) => item.slug === slug) ?? null
  }

  if (!data) {
    return fallbackBlogs.find((item) => item.slug === slug) ?? null
  }

  return mapBlogRow(data as BlogRow)
}

export async function getLatestEvents(limit = 3): Promise<EventItem[]> {
  const { data, error } = await supabase
    .from('events')
    .select('id, slug, date, title, type, seats, venue, time, summary, details, register_url')
    .order('id', { ascending: false })
    .limit(limit)

  if (error || !data || data.length === 0) {
    return fallbackEventItems.slice(0, limit)
  }

  return (data as EventRow[]).map(mapEventRow)
}

export async function getAllEvents(): Promise<EventItem[]> {
  const response = await withTimeout(
    supabase
      .from('events')
      .select('id, slug, date, title, type, seats, venue, time, summary, details, register_url')
      .order('id', { ascending: true }),
    8000
  )

  if (!response) {
    return fallbackEventItems
  }

  const { data, error } = response

  if (error || !data || data.length === 0) {
    return fallbackEventItems
  }

  return (data as EventRow[]).map(mapEventRow)
}

export async function getEventBySlug(slug: string): Promise<EventItem | null> {
  return getEventByIdentifier(slug)
}

export async function getEventByIdentifier(identifier: string): Promise<EventItem | null> {
  const response = await withTimeout(
    supabase
      .from('events')
      .select('id, slug, date, title, type, seats, venue, time, summary, details, register_url')
      .eq('slug', identifier)
      .maybeSingle(),
    5000
  )

  const data = response?.data
  const error = response?.error

  if (response && !error && data) {
    return mapEventRow(data as EventRow)
  }

  const allEvents = await getAllEvents()
  const normalizedIdentifier = normalizeIdentifier(identifier)
  const byIdentifier = allEvents.find((item) => {
    const slugCandidate = item.slug ? normalizeIdentifier(item.slug) : ''
    const titleCandidate = normalizeIdentifier(item.title)
    const titleDateCandidate = normalizeIdentifier(`${item.title}-${item.date}`)

    return (
      slugCandidate === normalizedIdentifier ||
      titleCandidate === normalizedIdentifier ||
      titleDateCandidate === normalizedIdentifier ||
      String(item.id) === identifier
    )
  })

  if (byIdentifier) {
    return byIdentifier
  }

  return fallbackEventItems.find((item) => item.slug === identifier || String(item.id) === identifier) ?? null
}

export async function getAllProjects(): Promise<ProjectItem[]> {
  const response = await withTimeout(
    supabase
      .from('projects')
      .select('id, project_name, summary, github_link')
      .order('id', { ascending: false }),
    8000
  )

  if (!response) {
    return []
  }

  const { data, error } = response

  if (error || !data || data.length === 0) {
    return []
  }

  return (data as ProjectRow[]).map(mapProjectRow)
}
