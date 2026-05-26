"use client"

import React, { useState, useEffect } from "react"
import { Loader2, MapPin, Image as ImageIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MapPicker } from "@/components/map-picker"

// Zod schemas
const createSchema = z.object({
  founder: z.string().min(1, "Таъсисчи исми киритилиши шарт!"),
  brandName: z.string().min(1, "Бренд номи киритилиши шарт!"),
  phoneNumber: z.string().min(5, "Телефон рақами киритилиши шарт!"),
  desc: z.string().min(1, "Тижорат тавсифи киритилиши шарт!"),
  password: z.string().min(6, "Махфий сўз камида 6 белгидан иборат бўлиши лозим!"),
  email: z.string().email("Нотўғри электрон почта манзили!"),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
})

const editSchema = z.object({
  founder: z.string().min(1, "Таъсисчи исми киритилиши шарт!"),
  brandName: z.string().min(1, "Бренд номи киритилиши шарт!"),
  phoneNumber: z.string().min(5, "Телефон рақами киритилиши шарт!"),
  desc: z.string().min(1, "Тижорат тавсифи киритилиши шарт!"),
  password: z.string().refine((val) => val.length === 0 || val.length >= 6, {
    message: "Махфий сўз камида 6 белгидан иборат бўлиши лозим!"
  }),
  email: z.string().email("Нотўғри электрон почта манзили!"),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
})

type CreateValues = z.infer<typeof createSchema>
type EditValues = z.infer<typeof editSchema>

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
}

interface SellerDialogsProps {
  isCreateOpen: boolean
  setIsCreateOpen: (open: boolean) => void
  isEditOpen: boolean
  setIsEditOpen: (open: boolean) => void
  isDeleteOpen: boolean
  setIsDeleteOpen: (open: boolean) => void
  selectedSeller: Seller | null
  submitting: boolean
  onCreateSubmit: (values: CreateValues, file: File | null) => Promise<void>
  onEditSubmit: (values: EditValues, file: File | null) => Promise<void>
  onDeleteConfirm: () => Promise<void>
}

