"use client"

import React from "react"
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

interface Sale {
  id: string
  productName: string
  images: string[]
  lastPrice: number
  salePrice: number
  percentageDiscount: number
  desc?: string | null
  expires: string
  sellerId: string
  categoryId: string
  seller?: { brandName: string }
  categories?: { name: string }
}

interface SalesTableProps {
  sales: Sale[]
  onEdit: (sale: Sale) => void
  onDelete: (sale: Sale) => void
}

export function SalesTable({ sales, onEdit, onDelete }: SalesTableProps) {
  return (
    <div className="border border-slate-100 bg-white rounded-2xl overflow-hidden shadow-sm shadow-slate-100/50">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50/60 border-b border-slate-100">
            <TableHead className="px-6 py-4 font-bold text-[10px] text-slate-400 uppercase tracking-widest">Расм</TableHead>
            <TableHead className="px-6 py-4 font-bold text-[10px] text-slate-400 uppercase tracking-widest">Маҳсулот</TableHead>
            <TableHead className="px-6 py-4 font-bold text-[10px] text-slate-400 uppercase tracking-widest">Бўлим</TableHead>
            <TableHead className="px-6 py-4 font-bold text-[10px] text-slate-400 uppercase tracking-widest">Дўкон / Сотувчи</TableHead>
            <TableHead className="px-6 py-4 font-bold text-[10px] text-slate-400 uppercase tracking-widest">Нархлар</TableHead>
            <TableHead className="px-6 py-4 font-bold text-[10px] text-slate-400 uppercase tracking-widest">Чегирма</TableHead>
            <TableHead className="px-6 py-4 font-bold text-[10px] text-slate-400 uppercase tracking-widest">Муддат</TableHead>
            <TableHead className="px-6 py-4 font-bold text-[10px] text-slate-400 uppercase tracking-widest text-right">Амаллар</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sales.map((sale) => (
            <TableRow 
              key={sale.id} 
              className="border-b border-slate-100 hover:bg-slate-50/40 transition-colors"
            >
              <TableCell className="px-6 py-4">
                {sale.images && sale.images[0] ? (
                  <img
                    src={sale.images[0]}
                    alt={sale.productName}
                    className="h-10 w-10 object-cover border border-slate-100 rounded-xl shadow-inner"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none"
                    }}
                  />
                ) : (
                  <div className="h-10 w-10 bg-slate-50 border border-slate-100 flex items-center justify-center text-[8px] text-slate-400 font-bold rounded-xl uppercase">
                    Расм
                  </div>
                )}
              </TableCell>
              <TableCell className="px-6 py-4 font-bold text-slate-800 uppercase tracking-wide text-xs">
                {sale.productName}
              </TableCell>
              <TableCell className="px-6 py-4 text-xs font-semibold text-slate-700 uppercase">
                {sale.categories?.name || <span className="text-slate-350">Номаълум</span>}
              </TableCell>
              <TableCell className="px-6 py-4 text-xs font-bold text-slate-700 uppercase">
                {sale.seller?.brandName || <span className="text-slate-350">Номаълум</span>}
              </TableCell>
              <TableCell className="px-6 py-4 text-xs text-slate-500 font-medium">
                <div className="line-through text-slate-300 text-[10px]">{sale.lastPrice.toLocaleString()} сўм</div>
                <div className="font-bold text-slate-900">{sale.salePrice.toLocaleString()} сўм</div>
              </TableCell>
              <TableCell className="px-6 py-4">
                <span className="inline-flex items-center text-[10px] font-extrabold text-rose-600 bg-rose-50 px-2.5 py-0.5 border border-rose-100 uppercase tracking-wider rounded-lg">
                  -{sale.percentageDiscount}%
                </span>
              </TableCell>
              <TableCell className="px-6 py-4 text-xs text-slate-500 font-mono">
                {sale.expires ? new Date(sale.expires).toLocaleDateString("uz-UZ") : "—"}
              </TableCell>
              <TableCell className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-2.5">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(sale)}
                    className="h-8 rounded-xl border-slate-150 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-all cursor-pointer text-[10px] uppercase font-bold tracking-wider"
                  >
                    <Edit2 className="h-3 w-3 mr-1 text-slate-400" />
                    Таҳрирлаш
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(sale)}
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
