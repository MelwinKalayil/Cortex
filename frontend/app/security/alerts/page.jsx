'use client'

import {
  AlertTriangle,
  Bell,
  Camera,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Filter,
  LayoutDashboard,
  MapPin,
  Menu,
  Shield,
  Siren,
  Video,
  X,
} from 'lucide-react'

import { useState } from 'react'
import Link from 'next/link'

const initialAlerts = [
  {
    id: 1,
    title: 'Perimeter Breach',
    description: 'Movement detected inside restricted perimeter.',
    location: 'North Gate',
    camera: 'Camera 01',
    time: '2 min ago',
    severity: 'High',
    status: 'Active',
  },
  {
    id: 2,
    title: 'Crowd Detected',
    description: 'Unusual crowd density detected in monitored area.',
    location: 'Central Lawn',
    camera: 'Camera 02',
    time: '8 min ago',
    severity: 'Medium',
    status: 'Active',
  },
  {
    id: 3,
    title: 'Vehicle in Restricted Zone',
    description: 'Vehicle detected in a restricted access area.',
    location: 'Library Road',
    camera: 'Camera 03',
    time: '14 min ago',
    severity: 'Low',
    status: 'Active',
  },
  {
    id: 4,
    title: 'Unusual Activity',
    description: 'Unusual movement pattern detected.',
    location: 'Hostel Block A',
    camera: 'Camera 04',
    time: '21 min ago',
    severity: 'Medium',
    status: 'Resolved',
  },
  {
    id: 5,
    title: 'Restricted Area Entry',
    description: 'Person detected entering restricted zone.',
    location: 'Engineering Block',
    camera: 'Camera 05',
    time: '32 min ago',
    severity: 'High',
    status: 'Resolved',
  },
]

