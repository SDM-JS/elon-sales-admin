"use client"

import React, { useState, useEffect } from "react"
import { Tag, Plus, Search, ShieldAlert, Loader2 } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

import {
  getSales,
  getSellers,
  getCategories,
  createSale,
  updateSale,
  deleteSale
} from "@/lib/api"
import { SalesTable } from "@/components/sales/sales-table"
import { SalesDialogs } from "@/components/sales/sales-dialogs"
import { Sale, Seller, Category } from "./types"

export function SalesPageContent() {
  const [sales, setSales] = useState<Sale[]>([])
  const [sellers, setSellers] = useState<Seller[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  const searchParams = useSearchParams()
  const filterSellerId = searchParams.get("sellerId")
  const filterCategoryId = searchParams.get("categoryId")

  const [selectedSellerId, setSelectedSellerId] = useState<string>("")
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("")

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    if (filterSellerId) setSelectedSellerId(filterSellerId)
  }, [filterSellerId])

  useEffect(() => {
    if (filterCategoryId) setSelectedCategoryId(filterCategoryId)
  }, [filterCategoryId])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [salesData, sellersData, categoriesData] = await Promise.all([
        getSales(),
        getSellers(),
        getCategories()
      ])
      setSales(salesData)
      setSellers(sellersData)
      setCategories(categoriesData)
    } catch (err) {
      console.error(err)
      toast.error("Маълумотларни юклашда хатолик юз берди.")
    } finally {
      setLoading(false)
    }
  }

  const onCreateSubmit = async (values: any, imageFiles: FileList | null) => {
    if (!imageFiles || imageFiles.length === 0) {
      toast.error("Илтимос, камида битта маҳсулот расмини юкланг!")
      return
    }
    const formData = new FormData()
    formData.append("productName", values.productName)
    formData.append("lastPrice", String(values.lastPrice))
    formData.append("salePrice", String(values.salePrice))
    formData.append("desc", values.desc || "")
    formData.append("categoryId", values.categoryId)
    formData.append("expires", values.expires)
    for (let i = 0; i < imageFiles.length; i++) {
      formData.append("images", imageFiles[i])
    }

    try {
      setSubmitting(true)
      await createSale(values.sellerId, formData)
      toast.success("Маҳсулот муваффақиятли қўшилди!")
      setIsCreateOpen(false)
      fetchData()
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Скидка қўшишда хатолик юз берди.")
    } finally {
      setSubmitting(false)
    }
  }

  const onEditSubmit = async (values: any, imageFiles: FileList | null) => {
    if (!selectedSale) return
    const formData = new FormData()
    formData.append("productName", values.productName)
    formData.append("lastPrice", String(values.lastPrice))
    formData.append("salePrice", String(values.salePrice))
    formData.append("desc", values.desc || "")
    formData.append("categoryId", values.categoryId)
    formData.append("sellerId", values.sellerId)
    formData.append("expires", values.expires)
    if (imageFiles && imageFiles.length > 0) {
      for (let i = 0; i < imageFiles.length; i++) {
        formData.append("images", imageFiles[i])
      }
    }

    try {
      setSubmitting(true)
      await updateSale(selectedSale.id, formData)
      toast.success("Маҳсулот маълумотлари янгиланди!")
      setIsEditOpen(false)
      setSelectedSale(null)
      fetchData()
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Маҳсулотни таҳрирлашда хатолик юз берди.")
    } finally {
      setSubmitting(false)
    }
  }

  const onDeleteConfirm = async () => {
    if (!selectedSale) return
    try {
      setSubmitting(true)
      await deleteSale(selectedSale.id)
      toast.success("Маҳсулот муваффақиятли ўчирилди!")
      setIsDeleteOpen(false)
      setSelectedSale(null)
      fetchData()
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Ўчиришда хатолик юз берди.")
    } finally {
      setSubmitting(false)
    }
  }

  const filteredSales = sales.filter((sale) => {
    const matchesSearch = sale.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (sale.seller?.brandName || "").toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategoryId ? sale.categoryId === selectedCategoryId : true
    const matchesSeller = selectedSellerId ? sale.sellerId === selectedSellerId : true
    return matchesSearch && matchesCategory && matchesSeller
  })

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col gap-4 border-b border-slate-100 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-black tracking-tight text-slate-900 uppercase flex items-center gap-2">
            <Tag className="h-6 w-6 text-indigo-600 shrink-0" />
            Чегирма ва Маҳсулотлар
          </h1>
          <p className="text-slate-500 text-xs uppercase tracking-wide font-medium">
            Платформадаги чегирмали акциялар ва маҳсулотларни назорат қилиш ва қўшиш.
          </p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)} className="uppercase tracking-wider cursor-pointer rounded-xl px-4 py-2.5 shadow-md shadow-indigo-150">
          <Plus className="h-4 w-4 mr-1" />
          Маҳсулот Қўшиш
        </Button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center border border-slate-100 bg-white p-4 rounded-2xl shadow-sm shadow-slate-100/30">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input 
            type="text" 
            placeholder="Маҳсулотларни номи ёки бренди бўйича излаш..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 rounded-xl border-slate-200"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedCategoryId}
            onChange={(e) => setSelectedCategoryId(e.target.value)}
            className="h-10 rounded-xl border border-slate-200 bg-white px-3 py-1 text-xs font-bold text-slate-700 outline-none focus:border-indigo-500 cursor-pointer min-w-[140px]"
          >
            <option value="">БАРЧА БЎЛИМЛАР</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name.toUpperCase()}</option>
            ))}
          </select>
          <select
            value={selectedSellerId}
            onChange={(e) => setSelectedSellerId(e.target.value)}
            className="h-10 rounded-xl border border-slate-200 bg-white px-3 py-1 text-xs font-bold text-slate-700 outline-none focus:border-indigo-500 cursor-pointer min-w-[140px]"
          >
            <option value="">БАРЧА СОТУВЧИЛАР</option>
            {sellers.map((sel) => (
              <option key={sel.id} value={sel.id}>{sel.brandName.toUpperCase()}</option>
            ))}
          </select>
          {(selectedCategoryId || selectedSellerId) && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedCategoryId("")
                setSelectedSellerId("")
                window.history.pushState({}, "", "/sales")
              }}
              className="h-10 text-[10px] text-rose-650 hover:bg-rose-50 hover:text-rose-700 uppercase font-bold tracking-wider rounded-xl cursor-pointer"
            >
              Тозалаш
            </Button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center flex flex-col items-center justify-center min-h-[300px] border border-slate-100 bg-white rounded-2xl">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mb-4" />
          <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Маълумотлар юкланмоқда...</p>
        </div>
      ) : filteredSales.length === 0 ? (
        <div className="p-12 text-center flex flex-col items-center justify-center min-h-[300px] border border-slate-100 bg-white rounded-2xl">
          <div className="flex h-12 w-12 items-center justify-center bg-slate-50 border border-slate-100 text-slate-450 mb-4 rounded-xl">
            <Tag className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Чегирмалар топилмади</h3>
          <p className="mt-2 text-xs text-slate-450 max-w-sm uppercase">Қидирув бўйича ёки тизимда биронта ҳам акция мавжуд эмас.</p>
        </div>
      ) : (
        <SalesTable 
          sales={filteredSales} 
          onEdit={(s) => { setSelectedSale(s); setIsEditOpen(true) }} 
          onDelete={(s) => { setSelectedSale(s); setIsDeleteOpen(true) }} 
        />
      )}

      <div className="flex items-start gap-3 border border-slate-100 bg-white p-4 text-[11px] text-slate-500 leading-relaxed rounded-2xl shadow-sm shadow-slate-100/20">
        <ShieldAlert className="h-4.5 w-4.5 shrink-0 text-indigo-600 mt-0.5" />
        <span>Чегирмалар базаси тизимдаги маҳсулот акцияларини бошқаради. Ҳар бир акция тегишли сотувчи дўкони ва бўлимга боғланган бўлиши шарт. Янги маҳсулот қўшишда камида битта расм юкланиши мажбурий.</span>
      </div>

      <SalesDialogs
        isCreateOpen={isCreateOpen}
        setIsCreateOpen={setIsCreateOpen}
        isEditOpen={isEditOpen}
        setIsEditOpen={setIsEditOpen}
        isDeleteOpen={isDeleteOpen}
        setIsDeleteOpen={setIsDeleteOpen}
        selectedSale={selectedSale}
        sellers={sellers}
        categories={categories}
        submitting={submitting}
        onCreateSubmit={onCreateSubmit}
        onEditSubmit={onEditSubmit}
        onDeleteConfirm={onDeleteConfirm}
      />
    </div>
  )
}
