"use client";

import React, { useState, useEffect } from "react";
import { Loader2, Image as ImageIcon, MessageSquare, Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Zod sxemalari rus tiliga o'tkazildi
const createSchema = z.object({
  founder: z.string().min(1, "Имя учредителя обязательно для заполнения!"),
  brandName: z.string().min(1, "Название бренда обязательно для заполнения!"),
  phoneNumber: z.string().min(5, "Номер телефона обязателен для заполнения!"),
  desc: z.string().optional().or(z.literal("")),
  password: z.string().min(6, "Пароль должен состоять минимум из 6 символов!"),
  email: z.string().email("Неверный адрес электронной почты!").optional().or(z.literal("")),
  whatsappNumber: z.string().optional(),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
});

const editSchema = z.object({
  founder: z.string().min(1, "Имя учредителя обязательно для заполнения!"),
  brandName: z.string().min(1, "Название бренда обязательно для заполнения!"),
  phoneNumber: z.string().min(5, "Номер телефона обязателен для заполнения!"),
  desc: z.string().optional().or(z.literal("")),
  password: z.string().optional().or(z.string().min(6, "Пароль должен состоять минимум из 6 символов!")).or(z.literal("")),
  email: z.string().email("Неверный адрес электронной почты!").optional().or(z.literal("")),
  whatsappNumber: z.string().optional(),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
});

type CreateValues = z.infer<typeof createSchema>;
type EditValues = z.infer<typeof editSchema>;
import { Seller } from "./types";

interface SellerDialogsProps {
  isCreateOpen: boolean;
  setIsCreateOpen: (open: boolean) => void;
  isEditOpen: boolean;
  setIsEditOpen: (open: boolean) => void;
  isDeleteOpen: boolean;
  setIsDeleteOpen: (open: boolean) => void;
  selectedSeller: Seller | null;
  submitting: boolean;
  onCreateSubmit: (values: CreateValues, file: File | null) => Promise<void>;
  onEditSubmit: (values: EditValues, file: File | null) => Promise<void>;
  onDeleteConfirm: () => Promise<void>;
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
  onDeleteConfirm,
}: SellerDialogsProps) {
  const [logoFile, setLogoFile] = useState<File | null>(null);

  // WhatsApp uchun alohida modal shtatlari
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);
  const [targetNumber, setTargetNumber] = useState("");
  const [whatsAppMessageData, setWhatsAppMessageData] = useState<{
    founder: string;
    brandName: string;
    phoneNumber: string;
    email: string;
    password?: string;
    latitude?: string;
    longitude?: string;
  } | null>(null);

  const createForm = useForm<CreateValues>({
    resolver: zodResolver(createSchema),
    defaultValues: {
      founder: "",
      brandName: "",
      phoneNumber: "",
      desc: "",
      password: "",
      email: "",
      whatsappNumber: "",
      latitude: "",
      longitude: "",
    },
  });

  const editForm = useForm<EditValues>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      founder: "",
      brandName: "",
      phoneNumber: "",
      desc: "",
      password: "",
      email: "",
      whatsappNumber: "",
      latitude: "",
      longitude: "",
    },
  });

  useEffect(() => {
    if (selectedSeller) {
      editForm.setValue("founder", selectedSeller.founder);
      editForm.setValue("brandName", selectedSeller.brandName);
      editForm.setValue("phoneNumber", selectedSeller.phoneNumber);
      editForm.setValue("desc", selectedSeller.desc);
      editForm.setValue("password", "");
      editForm.setValue("email", selectedSeller.email);
      editForm.setValue("whatsappNumber", selectedSeller.whatsappNumber || "");
      editForm.setValue("latitude", selectedSeller.latitude || "");
      editForm.setValue("longitude", selectedSeller.longitude || "");
      setLogoFile(null);
    }
  }, [selectedSeller, editForm]);

  // Sotuvchi muvaffaqiyatli yaratilganda ishlovchi wrapper funksiya
  const handleCreateFormSubmit = async (values: CreateValues) => {
    await onCreateSubmit(values, logoFile);
    // Yaratilgandan so'ng ma'lumotlarni saqlab, WhatsApp modalini ochamiz
    setWhatsAppMessageData({
      ...values,
      email: values.email || "",
    });
    const cleanNumber = (values.whatsappNumber || values.phoneNumber).replace(
      /\D/g,
      "",
    );
    setTargetNumber(cleanNumber);
    setIsCreateOpen(false);
    setIsWhatsAppOpen(true);
  };

  // Sotuvchi muvaffaqiyatli tahrirlanganda ishlovchi wrapper funksiya
  const handleEditFormSubmit = async (values: EditValues) => {
    await onEditSubmit(values, logoFile);
    // Tahrirlangandan so'ng ma'lumotlarni saqlab, WhatsApp modalini ochamiz
    setWhatsAppMessageData({
      ...values,
      email: values.email || "",
      password: values.password || "Не изменен",
    });
    const cleanNumber = (values.whatsappNumber || values.phoneNumber).replace(
      /\D/g,
      "",
    );
    setTargetNumber(cleanNumber);
    setIsEditOpen(false);
    setIsWhatsAppOpen(true);
  };

  // WhatsApp xabarini yuborish mantiqi (Barcha so'ralgan ma'lumotlar bilan)
  const executeWhatsAppSend = () => {
    if (!whatsAppMessageData || !targetNumber) return;

    const cleanWhatsAppNumber = targetNumber.replace(/\D/g, "");

    // Yuboriladigan xabar matni (Faqat kerakli barcha ma'lumotlar jamlandi)
    const messageText = `Здравствуйте, ${whatsAppMessageData.founder}!\nИнформация о вашем магазине "${whatsAppMessageData.brandName}":\n\nКонтакты: ${whatsAppMessageData.phoneNumber}\nEmail: ${whatsAppMessageData.email}\nПароль: ${whatsAppMessageData.password || "—"}\nАдрес: ${whatsAppMessageData.latitude || "—"}\nОриентир: ${whatsAppMessageData.longitude || "—"}`;

    const encodedMessage = encodeURIComponent(messageText);
    const whatsappUrl = `https://web.whatsapp.com/send?phone=${cleanWhatsAppNumber}&text=${encodedMessage}`;

    window.open(whatsappUrl, "_blank");
    setIsWhatsAppOpen(false);
    setWhatsAppMessageData(null);
  };

  return (
    <>
      {/* CREATE DIALOG */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-lg overflow-y-auto max-h-[90vh] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900 uppercase">
              Добавить нового продавца
            </DialogTitle>
          </DialogHeader>
          <form
            onSubmit={createForm.handleSubmit(handleCreateFormSubmit)}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase text-slate-400">
                  Бренд
                </label>
                <Input
                  {...createForm.register("brandName")}
                  className="rounded-xl border-slate-200"
                />
                {createForm.formState.errors.brandName && (
                  <span className="text-[10px] text-red-500 font-medium">
                    {createForm.formState.errors.brandName.message}
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase text-slate-400">
                  Учредитель
                </label>
                <Input
                  {...createForm.register("founder")}
                  className="rounded-xl border-slate-200"
                />
                {createForm.formState.errors.founder && (
                  <span className="text-[10px] text-red-500 font-medium">
                    {createForm.formState.errors.founder.message}
                  </span>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase text-slate-400">
                  Телефон
                </label>
                <Input
                  {...createForm.register("phoneNumber")}
                  className="rounded-xl border-slate-200"
                />
                {createForm.formState.errors.phoneNumber && (
                  <span className="text-[10px] text-red-500 font-medium">
                    {createForm.formState.errors.phoneNumber.message}
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase text-slate-400">
                  Почта
                </label>
                <Input
                  {...createForm.register("email")}
                  className="rounded-xl border-slate-200"
                />
                {createForm.formState.errors.email && (
                  <span className="text-[10px] text-red-500 font-medium">
                    {createForm.formState.errors.email.message}
                  </span>
                )}
              </div>
            </div>

            <div className="p-3 bg-indigo-50/60 border border-indigo-100 rounded-xl flex flex-col gap-1">
              <label className="text-[10px] font-bold uppercase text-indigo-900 flex items-center gap-1">
                <MessageSquare className="h-3.5 w-3.5 text-emerald-500" /> Номер
                WhatsApp (Необязательно)
              </label>
              <Input
                {...createForm.register("whatsappNumber")}
                placeholder="Например: 998901234567"
                className="rounded-xl border-indigo-200 bg-white focus-visible:ring-indigo-500"
              />
              <span className="text-[9px] text-slate-400 uppercase tracking-wide">
                * После сохранения продавца откроется окно для подтверждения
                отправки данных в WhatsApp.
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase text-slate-400">
                  Адрес
                </label>
                <Input
                  {...createForm.register("latitude")}
                  placeholder="Широта или название улицы"
                  className="rounded-xl border-slate-200"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase text-slate-400">
                  Ориентир
                </label>
                <Input
                  {...createForm.register("longitude")}
                  placeholder="Ориентир или долгота"
                  className="rounded-xl border-slate-200"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 items-end">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
                  <ImageIcon className="h-3.5 w-3.5" />
                  Изображение логотипа
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
                  className="border border-slate-200 p-1 text-xs rounded-xl bg-white"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase text-slate-400">
                  Пароль
                </label>
                <Input
                  type="password"
                  {...createForm.register("password")}
                  className="rounded-xl border-slate-200"
                />
                {createForm.formState.errors.password && (
                  <span className="text-[10px] text-red-500 font-medium">
                    {createForm.formState.errors.password.message}
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold uppercase text-slate-400">
                Описание бизнеса
              </label>
              <textarea
                {...createForm.register("desc")}
                rows={2}
                className="w-full border border-slate-200 px-3 py-2 text-xs rounded-xl"
              />
              {createForm.formState.errors.desc && (
                <span className="text-[10px] text-red-500 font-medium">
                  {createForm.formState.errors.desc.message}
                </span>
              )}
            </div>

            <DialogFooter className="border-t pt-4 flex gap-2 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateOpen(false)}
                className="rounded-xl"
              >
                Отмена
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="rounded-xl"
              >
                {submitting && (
                  <Loader2 className="h-3 w-3 animate-spin mr-1" />
                )}
                Сохранить
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* EDIT DIALOG */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-lg overflow-y-auto max-h-[90vh] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900 uppercase">
              Редактировать продавца
            </DialogTitle>
          </DialogHeader>
          <form
            onSubmit={editForm.handleSubmit(handleEditFormSubmit)}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase text-slate-400">
                  Бренд
                </label>
                <Input
                  {...editForm.register("brandName")}
                  className="rounded-xl border-slate-200"
                />
                {editForm.formState.errors.brandName && (
                  <span className="text-[10px] text-red-500 font-medium">
                    {editForm.formState.errors.brandName.message}
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase text-slate-400">
                  Учредитель
                </label>
                <Input
                  {...editForm.register("founder")}
                  className="rounded-xl border-slate-200"
                />
                {editForm.formState.errors.founder && (
                  <span className="text-[10px] text-red-500 font-medium">
                    {editForm.formState.errors.founder.message}
                  </span>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase text-slate-400">
                  Телефон
                </label>
                <Input
                  {...editForm.register("phoneNumber")}
                  className="rounded-xl border-slate-200"
                />
                {editForm.formState.errors.phoneNumber && (
                  <span className="text-[10px] text-red-500 font-medium">
                    {editForm.formState.errors.phoneNumber.message}
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase text-slate-400">
                  Почта
                </label>
                <Input
                  {...editForm.register("email")}
                  className="rounded-xl border-slate-200"
                />
                {editForm.formState.errors.email && (
                  <span className="text-[10px] text-red-500 font-medium">
                    {editForm.formState.errors.email.message}
                  </span>
                )}
              </div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex flex-col gap-1">
              <label className="text-[10px] font-bold uppercase text-slate-700 flex items-center gap-1">
                <MessageSquare className="h-3.5 w-3.5 text-slate-500" /> Номер
                WhatsApp
              </label>
              <Input
                {...editForm.register("whatsappNumber")}
                placeholder="Например: 998901234567"
                className="rounded-xl border-slate-200 bg-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase text-slate-400">
                  Адрес
                </label>
                <Input
                  {...editForm.register("latitude")}
                  placeholder="Широта или название улицы"
                  className="rounded-xl border-slate-200"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase text-slate-400">
                  Ориентир
                </label>
                <Input
                  {...editForm.register("longitude")}
                  placeholder="Ориентир или долгота"
                  className="rounded-xl border-slate-200"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 items-end">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
                  <ImageIcon className="h-3.5 w-3.5" />
                  Новый логотип
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
                  className="border border-slate-200 p-1 text-xs rounded-xl bg-white"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase text-slate-400">
                  Пароль
                </label>
                <Input
                  type="password"
                  {...editForm.register("password")}
                  className="rounded-xl border-slate-200"
                  placeholder="Оставить без изменений"
                />
                {editForm.formState.errors.password && (
                  <span className="text-[10px] text-red-500 font-medium">
                    {editForm.formState.errors.password.message}
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold uppercase text-slate-400">
                Описание бизнеса
              </label>
              <textarea
                {...editForm.register("desc")}
                rows={2}
                className="w-full border border-slate-200 px-3 py-2 text-xs rounded-xl"
              />
              {editForm.formState.errors.desc && (
                <span className="text-[10px] text-red-500 font-medium">
                  {editForm.formState.errors.desc.message}
                </span>
              )}
            </div>

            <DialogFooter className="border-t pt-4 flex gap-2 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditOpen(false)}
                className="rounded-xl"
              >
                Отмена
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="rounded-xl"
              >
                {submitting && (
                  <Loader2 className="h-3 w-3 animate-spin mr-1" />
                )}
                Обновить
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DELETE DIALOG */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="max-w-sm rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-rose-600 uppercase">
              Удалить продавца
            </DialogTitle>
          </DialogHeader>
          {selectedSeller && (
            <div className="my-2 p-3 bg-slate-50 border rounded-xl text-xs font-bold text-slate-700">
              Магазин: {selectedSeller.brandName}
            </div>
          )}
          <DialogFooter className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteOpen(false)}
              className="rounded-xl"
            >
              Отмена
            </Button>
            <Button
              variant="destructive"
              onClick={onDeleteConfirm}
              disabled={submitting}
              className="rounded-xl"
            >
              {submitting && <Loader2 className="h-3 w-3 animate-spin mr-1" />}
              Да, удалить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* FOYDALANUVCHI SUBMIT QILGANDAN SO'NG OCHILADIGAN WHATSAPP MODAL OYNASI */}
      <Dialog open={isWhatsAppOpen} onOpenChange={setIsWhatsAppOpen}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900 uppercase flex items-center gap-2">
              <Send className="h-4 w-4 text-emerald-600" />
              Отправка данных в WhatsApp
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 my-2">
            <p className="text-xs text-slate-500">
              Продавец{" "}
              <span className="font-bold text-slate-700">
                "{whatsAppMessageData?.brandName}"
              </span>{" "}
              успешно сохранен. Подтвердите номер телефона для отправки пароля и
              данных магазина.
            </p>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase text-slate-400">
                Номер телефона получателя
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
                setWhatsAppMessageData(null);
              }}
              className="rounded-xl"
            >
              Пропустить
            </Button>
            <Button
              type="button"
              onClick={executeWhatsAppSend}
              className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
            >
              <Send className="h-3.5 w-3.5 mr-1.5" />
              Отправить данные
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