export default function AlertsPage() {
  const [mobileMenu, setMobileMenu] = useState(false)
  const [alerts, setAlerts] = useState(initialAlerts)
  const [filter, setFilter] = useState('All')

  const filteredAlerts =
    filter === 'All'
      ? alerts
      : alerts.filter((alert) => alert.severity === filter)

  function acknowledgeAlert(id) {
    setAlerts((current) =>
      current.map((alert) =>
        alert.id === id
          ? { ...alert, status: 'Resolved' }
          : alert
      )
    )
  }

  const activeCount = alerts.filter(
    (alert) => alert.status === 'Active'
  ).length

  const highCount = alerts.filter(
    (alert) => alert.severity === 'High' && alert.status === 'Active'
  ).length

  return (
    <div className="min-h-screen bg-muted/30 text-foreground">

      {/* Mobile overlay */}
      {mobileMenu && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setMobileMenu(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 border-r bg-card transition-transform ${
          mobileMenu
            ? 'translate-x-0'
            : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="flex h-full flex-col">

          <div className="flex h-20 items-center gap-3 border-b px-6">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Shield className="size-5" />
            </div>

            <div>
              <h1 className="font-bold">NMSight</h1>
              <p className="text-xs text-muted-foreground">
                Security Operations
              </p>
            </div>

            <button
              className="ml-auto lg:hidden"
              onClick={() => setMobileMenu(false)}
            >
              <X className="size-5" />
            </button>
          </div>

          <nav className="flex-1 space-y-1 p-4">

            <NavItem
              href="/security/dashboard"
              icon={<LayoutDashboard className="size-4" />}
              label="Dashboard"
            />

            {/* <NavItem
              href="/security/live-monitor"
              icon={<Video className="size-4" />}
              label="Live Monitor"
            /> */}

            <NavItem
              href="/security/alerts"
              icon={<Bell className="size-4" />}
              label="Alerts"
              badge={activeCount}
              active
            />

            <NavItem
              href="/security/incidents"
              icon={<Siren className="size-4" />}
              label="Incidents"
            />

            {/* <NavItem
              href="/security/cameras"
              icon={<Camera className="size-4" />}
              label="Cameras"
            /> */}

            <NavItem
              href="/security/campus-zones"
              icon={<MapPin className="size-4" />}
              label="Campus Zones"
            />

          </nav>

          <div className="border-t p-4">
            <div className="flex items-center gap-3 rounded-xl bg-muted/60 p-3">
              <div className="flex size-9 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                S
              </div>

              <div>
                <p className="text-sm font-medium">
                  Security Officer
                </p>

                <p className="text-xs text-muted-foreground">
                  security@nmsight.com
                </p>
              </div>
            </div>
          </div>

        </div>
      </aside>

      {/* Main */}
      <main className="lg:pl-64">

        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b bg-background/95 px-4 backdrop-blur sm:px-6">

          <div className="flex items-center gap-3">

            <button
              className="rounded-lg p-2 hover:bg-muted lg:hidden"
              onClick={() => setMobileMenu(true)}
            >
              <Menu className="size-5" />
            </button>

            <div>
              <h2 className="font-semibold">
                Alerts
              </h2>

              <p className="text-xs text-muted-foreground sm:text-sm">
                Monitor and manage security alerts
              </p>
            </div>

          </div>

          <button className="relative rounded-xl border bg-card p-2.5 hover:bg-muted">
            <Bell className="size-5" />

            {activeCount > 0 && (
              <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-red-500 text-[9px] text-white">
                {activeCount}
              </span>
            )}
          </button>

        </header>

        <div className="p-4 sm:p-6">

          {/* Heading */}
          <div className="mb-6">
            <p className="text-xs font-semibold tracking-wider text-primary">
              SECURITY MONITORING
            </p>

            <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
              Security Alerts
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Review, investigate and acknowledge detected security events.
            </p>
          </div>

          {/* Stats */}
          <div className="grid gap-4 sm:grid-cols-3">

            <StatCard
              icon={<Bell className="size-5" />}
              title="Active Alerts"
              value={activeCount}
              description="Currently unresolved"
            />

            <StatCard
              icon={<AlertTriangle className="size-5" />}
              title="High Priority"
              value={highCount}
              description="Requires immediate attention"
            />

            <StatCard
              icon={<CheckCircle2 className="size-5" />}
              title="Resolved Today"
              value="12"
              description="Successfully handled"
            />

          </div>

          {/* Alert list */}
          <section className="mt-6 overflow-hidden rounded-2xl border bg-card shadow-sm">

            <div className="flex flex-col gap-4 border-b p-5 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <h2 className="font-semibold">
                  Alert Feed
                </h2>

                <p className="text-sm text-muted-foreground">
                  Latest events detected by NMSight
                </p>
              </div>

              <div className="flex items-center gap-2">

                <Filter className="size-4 text-muted-foreground" />

                {['All', 'High', 'Medium', 'Low'].map((item) => (
                  <button
                    key={item}
                    onClick={() => setFilter(item)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                      filter === item
                        ? 'bg-primary text-primary-foreground'
                        : 'border hover:bg-muted'
                    }`}
                  >
                    {item}
                  </button>
                ))}

              </div>

            </div>

            <div className="divide-y">

              {filteredAlerts.map((alert) => (

                <div
                  key={alert.id}
                  className="p-5 transition-colors hover:bg-muted/30"
                >

                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center">

                    {/* Icon */}
                    <div
                      className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${
                        alert.status === 'Resolved'
                          ? 'bg-green-500/10 text-green-600'
                          : alert.severity === 'High'
                          ? 'bg-red-500/10 text-red-600'
                          : alert.severity === 'Medium'
                          ? 'bg-yellow-500/10 text-yellow-600'
                          : 'bg-blue-500/10 text-blue-600'
                      }`}
                    >
                      {alert.status === 'Resolved' ? (
                        <CheckCircle2 className="size-5" />
                      ) : (
                        <AlertTriangle className="size-5" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1">

                      <div className="flex flex-wrap items-center gap-2">

                        <h3 className="font-semibold">
                          {alert.title}
                        </h3>

                        <span
                          className={`rounded-full px-2 py-1 text-[10px] font-semibold ${severityClass(
                            alert.severity
                          )}`}
                        >
                          {alert.severity}
                        </span>

                        <span
                          className={`rounded-full px-2 py-1 text-[10px] font-semibold ${
                            alert.status === 'Active'
                              ? 'bg-red-500/10 text-red-600'
                              : 'bg-green-500/10 text-green-600'
                          }`}
                        >
                          {alert.status}
                        </span>

                      </div>

                      <p className="mt-1 text-sm text-muted-foreground">
                        {alert.description}
                      </p>

                      <div className="mt-2 flex flex-wrap gap-4 text-xs text-muted-foreground">

                        <span className="flex items-center gap-1">
                          <MapPin className="size-3" />
                          {alert.location}
                        </span>

                        <span className="flex items-center gap-1">
                          <Camera className="size-3" />
                          {alert.camera}
                        </span>

                        <span className="flex items-center gap-1">
                          <Clock3 className="size-3" />
                          {alert.time}
                        </span>

                      </div>

                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">

                      {alert.status === 'Active' && (
                        <button
                          onClick={() =>
                            acknowledgeAlert(alert.id)
                          }
                          className="rounded-lg border px-3 py-2 text-xs font-medium hover:bg-muted"
                        >
                          Acknowledge
                        </button>
                      )}

                      <button className="rounded-lg bg-primary p-2 text-primary-foreground hover:bg-primary/90">
                        <ChevronRight className="size-4" />
                      </button>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          </section>

        </div>

      </main>

    </div>
  )
}

function NavItem({
  href,
  icon,
  label,
  active,
  badge,
}) {
  return (
    <Link
      href={href}
      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
        active
          ? 'bg-primary/10 font-medium text-primary'
          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
      }`}
    >
      {icon}

      <span className="flex-1">
        {label}
      </span>

      {badge !== undefined && (
        <span className="rounded-full bg-red-500/10 px-2 py-0.5 text-xs text-red-600">
          {badge}
        </span>
      )}
    </Link>
  )
}

function StatCard({
  icon,
  title,
  value,
  description,
}) {
  return (
    <div className="rounded-2xl border bg-card p-5 shadow-sm">

      <div className="flex items-center justify-between">

        <div className="rounded-xl bg-primary/10 p-2.5 text-primary">
          {icon}
        </div>

        <span className="size-2 rounded-full bg-green-500" />

      </div>

      <p className="mt-4 text-sm text-muted-foreground">
        {title}
      </p>

      <p className="mt-1 text-2xl font-bold">
        {value}
      </p>

      <p className="mt-1 text-xs text-muted-foreground">
        {description}
      </p>

    </div>
  )
}

function severityClass(severity) {
  if (severity === 'High') {
    return 'bg-red-500/10 text-red-600'
  }

  if (severity === 'Medium') {
    return 'bg-yellow-500/10 text-yellow-600'
  }

  return 'bg-blue-500/10 text-blue-600'
}