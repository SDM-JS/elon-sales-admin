"use client"

import React, { useState, useEffect } from "react"
import { Store, Plus, Search, ShieldAlert, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

import {
  getSellers,
  createSeller,
  updateSeller,
  deleteSeller
} from "@/lib/api"
import { SellersTable } from "@/components/sellers/sellers-table"
import { SellerDialogs } from "@/components/sellers/seller-dialogs"

interface Seller {
  id: string
  founder: string
  brandName: string
  phoneNumber: string
  logo?: string | null
  desc: string
  email: string
  latitude?: string | null
  longitude?: string | null
  createdAt: string
}

export default function SellersPage() {
  const [sellers, setSellers] = useState<Seller[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedSeller, setSelectedSeller] = useState<Seller | null>(null)
  const [submitting, setSubmitting] = useState(false)

  // Fetch sellers on mount
  useEffect(() => {
    fetchSellers()
  }, [])

  const fetchSellers = async () => {
    try {
      setLoading(true)
      const data = await getSellers()
      setSellers(data)
    } catch (err) {
      console.error("Ошибка при получении продавцов:", err)
      toast.error("Маълумотларни юклашда хатолик юз берди.")
    } finally {
      setLoading(false)
    }
  }

  // Handle Create Submit (with logo File)
  const onCreateSubmit = async (values: any, logoFile: File | null) => {
    const formData = new FormData()
    formData.append("brandName", values.brandName)
    formData.append("founder", values.founder)
    formData.append("phoneNumber", values.phoneNumber)
    formData.append("email", values.email)
    formData.append("desc", values.desc)
    formData.append("password", values.password)
    if (values.latitude) formData.append("latitude", values.latitude)
    if (values.longitude) formData.append("longitude", values.longitude)
    if (logoFile) {
      formData.append("logo", logoFile)
    }

    console.log("Create Seller Payload FormValues:", values)
    console.log("Create Seller Logo Upload:", logoFile ? logoFile.name : "None")

    try {
      setSubmitting(true)
      const newSeller = await createSeller(formData)
      console.log("Create Seller API Response:", newSeller)
      toast.success("Сотувчи муваффақиятли қўшилди!")
      setIsCreateOpen(false)
      fetchSellers()
    } catch (err: any) {
      console.error("Ошибка при создании продавца:", err)
      toast.error(err.response?.data?.error || "Сотувчи қўшишда хатолик юз берди.")
    } finally {
      setSubmitting(false)
    }
  }

  // Handle Edit Submit (with logo File)
  const onEditSubmit = async (values: any, logoFile: File | null) => {
    if (!selectedSeller) return
    
    const formData = new FormData()
    formData.append("brandName", values.brandName)
    formData.append("founder", values.founder)
    formData.append("phoneNumber", values.phoneNumber)
    formData.append("email", values.email)
    formData.append("desc", values.desc)
    if (values.password) formData.append("password", values.password)
    formData.append("latitude", values.latitude || "")
    formData.append("longitude", values.longitude || "")
    if (logoFile) {
      formData.append("logo", logoFile)
    }

    console.log("Update Seller Payload FormValues:", { id: selectedSeller.id, ...values })
    console.log("Update Seller Logo Upload:", logoFile ? logoFile.name : "None")

    try {
      setSubmitting(true)
      const updated = await updateSeller(selectedSeller.id, formData)
      console.log("Update Seller API Response:", updated)
      toast.success("Сотувчи маълумотлари янгиланди!")
      setIsEditOpen(false)
      setSelectedSeller(null)
      fetchSellers()
    } catch (err: any) {
      console.error("Ошибка при обновлении продавца:", err)
      toast.error(err.response?.data?.error || "Таҳрирлашда хатолик юз берди.")
    } finally {
      setSubmitting(false)
    }
  }

  // Handle Delete Confirmation
  const onDeleteConfirm = async () => {
    if (!selectedSeller) return
    console.log("Delete Seller ID:", selectedSeller.id)
    try {
      setSubmitting(true)
      const deleted = await deleteSeller(selectedSeller.id)
      console.log("Delete Seller API Response:", deleted)
      toast.success("Сотувчи муваффақиятли ўчирилди!")
      setIsDeleteOpen(false)
      setSelectedSeller(null)
      fetchSellers()
    } catch (err: any) {
      console.error("Ошибка при удалении продавца:", err)
      toast.error(err.response?.data?.error || "Сотувчини ўчиришда хатолик юз берди.")
    } finally {
      setSubmitting(false)
    }
  }

  // Filter sellers list
  const filteredSellers = sellers.filter((seller) =>
    seller.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    seller.founder.toLowerCase().includes(searchQuery.toLowerCase()) ||
    seller.phoneNumber.includes(searchQuery)
  )

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header section */}
      <div className="flex flex-col gap-4 border-b border-slate-100 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-black tracking-tight text-slate-900 uppercase flex items-center gap-2">
            <Store className="h-6 w-6 text-indigo-600 shrink-0" />
            Сотувчилар Бошқаруви
          </h1>
          <p className="text-slate-500 text-xs uppercase tracking-wide font-medium">
            Платформадаги мавжуд сотувчилар ва дўконларни назорат қилиш ва қўшиш.
          </p>
        </div>
        
        <Button
          onClick={() => setIsCreateOpen(true)}
          className="uppercase tracking-wider cursor-pointer rounded-xl px-4 py-2.5 shadow-md shadow-indigo-150"
        >
          <Plus className="h-4 w-4 mr-1" />
          Сотувчи Қўшиш
        </Button>
      </div>

      {/* Filter / Search bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between border border-slate-100 bg-white p-4 rounded-2xl shadow-sm shadow-slate-100/30">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input 
            type="text" 
            placeholder="Сотувчиларни бренд номи ёки таъсисчиси бўйича излаш..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 rounded-xl border-slate-200"
          />
        </div>
      </div>

      {/* Sellers List Table */}
      {loading ? (
        <div className="p-12 text-center flex flex-col items-center justify-center min-h-[300px] border border-slate-100 bg-white rounded-2xl">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mb-4" />
          <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Маълумотлар юкланмоқда...</p>
        </div>
      ) : filteredSellers.length === 0 ? (
        <div className="p-12 text-center flex flex-col items-center justify-center min-h-[300px] border border-slate-100 bg-white rounded-2xl">
          <div className="flex h-12 w-12 items-center justify-center bg-slate-50 border border-slate-100 text-slate-450 mb-4 rounded-xl">
            <Store className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Сотувчилар топилмади</h3>
          <p className="mt-2 text-xs text-slate-455 max-w-sm uppercase">
            Қидирув бўйича ёки тизимда биронта ҳам сотувчи рўйхатдан ўтмаган.
          </p>
        </div>
      ) : (
        <SellersTable 
          sellers={filteredSellers} 
          onEdit={(s) => { setSelectedSeller(s); setIsEditOpen(true) }} 
          onDelete={(s) => { setSelectedSeller(s); setIsDeleteOpen(true) }} 
        />
      )}

      {/* Info Panel */}
      <div className="flex items-start gap-3 border border-slate-100 bg-white p-4 text-[11px] text-slate-500 leading-relaxed rounded-2xl shadow-sm shadow-slate-100/20">
        <ShieldAlert className="h-4.5 w-4.5 shrink-0 text-indigo-600 mt-0.5" />
        <span>Сотувчилар маълумотлари тизимдаги ҳамкор дўконлар базасини бошқаради. Ҳамкор бренд номи, раҳбари, контактлари ва жойлашувини ушбу ойна орқали янгилаб бориш лозим.</span>
      </div>

      {/* Seller Dialogs Modals */}
      <SellerDialogs
        isCreateOpen={isCreateOpen}
        setIsCreateOpen={setIsCreateOpen}
        isEditOpen={isEditOpen}
        setIsEditOpen={setIsEditOpen}
        isDeleteOpen={isDeleteOpen}
        setIsDeleteOpen={setIsDeleteOpen}
        selectedSeller={selectedSeller}
        submitting={submitting}
        onCreateSubmit={onCreateSubmit}
        onEditSubmit={onEditSubmit}
        onDeleteConfirm={onDeleteConfirm}
      />
    </div>
  )
}
