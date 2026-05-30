import axios from "axios"

const API_BASE_URL = "https://saledos-1.onrender.com/api"

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Categories Endpoints
export const getCategories = async () => {
  const response = await api.get("/categories")
  return response.data
}

export const createCategory = async (name: string) => {
  const response = await api.post("/categories", { name })
  return response.data
}

export const updateCategory = async (id: string, name: string) => {
  const response = await api.put("/categories", { id, name })
  return response.data
}

export const deleteCategory = async (id: string) => {
  const response = await api.delete("/categories", { data: { id } })
  return response.data
}

// Users Endpoints
export const getUsers = async () => {
  const response = await api.get("/users")
  return response.data
}

export const createUser = async (data: any) => {
  const response = await api.post("/users", data)
  return response.data
}

export const updateUser = async (id: string, data: any) => {
  const response = await api.put(`/users/${id}`, { id, ...data })
  return response.data
}

export const deleteUser = async (id: string) => {
  const response = await api.delete(`/users/${id}`, { data: { id } })
  return response.data
}

// Sellers Endpoints
export const getSellers = async () => {
  const response = await api.get("/seller")
  return response.data
}

export const createSeller = async (data: any) => {
  const response = await api.post("/seller", data)
  return response.data
}

export const updateSeller = async (id: string, data: any) => {
  const response = await api.put(`/seller/${id}`, { id, ...data })
  return response.data
}

export const deleteSeller = async (id: string) => {
  const response = await api.delete(`/seller/${id}`, { data: { id } })
  return response.data
}

// Sales Endpoints
export const getSales = async () => {
  const response = await api.get("/sales")
  return response.data
}

export const createSale = async (sellerId: string, formData: FormData) => {
  const response = await api.post(`/sales/${sellerId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
  return response.data
}

export const updateSale = async (saleId: string, formData: FormData) => {
  const response = await api.put(`/sales/put/${saleId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
  return response.data
}

export const deleteSale = async (saleId: string) => {
  const response = await api.delete(`/sales/${saleId}`)
  return response.data
}
