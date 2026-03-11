'use client'

import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase'

type UpdateItem = {
    id: number
    message: string
    createdAt: string
}

function formatLogTime(value: string) {
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return value
    const yyyy = date.getUTCFullYear()
    const mm = String(date.getUTCMonth() + 1).padStart(2, '0')
    const dd = String(date.getUTCDate()).padStart(2, '0')
    const hh = String(date.getUTCHours()).padStart(2, '0')
    const min = String(date.getUTCMinutes()).padStart(2, '0')
    return `${yyyy}-${mm}-${dd} ${hh}:${min}`
}

function toTimestamp(value: string) {
    const ts = Date.parse(value)
    return Number.isNaN(ts) ? 0 : ts
}

function getProjectActivityMessage(name: string, summary: string) {
    const normalized = `${name} ${summary}`.toLowerCase()
    const endSignals = ['ended', 'complete', 'completed', 'archived', 'closed']
    const isEnded = endSignals.some((signal) => normalized.includes(signal))
    if (isEnded) {
        return `Project ended: ${name}`
    }
    return `New project started: ${name}`
}

export default function Updates() {
    const [logs, setLogs] = useState<UpdateItem[]>([])
    const [connected, setConnected] = useState(false)

    useEffect(() => {
        const loadLogs = async () => {
            const [blogsRes, eventsRes, projectsRes] = await Promise.all([
                supabase.from('blogs').select('id, title, created_at').order('created_at', { ascending: false }).limit(6),
                supabase.from('events').select('id, title, seats, created_at').order('created_at', { ascending: false }).limit(6),
                supabase.from('projects').select('id, project_name, summary, created_at').order('created_at', { ascending: false }).limit(6),
            ])

            const hasError = Boolean(blogsRes.error || eventsRes.error || projectsRes.error)
            if (hasError) {
                setLogs([])
                setConnected(false)
                return
            }

            const blogUpdates: UpdateItem[] = (blogsRes.data ?? []).map((blog) => ({
                id: 100000 + blog.id,
                message: `New blog added: ${blog.title}`,
                createdAt: blog.created_at,
            }))

            const eventUpdates: UpdateItem[] = (eventsRes.data ?? []).map((event) => ({
                id: 200000 + event.id,
                message: event.seats === 'FULL' ? `Event update: ${event.title} registrations filled` : `New event added: ${event.title}`,
                createdAt: event.created_at,
            }))

            const projectUpdates: UpdateItem[] = (projectsRes.data ?? []).map((project) => ({
                id: 300000 + project.id,
                message: getProjectActivityMessage(project.project_name, project.summary),
                createdAt: project.created_at,
            }))

            const merged = [...blogUpdates, ...eventUpdates, ...projectUpdates]
                .filter((item) => item.createdAt)
                .sort((a, b) => toTimestamp(b.createdAt) - toTimestamp(a.createdAt))
                .slice(0, 3)

            setLogs(merged)
            setConnected(true)
        }

        void loadLogs()
    }, [])

    const statusClass = useMemo(() => (connected ? 'bg-green-500' : 'bg-amber-500'), [connected])

    return (
        <section className="py-12 px-6 md:px-12 bg-neutral-950 text-neutral-400 font-mono text-xs border-t border-neutral-900">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="col-span-1">
                    <span className="block text-white mb-4">SYSTEM LOG</span>
                    <div className="flex items-center gap-2">
                        <div className={`h-2 w-2 ${statusClass} rounded-full animate-pulse`}></div>
                        <span className="text-[10px] text-neutral-500">{connected ? 'LIVE' : 'FALLBACK'}</span>
                    </div>
                </div>

                <div className="col-span-3 space-y-4">
                    {logs.length > 0 ? (
                        logs.map((log) => (
                            <div key={log.id} className="flex gap-4">
                                <span className="text-neutral-600">[{formatLogTime(log.createdAt)}]</span>
                                <span>{log.message}</span>
                            </div>
                        ))
                    ) : (
                        <div className="text-neutral-600">No recent website updates yet. Add blogs, events, or projects.</div>
                    )}
                </div>
            </div>
        </section>
    )
}
