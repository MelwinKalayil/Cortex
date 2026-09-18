'use client'

import { useEffect, useState } from 'react'
import { FeatureGroup, Polygon, Popup } from 'react-leaflet'
import { EditControl } from 'react-leaflet-draw'

import { predefinedRestrictedZones } from './predefinedRestrictedZones'

import 'leaflet-draw/dist/leaflet.draw.css'

const STORAGE_KEY = 'nmsight-restricted-zones'

function getCoordinates(layer) {
  const latLngs = layer.getLatLngs()

  if (!latLngs || !latLngs.length) {
    return []
  }

  return latLngs[0].map((point) => [
    point.lat,
    point.lng,
  ])
}

export default function RestrictedZoneLayer() {
  const [zones, setZones] = useState([])
  const [loaded, setLoaded] = useState(false)

  // Load manually-created zones
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)

    if (saved) {
      try {
        setZones(JSON.parse(saved))
      } catch (error) {
        console.error('Could not load restricted zones', error)
      }
    }

    setLoaded(true)
  }, [])

  // Save manually-created zones
  useEffect(() => {
    if (!loaded) return

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(zones)
    )
  }, [zones, loaded])

  function handleCreated(event) {
    const layer = event.layer

    const name = window.prompt(
      'Enter restricted area name:'
    )

    if (!name || !name.trim()) {
      return
    }

    const newZone = {
      id: Date.now(),
      name: name.trim(),
      coordinates: getCoordinates(layer),
    }

    layer.options.zoneId = newZone.id

    setZones((current) => [
      ...current,
      newZone,
    ])
  }

  function handleEdited(event) {
    const editedLayers = event.layers

    setZones((currentZones) =>
      currentZones.map((zone) => {
        let updatedZone = zone

        editedLayers.eachLayer((layer) => {
          if (layer.options.zoneId === zone.id) {
            updatedZone = {
              ...zone,
              coordinates: getCoordinates(layer),
            }
          }
        })

        return updatedZone
      })
    )
  }

  function handleDeleted(event) {
    const deletedIds = []

    event.layers.eachLayer((layer) => {
      if (layer.options.zoneId) {
        deletedIds.push(layer.options.zoneId)
      }
    })

    setZones((currentZones) =>
      currentZones.filter(
        (zone) => !deletedIds.includes(zone.id)
      )
    )
  }

  return (
    <FeatureGroup>

      {/* ============================= */}
      {/* PREDEFINED VIT RESTRICTED ZONES */}
      {/* ============================= */}

      {predefinedRestrictedZones.map((zone) => (
        <Polygon
          key={zone.id}
          positions={zone.coordinates}
          pathOptions={{
            color: '#7f1d1d',
            weight: 2,
            fillColor: '#ef4444',
            fillOpacity: 0.22,
          }}
        >
          <Popup>
            <div className="min-w-[180px] text-black">
              <h3 className="font-semibold">
                {zone.name}
              </h3>

              <p className="mt-1 text-xs text-gray-600">
                Predefined Restricted Zone
              </p>

              <p className="mt-2 text-xs text-gray-500">
                Rooftop / building area
              </p>
            </div>
          </Popup>
        </Polygon>
      ))}


      {/* ============================= */}
      {/* SECURITY OFFICER DRAWING TOOLS */}
      {/* ============================= */}

      <EditControl
        position="topright"

        onCreated={handleCreated}
        onEdited={handleEdited}
        onDeleted={handleDeleted}

        draw={{
          polyline: false,
          circle: false,
          circlemarker: false,
          marker: false,

          rectangle: {
            shapeOptions: {
              color: '#dc2626',
              weight: 2,
              fillColor: '#ef4444',
              fillOpacity: 0.25,
            },
          },

          polygon: {
            allowIntersection: false,

            shapeOptions: {
              color: '#dc2626',
              weight: 2,
              fillColor: '#ef4444',
              fillOpacity: 0.25,
            },
          },
        }}

        edit={{
          edit: true,
          remove: true,
        }}
      />


      {/* ============================= */}
      {/* MANUALLY CREATED ZONES */}
      {/* ============================= */}

      {zones.map((zone) => (
        <Polygon
          key={zone.id}
          positions={zone.coordinates}
          pathOptions={{
            color: '#dc2626',
            weight: 2,
            fillColor: '#ef4444',
            fillOpacity: 0.25,
          }}
        >
          <Popup>
            <div className="min-w-[180px] text-black">
              <h3 className="font-semibold">
                {zone.name}
              </h3>

              <p className="mt-1 text-xs text-gray-600">
                Security Officer Defined Zone
              </p>

              <div className="mt-2 rounded-md bg-gray-100 p-2">
                <p className="text-[10px] text-gray-500">
                  Coordinates
                </p>

                <p className="text-xs">
                  {zone.coordinates
                    .map(
                      ([lat, lng]) =>
                        `${lat.toFixed(6)}, ${lng.toFixed(6)}`
                    )
                    .join(' → ')}
                </p>
              </div>
            </div>
          </Popup>
        </Polygon>
      ))}

    </FeatureGroup>
  )
}