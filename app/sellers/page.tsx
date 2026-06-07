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
import { Seller } from "@/components/sellers/types"


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

  // Handle Create Submit (WhatsApp yo'naltirish mantiqi bilan)
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

    try {
      setSubmitting(true)
      // 1. Serverga yuborish
      const newSeller = await createSeller(formData)
      
      toast.success("Сотувчи муваффақиятли қўшилди!")
      setIsCreateOpen(false)
      fetchSellers()

      // 2. Client kompyuterida WhatsApp ochish
      if (values.whatsappNumber) {
        const cleanWhatsAppNumber = values.whatsappNumber.replace(/\D/g, "")
        const messageText = `Assalomu alaykum, ${values.founder}!\nSizning "${values.brandName}" do'koningiz muvaffaqiyatli ro'yxatdan o'tdi.\n\nTizimga kirish parolingiz: ${values.password}`
        const encodedMessage = encodeURIComponent(messageText)
        const whatsappUrl = `https://web.whatsapp.com/send?phone=${cleanWhatsAppNumber}&text=${encodedMessage}`
        
        window.open(whatsappUrl, "_blank")
      }

    } catch (err: any) {
      console.error("Ошибка при создании продавца:", err)
      toast.error(err.response?.data?.error || "Сотувчи қўшишда хатолик юз берди.")
    } finally {
      setSubmitting(false)
    }
  }

  // Handle Edit Submit
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

    try {
      setSubmitting(true)
      await updateSeller(selectedSeller.id, formData)
      toast.success("Сотувчи маълумотлари янгиланди!")
      setIsEditOpen(false)
      setSelectedSeller(null)
      fetchSellers()
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Таҳрирлашда хатолик юз берди.")
    } finally {
      setSubmitting(false)
    }
  }

  // Handle Delete Confirmation
  const onDeleteConfirm = async () => {
    if (!selectedSeller) return
    try {
      setSubmitting(true)
      await deleteSeller(selectedSeller.id)
      toast.success("Сотувчи муваффақиятли ўчирилди!")
      setIsDeleteOpen(false)
      setSelectedSeller(null)
      fetchSellers()
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Сотувчини ўчиришда хатолик юз берди.")
    } finally {
      setSubmitting(false)
    }
  }

  const filteredSellers = sellers.filter((seller) =>
    seller.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    seller.founder.toLowerCase().includes(searchQuery.toLowerCase()) ||
    seller.phoneNumber.includes(searchQuery)
  )

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col gap-4 border-b border-slate-100 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-black tracking-tight text-slate-900 uppercase flex items-center gap-2">
            <Store className="h-6 w-6 text-indigo-600 shrink-0" />
            Сотувчилар Бошқаруви
          </h1>
        </div>
        <Button onClick={() => setIsCreateOpen(true)} className="uppercase tracking-wider rounded-xl px-4 py-2.5">
          <Plus className="h-4 w-4 mr-1" /> Сотувчи Қўшиш
        </Button>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between border border-slate-100 bg-white p-4 rounded-2xl">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input 
            type="text" 
            placeholder="Сотувчиларни излаш..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 rounded-xl"
          />
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center flex flex-col items-center justify-center min-h-[300px] border border-slate-100 bg-white rounded-2xl">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mb-4" />
          <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Маълумотлар юкланмоқда...</p>
        </div>
      ) : (
        <SellersTable
          sellers={filteredSellers}
          onEdit={(s) => { setSelectedSeller(s); setIsEditOpen(true) }}
          onDelete={(s) => { setSelectedSeller(s); setIsDeleteOpen(true) }}
        />
      )}

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