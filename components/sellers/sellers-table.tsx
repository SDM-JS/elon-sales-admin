"use client"

import React from "react"
import Link from "next/link"
import { Edit2, Trash2, Phone, Mail, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"

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

interface SellersTableProps {
  sellers: Seller[]
  onEdit: (seller: Seller) => void
  onDelete: (seller: Seller) => void
}

export function SellersTable({ sellers, onEdit, onDelete }: SellersTableProps) {
  return (
    <div className="border border-slate-100 bg-white rounded-2xl overflow-hidden shadow-sm shadow-slate-100/50">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50/60 border-b border-slate-100">
            <TableHead className="px-6 py-4 font-bold text-[10px] text-slate-400 uppercase tracking-widest">Логотип</TableHead>
            <TableHead className="px-6 py-4 font-bold text-[10px] text-slate-400 uppercase tracking-widest">Бренд Номи</TableHead>
            <TableHead className="px-6 py-4 font-bold text-[10px] text-slate-400 uppercase tracking-widest">Раҳбар / Таъсисчи</TableHead>
            <TableHead className="px-6 py-4 font-bold text-[10px] text-slate-400 uppercase tracking-widest">Контактлар</TableHead>
            <TableHead className="px-6 py-4 font-bold text-[10px] text-slate-400 uppercase tracking-widest">Тавсиф</TableHead>
            <TableHead className="px-6 py-4 font-bold text-[10px] text-slate-400 uppercase tracking-widest">Геолокация</TableHead>
            <TableHead className="px-6 py-4 font-bold text-[10px] text-slate-400 uppercase tracking-widest text-right">Амаллар</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sellers.map((seller) => (
            <TableRow 
              key={seller.id} 
              className="border-b border-slate-100 hover:bg-slate-50/40 transition-colors"
            >
              <TableCell className="px-6 py-4">
                {seller.logo ? (
                  <img
                    src={seller.logo}
                    alt={seller.brandName}
                    className="h-10 w-10 object-cover border border-slate-100 rounded-xl shadow-inner"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none"
                    }}
                  />
                ) : (
                  <div className="h-10 w-10 bg-slate-50 border border-slate-100 flex items-center justify-center text-[9px] text-slate-400 font-bold rounded-xl uppercase">
                    Лого
                  </div>
                )}
              </TableCell>
              <TableCell className="px-6 py-4">
                <Link
                  href={`/sales?sellerId=${seller.id}`}
                  className="font-bold text-slate-800 hover:text-indigo-650 hover:underline transition-colors uppercase tracking-wide text-xs cursor-pointer"
                >
                  {seller.brandName}
                </Link>
              </TableCell>
              <TableCell className="px-6 py-4 font-semibold text-slate-700 text-xs uppercase">
                {seller.founder}
              </TableCell>
              <TableCell className="px-6 py-4 text-xs text-slate-500">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 font-mono text-[10px] text-slate-700">
                    <Phone className="h-3.5 w-3.5 text-slate-400" />
                    <span>{seller.phoneNumber}</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono text-[10px] text-slate-500 lowercase">
                    <Mail className="h-3.5 w-3.5 text-slate-400" />
                    <span>{seller.email}</span>
                  </div>
                </div>
              </TableCell>
              <TableCell className="px-6 py-4 text-xs text-slate-500 max-w-xs truncate font-medium">
                {seller.desc}
              </TableCell>
              <TableCell className="px-6 py-4 text-xs text-slate-500">
                {seller.latitude && seller.longitude ? (
                  <div className="flex items-center gap-1 bg-slate-50 border border-slate-100 px-2 py-1 rounded-lg w-fit font-mono text-[10px] text-slate-600">
                    <MapPin className="h-3.5 w-3.5 text-indigo-500" />
                    <span>{seller.latitude}, {seller.longitude}</span>
                  </div>
                ) : (
                  <span className="text-slate-300 font-bold">—</span>
                )}
              </TableCell>
              <TableCell className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-2.5">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(seller)}
                    className="h-8 rounded-xl border-slate-150 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-all cursor-pointer text-[10px] uppercase font-bold tracking-wider"
                  >
                    <Edit2 className="h-3 w-3 mr-1 text-slate-400" />
                    Таҳрирлаш
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(seller)}
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
