"use client";

import React, { useState, useEffect } from "react";
import {
  Loader2,
  DollarSign,
  Store,
  FolderOpen,
  Calendar,
  Image as ImageIcon,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";

// Zod validation schema
const salesSchema = z
  .object({
    productName: z.string().min(1, "Название товара обязательно к заполнению!"),
    lastPrice: z.coerce
      .number()
      .positive("Исходная цена должна быть больше нуля!"),
    salePrice: z.coerce
      .number()
      .positive("Цена со скидкой должна быть больше нуля!"),
    desc: z.string().optional().or(z.literal("")),
    categoryId: z.string().min(1, "Выберите категорию!"),
    sellerId: z.string().min(1, "Выберите продавца!"),
    expires: z.string().min(1, "Выберите срок действия!"),
  })
  .refine((data) => data.salePrice < data.lastPrice, {
    message: "Цена со скидкой должна быть меньше исходной цены!",
    path: ["salePrice"],
  });

type SalesFormValues = z.infer<typeof salesSchema>;

interface Sale {
  id: string;
  productName: string;
  images: string[];
  lastPrice: number;
  salePrice: number;
  expires: string;
  sellerId: string;
  categoryId: string;
  desc?: string | null;
  seller?: { brandName: string };
}

interface Seller {
  id: string;
  brandName: string;
}
interface Category {
  id: string;
  name: string;
}

interface SalesDialogsProps {
  isCreateOpen: boolean;
  setIsCreateOpen: (open: boolean) => void;
  isEditOpen: boolean;
  setIsEditOpen: (open: boolean) => void;
  isDeleteOpen: boolean;
  setIsDeleteOpen: (open: boolean) => void;
  selectedSale: Sale | null;
  sellers: Seller[];
  categories: Category[];
  submitting: boolean;
  onCreateSubmit: (
    values: SalesFormValues,
    files: FileList | null,
  ) => Promise<void>;
  onEditSubmit: (
    values: SalesFormValues,
    files: FileList | null,
  ) => Promise<void>;
  onDeleteConfirm: () => Promise<void>;
}

export function SalesDialogs({
  isCreateOpen,
  setIsCreateOpen,
  isEditOpen,
  setIsEditOpen,
  isDeleteOpen,
  setIsDeleteOpen,
  selectedSale,
  sellers,
  categories,
  submitting,
  onCreateSubmit,
  onEditSubmit,
  onDeleteConfirm,
}: SalesDialogsProps) {
  const [imageFiles, setImageFiles] = useState<FileList | null>(null);
  const [formKey, setFormKey] = useState(0);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<SalesFormValues>({
    resolver: zodResolver(salesSchema),
    defaultValues: {
      productName: "",
      lastPrice: 0,
      salePrice: 0,
      desc: "",
      categoryId: "",
      sellerId: "",
      expires: "",
    },
    key: formKey,
  });

  useEffect(() => {
    if (selectedSale) {
      setValue("productName", selectedSale.productName);
      setValue("lastPrice", selectedSale.lastPrice);
      setValue("salePrice", selectedSale.salePrice);
      setValue("desc", selectedSale.desc || "");
      setValue("categoryId", selectedSale.categoryId);
      setValue("sellerId", selectedSale.sellerId);
      if (selectedSale.expires) {
        setValue(
          "expires",
          new Date(selectedSale.expires).toISOString().split("T")[0],
        );
      }
      setImageFiles(null);
    } else {
      reset();
      setFormKey((k) => k + 1);
      setImageFiles(null);
    }
  }, [selectedSale]);

  const handleCreate = async (v: SalesFormValues) => {
    await onCreateSubmit(v, imageFiles);
    reset();
    setFormKey((k) => k + 1);
    setImageFiles(null);
  };

  const handleEdit = async (v: SalesFormValues) => {
    await onEditSubmit(v, imageFiles);
    reset();
    setFormKey((k) => k + 1);
    setImageFiles(null);
  };

  return (
    <>
      {/* CREATE DIALOG */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-lg overflow-y-auto max-h-[90vh] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900 uppercase">
              Добавить новую скидку
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleCreate)} className="space-y-4">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold uppercase text-slate-400">
                Товар
              </label>
              <Input
                {...register("productName")}
                className="rounded-xl border-slate-200"
              />
              {errors.productName && (
                <span className="text-[10px] text-rose-600 font-bold uppercase mt-1">
                  {errors.productName.message}
                </span>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
                  <DollarSign className="h-3 w-3" />
                  Исходная цена
                </label>
                <Input
                  type="number"
                  {...register("lastPrice")}
                  className="rounded-xl border-slate-200"
                />
                {errors.lastPrice && (
                  <span className="text-[10px] text-rose-600 font-bold uppercase mt-1">
                    {errors.lastPrice.message}
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
                  <DollarSign className="h-3 w-3" />
                  Цена со скидкой
                </label>
                <Input
                  type="number"
                  {...register("salePrice")}
                  className="rounded-xl border-slate-200"
                />
                {errors.salePrice && (
                  <span className="text-[10px] text-rose-600 font-bold uppercase mt-1">
                    {errors.salePrice.message}
                  </span>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
                  <Store className="h-3 w-3" />
                  Продавец
                </label>
                <NativeSelect
                  {...register("sellerId")}
                  className="w-full rounded-xl"
                >
                  <option value="">Выберите продавца...</option>
                  {sellers.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.brandName}
                    </option>
                  ))}
                </NativeSelect>
                {errors.sellerId && (
                  <span className="text-[10px] text-rose-600 font-bold uppercase mt-1">
                    {errors.sellerId.message}
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
                  <FolderOpen className="h-3 w-3" />
                  Категория
                </label>
                <NativeSelect
                  {...register("categoryId")}
                  className="w-full rounded-xl"
                >
                  <option value="">Выберите категорию...</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </NativeSelect>
                {errors.categoryId && (
                  <span className="text-[10px] text-rose-600 font-bold uppercase mt-1">
                    {errors.categoryId.message}
                  </span>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 items-end">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Срок действия
                </label>
                <Input
                  type="date"
                  {...register("expires")}
                  className="rounded-xl border-slate-200"
                />
                {errors.expires && (
                  <span className="text-[10px] text-rose-600 font-bold uppercase mt-1">
                    {errors.expires.message}
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
                  <ImageIcon className="h-3 w-3" />
                  Изображение товара
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => setImageFiles(e.target.files)}
                  className="border border-slate-205 p-1 text-xs rounded-xl"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold uppercase text-slate-400">
                Описание
              </label>
              <textarea
                {...register("desc")}
                rows={2}
                className="w-full border border-slate-200 px-3 py-2 text-xs rounded-xl"
              />
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
              Редактировать товар
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleEdit)} className="space-y-4">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold uppercase text-slate-400">
                Товар
              </label>
              <Input
                {...register("productName")}
                className="rounded-xl border-slate-200"
              />
              {errors.productName && (
                <span className="text-[10px] text-rose-600 font-bold uppercase mt-1">
                  {errors.productName.message}
                </span>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
                  <DollarSign className="h-3 w-3" />
                  Исходная цена
                </label>
                <Input
                  type="number"
                  {...register("lastPrice")}
                  className="rounded-xl border-slate-200"
                />
                {errors.lastPrice && (
                  <span className="text-[10px] text-rose-600 font-bold uppercase mt-1">
                    {errors.lastPrice.message}
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
                  <DollarSign className="h-3 w-3" />
                  Цена со скидкой
                </label>
                <Input
                  type="number"
                  {...register("salePrice")}
                  className="rounded-xl border-slate-200"
                />
                {errors.salePrice && (
                  <span className="text-[10px] text-rose-600 font-bold uppercase mt-1">
                    {errors.salePrice.message}
                  </span>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
                  <Store className="h-3 w-3" />
                  Продавец
                </label>
                <NativeSelect
                  {...register("sellerId")}
                  className="w-full rounded-xl"
                >
                  {sellers.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.brandName}
                    </option>
                  ))}
                </NativeSelect>
                {errors.sellerId && (
                  <span className="text-[10px] text-rose-600 font-bold uppercase mt-1">
                    {errors.sellerId.message}
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
                  <FolderOpen className="h-3 w-3" />
                  Категория
                </label>
                <NativeSelect
                  {...register("categoryId")}
                  className="w-full rounded-xl"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </NativeSelect>
                {errors.categoryId && (
                  <span className="text-[10px] text-rose-600 font-bold uppercase mt-1">
                    {errors.categoryId.message}
                  </span>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 items-end">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Срок действия
                </label>
                <Input
                  type="date"
                  {...register("expires")}
                  className="rounded-xl border-slate-200"
                />
                {errors.expires && (
                  <span className="text-[10px] text-rose-600 font-bold uppercase mt-1">
                    {errors.expires.message}
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
                  <ImageIcon className="h-3 w-3" />
                  Новые изображения (опционально)
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => setImageFiles(e.target.files)}
                  className="border border-slate-205 p-1 text-xs rounded-xl"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold uppercase text-slate-400">
                Описание
              </label>
              <textarea
                {...register("desc")}
                rows={2}
                className="w-full border border-slate-200 px-3 py-2 text-xs rounded-xl"
              />
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
              Удаление товара
            </DialogTitle>
          </DialogHeader>
          {selectedSale && (
            <div className="my-2 p-3 bg-slate-50 border rounded-xl text-xs font-bold text-slate-700">
              Товар: {selectedSale.productName}
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
    </>
  );
}
