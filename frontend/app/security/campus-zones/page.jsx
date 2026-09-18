'use client'

import {
  AlertTriangle,
  Bell,
  Camera,
  CheckCircle2,
  ChevronRight,
  LayoutDashboard,
  MapPin,
  Menu,
  Shield,
  Siren,
  Users,
  Video,
  X,
} from 'lucide-react'

import { useState } from 'react'
import Link from 'next/link'

const zones = [
  {
    id: 1,
    name: 'North Gate',
    description: 'Main campus entrance',
    cameras: 2,
    people: 6,
    status: 'Alert',
    security: 'High',
  },
  {
    id: 2,
    name: 'Central Lawn',
    description: 'Central student activity area',
    cameras: 3,
    people: 9,
    status: 'Normal',
    security: 'Medium',
  },
  {
    id: 3,
    name: 'Library Road',
    description: 'East campus access road',
    cameras: 2,
    people: 4,
    status: 'Normal',
    security: 'Medium',
  },
  {
    id: 4,
    name: 'Hostel Block A',
    description: 'Residential area',
    cameras: 4,
    people: 18,
    status: 'Normal',
    security: 'High',
  },
  {
    id: 5,
    name: 'Engineering Block',
    description: 'Academic and laboratory area',
    cameras: 3,
    people: 12,
    status: 'Normal',
    security: 'High',
  },
  {
    id: 6,
    name: 'Parking Area',
    description: 'Main campus parking',
    cameras: 2,
    people: 7,
    status: 'Normal',
    security: 'Low',
  },
]

