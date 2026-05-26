export interface Sale {
  id: string
  productName: string
  images: string[]
  lastPrice: number
  salePrice: number
  percentageDiscount: number
  desc?: string | null
  expires: string
  sellerId: string
  categoryId: string
  seller?: { brandName: string }
  categories?: { name: string }
}

export interface Seller {
  id: string
  brandName: string
}

export interface Category {
  id: string
  name: string
}
