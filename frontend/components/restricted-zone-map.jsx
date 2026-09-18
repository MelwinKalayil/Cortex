'use client'

import { useEffect, useRef, useState } from 'react'
import {
  FeatureGroup,
  MapContainer,
  Polygon,
  Rectangle,
  TileLayer,
  useMap,
} from 'react-leaflet'
import { EditControl } from 'react-leaflet-draw'

import 'leaflet/dist/leaflet.css'
import 'leaflet-draw/dist/leaflet.draw.css'

const vitCenter = [12.9692, 79.1560]

const STORAGE_KEY = 'nmsight-restricted-zones'

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

function getCoordinates(layer) {
  if (layer.getLatLngs) {
    const latLngs = layer.getLatLngs()

    if (latLngs.length > 0 && Array.isArray(latLngs[0])) {
      return latLngs[0].map((point) => [
        point.lat,
        point.lng,
      ])
    }
  }

  return []
}

export default function RestrictedZoneMap() {
  const featureGroupRef = useRef(null)

  const [zones, setZones] = useState([])
  const [loaded, setLoaded] = useState(false)

  // Load saved zones
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)

      if (saved) {
        setZones(JSON.parse(saved))
      }
    } catch (error) {
      console.error('Unable to load restricted zones:', error)
    }

    setLoaded(true)
  }, [])

  // Save zones whenever they change
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
      'Enter a name for this restricted area:'
    )

    if (!name || !name.trim()) {
      return
    }

    const coordinates = getCoordinates(layer)

    const newZone = {
      id: Date.now(),
      name: name.trim(),
      coordinates,
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

  function deleteZone(zoneId) {
    setZones((currentZones) =>
      currentZones.filter(
        (zone) => zone.id !== zoneId
      )
    )

    if (featureGroupRef.current) {
      featureGroupRef.current.eachLayer((layer) => {
        if (layer.options.zoneId === zoneId) {
          featureGroupRef.current.removeLayer(layer)
        }
      })
    }
  }

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

        <FeatureGroup ref={featureGroupRef}>

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

          {zones.map((zone) => (
            <Polygon
              key={zone.id}
              positions={zone.coordinates}
              pathOptions={{
                color: '#dc2626',
                weight: 2,
                fillColor: '#ef4444',
                fillOpacity: 0.25,
                zoneId: zone.id,
              }}
            >
              <div />
            </Polygon>
          ))}

        </FeatureGroup>

      </MapContainer>

      {/* Header */}
      <div className="absolute left-4 top-4 z-[1000] rounded-xl border border-gray-200 bg-white/95 px-4 py-3 shadow-lg">

        <p className="text-sm font-semibold text-black">
          Restricted Areas
        </p>

        <p className="mt-1 text-xs text-gray-600">
          Use the drawing tools to mark restricted zones
        </p>

      </div>

      {/* Zone list */}
      <div className="absolute bottom-4 left-4 z-[1000] max-h-[180px] w-[270px] overflow-y-auto rounded-xl border border-gray-200 bg-white/95 p-3 shadow-lg">

        <div className="mb-2 flex items-center justify-between">

          <p className="text-xs font-semibold text-black">
            Restricted Zones
          </p>

          <span className="rounded-full bg-red-100 px-2 py-1 text-[10px] font-semibold text-red-700">
            {zones.length}
          </span>

        </div>

        {zones.length === 0 ? (
          <p className="text-xs text-gray-500">
            No restricted areas created yet.
          </p>
        ) : (
          <div className="space-y-2">

            {zones.map((zone) => (
              <div
                key={zone.id}
                className="flex items-center justify-between rounded-lg bg-gray-100 px-3 py-2"
              >

                <div className="flex items-center gap-2">

                  <span className="size-2.5 rounded-full bg-red-500" />

                  <span className="text-xs font-medium text-black">
                    {zone.name}
                  </span>

                </div>

                <button
                  type="button"
                  onClick={() => deleteZone(zone.id)}
                  className="text-xs font-medium text-red-600 hover:text-red-800"
                >
                  Delete
                </button>

              </div>
            ))}

          </div>
        )}

      </div>

      {/* Instruction */}
      <div className="absolute bottom-4 right-4 z-[1000] rounded-xl border border-gray-200 bg-white/95 px-3 py-2 shadow-lg">

        <p className="text-xs text-black">
          Draw → Name → Save
        </p>

      </div>

    </div>
  )
}