export default function CampusZonesPage() {
  const [mobileMenu, setMobileMenu] = useState(false)
  const [selectedZone, setSelectedZone] = useState(null)

  const alertZones = zones.filter(
    (zone) => zone.status === 'Alert'
  ).length

  const totalCameras = zones.reduce(
    (sum, zone) => sum + zone.cameras,
    0
  )

  const totalPeople = zones.reduce(
    (sum, zone) => sum + zone.people,
    0
  )

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
              <h1 className="font-bold">
                NMSight
              </h1>

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
              badge="3"
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
              active
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
                Campus Zones
              </h2>

              <p className="text-xs text-muted-foreground sm:text-sm">
                Monitor security status by campus area
              </p>
            </div>

          </div>

          <button className="relative rounded-xl border bg-card p-2.5 hover:bg-muted">
            <Bell className="size-5" />
          </button>

        </header>

        <div className="p-4 sm:p-6">

          {/* Heading */}
          <div className="mb-6">

            <p className="text-xs font-semibold tracking-wider text-primary">
              CAMPUS MONITORING
            </p>

            <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
              Campus Zones
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              View security conditions and activity across monitored areas.
            </p>

          </div>

          {/* Stats */}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

            <Stat
              icon={<MapPin className="size-5" />}
              label="Monitored Zones"
              value={zones.length}
              description="Campus areas"
            />

            <Stat
              icon={<Camera className="size-5" />}
              label="Active Cameras"
              value={totalCameras}
              description="Across all zones"
            />

            <Stat
              icon={<Users className="size-5" />}
              label="People Detected"
              value={totalPeople}
              description="Currently monitored"
            />

            <Stat
              icon={<AlertTriangle className="size-5" />}
              label="Zones With Alerts"
              value={alertZones}
              description="Require attention"
            />

          </div>

          {/* Dummy campus map */}
          <section className="mt-6 overflow-hidden rounded-2xl border bg-card shadow-sm">

            <div className="border-b p-5">

              <h2 className="font-semibold">
                Campus Map
              </h2>

              <p className="text-sm text-muted-foreground">
                Real-time zone overview
              </p>

            </div>

            <div className="relative m-5 h-[380px] overflow-hidden rounded-xl bg-muted/70">

              {/* Dummy roads */}
              <div className="absolute left-1/2 top-0 h-full w-20 -translate-x-1/2 bg-background/70" />

              <div className="absolute left-0 top-1/2 h-20 w-full -translate-y-1/2 bg-background/70" />

              <div className="absolute inset-10 rounded-3xl border-2 border-dashed border-muted-foreground/20" />

              {/* Zone pins */}
              <ZonePin
                label="North Gate"
                position="left-[15%] top-[15%]"
                alert
              />

              <ZonePin
                label="Library Road"
                position="right-[18%] top-[18%]"
              />

              <ZonePin
                label="Central Lawn"
                position="left-[38%] top-[48%]"
              />

              <ZonePin
                label="Engineering"
                position="right-[28%] top-[52%]"
              />

              <ZonePin
                label="Hostel Block A"
                position="left-[20%] bottom-[15%]"
              />

              <ZonePin
                label="Parking"
                position="right-[15%] bottom-[14%]"
              />

              {/* Legend */}
              <div className="absolute bottom-4 left-4 rounded-lg border bg-card px-4 py-3 shadow-sm">

                <p className="mb-2 text-xs font-semibold">
                  Zone Status
                </p>

                <div className="flex gap-4 text-xs">

                  <span className="flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-green-500" />
                    Normal
                  </span>

                  <span className="flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-red-500" />
                    Alert
                  </span>

                </div>

              </div>

            </div>

          </section>

          {/* Zone cards */}
          <section className="mt-6">

            <div className="mb-4">

              <h2 className="font-semibold">
                Monitored Areas
              </h2>

              <p className="text-sm text-muted-foreground">
                Select a zone to view its monitoring details.
              </p>

            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">

              {zones.map((zone) => (

                <button
                  key={zone.id}
                  onClick={() => setSelectedZone(zone)}
                  className="text-left"
                >

                  <div className="rounded-2xl border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">

                    <div className="flex items-start justify-between">

                      <div
                        className={`flex size-11 items-center justify-center rounded-xl ${
                          zone.status === 'Alert'
                            ? 'bg-red-500/10 text-red-600'
                            : 'bg-green-500/10 text-green-600'
                        }`}
                      >
                        {zone.status === 'Alert' ? (
                          <AlertTriangle className="size-5" />
                        ) : (
                          <CheckCircle2 className="size-5" />
                        )}
                      </div>

                      <span
                        className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                          zone.status === 'Alert'
                            ? 'bg-red-500/10 text-red-600'
                            : 'bg-green-500/10 text-green-600'
                        }`}
                      >
                        {zone.status}
                      </span>

                    </div>

                    <h3 className="mt-4 font-semibold">
                      {zone.name}
                    </h3>

                    <p className="mt-1 text-sm text-muted-foreground">
                      {zone.description}
                    </p>

                    <div className="mt-4 grid grid-cols-2 gap-3">

                      <div className="rounded-xl bg-muted/60 p-3">

                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Camera className="size-4" />
                          <span className="text-xs">
                            Cameras
                          </span>
                        </div>

                        <p className="mt-1 text-lg font-semibold">
                          {zone.cameras}
                        </p>

                      </div>

                      <div className="rounded-xl bg-muted/60 p-3">

                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Users className="size-4" />
                          <span className="text-xs">
                            People
                          </span>
                        </div>

                        <p className="mt-1 text-lg font-semibold">
                          {zone.people}
                        </p>

                      </div>

                    </div>

                    <div className="mt-4 flex items-center justify-between">

                      <span className="text-xs text-muted-foreground">
                        Security level: {zone.security}
                      </span>

                      <ChevronRight className="size-4 text-muted-foreground" />

                    </div>

                  </div>

                </button>

              ))}

            </div>

          </section>

          {/* Selected zone */}
          {selectedZone && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

              <div className="w-full max-w-md rounded-2xl border bg-card p-6 shadow-xl">

                <div className="flex items-start justify-between">

                  <div>
                    <p className="text-xs font-semibold text-primary">
                      ZONE DETAILS
                    </p>

                    <h2 className="mt-1 text-xl font-bold">
                      {selectedZone.name}
                    </h2>
                  </div>

                  <button
                    onClick={() => setSelectedZone(null)}
                    className="rounded-lg p-2 hover:bg-muted"
                  >
                    <X className="size-5" />
                  </button>

                </div>

                <p className="mt-4 text-sm text-muted-foreground">
                  {selectedZone.description}
                </p>

                <div className="mt-5 grid grid-cols-2 gap-3">

                  <Detail
                    label="Status"
                    value={selectedZone.status}
                  />

                  <Detail
                    label="Security"
                    value={selectedZone.security}
                  />

                  <Detail
                    label="Cameras"
                    value={selectedZone.cameras}
                  />

                  <Detail
                    label="People"
                    value={selectedZone.people}
                  />

                </div>

                <button
                  onClick={() => setSelectedZone(null)}
                  className="mt-6 w-full rounded-xl bg-primary py-2.5 text-sm font-medium text-primary-foreground"
                >
                  Close
                </button>

              </div>

            </div>
          )}

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

function Stat({
  icon,
  label,
  value,
  description,
}) {
  return (
    <div className="rounded-2xl border bg-card p-5 shadow-sm">

      <div className="rounded-xl bg-primary/10 p-2.5 text-primary w-fit">
        {icon}
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

function ZonePin({
  label,
  position,
  alert,
}) {
  return (
    <div className={`absolute ${position}`}>

      <div className="flex flex-col items-center">

        <div
          className={`flex size-10 items-center justify-center rounded-full border-4 border-background shadow-lg ${
            alert
              ? 'bg-red-500'
              : 'bg-green-500'
          }`}
        >
          <MapPin className="size-4 text-white" />
        </div>

        <span className="mt-1 whitespace-nowrap rounded-md bg-card px-2 py-1 text-[10px] font-medium shadow">
          {label}
        </span>

      </div>

    </div>
  )
}

function Detail({
  label,
  value,
}) {
  return (
    <div className="rounded-xl bg-muted/60 p-3">

      <p className="text-xs text-muted-foreground">
        {label}
      </p>

      <p className="mt-1 font-semibold">
        {value}
      </p>

    </div>
  )
}