"use client";

import React, { useState, useEffect } from "react";
import { Edit2, Trash2, PlusCircle, Loader2, Eye, X, MessageCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner"; // Заменено на современный toast вместо alert

import {
  createCarusel,
  getCarusels,
  deleteCarusel,
  updateCarusel,
  sendMessages,
} from "@/lib/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Sale } from "./types";
interface CarouselItem {
  id: string;
  image: string;
  saleId: string;
  sale?: Sale;
}

interface SalesTableProps {
  sales: Sale[];
  onEdit: (sale: Sale) => void;
  onDelete: (sale: Sale) => void;
  onCarouselSuccess?: () => void;
}

export function SalesTable({
  sales,
  onEdit,
  onDelete,
  onCarouselSuccess,
}: SalesTableProps) {
  const [selectedSaleIds, setSelectedSaleIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null)

  // Состояния карусели
  const [carousels, setCarousels] = useState<CarouselItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoadingCarousels, setIsLoadingCarousels] = useState(false);

  // Загрузка элементов карусели с бэкенда
  const fetchCarousels = async () => {
    try {
      setIsLoadingCarousels(true);
      const data = await getCarusels();
      setCarousels(data);
    } catch (error) {
      console.error("Ошибка при загрузке карусели:", error);
      toast.error("Не удалось загрузить элементы карусели");
    } finally {
      setIsLoadingCarousels(false);
    }
  };

  // Обновление карусели при открытии модального окна
  useEffect(() => {
    if (isModalOpen) {
      fetchCarousels();
    }
  }, [isModalOpen]);

  // Выбор одного элемента
  const handleSelectSale = (id: string) => {
    setSelectedSaleIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const sendMessage = async (id: string) => {
    try {
      const result = sendMessages(id)
      setResult(result)
    } catch (error) {
      console.error("Send message error: ", error)
    }
  }

  // Выбор всех элементов
  const handleSelectAll = () => {
    if (selectedSaleIds.length === sales.length) {
      setSelectedSaleIds([]);
    } else {
      setSelectedSaleIds(sales.map((sale) => sale.id));
    }
  };

  // Добавление выбранных товаров в карусель (POST)
  const handleSendToCarousel = async () => {
    if (selectedSaleIds.length === 0) return;

    const carouselPayload = sales
      .filter((sale) => selectedSaleIds.includes(sale.id))
      .map((sale) => ({
        image: sale.images && sale.images[0] ? sale.images[0] : "",
        saleId: sale.id,
      }));

    try {
      setIsSubmitting(true);
      await createCarusel(carouselPayload);
      toast.success("Товары успешно добавлены в карусель!");
      setSelectedSaleIds([]);
      if (onCarouselSuccess) onCarouselSuccess();
    } catch (error: any) {
      console.error("Ошибка при добавлении в карусель:", error);
      toast.error(
        error?.response?.data?.message ||
        "Произошла ошибка при добавлении в карусель",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Удаление элемента карусели (DELETE)
  const handleDeleteCarouselItem = async (id: string) => {
    if (!confirm("Вы уверены, что хотите удалить этот элемент из карусели?"))
      return;

    try {
      await deleteCarusel(id);
      setCarousels((prev) => prev.filter((item) => item.id !== id));
      toast.success("Элемент успешно удален из карусели");
    } catch (error) {
      console.error("Ошибка при удалении карусели:", error);
      toast.error("Не удалось удалить элемент");
    }
  };

  // Редактирование URL-адреса изображения элемента карусели (PUT)
  const handleEditCarouselItem = async (id: string, currentImage: string) => {
    const newImageUrl = prompt(
      "Введите новый URL-адрес изображения для карусели:",
      currentImage,
    );
    if (newImageUrl === null || newImageUrl.trim() === "") return;

    try {
      await updateCarusel(id, { image: newImageUrl });
      setCarousels((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, image: newImageUrl } : item,
        ),
      );
      toast.success("Изображение карусели успешно обновлено!");
    } catch (error) {
      console.error("Ошибка при обновлении карусели:", error);
      toast.error("Не удалось обновить изображение");
    }
  };

  return (
    <div className="space-y-4">
      {/* Верхняя панель управления */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
          Управление скидками
        </h2>
        <Button
          onClick={() => setIsModalOpen(true)}
          variant="outline"
          className="h-9 px-4 border-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
        >
          <Eye className="h-4 w-4" />
          Показать карусель
        </Button>
      </div>

      {/* Панель добавления, если товары выбраны */}
      {selectedSaleIds.length > 0 && (
        <div className="flex items-center justify-between bg-indigo-50 border border-indigo-100 p-4 rounded-2xl animate-in fade-in-50 duration-200">
          <span className="text-xs font-bold text-indigo-700 uppercase">
            Выбрано товаров: {selectedSaleIds.length} шт.
          </span>
          <Button
            onClick={handleSendToCarousel}
            disabled={isSubmitting}
            className="h-9 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-sm disabled:opacity-70"
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <PlusCircle className="h-4 w-4" />
            )}
            {isSubmitting ? "Отправка..." : "Добавить в карусель"}
          </Button>
        </div>
      )}

      {/* Основная таблица объявлений */}
      <div className="border border-slate-100 bg-white rounded-2xl overflow-hidden shadow-sm shadow-slate-100/50">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/60 border-b border-slate-100">
              <TableHead className="w-[50px] px-4 py-4 text-center">
                <Checkbox
                  checked={
                    sales.length > 0 && selectedSaleIds.length === sales.length
                  }
                  onCheckedChange={handleSelectAll}
                  disabled={isSubmitting}
                />
              </TableHead>
              <TableHead className="px-6 py-4 font-bold text-[10px] text-slate-400 uppercase tracking-widest">
                Фото
              </TableHead>
              <TableHead className="px-6 py-4 font-bold text-[10px] text-slate-400 uppercase tracking-widest">
                Товар
              </TableHead>
              <TableHead className="px-6 py-4 font-bold text-[10px] text-slate-400 uppercase tracking-widest">
                Категория
              </TableHead>
              <TableHead className="px-6 py-4 font-bold text-[10px] text-slate-400 uppercase tracking-widest">
                Магазин / Продавец
              </TableHead>
              <TableHead className="px-6 py-4 font-bold text-[10px] text-slate-400 uppercase tracking-widest">
                Цены
              </TableHead>
              <TableHead className="px-6 py-4 font-bold text-[10px] text-slate-400 uppercase tracking-widest">
                Скидка
              </TableHead>
              <TableHead className="px-6 py-4 font-bold text-[10px] text-slate-400 uppercase tracking-widest">
                Срок действия
              </TableHead>
              <TableHead className="px-6 py-4 font-bold text-[10px] text-slate-400 uppercase tracking-widest text-right">
                Действия
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sales.map((sale) => (
              <TableRow
                key={sale.id}
                className={`border-b border-slate-100 hover:bg-slate-50/40 transition-colors ${selectedSaleIds.includes(sale.id)
                  ? "bg-indigo-50/20 hover:bg-indigo-50/30"
                  : ""
                  }`}
              >
                <TableCell className="px-4 py-4 text-center">
                  <Checkbox
                    checked={selectedSaleIds.includes(sale.id)}
                    onCheckedChange={() => handleSelectSale(sale.id)}
                    disabled={isSubmitting}
                  />
                </TableCell>
                <TableCell className="px-6 py-4">
                  {sale.images && sale.images[0] ? (
                    <img
                      src={sale.images[0]}
                      alt={sale.productName}
                      className="h-10 w-10 object-cover border border-slate-100 rounded-xl shadow-inner"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="h-10 w-10 bg-slate-50 border border-slate-100 flex items-center justify-center text-[8px] text-slate-400 font-bold rounded-xl uppercase">
                      НЕТ ФОТО
                    </div>
                  )}
                </TableCell>
                <TableCell className="px-6 py-4 font-bold text-slate-800 uppercase tracking-wide text-xs">
                  {sale.productName}
                </TableCell>
                <TableCell className="px-6 py-4 text-xs font-semibold text-slate-700 uppercase">
                  {sale.categories?.name || (
                    <span className="text-slate-300">Неизвестно</span>
                  )}
                </TableCell>
                <TableCell className="px-6 py-4 text-xs font-bold text-slate-700 uppercase">
                  {sale.seller?.brandName || (
                    <span className="text-slate-300">Неизвестно</span>
                  )}
                </TableCell>
                <TableCell className="px-6 py-4 text-xs text-slate-500 font-medium">
                  <div className="line-through text-slate-300 text-[10px]">
                    {sale.lastPrice.toLocaleString()} сум
                  </div>
                  <div className="font-bold text-slate-900">
                    {sale.salePrice.toLocaleString()} сум
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <span className="inline-flex items-center text-[10px] font-extrabold text-rose-600 bg-rose-50 px-2.5 py-0.5 border border-rose-100 uppercase tracking-wider rounded-lg">
                    -{sale.percentageDiscount}%
                  </span>
                </TableCell>
                <TableCell className="px-6 py-4 text-xs text-slate-500 font-mono">
                  {sale.expires
                    ? new Date(sale.expires).toLocaleDateString("ru-RU")
                    : "—"}
                </TableCell>
                <TableCell className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2.5">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(sale)}
                      disabled={isSubmitting}
                      className="h-8 rounded-xl border-slate-150 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-all cursor-pointer text-[10px] uppercase font-bold tracking-wider"
                    >
                      <Edit2 className="h-3 w-3 mr-1 text-slate-400" />
                      Редактировать
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(sale)}
                      disabled={isSubmitting}
                      className="h-8 rounded-xl text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-all cursor-pointer text-[10px] uppercase font-bold tracking-wider"
                    >
                      <Trash2 className="h-3 w-3 mr-1 text-rose-400" />
                      Удалить
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => sendMessage(sale.id)}
                      disabled={isSubmitting}
                      className="h-8 rounded-xl text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-all cursor-pointer text-[10px] uppercase font-bold tracking-wider"
                    >
                      <Send className="h-3 w-3 mr-1 text-rose-400" />
                      Отправить
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* МОДАЛЬНОЕ ОКНО УПРАВЛЕНИЯ ЭЛЕМЕНТАМИ КАРУСЕЛИ */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col shadow-xl">
            {/* Заголовок модального окна */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                  Текущие элементы карусели
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Список товаров, отображаемых на главном баннере
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Содержимое модального окна (Таблица карусели) */}
            <div className="p-6 overflow-y-auto flex-1">
              {isLoadingCarousels ? (
                <div className="py-12 flex flex-col items-center justify-center text-slate-400 gap-2 text-xs font-medium">
                  <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
                  Загрузка элементов карусели...
                </div>
              ) : carousels.length === 0 ? (
                <div className="py-12 text-center text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Карусель пуста. Добавьте товары из таблицы ниже.
                </div>
              ) : (
                <div className="border border-slate-100 rounded-xl overflow-hidden">
                  <Table>
                    <TableHeader className="bg-slate-50/50">
                      <TableRow>
                        <TableHead className="font-bold text-[10px] text-slate-400 uppercase tracking-widest px-4 py-3">
                          Баннер
                        </TableHead>
                        <TableHead className="font-bold text-[10px] text-slate-400 uppercase tracking-widest px-4 py-3">
                          Название товара
                        </TableHead>
                        <TableHead className="font-bold text-[10px] text-slate-400 uppercase tracking-widest px-4 py-3">
                          ID Скидки
                        </TableHead>
                        <TableHead className="font-bold text-[10px] text-slate-400 uppercase tracking-widest text-right px-4 py-3">
                          Действия
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {carousels.map((item) => (
                        <TableRow
                          key={item.id}
                          className="hover:bg-slate-50/30 transition-colors"
                        >
                          <TableCell className="px-4 py-3">
                            <img
                              src={item.image}
                              alt="Carousel"
                              className="h-10 w-16 object-cover rounded-lg border border-slate-100 shadow-sm"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display =
                                  "none";
                              }}
                            />
                          </TableCell>
                          <TableCell className="font-semibold text-xs text-slate-700 px-4 py-3">
                            {item.sale?.productName || (
                              <span className="text-slate-300 italic">
                                Товар удален или недоступен
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="font-mono text-[10px] text-slate-400 px-4 py-3">
                            {item.saleId}
                          </TableCell>
                          <TableCell className="text-right px-4 py-3">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  handleEditCarouselItem(item.id, item.image)
                                }
                                className="h-7 px-2 text-[10px] font-bold uppercase rounded-lg border-slate-200 hover:bg-indigo-50 hover:text-indigo-600"
                              >
                                Изменить фото
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() =>
                                  handleDeleteCarouselItem(item.id)
                                }
                                className="h-7 px-2 text-[10px] font-bold uppercase rounded-lg text-rose-600 hover:bg-rose-50"
                              >
                                Удалить
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>

            {/* Футер модального окна */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/30 flex justify-end">
              <Button
                onClick={() => setIsModalOpen(false)}
                className="h-9 px-4 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer"
              >
                Закрыть
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}