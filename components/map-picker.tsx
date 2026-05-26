"use client"

import React, { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { MapPin, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface MapPickerProps {
  latitude: string
  longitude: string
  onChange: (lat: string, lng: string) => void
}

export function MapPicker({ latitude, longitude, onChange }: MapPickerProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<any>(null)
  const markerRef = useRef<any>(null)
  const [leafletLoaded, setLeafletLoaded] = useState(false)
  const [locating, setLocating] = useState(false)

  // Load Leaflet dynamically on mount
  useEffect(() => {
    if ((window as any).L) {
      setLeafletLoaded(true)
      return
    }

    const link = document.createElement("link")
    link.rel = "stylesheet"
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
    document.head.appendChild(link)

    const script = document.createElement("script")
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
    script.async = true
    script.onload = () => {
      setLeafletLoaded(true)
    }
    document.head.appendChild(script)

    return () => {
      if (document.head.contains(link)) document.head.removeChild(link)
      if (document.head.contains(script)) document.head.removeChild(script)
    }
  }, [])

  // Initialize Map
  useEffect(() => {
    if (!leafletLoaded || !mapContainerRef.current) return
    const L = (window as any).L
    if (!L) return

    const initialLat = parseFloat(latitude) || 41.2995 // Tashkent
    const initialLng = parseFloat(longitude) || 69.2401

    if (mapRef.current) {
      if (markerRef.current) {
        markerRef.current.setLatLng([initialLat, initialLng])
      }
      mapRef.current.panTo([initialLat, initialLng])
      return
    }

    const map = L.map(mapContainerRef.current).setView([initialLat, initialLng], 13)
    mapRef.current = map

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://openstreetmap.org">OpenStreetMap</a>'
    }).addTo(map)

    const marker = L.marker([initialLat, initialLng], { draggable: true }).addTo(map)
    markerRef.current = marker

    marker.on("dragend", () => {
      const position = marker.getLatLng()
      onChange(position.lat.toFixed(6), position.lng.toFixed(6))
    })

    map.on("click", (e: any) => {
      const { lat, lng } = e.latlng
      marker.setLatLng([lat, lng])
      onChange(lat.toFixed(6), lng.toFixed(6))
    })

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
        markerRef.current = null
      }
    }
  }, [leafletLoaded])

  // React to outside/geolocation changes in coordinates
  useEffect(() => {
    if (!mapRef.current) return
    const latNum = parseFloat(latitude)
    const lngNum = parseFloat(longitude)
    if (isNaN(latNum) || isNaN(lngNum)) return

    const currentCenter = mapRef.current.getCenter()
    if (Math.abs(currentCenter.lat - latNum) > 0.0002 || Math.abs(currentCenter.lng - lngNum) > 0.0002) {
      if (markerRef.current) {
        markerRef.current.setLatLng([latNum, lngNum])
      }
      mapRef.current.setView([latNum, lngNum], 15)
    }
  }, [latitude, longitude])

  const handleLocateUser = () => {
    if (!navigator.geolocation) {
      toast.error("Браузерингиз геолокацияни қўллаб-қувватламайди!")
      return
    }
    setLocating(true)
    toast.info("Жойлашув аниқланмоқда...")

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocating(false)
        const lat = position.coords.latitude.toFixed(6)
        const lng = position.coords.longitude.toFixed(6)
        onChange(lat, lng)
        toast.success("Жойлашувингиз муваффақиятли аниқланди!")
      },
      (error) => {
        setLocating(false)
        console.error("Geolocation error:", error)
        toast.error("Геолокацияни аниқлаб бўлмади. Рухсатни текширинг.")
      },
      { enableHighAccuracy: true, timeout: 8000 }
    )
  }

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Жойлашувни харитада белгиланг:</div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleLocateUser}
          disabled={locating}
          className="h-8 rounded-xl border-slate-200 text-slate-600 hover:text-indigo-650 hover:bg-indigo-50/60 font-bold uppercase text-[9px] tracking-wider transition-all flex items-center gap-1.5 cursor-pointer"
        >
          {locating ? (
            <Loader2 className="h-3 w-3 animate-spin text-indigo-600" />
          ) : (
            <MapPin className="h-3 w-3 text-indigo-500" />
          )}
          Ҳозирги Жойлашувим
        </Button>
      </div>
      <div 
        ref={mapContainerRef} 
        className="w-full h-72 border border-slate-200 rounded-xl overflow-hidden shadow-sm z-0" 
      />
    </div>
  )
}

