"use client";

import React, { useState, useEffect } from "react";
import { FolderOpen, Plus, Search, ShieldAlert, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/lib/api";
import { CategoriesTable } from "@/components/categories/categories-table";
import { CategoryDialogs } from "@/components/categories/category-dialogs";

interface Category {
  id: string;
  name: string;
  createdAt: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );
  const [submitting, setSubmitting] = useState(false);

  // Load categories on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      console.error("Ошибка при получении категорий:", err);
      toast.error("Произошла ошибка при загрузке данных.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Create Submit
  const onCreateSubmit = async (values: { name: string }) => {
    console.log("Create Category Submit Payload:", values);
    try {
      setSubmitting(true);
      const newCat = await createCategory(values.name);
      console.log("Create Category API Response:", newCat);
      toast.success("Категория успешно добавлена!");
      setIsCreateOpen(false);
      fetchCategories();
    } catch (err: any) {
      console.error("Ошибка при создании категории:", err);
      toast.error(
        err.response?.data?.error ||
          "Произошла ошибка при добавлении категории.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Edit Submit
  const onEditSubmit = async (values: { name: string }) => {
    if (!selectedCategory) return;
    console.log("Update Category Submit Payload:", {
      id: selectedCategory.id,
      ...values,
    });
    try {
      setSubmitting(true);
      const updated = await updateCategory(selectedCategory.id, values.name);
      toast.success("Категория успешно обновлена!");
      setIsEditOpen(false);
      setSelectedCategory(null);
      fetchCategories();
    } catch (err: any) {
      console.error("Ошибка при обновлении категории:", err);
      toast.error(
        err.response?.data?.error ||
          "Произошла ошибка при редактировании категории.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Delete Confirmation
  const onDeleteConfirm = async () => {
    if (!selectedCategory) return;
    console.log("Delete Category ID:", selectedCategory.id);
    try {
      setSubmitting(true);
      const deleted = await deleteCategory(selectedCategory.id);
      console.log("Delete Category API Response:", deleted);
      toast.success("Категория успешно удалена!");
      setIsDeleteOpen(false);
      setSelectedCategory(null);
      fetchCategories();
    } catch (err: any) {
      console.error("Ошибка при удалении категории:", err);
      toast.error(
        err.response?.data?.error || "Произошла ошибка при удалении категории.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Open Edit Modal
  const openEdit = (cat: Category) => {
    setSelectedCategory(cat);
    setIsEditOpen(true);
  };

  // Open Delete Modal
  const openDelete = (cat: Category) => {
    setSelectedCategory(cat);
    setIsDeleteOpen(true);
  };

  // Filter category list
  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header section */}
      <div className="flex flex-col gap-4 border-b border-slate-100 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-black tracking-tight text-slate-900 uppercase flex items-center gap-2">
            <FolderOpen className="h-6 w-6 text-indigo-600 shrink-0" />
            Управление категориями
          </h1>
          <p className="text-slate-500 text-xs uppercase tracking-wide font-medium">
            Контроль и добавление разделов и категорий товаров на платформе.
          </p>
        </div>

        <Button
          onClick={() => setIsCreateOpen(true)}
          className="uppercase tracking-wider cursor-pointer rounded-xl px-4 py-2.5 shadow-md shadow-indigo-150"
        >
          <Plus className="h-4 w-4 mr-1" />
          Добавить категорию
        </Button>
      </div>

      {/* Filter / Search bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between border border-slate-100 bg-white p-4 rounded-2xl shadow-sm shadow-slate-100/30">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            type="text"
            placeholder="Поиск категорий по названию..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 rounded-xl border-slate-200"
          />
        </div>
      </div>

      {/* Table Display */}
      {loading ? (
        <div className="p-12 text-center flex flex-col items-center justify-center min-h-[300px] border border-slate-100 bg-white rounded-2xl">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mb-4" />
          <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">
            Загрузка данных...
          </p>
        </div>
      ) : filteredCategories.length === 0 ? (
        <div className="p-12 text-center flex flex-col items-center justify-center min-h-[300px] border border-slate-100 bg-white rounded-2xl">
          <div className="flex h-12 w-12 items-center justify-center bg-slate-50 border border-slate-100 text-slate-400 mb-4 rounded-xl">
            <FolderOpen className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">
            Категории не найдены
          </h3>
          <p className="mt-2 text-xs text-slate-400 max-w-sm">
            По данному запросу или в системе пока нет ни одной категории.
          </p>
        </div>
      ) : (
        <FolderOpen className="hidden" /> && (
          <CategoriesTable
            categories={filteredCategories}
            onEdit={openEdit}
            onDelete={openDelete}
          />
        )
      )}

      {/* Info Panel */}
      <div className="flex items-start gap-3 border border-slate-100 bg-white p-4 text-[11px] text-slate-500 leading-relaxed rounded-2xl shadow-sm shadow-slate-100/20">
        <ShieldAlert className="h-4.5 w-4.5 shrink-0 text-indigo-600 mt-0.5" />
        <span>
          Управление категориями осуществляется через системную таблицу. Вы
          можете вводить новые названия, просматривать и редактировать
          привязанные товары. Запросы на изменение и удаление применяются к базе
          данных в реальном времени.
        </span>
      </div>

      {/* Dialog Modals */}
      <CategoryDialogs
        isCreateOpen={isCreateOpen}
        setIsCreateOpen={setIsCreateOpen}
        isEditOpen={isEditOpen}
        setIsEditOpen={setIsEditOpen}
        isDeleteOpen={isDeleteOpen}
        setIsDeleteOpen={setIsDeleteOpen}
        selectedCategory={selectedCategory}
        submitting={submitting}
        onCreateSubmit={onCreateSubmit}
        onEditSubmit={onEditSubmit}
        onDeleteConfirm={onDeleteConfirm}
      />
    </div>
  );
}
