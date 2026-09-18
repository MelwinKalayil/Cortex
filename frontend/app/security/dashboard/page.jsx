'use client'
import { useEffect, useState } from 'react'
import { getCurrentUser } from '@/lib/auth'

import {
  AlertTriangle,
  Bell,
  Camera,
  CheckCircle2,
  ChevronRight,
  Circle,
  Clock3,
  LayoutDashboard,
  MapPin,
  Menu,
  Shield,
  Siren,
  Users,
  Video,
  X,
} from 'lucide-react'
import Link from 'next/link'


import dynamic from 'next/dynamic'


const CampusAlertMap = dynamic(
  () => import('@/components/campus-alert-map'),
  {
    ssr: false,
  }
)
const alerts = [
  {
    id: 1,
    type: 'Perimeter Breach',
    location: 'North Gate',
    time: '2 min ago',
    severity: 'High',
  },
  {
    id: 2,
    type: 'Crowd Detected',
    location: 'Central Lawn',
    time: '8 min ago',
    severity: 'Medium',
  },
  {
    id: 3,
    type: 'Vehicle in Restricted Zone',
    location: 'Library Road',
    time: '14 min ago',
    severity: 'Low',
  },
]

const cameras = [
  {
    name: 'North Gate',
    location: 'Main Entrance',
    status: 'Live',
    people: 4,
  },
  {
    name: 'Central Lawn',
    location: 'Zone B',
    status: 'Live',
    people: 9,
  },
  {
    name: 'Library Road',
    location: 'East Campus',
    status: 'Live',
    people: 4,
  },
]

function severityClass(severity) {
  if (severity === 'High') {
    return 'bg-red-500/10 text-red-600'
  }

  if (severity === 'Medium') {
    return 'bg-yellow-500/10 text-yellow-600'
  }

  return 'bg-blue-500/10 text-blue-600'
}

