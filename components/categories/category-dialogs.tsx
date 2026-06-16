"use client";

import React from "react";
import { Loader2 } from "lucide-react";
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

const categorySchema = z.object({
  name: z.string().min(1, "Название категории обязательно к заполнению!"),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

import { Category } from "./types";

interface CategoryDialogsProps {
  isCreateOpen: boolean;
  setIsCreateOpen: (open: boolean) => void;
  isEditOpen: boolean;
  setIsEditOpen: (open: boolean) => void;
  isDeleteOpen: boolean;
  setIsDeleteOpen: (open: boolean) => void;
  selectedCategory: Category | null;
  submitting: boolean;
  onCreateSubmit: (values: CategoryFormValues) => Promise<void>;
  onEditSubmit: (values: CategoryFormValues) => Promise<void>;
  onDeleteConfirm: () => Promise<void>;
}

export function CategoryDialogs({
  isCreateOpen,
  setIsCreateOpen,
  isEditOpen,
  setIsEditOpen,
  isDeleteOpen,
  setIsDeleteOpen,
  selectedCategory,
  submitting,
  onCreateSubmit,
  onEditSubmit,
  onDeleteConfirm,
}: CategoryDialogsProps) {
  // React Hook Form for Create
  const createForm = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: "" },
  });

  // React Hook Form for Edit
  const editForm = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: "" },
  });

  // Populate edit form when selectedCategory changes
  React.useEffect(() => {
    if (selectedCategory) {
      editForm.setValue("name", selectedCategory.name);
    }
  }, [selectedCategory]);

  const handleCreate = async (values: CategoryFormValues) => {
    await onCreateSubmit(values);
    createForm.reset();
  };

  const handleEdit = async (values: CategoryFormValues) => {
    await onEditSubmit(values);
    editForm.reset();
  };

  return (
    <>
      {/* CREATE DIALOG */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900 uppercase tracking-wide">
              Добавить новую категорию
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-400">
              Заполните следующее поле, чтобы добавить новую категорию товаров в
              систему.
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={createForm.handleSubmit(handleCreate)}
            className="space-y-4 my-2"
          >
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Название категории
              </label>
              <Input
                type="text"
                {...createForm.register("name")}
                placeholder="Например: Одежда"
                className="rounded-xl border-slate-200"
              />
              {createForm.formState.errors.name && (
                <span className="text-[10px] text-rose-600 font-bold uppercase mt-1">
                  {createForm.formState.errors.name.message}
                </span>
              )}
            </div>

            <DialogFooter className="mt-6 pt-4 border-t border-slate-100 flex gap-2 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateOpen(false)}
                className="rounded-xl cursor-pointer"
              >
                Отмена
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="rounded-xl cursor-pointer"
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
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900 uppercase tracking-wide">
              Редактировать категорию
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-400">
              Изменение названия категории.
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={editForm.handleSubmit(handleEdit)}
            className="space-y-4 my-2"
          >
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Название категории
              </label>
              <Input
                type="text"
                {...editForm.register("name")}
                className="rounded-xl border-slate-200"
              />
              {editForm.formState.errors.name && (
                <span className="text-[10px] text-rose-600 font-bold uppercase mt-1">
                  {editForm.formState.errors.name.message}
                </span>
              )}
            </div>

            <DialogFooter className="mt-6 pt-4 border-t border-slate-100 flex gap-2 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsEditOpen(false);
                }}
                className="rounded-xl cursor-pointer"
              >
                Отмена
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="rounded-xl cursor-pointer"
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
            <DialogTitle className="text-base font-bold text-rose-600 uppercase tracking-wide">
              Подтвердите удаление
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-400">
              Вы действительно хотите удалить эту категорию?
            </DialogDescription>
          </DialogHeader>

          {selectedCategory && (
            <div className="my-4 p-3 border border-slate-100 bg-slate-50 text-xs font-bold uppercase text-slate-700 rounded-xl">
              Категория: {selectedCategory.name}
            </div>
          )}

          <DialogFooter className="mt-4 pt-4 border-t border-slate-100 flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteOpen(false)}
              className="rounded-xl cursor-pointer"
            >
              Отмена
            </Button>
            <Button
              variant="destructive"
              onClick={onDeleteConfirm}
              disabled={submitting}
              className="rounded-xl cursor-pointer"
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
