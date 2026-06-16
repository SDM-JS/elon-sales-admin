"use client";

<<<<<<< HEAD
import React, { useState, useEffect } from "react";
=======
import React, { useState, useEffect, useCallback } from "react";
>>>>>>> 4737b9446fa7f0d132ceae4e984849930c3ca881
import { Users, Plus, Search, ShieldAlert, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

import { getUsers, createUser, updateUser, deleteUser } from "@/lib/api";
import { UsersTable } from "@/components/users/users-table";
import { UserDialogs } from "@/components/users/user-dialogs";
<<<<<<< HEAD

interface User {
  id: string;
  fullName: string;
  phoneNumber: string;
  password?: string;
  createdAt: string;
}
=======

import { User } from "@/components/users/types";

>>>>>>> 4737b9446fa7f0d132ceae4e984849930c3ca881

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Load users on mount
<<<<<<< HEAD
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
=======
  const fetchUsers = useCallback(async () => {
>>>>>>> 4737b9446fa7f0d132ceae4e984849930c3ca881
    try {
      setLoading(true);
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      console.error("Ошибка при получении пользователей:", err);
<<<<<<< HEAD
      toast.error("Произошла ошибка при загрузке данных.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Create Submit
  const onCreateSubmit = async (values: any) => {
=======
      toast.error("Маълумотларни юклашда хатолик юз берди.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Handle Create Submit
  const onCreateSubmit = async (values: {
    fullName: string;
    phoneNumber: string;
  }) => {
>>>>>>> 4737b9446fa7f0d132ceae4e984849930c3ca881
    console.log("Create User Submit Payload:", values);
    try {
      setSubmitting(true);
      const newUser = await createUser(values);
      console.log("Create User API Response:", newUser);
<<<<<<< HEAD
      toast.success("Пользователь успешно добавлен!");
=======
      toast.success("Фойдаланувчи муваффақиятли қўшилди!");
>>>>>>> 4737b9446fa7f0d132ceae4e984849930c3ca881
      setIsCreateOpen(false);
      fetchUsers();
    } catch (err: any) {
      console.error("Ошибка при создании пользователя:", err);
      toast.error(
<<<<<<< HEAD
        err.response?.data?.error ||
          "Произошла ошибка при добавлении пользователя.",
=======
        err.response?.data?.error || "Фойдаланувчи қўшишда хатолик юз берди.",
>>>>>>> 4737b9446fa7f0d132ceae4e984849930c3ca881
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Edit Submit
<<<<<<< HEAD
  const onEditSubmit = async (values: any) => {
=======
  const onEditSubmit = async (values: {
    fullName: string;
    phoneNumber: string;
    password?: string;
  }) => {
>>>>>>> 4737b9446fa7f0d132ceae4e984849930c3ca881
    if (!selectedUser) return;
    console.log("Update User Submit Payload:", {
      id: selectedUser.id,
      ...values,
    });
    try {
      setSubmitting(true);
      const updated = await updateUser(selectedUser.id, values);
      console.log("Update User API Response:", updated);
<<<<<<< HEAD
      toast.success("Данные пользователя успешно обновлены!");
=======
      toast.success("Фойдаланувчи маълумотлари янгиланди!");
>>>>>>> 4737b9446fa7f0d132ceae4e984849930c3ca881
      setIsEditOpen(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (err: any) {
      console.error("Ошибка при обновлении пользователя:", err);
<<<<<<< HEAD
      toast.error(
        err.response?.data?.error || "Произошла ошибка при редактировании.",
      );
=======
      toast.error(err.response?.data?.error || "Таҳрирлашда хатолик юз берди.");
>>>>>>> 4737b9446fa7f0d132ceae4e984849930c3ca881
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Delete Confirmation
  const onDeleteConfirm = async () => {
    if (!selectedUser) return;
    console.log("Delete User ID:", selectedUser.id);
    try {
      setSubmitting(true);
      const deleted = await deleteUser(selectedUser.id);
      console.log("Delete User API Response:", deleted);
<<<<<<< HEAD
      toast.success("Пользователь успешно удален из системы!");
=======
      toast.success("Фойдаланувчи тизимдан ўчирилди!");
>>>>>>> 4737b9446fa7f0d132ceae4e984849930c3ca881
      setIsDeleteOpen(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (err: any) {
      console.error("Ошибка при удалении пользователя:", err);
<<<<<<< HEAD
      toast.error(
        err.response?.data?.error || "Произошла ошибка при удалении.",
      );
=======
      toast.error(err.response?.data?.error || "Ўчиришда хатолик юз берди.");
>>>>>>> 4737b9446fa7f0d132ceae4e984849930c3ca881
    } finally {
      setSubmitting(false);
    }
  };

  // Open Edit Modal
  const openEdit = (user: User) => {
    setSelectedUser(user);
    setIsEditOpen(true);
  };

  // Open Delete Modal
  const openDelete = (user: User) => {
    setSelectedUser(user);
    setIsDeleteOpen(true);
  };

  // Filter users
  const filteredUsers = users.filter(
    (user) =>
      user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phoneNumber.includes(searchQuery),
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header section */}
      <div className="flex flex-col gap-4 border-b border-slate-100 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-black tracking-tight text-slate-900 uppercase flex items-center gap-2">
            <Users className="h-6 w-6 text-indigo-600 shrink-0" />
            Управление пользователями
          </h1>
          <p className="text-slate-500 text-xs uppercase tracking-wide font-medium">
<<<<<<< HEAD
            Контроль зарегистрированных покупателей системы и добавление новых
            участников.
=======
            Тизимдан рўйхатдан ўтган харидорларни назорат қилиш ва янги аъзолар
            қўшиш.
>>>>>>> 4737b9446fa7f0d132ceae4e984849930c3ca881
          </p>
        </div>

        <Button
          onClick={() => setIsCreateOpen(true)}
          className="uppercase tracking-wider cursor-pointer rounded-xl px-4 py-2.5 shadow-md shadow-indigo-150"
        >
          <Plus className="h-4 w-4 mr-1" />
          Добавить участника
        </Button>
      </div>

      {/* Filter / Search bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between border border-slate-100 bg-white p-4 rounded-2xl shadow-sm shadow-slate-100/30">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            type="text"
<<<<<<< HEAD
            placeholder="Поиск участников по имени или номеру телефона..."
=======
            placeholder="Аъзоларни исми ёки телефон рақами бўйича излаш..."
>>>>>>> 4737b9446fa7f0d132ceae4e984849930c3ca881
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 rounded-xl border-slate-200"
          />
        </div>
      </div>

      {/* Users Table */}
      {loading ? (
        <div className="p-12 text-center flex flex-col items-center justify-center min-h-[300px] border border-slate-100 bg-white rounded-2xl">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mb-4" />
          <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">
<<<<<<< HEAD
            Загрузка данных...
=======
            Маълумотлар юкланмоқда...
>>>>>>> 4737b9446fa7f0d132ceae4e984849930c3ca881
          </p>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="p-12 text-center flex flex-col items-center justify-center min-h-[300px] border border-slate-100 bg-white rounded-2xl">
          <div className="flex h-12 w-12 items-center justify-center bg-slate-50 border border-slate-100 text-slate-400 mb-4 rounded-xl">
            <Users className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">
<<<<<<< HEAD
            Пользователи не найдены
=======
            Аъзолар топилмади
>>>>>>> 4737b9446fa7f0d132ceae4e984849930c3ca881
          </h3>
          <p className="mt-2 text-xs text-slate-400 max-w-sm uppercase">
            По данному запросу или в системе пока нет ни одного пользователя.
          </p>
        </div>
      ) : (
        <UsersTable
          users={filteredUsers}
          onEdit={openEdit}
          onDelete={openDelete}
        />
      )}

      {/* Info Panel */}
      <div className="flex items-start gap-3 border border-slate-100 bg-white p-4 text-[11px] text-slate-500 leading-relaxed rounded-2xl shadow-sm shadow-slate-100/20">
        <ShieldAlert className="h-4.5 w-4.5 shrink-0 text-indigo-600 mt-0.5" />
        <span>
<<<<<<< HEAD
          База данных пользователей управляет покупателями системы. Здесь можно
          редактировать ФИО, номера телефонов и пароли участников, а также
          добавлять новых пользователей.
=======
          Фойдаланувчилар базаси тизим харидорларини бошқаради. Бу ерда аъзолар
          исми-шарифи, телефон рақами ва махфий сўзларини таҳрирлаш ёки янги
          аъзолар қўшиш мумкин.
>>>>>>> 4737b9446fa7f0d132ceae4e984849930c3ca881
        </span>
      </div>

      {/* User Dialogs Modals */}
      <UserDialogs
        isCreateOpen={isCreateOpen}
        setIsCreateOpen={setIsCreateOpen}
        isEditOpen={isEditOpen}
        setIsEditOpen={setIsEditOpen}
        isDeleteOpen={isDeleteOpen}
        setIsDeleteOpen={setIsDeleteOpen}
        selectedUser={selectedUser}
        submitting={submitting}
        onCreateSubmit={onCreateSubmit}
        onEditSubmit={onEditSubmit}
        onDeleteConfirm={onDeleteConfirm}
      />
    </div>
  );
}
