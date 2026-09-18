// 'use client'

// import {
//   CircleMarker,
//   MapContainer,
//   Popup,
//   TileLayer,
//   useMap,
// } from 'react-leaflet'

// import 'leaflet/dist/leaflet.css'

// const vitCenter = [12.9692, 79.1560]

// const alerts = [
//   {
//     id: 1,
//     title: 'Perimeter Breach',
//     location: 'North Gate',
//     latitude: 12.9711,
//     longitude: 79.1641,
//     severity: 'High',
//     time: '2 min ago',
//   },
//   {
//     id: 2,
//     title: 'Crowd Detected',
//     location: 'Central Lawn',
//     latitude: 12.9698,
//     longitude: 79.1578,
//     severity: 'Medium',
//     time: '8 min ago',
//   },
//   {
//     id: 3,
//     title: 'Vehicle in Restricted Zone',
//     location: 'Library Road',
//     latitude: 12.9706,
//     longitude: 79.1600,
//     severity: 'Low',
//     time: '14 min ago',
//   },
// ]

// function MapResize() {
//   const map = useMap()

//   setTimeout(() => {
//     map.invalidateSize()
//   }, 100)

//   return null
// }

// export default function CampusAlertMap() {
//   return (
//     <div className="relative h-[500px] w-full overflow-hidden rounded-xl">

//       <MapContainer
//         center={vitCenter}
//         zoom={16}
//         scrollWheelZoom={true}
//         className="h-full w-full"
//       >

//         <TileLayer
//           attribution='&copy; OpenStreetMap contributors'
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//         />

//         <MapResize />

//         {alerts.map((alert) => (

//           <CircleMarker
//             key={alert.id}
//             center={[
//               alert.latitude,
//               alert.longitude,
//             ]}
//             radius={12}
//             pathOptions={{
//               color: '#ffffff',
//               weight: 3,
//               fillColor:
//                 alert.severity === 'High'
//                   ? '#ef4444'
//                   : alert.severity === 'Medium'
//                   ? '#f59e0b'
//                   : '#3b82f6',
//               fillOpacity: 0.95,
//             }}
//           >

//             <Popup>

//               <div className="min-w-[190px]">

//                 <div className="mb-2 flex items-center justify-between gap-3">

//                   <h3 className="font-semibold">
//                     {alert.title}
//                   </h3>

//                   <span
//                     className={`rounded-full px-2 py-1 text-[10px] font-semibold ${
//                       alert.severity === 'High'
//                         ? 'bg-red-100 text-red-700'
//                         : alert.severity === 'Medium'
//                         ? 'bg-yellow-100 text-yellow-700'
//                         : 'bg-blue-100 text-blue-700'
//                     }`}
//                   >
//                     {alert.severity}
//                   </span>

//                 </div>

//                 <p className="text-sm text-gray-600">
//                   {alert.location}
//                 </p>

//                 <p className="mt-1 text-xs text-gray-500">
//                   Detected {alert.time}
//                 </p>

//                 <div className="mt-3 rounded-lg bg-gray-100 p-2">

//                   <p className="text-[10px] text-gray-500">
//                     Coordinates
//                   </p>

//                   <p className="text-xs font-medium">
//                     {alert.latitude.toFixed(6)}, {alert.longitude.toFixed(6)}
//                   </p>

//                 </div>

//               </div>

//             </Popup>

//           </CircleMarker>

//         ))}

//       </MapContainer>

//       {/* Map legend */}
//       <div className="absolute bottom-4 left-4 z-[1000] rounded-xl border bg-white/95 p-3 shadow-lg">

//         <p className="mb-2 text-xs font-semibold text-gray-900">
//           Alert Severity
//         </p>

//         <div className="space-y-1.5 text-xs">

//           <div className="flex items-center gap-2">
//             <span className="size-2.5 rounded-full bg-red-500" />
//             High
//           </div>

//           <div className="flex items-center gap-2">
//             <span className="size-2.5 rounded-full bg-yellow-500" />
//             Medium
//           </div>

//           <div className="flex items-center gap-2">
//             <span className="size-2.5 rounded-full bg-blue-500" />
//             Low
//           </div>

//         </div>

//       </div>

//       {/* Live indicator */}
//       <div className="absolute right-4 top-4 z-[1000] flex items-center gap-2 rounded-full border bg-white/95 px-3 py-2 text-xs font-medium shadow-lg">

//         <span className="size-2 rounded-full bg-green-500" />

//         Live Monitoring

//       </div>

