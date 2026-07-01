"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Edit2, Trash2, Phone, Mail, MapPin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { Seller } from "./types";

interface SellersTableProps {
  sellers: Seller[];
  onEdit: (seller: Seller) => void;
  onDelete: (seller: Seller) => void;
}

export function SellersTable({ sellers, onEdit, onDelete }: SellersTableProps) {
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState<Seller | null>(null);
  const [targetNumber, setTargetNumber] = useState("");

  // FAQAT WHATSAPP TUGMASI BOSILGANDA ISHLAYDI
  const handleWhatsAppClick = (seller: Seller) => {
    setSelectedSeller(seller);
    const cleanNumber = seller.phoneNumber.replace(/\D/g, "");
    setTargetNumber(cleanNumber);
    setIsWhatsAppOpen(true);
  };

  // MODAL ICHIDAGI "ОТПРАВИТЬ" TUGMASI BOSILGANDA ISHLAYDI
  const handleSendWhatsApp = () => {
    if (!selectedSeller || !targetNumber) return;

    const cleanWhatsAppNumber = targetNumber.replace(/\D/g, "");

    const geoAddress = 
      selectedSeller.latitude && selectedSeller.longitude
        ? `${selectedSeller.latitude}, ${selectedSeller.longitude}`
        : "—";

    const greeting = selectedSeller.founder
      ? `Здравствуйте, ${selectedSeller.founder}!`
      : "Здравствуйте!";
    const brandName = selectedSeller.brandName || "—";
    const messageText = `${greeting}\nИнформация о вашем магазине "${brandName}":\n\nКонтакты: ${selectedSeller.phoneNumber}\nEmail: ${selectedSeller.email || "—"}\nАдрес: ${geoAddress}`;

    const encodedMessage = encodeURIComponent(messageText);
    const whatsappUrl = `https://web.whatsapp.com/send?phone=${cleanWhatsAppNumber}&text=${encodedMessage}`;

    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    
    setIsWhatsAppOpen(false);
    setSelectedSeller(null);
  };

  return (
    <div className="border border-slate-100 bg-white rounded-2xl overflow-hidden shadow-sm shadow-slate-100/50">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50/60 border-b border-slate-100">
            <TableHead className="px-6 py-4 font-bold text-[10px] text-slate-400 uppercase tracking-widest">
              Логотип
            </TableHead>
            <TableHead className="px-6 py-4 font-bold text-[10px] text-slate-400 uppercase tracking-widest">
              Название бренда
            </TableHead>
            <TableHead className="px-6 py-4 font-bold text-[10px] text-slate-400 uppercase tracking-widest">
              Руководитель / Учредитель
            </TableHead>
            <TableHead className="px-6 py-4 font-bold text-[10px] text-slate-400 uppercase tracking-widest">
              Контакты
            </TableHead>
            <TableHead className="px-6 py-4 font-bold text-[10px] text-slate-400 uppercase tracking-widest">
              Описание
            </TableHead>
            <TableHead className="px-6 py-4 font-bold text-[10px] text-slate-400 uppercase tracking-widest">
              Геолокация
            </TableHead>
            <TableHead className="px-6 py-4 font-bold text-[10px] text-slate-400 uppercase tracking-widest text-right">
              Действия
            </TableHead>
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
                    alt={seller.brandName || "Логотип продавца"}
                    className="h-10 w-10 object-cover border border-slate-100 rounded-xl shadow-inner"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
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
                  {seller.brandName || <span className="text-slate-300 font-bold">—</span>}
                </Link>
              </TableCell>
              <TableCell className="px-6 py-4 font-semibold text-slate-700 text-xs uppercase">
                {seller.founder || <span className="text-slate-300 font-bold">—</span>}
              </TableCell>
              <TableCell className="px-6 py-4 text-xs text-slate-500">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 font-mono text-[10px] text-slate-700">
                    <Phone className="h-3.5 w-3.5 text-slate-400" />
                    <span>{seller.phoneNumber}</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono text-[10px] text-slate-500 lowercase">
                    <Mail className="h-3.5 w-3.5 text-slate-400" />
                    <span>{seller.email || "—"}</span>
                  </div>
                </div>
              </TableCell>
              <TableCell className="px-6 py-4 text-xs text-slate-500 max-w-xs truncate font-medium">
                {seller.desc || <span className="text-slate-300 font-bold">—</span>}
              </TableCell>
              <TableCell className="px-6 py-4 text-xs text-slate-500">
                {seller.latitude && seller.longitude ? (
                  <Link
                    href={`/sellers/map?lat=${seller.latitude}&lng=${seller.longitude}&name=${encodeURIComponent(seller.brandName || "")}`}
                    className="flex items-center gap-1 bg-indigo-50 border border-indigo-100 px-2 py-1 rounded-lg w-fit font-mono text-[10px] text-indigo-700 hover:bg-indigo-100 hover:border-indigo-300 transition-all cursor-pointer group"
                  >
                    <MapPin className="h-3.5 w-3.5 text-indigo-500 group-hover:text-indigo-700 transition-colors" />
                    <span>{seller.latitude}, {seller.longitude}</span>
                  </Link>
                ) : (
                  <span className="text-slate-300 font-bold">—</span>
                )}
              </TableCell>
              <TableCell className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  
                  {/* WHATSAPP TUGMASI - FAQAT MODALNI OCHADI */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleWhatsAppClick(seller)}
                    className="h-8 rounded-xl border-emerald-100 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 transition-all cursor-pointer text-[10px] uppercase font-bold tracking-wider"
                  >
                    <Send className="h-3 w-3 mr-1" />
                    WhatsApp
                  </Button>

                  {/* EDIT TUGMASI - WHATSAPPGA HECH NARSA YUBORMAYDI */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(seller)}
                    className="h-8 rounded-xl border-slate-150 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-all cursor-pointer text-[10px] uppercase font-bold tracking-wider"
                  >
                    <Edit2 className="h-3 w-3 mr-1 text-slate-400" />
                    Редактировать
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(seller)}
                    className="h-8 rounded-xl text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-all cursor-pointer text-[10px] uppercase font-bold tracking-wider"
                  >
                    <Trash2 className="h-3 w-3 mr-1 text-rose-400" />
                    Удалить
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* WHATSAPP MODAL */}
      <Dialog open={isWhatsAppOpen} onOpenChange={setIsWhatsAppOpen}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900 uppercase">
              Отправка через WhatsApp
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 my-2">
            <p className="text-xs text-slate-500">
              Вы можете отправить данные продавца{" "}
              <span className="font-bold text-slate-700">
                &quot;{selectedSeller?.brandName || "—"}&quot;
              </span>{" "}
              на основной номер телефона или указать другой.
            </p>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase text-slate-400">
                Номер телефона для отправки
              </label>
              <Input
                type="text"
                value={targetNumber}
                onChange={(e) => setTargetNumber(e.target.value)}
                placeholder="Например: 998901234567"
                className="rounded-xl border-slate-200 font-mono"
              />
            </div>
          </div>

          <DialogFooter className="border-t pt-4 flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsWhatsAppOpen(false);
                setSelectedSeller(null);
              }}
              className="rounded-xl"
            >
              Отмена
            </Button>
            <Button
              type="button"
              onClick={handleSendWhatsApp}
              className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <Send className="h-3 w-3 mr-1" />
              Отправить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
