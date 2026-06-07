"use client"

import React from "react"
import Link from "next/link"
import { Edit2, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"


import { Category } from "./types"


interface CategoriesTableProps {
  categories: Category[]
  onEdit: (cat: Category) => void
  onDelete: (cat: Category) => void
}

export function CategoriesTable({ categories, onEdit, onDelete }: CategoriesTableProps) {
  return (
    <div className="border border-slate-100 bg-white rounded-2xl overflow-hidden shadow-sm shadow-slate-100/50">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50/60 border-b border-slate-100">
            <TableHead className="px-6 py-4 font-bold text-[10px] text-slate-400 uppercase tracking-widest">Номи</TableHead>
            <TableHead className="px-6 py-4 font-bold text-[10px] text-slate-400 uppercase tracking-widest">Яратилган Вақти</TableHead>
            <TableHead className="px-6 py-4 font-bold text-[10px] text-slate-400 uppercase tracking-widest text-right">Амаллар</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((cat) => (
            <TableRow
              key={cat.id}
              className="border-b border-slate-100 hover:bg-slate-50/40 transition-colors"
            >
              <TableCell className="px-6 py-4">
                <Link
                  href={`/sales?categoryId=${cat.id}`}
                  className="font-bold text-slate-800 hover:text-indigo-650 hover:underline transition-colors uppercase tracking-wide text-xs cursor-pointer"
                >
                  {cat.name}
                </Link>
              </TableCell>
              <TableCell className="px-6 py-4 text-xs text-slate-500 font-medium">
                {cat.createdAt ? new Date(cat.createdAt).toLocaleString("uz-UZ") : "—"}
              </TableCell>
              <TableCell className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-2.5">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(cat)}
                    className="h-8 rounded-xl border-slate-150 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-all cursor-pointer text-[10px] uppercase font-bold tracking-wider"
                  >
                    <Edit2 className="h-3 w-3 mr-1 text-slate-400 group-hover:text-indigo-600" />
                    Таҳрирлаш
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(cat)}
                    className="h-8 rounded-xl text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-all cursor-pointer text-[10px] uppercase font-bold tracking-wider"
                  >
                    <Trash2 className="h-3 w-3 mr-1 text-rose-400" />
                    Ўчириш
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