//     </div>
//   )
// }


'use client'

import { useEffect } from 'react'
import {
  CircleMarker,
  MapContainer,
  Popup,
  TileLayer,
  useMap,
} from 'react-leaflet'
import dynamic from 'next/dynamic'
import 'leaflet/dist/leaflet.css'

const RestrictedZoneLayer = dynamic(
  () => import('@/components/restricted-zone-map'),
  {
    ssr: false,
  }
)
const vitCenter = [12.9692, 79.1560]
const alerts = [
  {
    id: 1,
    title: 'Perimeter Breach',
    location: 'North Gate',
    latitude: 12.9711,
    longitude: 79.1641,
    severity: 'High',
    time: '2 min ago',
    snapshot: '/snapshots/perimeter-breach.jpeg',
  },
  {
    id: 2,
    title: 'Crowd Detected',
    location: 'Central Lawn',
    latitude: 12.9698,
    longitude: 79.1578,
    severity: 'Medium',
    time: '8 min ago',
    snapshot: '/snapshots/crowd-detected.jpeg',
  },
  {
    id: 3,
    title: 'Vehicle in Restricted Zone',
    location: 'Library Road',
    latitude: 12.9706,
    longitude: 79.1600,
    severity: 'Low',
    time: '14 min ago',
    snapshot: '/snapshots/restricted-vehicle.jpeg',
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

function MapResize() {
  const map = useMap()

  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize()
    }, 100)

    return () => clearTimeout(timer)
  }, [map])

  return null
}

export default function CampusAlertMap() {
  return (
    <div className="relative h-[500px] w-full overflow-hidden rounded-xl">

      <MapContainer
        center={vitCenter}
        zoom={16}
        scrollWheelZoom={true}
        className="h-full w-full"
      >

        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapResize />
        <RestrictedZoneLayer />

        {alerts.map((alert) => (
          <CircleMarker
            key={alert.id}
            center={[
              alert.latitude,
              alert.longitude,
            ]}
            radius={12}
            pathOptions={{
              color: '#ffffff',
              weight: 3,
              fillColor:
                alert.severity === 'High'
                  ? '#ef4444'
                  : alert.severity === 'Medium'
                    ? '#f59e0b'
                    : '#3b82f6',
              fillOpacity: 0.95,
            }}
          >
<Popup>
  <div className="w-[240px] text-black">

{console.log(alert)}
    <img
      src={alert.snapshot}
      alt={alert.title}
      className="mb-3 h-[130px] w-full rounded-lg object-cover"
        onError={(e) => {
    e.currentTarget.style.display = 'none'
  }}
    />

    <div className="mb-2 flex items-center justify-between gap-3">

      <h3 className="font-semibold text-black">
        {alert.title}
      </h3>

      <span
        className={`rounded-full px-2 py-1 text-[10px] font-semibold ${
          alert.severity === 'High'
            ? 'bg-red-100 text-red-700'
            : alert.severity === 'Medium'
              ? 'bg-yellow-100 text-yellow-700'
              : 'bg-blue-100 text-blue-700'
        }`}
      >
        {alert.severity}
      </span>

    </div>

    <p className="text-sm text-black">
      {alert.location}
    </p>

    <p className="mt-1 text-xs text-black">
      Detected {alert.time}
    </p>

    <div className="mt-3 rounded-lg bg-gray-100 p-2">

      <p className="text-[10px] text-gray-600">
        Coordinates
      </p>

      <p className="text-xs font-medium text-black">
        {alert.latitude.toFixed(6)}, {alert.longitude.toFixed(6)}
      </p>

    </div>

  </div>
</Popup>
          </CircleMarker>
        ))}

      </MapContainer>

      {/* Alert Severity */}
      <div className="absolute bottom-4 left-4 z-[1000] rounded-xl border border-gray-200 bg-white/95 p-3 text-black shadow-lg">

        <p className="mb-2 text-xs font-semibold text-black">
          Alert Severity
        </p>

        <div className="space-y-1.5 text-xs text-black">

          <div className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-red-500" />
            <span className="text-black">High</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-yellow-500" />
            <span className="text-black">Medium</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-blue-500" />
            <span className="text-black">Low</span>
          </div>

        </div>

      </div>

      {/* Live Monitoring */}
        {/* Live indicator */}
<div className="absolute right-4 top-4 z-[1100] flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-black shadow-lg">

  <span className="size-2 rounded-full bg-green-500" />

  Live Monitoring

</div>

    </div>
  )
}