export default function SecurityDashboard() {
  const [mobileMenu, setMobileMenu] = useState(false)
  const [alertList, setAlertList] = useState(alerts)
const [currentUser, setCurrentUser] = useState(null)

useEffect(() => {
  const user = getCurrentUser()
  setCurrentUser(user)
}, [])
  function acknowledgeAlert(id) {
    setAlertList((current) =>
      current.filter((alert) => alert.id !== id)
    )
  }

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
        className={`fixed inset-y-0 left-0 z-50 w-64 border-r bg-card transition-transform duration-200 ${
          mobileMenu
            ? 'translate-x-0'
            : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="flex h-full flex-col">

          {/* Logo */}
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

  <Link
    href="/security/dashboard"
    className="flex w-full items-center gap-3 rounded-xl bg-primary/10 px-3 py-2.5 text-sm font-medium text-primary"
  >
    <LayoutDashboard className="size-4" />
    <span>Dashboard</span>
  </Link>

  <Link
    href="/security/alerts"
    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
  >
    <Bell className="size-4" />
    <span className="flex-1">Alerts</span>

    <span className="rounded-full bg-red-500/10 px-2 py-0.5 text-xs text-red-600">
      {alertList?.length || 3}
    </span>
  </Link>

  <Link
    href="/security/campus-zones"
    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
  >
    <MapPin className="size-4" />
    <span>Campus Zones</span>
  </Link>

</nav>
          {/* User */}
          <div className="border-t p-4">
            <div className="flex items-center gap-3 rounded-xl bg-muted/60 p-3">
              <div className="flex size-9 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                S
              </div>

              <div className="min-w-0">
                <p className="text-sm font-medium">
                     {currentUser?.name || 'Security Officer'}
                </p>

                <p className="text-xs text-muted-foreground">
                    {currentUser?.email || 'security@nmsight.com'}
                </p>
              </div>
            </div>
          </div>

        </div>
      </aside>

      {/* Main content */}
      <main className="lg:pl-64">

        {/* Top bar */}
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
                Security Dashboard
              </h2>

              <p className="text-xs text-muted-foreground sm:text-sm">
                Real-time campus safety monitoring
              </p>
            </div>

          </div>

          <button className="relative rounded-xl border bg-card p-2.5 hover:bg-muted">

            <Bell className="size-5" />

            {alertList.length > 0 && (
              <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-red-500 text-[9px] text-white">
                {alertList.length}
              </span>
            )}

          </button>

        </header>

        <div className="p-4 sm:p-6">

          {/* Welcome */}
          <div className="mb-6">
            <p className="text-xs font-semibold tracking-wider text-primary">
              LIVE OPERATIONS
            </p>

            <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
              Good afternoon, Security
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Here's the current safety status across campus.
            </p>
          </div>

          {/* Statistics */}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

            <StatCard
              icon={<AlertTriangle className="size-5" />}
              label="Active Alerts"
              value={alertList.length}
              description="Currently requiring attention"
            />

            <StatCard
              icon={<Siren className="size-5" />}
              label="High Priority"
              value="01"
              description="Requires immediate response"
            />

            <StatCard
              icon={<Users className="size-5" />}
              label="People Detected"
              value="17"
              description="Across monitored zones"
            />

            <StatCard
              icon={<Camera className="size-5" />}
              label="Cameras Online"
              value="03 / 03"
              description="All devices operational"
            />

          </div>

          {/* Map + Alerts */}
          <div className="mt-6 grid gap-6 xl:grid-cols-[1.5fr_1fr]">

            {/* Campus Map */}
            {/* Campus Alert Map */}
<section className="mt-6 overflow-hidden rounded-2xl border bg-card shadow-sm">

  <div className="flex flex-col gap-3 border-b p-5 sm:flex-row sm:items-center sm:justify-between">

    <div>
      <h2 className="font-semibold">
        VIT Vellore Campus
      </h2>

      <p className="text-sm text-muted-foreground">
        Real-time security alerts and incident locations
      </p>
    </div>

    <div className="flex items-center gap-2">

      <span className="size-2 rounded-full bg-green-500" />

      <span className="text-xs font-medium text-green-600">
        Monitoring Active
      </span>

    </div>

  </div>

  <div className="p-5">
    <CampusAlertMap />
  </div>

</section>

            {/* Alerts */}
            <section className="overflow-hidden rounded-2xl border bg-card shadow-sm">

              <div className="flex items-center justify-between border-b p-5">

                <div>
                  <h2 className="font-semibold">
                    Active Alerts
                  </h2>

                  <p className="text-sm text-muted-foreground">
                    Security attention required
                  </p>
                </div>

                <span className="rounded-full bg-red-500/10 px-2.5 py-1 text-xs font-medium text-red-600">
                  {alertList.length} active
                </span>

              </div>

              <div className="divide-y">

                {alertList.length === 0 ? (

                  <div className="flex flex-col items-center justify-center p-12 text-center">

                    <CheckCircle2 className="size-10 text-green-500" />

                    <p className="mt-3 font-medium">
                      Campus is clear
                    </p>

                    <p className="mt-1 text-sm text-muted-foreground">
                      No active alerts at the moment.
                    </p>

                  </div>

                ) : (

                  alertList.map((alert) => (

                    <div
                      key={alert.id}
                      className="p-4"
                    >

                      <div className="flex gap-3">

                        <div className="mt-1.5">
                          <span
                            className={`block size-2.5 rounded-full ${
                              alert.severity === 'High'
                                ? 'bg-red-500'
                                : alert.severity === 'Medium'
                                ? 'bg-yellow-500'
                                : 'bg-blue-500'
                            }`}
                          />
                        </div>

                        <div className="min-w-0 flex-1">

                          <div className="flex items-start justify-between gap-2">

                            <div>
                              <p className="text-sm font-semibold">
                                {alert.type}
                              </p>

                              <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                                <MapPin className="size-3" />
                                {alert.location}
                              </p>
                            </div>

                            <span className="whitespace-nowrap text-xs text-muted-foreground">
                              {alert.time}
                            </span>

                          </div>

                          <div className="mt-3 flex items-center justify-between">

                            <span
                              className={`rounded-full px-2 py-1 text-[10px] font-semibold ${severityClass(
                                alert.severity
                              )}`}
                            >
                              {alert.severity}
                            </span>

                            <button
                              onClick={() =>
                                acknowledgeAlert(alert.id)
                              }
                              className="rounded-lg border px-3 py-1.5 text-xs font-medium hover:bg-muted"
                            >
                              Acknowledge
                            </button>

                          </div>

                        </div>

                      </div>

                    </div>

                  ))

                )}

              </div>

            </section>

          </div>

          {/* Live Cameras */}
          <section className="mt-6 overflow-hidden rounded-2xl border bg-card shadow-sm">

            <div className="flex items-center justify-between border-b p-5">

              <div>
                <h2 className="font-semibold">
                  Live Camera Feeds
                </h2>

                <p className="text-sm text-muted-foreground">
                  Connected NMSight edge devices
                </p>
              </div>

              <span className="flex items-center gap-2 text-xs font-medium text-green-600">
                <span className="size-2 rounded-full bg-green-500" />
                System Online
              </span>

            </div>

            <div className="grid gap-4 p-5 md:grid-cols-2 xl:grid-cols-3">

              {cameras.map((camera) => (

                <div
                  key={camera.name}
                  className="overflow-hidden rounded-xl border"
                >

                  {/* Video placeholder */}
                  <div className="relative flex aspect-video items-center justify-center bg-muted">

                    <Camera className="size-10 text-muted-foreground/30" />

                    <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-md bg-black/60 px-2 py-1 text-xs text-white">

                      <span className="size-1.5 rounded-full bg-red-500" />

                      LIVE

                    </div>

                    <div className="absolute right-3 top-3 rounded-md bg-black/60 px-2 py-1 text-xs text-white">
                      AI ACTIVE
                    </div>

                    <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-md bg-black/60 px-2 py-1 text-xs text-white">
                      <Users className="size-3" />
                      {camera.people} detected
                    </div>

                  </div>

                  <div className="flex items-center justify-between p-3">

                    <div>
                      <p className="text-sm font-semibold">
                        {camera.name}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        {camera.location}
                      </p>
                    </div>

                    <button className="rounded-lg border p-2 hover:bg-muted">
                      <ChevronRight className="size-4" />
                    </button>

                  </div>

                </div>

              ))}

            </div>

          </section>

          {/* Recent Activity */}
          <section className="mt-6 overflow-hidden rounded-2xl border bg-card shadow-sm">

            <div className="border-b p-5">

              <h2 className="font-semibold">
                Recent Security Activity
              </h2>

              <p className="text-sm text-muted-foreground">
                Latest events detected by NMSight
              </p>

            </div>

            <div className="divide-y">

              <Activity
                icon={<AlertTriangle className="size-4" />}
                title="Perimeter breach detected"
                location="North Gate"
                time="14:32"
                status="Active"
              />

              <Activity
                icon={<Users className="size-4" />}
                title="Crowd detected"
                location="Central Lawn"
                time="14:18"
                status="Resolved"
              />

              <Activity
                icon={<Camera className="size-4" />}
                title="Vehicle entered restricted zone"
                location="Library Road"
                time="13:51"
                status="Investigating"
              />

              <Activity
                icon={<CheckCircle2 className="size-4" />}
                title="Security patrol completed"
                location="Hostel Block A"
                time="13:20"
                status="Completed"
              />

            </div>

          </section>

        </div>

      </main>

    </div>
  )
}

/* ---------------- Components ---------------- */

function NavItem({ icon, label, active, badge }) {
  return (
    <button
      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
        active
          ? 'bg-primary/10 font-medium text-primary'
          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
      }`}
    >
      {icon}

      <span className="flex-1 text-left">
        {label}
      </span>

      {badge !== undefined && (
        <span className="rounded-full bg-red-500/10 px-2 py-0.5 text-xs text-red-600">
          {badge}
        </span>
      )}
    </button>
  )
}

