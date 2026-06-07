"use client"

import React from "react"
import { Loader2 } from "lucide-react"
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

// Zod validation schemas
const createUserSchema = z.object({
  fullName: z.string().min(1, "Исм-шариф киритилиши шарт!"),
  phoneNumber: z.string().min(5, "Телефон рақами киритилиши шарт!"),
  password: z.string().min(6, "Махфий сўз камида 6 белгидан иборат бўлиши керак!"),
})

const editUserSchema = z.object({
  fullName: z.string().min(1, "Исм-шариф киритилиши шарт!"),
  phoneNumber: z.string().min(5, "Телефон рақами киритилиши шарт!"),
  password: z.string().refine((val) => val.length === 0 || val.length >= 6, {
    message: "Махфий сўз камида 6 белгидан иборат бўлиши керак!"
  }),
})

type CreateUserValues = z.infer<typeof createUserSchema>
type EditUserValues = z.infer<typeof editUserSchema>

import { User } from "./types"


interface UserDialogsProps {
  isCreateOpen: boolean
  setIsCreateOpen: (open: boolean) => void
  isEditOpen: boolean
  setIsEditOpen: (open: boolean) => void
  isDeleteOpen: boolean
  setIsDeleteOpen: (open: boolean) => void
  selectedUser: User | null
  submitting: boolean
  onCreateSubmit: (values: CreateUserValues) => Promise<void>
  onEditSubmit: (values: EditUserValues) => Promise<void>
  onDeleteConfirm: () => Promise<void>
}

export function UserDialogs({
  isCreateOpen,
  setIsCreateOpen,
  isEditOpen,
  setIsEditOpen,
  isDeleteOpen,
  setIsDeleteOpen,
  selectedUser,
  submitting,
  onCreateSubmit,
  onEditSubmit,
  onDeleteConfirm
}: UserDialogsProps) {

  // Forms
  const createForm = useForm<CreateUserValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: { fullName: "", phoneNumber: "", password: "" }
  })

  const editForm = useForm<EditUserValues>({
    resolver: zodResolver(editUserSchema),
    defaultValues: { fullName: "", phoneNumber: "", password: "" }
  })

  // Pre-populate edit form
  React.useEffect(() => {
    if (selectedUser) {
      editForm.setValue("fullName", selectedUser.fullName)
      editForm.setValue("phoneNumber", selectedUser.phoneNumber)
      editForm.setValue("password", "") // Start empty (unchanged)
    }
  }, [selectedUser])

  const handleCreate = async (values: CreateUserValues) => {
    await onCreateSubmit(values)
    createForm.reset()
  }

  const handleEdit = async (values: EditUserValues) => {
    await onEditSubmit(values)
    editForm.reset()
  }

  return (
    <>
      {/* CREATE MODAL */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900 uppercase tracking-wide">Янги аъзо қўшиш</DialogTitle>
            <DialogDescription className="text-xs text-slate-400">
              Янги харидор учун тизимда аккаунт яратиш.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={createForm.handleSubmit(handleCreate)} className="space-y-4 my-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Исм-Шариф</label>
              <Input
                type="text"
                {...createForm.register("fullName")}
                placeholder="Исми ва фамилияси"
                className="rounded-xl border-slate-200"
              />
              {createForm.formState.errors.fullName && (
                <span className="text-[10px] text-rose-600 font-bold uppercase mt-1">{createForm.formState.errors.fullName.message}</span>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Телефон Рақами</label>
              <Input
                type="text"
                {...createForm.register("phoneNumber")}
                placeholder="Масалан: +998901234567"
                className="rounded-xl border-slate-200"
              />
              {createForm.formState.errors.phoneNumber && (
                <span className="text-[10px] text-rose-600 font-bold uppercase mt-1">{createForm.formState.errors.phoneNumber.message}</span>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Махфий сўз</label>
              <Input
                type="password"
                {...createForm.register("password")}
                placeholder="Камида 6 белгидан иборат"
                className="rounded-xl border-slate-200"
              />
              {createForm.formState.errors.password && (
                <span className="text-[10px] text-rose-600 font-bold uppercase mt-1">{createForm.formState.errors.password.message}</span>
              )}
            </div>

            <DialogFooter className="mt-6 pt-4 border-t border-slate-100 flex gap-2 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateOpen(false)}
                className="rounded-xl cursor-pointer"
              >
                Бекор қилиш
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="rounded-xl cursor-pointer"
              >
                {submitting && <Loader2 className="h-3 w-3 animate-spin mr-1" />}
                Сақлаш
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* EDIT MODAL */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900 uppercase tracking-wide">Аъзо маълумотларини таҳрирлаш</DialogTitle>
            <DialogDescription className="text-xs text-slate-400">
              Фойдаланувчи аккаунтини таҳрирлаш. (Парол ўзгаришсиз қолиши учун бўш қолдиринг)
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={editForm.handleSubmit(handleEdit)} className="space-y-4 my-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Исм-Шариф</label>
              <Input
                type="text"
                {...editForm.register("fullName")}
                className="rounded-xl border-slate-200"
              />
              {editForm.formState.errors.fullName && (
                <span className="text-[10px] text-rose-600 font-bold uppercase mt-1">{editForm.formState.errors.fullName.message}</span>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Телефон Рақами</label>
              <Input
                type="text"
                {...editForm.register("phoneNumber")}
                className="rounded-xl border-slate-200"
              />
              {editForm.formState.errors.phoneNumber && (
                <span className="text-[10px] text-rose-600 font-bold uppercase mt-1">{editForm.formState.errors.phoneNumber.message}</span>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Махфий сўз</label>
              <Input
                type="text"
                {...editForm.register("password")}
                placeholder="Ўзгаришсиз қолдириш учун бўш қолдиринг"
                className="rounded-xl border-slate-200"
              />
              {editForm.formState.errors.password && (
                <span className="text-[10px] text-rose-600 font-bold uppercase mt-1">{editForm.formState.errors.password.message}</span>
              )}
            </div>

            <DialogFooter className="mt-6 pt-4 border-t border-slate-100 flex gap-2 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditOpen(false)}
                className="rounded-xl cursor-pointer"
              >
                Бекор қилиш
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="rounded-xl cursor-pointer"
              >
                {submitting && <Loader2 className="h-3 w-3 animate-spin mr-1" />}
                Янгилаш
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DELETE CONFIRM MODAL */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="max-w-sm rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-rose-600 uppercase tracking-wide">Аъзони ўчиришни тасдиқланг</DialogTitle>
            <DialogDescription className="text-xs text-slate-400">
              Сиз ҳақиқатдан ҳам ушбу фойдаланувчини ўчириб юбормоқчимисиз?
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="my-4 p-3 border border-slate-100 bg-slate-50 text-xs font-bold uppercase text-slate-700 rounded-xl">
              Харидор: {selectedUser.fullName} ({selectedUser.phoneNumber})
            </div>
          )}

          <DialogFooter className="mt-4 pt-4 border-t border-slate-100 flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteOpen(false)}
              className="rounded-xl cursor-pointer"
            >
              Бекор қилиш
            </Button>
            <Button
              variant="destructive"
              onClick={onDeleteConfirm}
              disabled={submitting}
              className="rounded-xl cursor-pointer"
            >
              {submitting && <Loader2 className="h-3 w-3 animate-spin mr-1" />}
              Ҳа, ўчирилсин
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
