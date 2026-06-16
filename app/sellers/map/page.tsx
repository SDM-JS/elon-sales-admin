"use client"

import React, { Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { ArrowLeft, MapPin, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

function MapView() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const lat = searchParams.get("lat")
  const lng = searchParams.get("lng")
  const name = searchParams.get("name") ?? "Сотувчи"

  const isValid = lat && lng && !isNaN(Number(lat)) && !isNaN(Number(lng))

  // Build OpenStreetMap embed URL (no API key needed)
  const zoom = 15
  const embedUrl = isValid
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${Number(lng) - 0.01},${Number(lat) - 0.01},${Number(lng) + 0.01},${Number(lat) + 0.01}&layer=mapnik&marker=${lat},${lng}`
    : null

  // Full OpenStreetMap link for "open in new tab"
  const externalUrl = isValid
    ? `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=${zoom}/${lat}/${lng}`
    : null

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top bar */}
      <div className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="rounded-xl hover:bg-slate-100 cursor-pointer text-slate-600 font-bold uppercase tracking-wider text-[10px]"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Орқага
          </Button>
          <div className="h-5 w-px bg-slate-200" />
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-indigo-600" />
            <div>
              <p className="text-xs font-black text-slate-900 uppercase tracking-wide">{decodeURIComponent(name)}</p>
              {isValid && (
                <p className="text-[10px] text-slate-400 font-mono">{lat}, {lng}</p>
              )}
            </div>
          </div>
        </div>

        {externalUrl && (
          <a
            href={externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-indigo-600 hover:text-indigo-800 border border-indigo-200 hover:border-indigo-400 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-xl transition-all"
          >
            <ExternalLink className="h-3 w-3" />
            OpenStreetMap да очиш
          </a>
        )}
      </div>

      {/* Map area */}
      <div className="flex-1 p-6">
        {isValid && embedUrl ? (
          <div className="w-full h-full min-h-[calc(100vh-120px)] rounded-2xl overflow-hidden border border-slate-200 shadow-lg">
            <iframe
              src={embedUrl}
              width="100%"
              height="100%"
              style={{ minHeight: "calc(100vh - 140px)", border: "none", display: "block" }}
              allowFullScreen
              loading="lazy"
              title={`${decodeURIComponent(name)} харитаси`}
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[400px] bg-white border border-slate-100 rounded-2xl">
            <div className="h-14 w-14 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center mb-4">
              <MapPin className="h-6 w-6 text-rose-400" />
            </div>
            <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-1">
              Геолокация топилмади
            </h2>
            <p className="text-xs text-slate-400 font-medium">
              Ушбу сотувчи учун координаталар мавжуд эмас.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.back()}
              className="mt-6 rounded-xl uppercase tracking-wider text-[10px] font-bold"
            >
              <ArrowLeft className="h-3.5 w-3.5 mr-1" />
              Орқага қайтиш
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function SellerMapPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-xs text-slate-400 uppercase tracking-widest font-bold animate-pulse">
          Харита юкланмоқда...
        </div>
      </div>
    }>
      <MapView />
    </Suspense>
  )
}