export function SellerDialogs({
  isCreateOpen,
  setIsCreateOpen,
  isEditOpen,
  setIsEditOpen,
  isDeleteOpen,
  setIsDeleteOpen,
  selectedSeller,
  submitting,
  onCreateSubmit,
  onEditSubmit,
  onDeleteConfirm
}: SellerDialogsProps) {
  const [logoFile, setLogoFile] = useState<File | null>(null)

  const createForm = useForm<CreateValues>({
    resolver: zodResolver(createSchema),
    defaultValues: { founder: "", brandName: "", phoneNumber: "", desc: "", password: "", email: "", latitude: "", longitude: "" }
  })

  const editForm = useForm<EditValues>({
    resolver: zodResolver(editSchema),
    defaultValues: { founder: "", brandName: "", phoneNumber: "", desc: "", password: "", email: "", latitude: "", longitude: "" }
  })

  useEffect(() => {
    if (selectedSeller) {
      editForm.setValue("founder", selectedSeller.founder)
      editForm.setValue("brandName", selectedSeller.brandName)
      editForm.setValue("phoneNumber", selectedSeller.phoneNumber)
      editForm.setValue("desc", selectedSeller.desc)
      editForm.setValue("password", "")
      editForm.setValue("email", selectedSeller.email)
      editForm.setValue("latitude", selectedSeller.latitude || "")
      editForm.setValue("longitude", selectedSeller.longitude || "")
      setLogoFile(null)
    }
  }, [selectedSeller])

  return (
    <>
      {/* CREATE DIALOG */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-lg overflow-y-auto max-h-[90vh] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900 uppercase">Янги Сотувчи Қўшиш</DialogTitle>
          </DialogHeader>
          <form onSubmit={createForm.handleSubmit(v => onCreateSubmit(v, logoFile))} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1"><label className="text-[10px] font-bold uppercase text-slate-400">Бренд</label>
                <Input {...createForm.register("brandName")} className="rounded-xl border-slate-200" /></div>
              <div className="flex flex-col gap-1"><label className="text-[10px] font-bold uppercase text-slate-400">Таъсисчи</label>
                <Input {...createForm.register("founder")} className="rounded-xl border-slate-200" /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1"><label className="text-[10px] font-bold uppercase text-slate-400">Телефон</label>
                <Input {...createForm.register("phoneNumber")} className="rounded-xl border-slate-200" /></div>
              <div className="flex flex-col gap-1"><label className="text-[10px] font-bold uppercase text-slate-400">Почта</label>
                <Input {...createForm.register("email")} className="rounded-xl border-slate-200" /></div>
            </div>
            <div className="grid grid-cols-2 gap-4 items-end">
              <div className="flex flex-col gap-1"><label className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1"><ImageIcon className="h-3.5 w-3.5"/>Логотип расми</label>
                <input type="file" accept="image/*" onChange={e => setLogoFile(e.target.files?.[0] || null)} className="border border-slate-200 p-1 text-xs rounded-xl" /></div>
              <div className="flex flex-col gap-1"><label className="text-[10px] font-bold uppercase text-slate-400">Махфий сўз</label>
                <Input type="password" {...createForm.register("password")} className="rounded-xl border-slate-200" /></div>
            </div>
            <div className="flex flex-col gap-1"><label className="text-[10px] font-bold uppercase text-slate-400">Тижорат тавсифи</label>
              <textarea {...createForm.register("desc")} rows={2} className="w-full border border-slate-200 px-3 py-2 text-xs rounded-xl" /></div>
            
            <MapPicker 
              latitude={createForm.watch("latitude") || ""} 
              longitude={createForm.watch("longitude") || ""} 
              onChange={(lat, lng) => { createForm.setValue("latitude", lat); createForm.setValue("longitude", lng) }} 
            />

            <DialogFooter className="border-t pt-4 flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)} className="rounded-xl">Бекор қилиш</Button>
              <Button type="submit" disabled={submitting} className="rounded-xl">{submitting && <Loader2 className="h-3 w-3 animate-spin mr-1"/>}Сақлаш</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* EDIT DIALOG */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-lg overflow-y-auto max-h-[90vh] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900 uppercase">Сотувчини Таҳрирлаш</DialogTitle>
          </DialogHeader>
          <form onSubmit={editForm.handleSubmit(v => onEditSubmit(v, logoFile))} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1"><label className="text-[10px] font-bold uppercase text-slate-400">Бренд</label>
                <Input {...editForm.register("brandName")} className="rounded-xl border-slate-200" /></div>
              <div className="flex flex-col gap-1"><label className="text-[10px] font-bold uppercase text-slate-400">Таъсисчи</label>
                <Input {...editForm.register("founder")} className="rounded-xl border-slate-200" /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1"><label className="text-[10px] font-bold uppercase text-slate-400">Телефон</label>
                <Input {...editForm.register("phoneNumber")} className="rounded-xl border-slate-200" /></div>
              <div className="flex flex-col gap-1"><label className="text-[10px] font-bold uppercase text-slate-400">Почта</label>
                <Input {...editForm.register("email")} className="rounded-xl border-slate-200" /></div>
            </div>
            <div className="grid grid-cols-2 gap-4 items-end">
              <div className="flex flex-col gap-1"><label className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1"><ImageIcon className="h-3.5 w-3.5"/>Янги логотип</label>
                <input type="file" accept="image/*" onChange={e => setLogoFile(e.target.files?.[0] || null)} className="border border-slate-200 p-1 text-xs rounded-xl" /></div>
              <div className="flex flex-col gap-1"><label className="text-[10px] font-bold uppercase text-slate-400">Махфий сўз</label>
                <Input type="password" {...editForm.register("password")} className="rounded-xl border-slate-200" /></div>
            </div>
            <div className="flex flex-col gap-1"><label className="text-[10px] font-bold uppercase text-slate-400">Тижорат тавсифи</label>
              <textarea {...editForm.register("desc")} rows={2} className="w-full border border-slate-200 px-3 py-2 text-xs rounded-xl" /></div>
            
            <MapPicker 
              latitude={editForm.watch("latitude") || ""} 
              longitude={editForm.watch("longitude") || ""} 
              onChange={(lat, lng) => { editForm.setValue("latitude", lat); editForm.setValue("longitude", lng) }} 
            />

            <DialogFooter className="border-t pt-4 flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)} className="rounded-xl">Бекор қилиш</Button>
              <Button type="submit" disabled={submitting} className="rounded-xl">{submitting && <Loader2 className="h-3 w-3 animate-spin mr-1"/>}Янгилаш</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DELETE DIALOG */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="max-w-sm rounded-2xl">
          <DialogHeader><DialogTitle className="text-base font-bold text-rose-600 uppercase">Сотувчини ўчириш</DialogTitle></DialogHeader>
          {selectedSeller && <div className="my-2 p-3 bg-slate-50 border rounded-xl text-xs font-bold text-slate-700">Дўкон: {selectedSeller.brandName}</div>}
          <DialogFooter className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={() => setIsDeleteOpen(false)} className="rounded-xl">Бекор қилиш</Button>
            <Button variant="destructive" onClick={onDeleteConfirm} disabled={submitting} className="rounded-xl">{submitting && <Loader2 className="h-3 w-3 animate-spin mr-1"/>}Ҳа, ўчирилсин</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
