"use client";

import React, { useState, useEffect } from "react";
import { Users, Plus, Search, ShieldAlert, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

import { getUsers, createUser, updateUser, deleteUser } from "@/lib/api";
import { UsersTable } from "@/components/users/users-table";
import { UserDialogs } from "@/components/users/user-dialogs";

interface User {
  id: string;
  fullName: string;
  phoneNumber: string;
  password?: string;
  createdAt: string;
}

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
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      console.error("Ошибка при получении пользователей:", err);
      toast.error("Маълумотларни юклашда хатолик юз берди.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Handle Create Submit
  const onCreateSubmit = async (values: {
    fullName: string;
    phoneNumber: string;
    password: string;
  }) => {
    console.log("Create User Submit Payload:", values);
    try {
      setSubmitting(true);
      const newUser = await createUser(values);
      console.log("Create User API Response:", newUser);
      toast.success("Фойдаланувчи муваффақиятли қўшилди!");
      setIsCreateOpen(false);
      fetchUsers();
    } catch (err: any) {
      console.error("Ошибка при создании пользователя:", err);
      toast.error(
        err.response?.data?.error || "Фойдаланувчи қўшишда хатолик юз берди.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Edit Submit
  const onEditSubmit = async (values: {
    fullName: string;
    phoneNumber: string;
    password?: string;
  }) => {
    if (!selectedUser) return;
    console.log("Update User Submit Payload:", {
      id: selectedUser.id,
      ...values,
    });
    try {
      setSubmitting(true);
      const updated = await updateUser(selectedUser.id, values);
      console.log("Update User API Response:", updated);
      toast.success("Фойдаланувчи маълумотлари янгиланди!");
      setIsEditOpen(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (err: any) {
      console.error("Ошибка при обновлении пользователя:", err);
      toast.error(err.response?.data?.error || "Таҳрирлашда хатолик юз берди.");
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
      toast.success("Фойдаланувчи тизимдан ўчирилди!");
      setIsDeleteOpen(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (err: any) {
      console.error("Ошибка при удалении пользователя:", err);
      toast.error(err.response?.data?.error || "Ўчиришда хатолик юз берди.");
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
            Фойдаланувчилар Бошқаруви
          </h1>
          <p className="text-slate-500 text-xs uppercase tracking-wide font-medium">
            Тизимдан рўйхатдан ўтган харидорларни назорат қилиш ва янги аъзолар
            қўшиш.
          </p>
        </div>

        <Button
          onClick={() => setIsCreateOpen(true)}
          className="uppercase tracking-wider cursor-pointer rounded-xl px-4 py-2.5 shadow-md shadow-indigo-150"
        >
          <Plus className="h-4 w-4 mr-1" />
          Аъзо Қўшиш
        </Button>
      </div>

      {/* Filter / Search bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between border border-slate-100 bg-white p-4 rounded-2xl shadow-sm shadow-slate-100/30">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            type="text"
            placeholder="Аъзоларни исми ёки телефон рақами бўйича излаш..."
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
            Маълумотлар юкланмоқда...
          </p>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="p-12 text-center flex flex-col items-center justify-center min-h-[300px] border border-slate-100 bg-white rounded-2xl">
          <div className="flex h-12 w-12 items-center justify-center bg-slate-50 border border-slate-100 text-slate-400 mb-4 rounded-xl">
            <Users className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">
            Аъзолар топилмади
          </h3>
          <p className="mt-2 text-xs text-slate-400 max-w-sm uppercase">
            Қидирув бўйича ёки тизимда биронта ҳам фойдаланувчи мавжуд эмас.
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
          Фойдаланувчилар базаси тизим харидорларини бошқаради. Бу ерда аъзолар
          исми-шарифи, телефон рақами ва махфий сўзларини таҳрирлаш ёки янги
          аъзолар қўшиш мумкин.
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
