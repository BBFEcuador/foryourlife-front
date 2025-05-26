export interface Product {
    id: string
    name: string
    code: string
    basePrice: number
    currency: string
    description: string
    rules: any
    programs: Program[]
    isActive: boolean
}

export interface Content {
    id: string
    name: string
    code: string
    basePrice: number
    currency: string
    description: string
    rules: any
    programs: Program[]
    isActive: boolean
}

export interface Program {
    id: string
    name: string
    courseLevel: string
}

export interface Pageable {
    pageNumber: number
    pageSize: number
    sort: Sort
    offset: number
    paged: boolean
    unpaged: boolean
}

export interface Sort {
    empty: boolean
    sorted: boolean
    unsorted: boolean
}