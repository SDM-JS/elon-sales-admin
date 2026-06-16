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

// Схемы валидации Zod
const createUserSchema = z.object({
  fullName: z.string().min(1, "Имя и фамилия обязательны для заполнения!"),
  phoneNumber: z.string().min(5, "Номер телефона обязателен для заполнения!"),
  password: z.string().min(6, "Пароль должен состоять минимум из 6 символов!"),
});

const editUserSchema = z.object({
  fullName: z.string().min(1, "Имя и фамилия обязательны для заполнения!"),
  phoneNumber: z.string().min(5, "Номер телефона обязателен для заполнения!"),
  password: z.string().refine((val) => val.length === 0 || val.length >= 6, {
    message: "Пароль должен состоять минимум из 6 символов!",
  }),
});

type CreateUserValues = z.infer<typeof createUserSchema>;
type EditUserValues = z.infer<typeof editUserSchema>;

interface User {
  id: string;
  fullName: string;
  phoneNumber: string;
  password?: string;
}

interface UserDialogsProps {
  isCreateOpen: boolean;
  setIsCreateOpen: (open: boolean) => void;
  isEditOpen: boolean;
  setIsEditOpen: (open: boolean) => void;
  isDeleteOpen: boolean;
  setIsDeleteOpen: (open: boolean) => void;
  selectedUser: User | null;
  submitting: boolean;
  onCreateSubmit: (values: CreateUserValues) => Promise<void>;
  onEditSubmit: (values: EditUserValues) => Promise<void>;
  onDeleteConfirm: () => Promise<void>;
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
  onDeleteConfirm,
}: UserDialogsProps) {
  // Формы
  const createForm = useForm<CreateUserValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: { fullName: "", phoneNumber: "", password: "" },
  });

  const editForm = useForm<EditUserValues>({
    resolver: zodResolver(editUserSchema),
    defaultValues: { fullName: "", phoneNumber: "", password: "" },
  });

  // Автозаполнение формы редактирования
  React.useEffect(() => {
    if (selectedUser) {
      editForm.setValue("fullName", selectedUser.fullName);
      editForm.setValue("phoneNumber", selectedUser.phoneNumber);
      editForm.setValue("password", ""); // Начинаем с пустой строки (без изменений)
    }
  }, [selectedUser]);

  const handleCreate = async (values: CreateUserValues) => {
    await onCreateSubmit(values);
    createForm.reset();
  };

  const handleEdit = async (values: EditUserValues) => {
    await onEditSubmit(values);
    editForm.reset();
  };

  return (
    <>
      {/* МОДАЛЬНОЕ ОКНО СОЗДАНИЯ */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900 uppercase tracking-wide">
              Добавить нового участника
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-400">
              Создание учетной записи для нового покупателя в системе.
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={createForm.handleSubmit(handleCreate)}
            className="space-y-4 my-2"
          >
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Имя и Фамилия
              </label>
              <Input
                type="text"
                {...createForm.register("fullName")}
                placeholder="Имя и фамилия"
                className="rounded-xl border-slate-200"
              />
              {createForm.formState.errors.fullName && (
                <span className="text-[10px] text-rose-600 font-bold uppercase mt-1">
                  {createForm.formState.errors.fullName.message}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Номер телефона
              </label>
              <Input
                type="text"
                {...createForm.register("phoneNumber")}
                placeholder="Например: +998901234567"
                className="rounded-xl border-slate-200"
              />
              {createForm.formState.errors.phoneNumber && (
                <span className="text-[10px] text-rose-600 font-bold uppercase mt-1">
                  {createForm.formState.errors.phoneNumber.message}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Пароль
              </label>
              <Input
                type="password"
                {...createForm.register("password")}
                placeholder="Минимум 6 символов"
                className="rounded-xl border-slate-200"
              />
              {createForm.formState.errors.password && (
                <span className="text-[10px] text-rose-600 font-bold uppercase mt-1">
                  {createForm.formState.errors.password.message}
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

      {/* МОДАЛЬНОЕ ОКНО РЕДАКТИРОВАНИЯ */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900 uppercase tracking-wide">
              Редактировать данные участника
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-400">
              Редактирование профиля пользователя. (Оставьте поле пустым, чтобы
              пароль остался без изменений)
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={editForm.handleSubmit(handleEdit)}
            className="space-y-4 my-2"
          >
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Имя и Фамилия
              </label>
              <Input
                type="text"
                {...editForm.register("fullName")}
                className="rounded-xl border-slate-200"
              />
              {editForm.formState.errors.fullName && (
                <span className="text-[10px] text-rose-600 font-bold uppercase mt-1">
                  {editForm.formState.errors.fullName.message}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Номер телефона
              </label>
              <Input
                type="text"
                {...editForm.register("phoneNumber")}
                className="rounded-xl border-slate-200"
              />
              {editForm.formState.errors.phoneNumber && (
                <span className="text-[10px] text-rose-600 font-bold uppercase mt-1">
                  {editForm.formState.errors.phoneNumber.message}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Пароль
              </label>
              <Input
                type="text"
                {...editForm.register("password")}
                placeholder="Оставьте пустым для сохранения прежнего пароля"
                className="rounded-xl border-slate-200"
              />
              {editForm.formState.errors.password && (
                <span className="text-[10px] text-rose-600 font-bold uppercase mt-1">
                  {editForm.formState.errors.password.message}
                </span>
              )}
            </div>

            <DialogFooter className="mt-6 pt-4 border-t border-slate-100 flex gap-2 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditOpen(false)}
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

      {/* МОДАЛЬНОЕ ОКНО ПОДТВЕРЖДЕНИЯ УДАЛЕНИЯ */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="max-w-sm rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-rose-600 uppercase tracking-wide">
              Подтвердите удаление участника
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-400">
              Вы действительно хотите удалить данного пользователя?
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="my-4 p-3 border border-slate-100 bg-slate-50 text-xs font-bold uppercase text-slate-700 rounded-xl">
              Покупатель: {selectedUser.fullName} ({selectedUser.phoneNumber})
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
