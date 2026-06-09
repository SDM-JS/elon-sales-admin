"use client"

import React, { useEffect, useState } from "react"
import { 
  Store, 
  Tag, 
  FolderOpen, 
  Users, 
  ArrowUpRight, 
  Activity,
  Loader2,
  RefreshCw,
  CheckCircle2,
  XCircle
} from "lucide-react"
import Link from "next/link"

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  getSellers, 
  getSales, 
  getCategories, 
  getUsers 
} from "@/lib/api"

interface DashboardStats {
  sellers: number | null
  sales: number | null
  categories: number | null
  users: number | null
}

interface ApiStatus {
  connected: boolean | null
  responseTime: number | null
  loading: boolean
}

export default function Home() {
  const [stats, setStats] = useState<DashboardStats>({
    sellers: null,
    sales: null,
    categories: null,
    users: null,
  })
  const [loading, setLoading] = useState(true)
  const [apiStatus, setApiStatus] = useState<ApiStatus>({
    connected: null,
    responseTime: null,
    loading: true,
  })
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchDashboardData = async () => {
    setLoading(true)
    setApiStatus(prev => ({ ...prev, loading: true }))
    const start = performance.now()

    try {
      const [sellersData, salesData, categoriesData, usersData] = await Promise.all([
        getSellers(),
        getSales(),
        getCategories(),
        getUsers(),
      ])

      const elapsed = Math.round(performance.now() - start)

      setStats({
        sellers: Array.isArray(sellersData) ? sellersData.length : (sellersData?.data?.length ?? 0),
        sales: Array.isArray(salesData) ? salesData.length : (salesData?.data?.length ?? 0),
        categories: Array.isArray(categoriesData) ? categoriesData.length : (categoriesData?.data?.length ?? 0),
        users: Array.isArray(usersData) ? usersData.length : (usersData?.data?.length ?? 0),
      })

      setApiStatus({ connected: true, responseTime: elapsed, loading: false })
      setLastUpdated(new Date())
    } catch {
      setApiStatus({ connected: false, responseTime: null, loading: false })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const formatValue = (value: number | null) => {
    if (value === null) return "—"
    return value.toLocaleString("uz-UZ")
  }

  const statCards = [
    {
      title: "Жами сотувчилар",
      value: formatValue(stats.sellers),
      description: "Фаол тижорат ҳамкорлари",
      icon: Store,
      link: "/sellers",
      label: "Сотувчиларни бошқариш",
      color: "from-blue-500 to-indigo-500",
      shadow: "shadow-indigo-100/50",
    },
    {
      title: "Фаол акциялар",
      value: formatValue(stats.sales),
      description: "Жорий чегирмали таклифлар",
      icon: Tag,
      link: "/sales",
      label: "Акцияларни бошқариш",
      color: "from-pink-500 to-rose-500",
      shadow: "shadow-rose-100/50",
    },
    {
      title: "Категориялар",
      value: formatValue(stats.categories),
      description: "Тизимдаги маҳсулот бўлимлари",
      icon: FolderOpen,
      link: "/categories",
      label: "Бўлимларни бошқариш",
      color: "from-amber-500 to-orange-500",
      shadow: "shadow-orange-100/50",
    },
    {
      title: "Фойдаланувчилар",
      value: formatValue(stats.users),
      description: "Рўйхатдан ўтган харидорлар",
      icon: Users,
      link: "/users",
      label: "Аъзоларни бошқариш",
      color: "from-emerald-500 to-teal-500",
      shadow: "shadow-teal-100/50",
    },
  ]

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Welcome Section */}
      <div className="flex flex-col gap-2 border-b border-slate-100 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 uppercase sm:text-3xl">
            Хуш келибсиз, Администратор
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm uppercase tracking-wide font-medium mt-1">
            ELON платформасининг тизим ҳолати ва асосий маълумотлари.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {lastUpdated && (
            <span className="text-[10px] text-slate-400 font-mono uppercase">
              {lastUpdated.toLocaleTimeString("uz-UZ")}
            </span>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={fetchDashboardData}
            disabled={loading}
            className="text-[10px] font-bold uppercase tracking-wider border-slate-200 hover:bg-slate-50"
          >
            <RefreshCw className={`h-3 w-3 mr-1.5 ${loading ? "animate-spin" : ""}`} />
            Янгилаш
          </Button>
        </div>
      </div>

      {/* Grid of Stats Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card 
            key={stat.title}
            className={`transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${stat.shadow} border-slate-100 hover:border-slate-200/80`}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{stat.title}</span>
              <div className={`flex h-9 w-9 items-center justify-center bg-gradient-to-br ${stat.color} text-white rounded-xl shadow-md`}>
                <stat.icon className="h-4.5 w-4.5" />
              </div>
            </CardHeader>

            <CardContent className="mt-4 flex flex-col gap-2">
              <div className="flex items-baseline gap-2">
                {loading ? (
                  <Loader2 className="h-7 w-7 animate-spin text-slate-300" />
                ) : (
                  <span className="text-3xl font-black tracking-tight text-slate-900">{stat.value}</span>
                )}
                {!loading && (
                  <span className="flex items-center text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 border border-emerald-100 gap-1 uppercase tracking-wider rounded-full">
                    <Activity className="h-2.5 w-2.5 animate-pulse" />
                    Фаол
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 font-medium">{stat.description}</p>
            </CardContent>

            <CardFooter className="mt-auto border-t border-slate-50 pt-4 flex items-center justify-between bg-slate-50/30">
              <Button variant="link" size="sm" asChild className="p-0 text-indigo-600 hover:text-indigo-700 font-bold uppercase tracking-wider">
                <Link 
                  href={stat.link} 
                  className="text-[10px] flex items-center gap-1"
                >
                  {stat.label}
                  <ArrowUpRight className="h-3 w-3" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Platform Status / Actions */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2 border-slate-100 shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm font-bold text-slate-900 uppercase tracking-widest">Тизим ҳақида умумий маълумот</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-xs text-slate-600 leading-relaxed">
            <p>
              Ушбу бошқарув панели тўғридан-тўғри <strong>ELON Backend</strong> базаси билан ишлайди. Чап томондаги меню орқали тизимдаги субъектларни бошқаришингиз мумкин.
            </p>
            <p>
              Ҳар бир бўлимда тўлиқ <strong>CRUD (Яратиш, Ўқиш, Таҳрирлаш, Ўчириш)</strong> амалларини бажариш имконияти мавжуд. Киритилган ўзгаришлар фойдаланувчи ва сотувчи иловаларида реал вақтда акс этади.
            </p>
          </CardContent>
        </Card>

        <Card className="flex flex-col justify-between border-slate-100 shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm font-bold text-slate-900 uppercase tracking-widest">Сервер уланиши</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 font-mono text-[10px]">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-slate-400 uppercase">API Ҳолати</span>
              {apiStatus.loading ? (
                <Loader2 className="h-3 w-3 animate-spin text-slate-400" />
              ) : apiStatus.connected ? (
                <span className="inline-flex items-center gap-1 font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 border border-emerald-100 uppercase tracking-wider rounded-full">
                  <CheckCircle2 className="h-3 w-3" />
                  Уланган
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 font-bold text-red-600 bg-red-50 px-2 py-0.5 border border-red-100 uppercase tracking-wider rounded-full">
                  <XCircle className="h-3 w-3" />
                  Хато
                </span>
              )}
            </div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-slate-400 uppercase">Маълумотлар базаси</span>
              <span className="font-bold text-slate-700 uppercase">PostgreSQL</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400 uppercase">ORM Тизими</span>
              <span className="font-bold text-slate-700 uppercase">Prisma Client</span>
            </div>
          </CardContent>
          
          <CardFooter className="mt-6 border-t border-slate-50 pt-4 text-[9px] text-slate-500 flex items-center justify-between uppercase bg-slate-50/20">
            <span>Жавоб вақти:</span>
            {apiStatus.loading ? (
              <span className="font-bold text-slate-400">—</span>
            ) : (
              <span className="font-bold text-slate-900">
                {apiStatus.responseTime !== null ? `${apiStatus.responseTime}мс` : "—"}
              </span>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
