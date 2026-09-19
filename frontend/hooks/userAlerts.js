// 'use client'
// import { useEffect, useState } from 'react'

// const API_URL = 'http://localhost:8000'

// function normalizeSeverity(severity) {
//   const map = {
//     CRITICAL: 'Critical',
//     HIGH: 'High',
//     MEDIUM: 'Medium',
//     LOW: 'Low',
//   }
//   return map[severity] || severity
// }

// export function useAlerts() {
//   const [alerts, setAlerts] = useState([])

//   useEffect(() => {
//     fetch(`${API_URL}/alerts/recent`)
//       .then((res) => res.json())
//       .then((data) =>
//         setAlerts(
//           data.map((a) => ({
//             id: a.event_id,
//             title: a.event_type,
//             description: `${a.hazard_class || 'Object'} detected in ${a.geofence_tag || 'monitored area'}`,
//             location: a.geofence_tag,
//             camera: 'Camera 01',
//             time: a.detected_at,
//             severity: normalizeSeverity(a.severity),
//             status: a.status || 'Active',
//             latitude: a.latitude,
//             longitude: a.longitude,
//           }))
//         )
//       )
//       .catch((err) => console.error('Failed to load alerts:', err))

//     const ws = new WebSocket('ws://localhost:8000/ws/alerts')

//     ws.onmessage = (event) => {
//       const data = JSON.parse(event.data)
//       const [lat, lng] = data.details.target_coordinates

//       setAlerts((prev) => [
//         {
//           id: data.event_id,
//           title: data.event_type,
//           description: `${data.details.hazard_class} detected in ${data.details.geofence_tag}`,
//           location: data.details.geofence_tag,
//           camera: 'Camera 01',
//           time: 'just now',
//           severity: normalizeSeverity(data.severity),
//           status: 'Active',
//           latitude: lat,
//           longitude: lng,
//           snapshot: data.snapshot_base64
//             ? `data:image/jpeg;base64,${data.snapshot_base64}`
//             : null,
//         },
//         ...prev,
//       ])
//     }

//     ws.onerror = (err) => console.error('WebSocket error:', err)

//     return () => ws.close()
//   }, [])

//   async function acknowledgeAlert(id) {
//     setAlerts((current) =>
//       current.map((alert) =>
//         alert.id === id ? { ...alert, status: 'Resolved' } : alert
//       )
//     )
//     try {
//       await fetch(`${API_URL}/alerts/${id}/status`, {
//         method: 'PATCH',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ status: 'Resolved' }),
//       })
//     } catch (err) {
//       console.error('Failed to update alert status:', err)
//     }
//   }

//   return { alerts, acknowledgeAlert }
// }

'use client'

import { useEffect, useState } from 'react'

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000'

export function userAlerts() {
  const [alerts, setAlerts] = useState([])

  useEffect(() => {
    let websocket

    const loadAlerts = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/alerts/recent`)

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`)
        }

        const data = await response.json()

        const formattedAlerts = data.map((alert) => ({
          id: alert.event_id,
          title: alert.hazard_class || alert.event_type,
          location: alert.geofence_tag || 'Campus',
          severity: alert.severity,
          latitude: Number(alert.latitude),
          longitude: Number(alert.longitude),
          time: alert.detected_at,
          snapshot: null,
        }))

        setAlerts(formattedAlerts)
      } catch (error) {
        console.log('Failed to load alerts:', error)
      }
    }

    loadAlerts()

    try {
      const wsUrl = API_BASE_URL
        .replace('http://', 'ws://')
        .replace('https://', 'wss://')

      websocket = new WebSocket(`${wsUrl}/ws/alerts`)

      websocket.onmessage = (event) => {
        try {
          const alert = JSON.parse(event.data)

          const formattedAlert = {
            id: alert.event_id,
            title:
              alert.details?.hazard_class ||
              alert.event_type ||
              'Security Alert',
            location:
              alert.details?.geofence_tag ||
              'Campus',
            severity: alert.severity,
            latitude: Number(
              alert.details?.target_coordinates?.[0]
            ),
            longitude: Number(
              alert.details?.target_coordinates?.[1]
            ),
            time: alert.timestamp,
            snapshot:
              alert.details?.snapshot || null,
          }

          if (
            Number.isFinite(formattedAlert.latitude) &&
            Number.isFinite(formattedAlert.longitude)
          ) {
            setAlerts((currentAlerts) => {
              const alreadyExists = currentAlerts.some(
                (item) => item.id === formattedAlert.id
              )

              if (alreadyExists) {
                return currentAlerts
              }

              return [
                formattedAlert,
                ...currentAlerts,
              ].slice(0, 50)
            })
          }
        } catch (error) {
          console.error(
            'Invalid WebSocket alert:',
            error
          )
        }
      }

      websocket.onerror = (error) => {
        console.log('WebSocket error:', error)
      }
    } catch (error) {
      console.error(
        'WebSocket connection failed:',
        error
      )
    }

    return () => {
      if (websocket) {
        websocket.close()
      }
    }
  }, [])

  return { alerts }
}