function StatCard({
  icon,
  label,
  value,
  description,
}) {
  return (
    <div className="rounded-2xl border bg-card p-5 shadow-sm">

      <div className="flex items-center justify-between">

        <div className="rounded-xl bg-primary/10 p-2.5 text-primary">
          {icon}
        </div>

        <span className="flex items-center gap-1 text-xs font-medium text-green-600">
          <Circle className="size-2 fill-current" />
          Live
        </span>

      </div>

      <p className="mt-4 text-sm text-muted-foreground">
        {label}
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

function CameraPin({
  label,
  position,
  alert,
}) {
  return (
    <div className={`absolute ${position}`}>

      <div className="flex flex-col items-center">

        <div
          className={`flex size-9 items-center justify-center rounded-full border-4 border-background shadow-lg ${
            alert
              ? 'bg-red-500'
              : 'bg-green-500'
          }`}
        >
          <Camera className="size-4 text-white" />
        </div>

        <span className="mt-1 whitespace-nowrap rounded-md bg-card px-2 py-1 text-[10px] font-medium shadow">
          {label}
        </span>

      </div>

    </div>
  )
}

function Activity({
  icon,
  title,
  location,
  time,
  status,
}) {
  return (
    <div className="flex items-center gap-4 p-4">

      <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
        {icon}
      </div>

      <div className="min-w-0 flex-1">

        <p className="truncate text-sm font-medium">
          {title}
        </p>

        <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="size-3" />
          {location}
        </p>

      </div>

      <div className="hidden text-right sm:block">

        <p className="flex items-center justify-end gap-1 text-xs text-muted-foreground">
          <Clock3 className="size-3" />
          {time}
        </p>

        <p
          className={`mt-1 text-xs font-medium ${
            status === 'Active'
              ? 'text-red-600'
              : status === 'Resolved'
              ? 'text-green-600'
              : status === 'Investigating'
              ? 'text-yellow-600'
              : 'text-muted-foreground'
          }`}
        >
          {status}
        </p>

      </div>

    </div>
  )
}