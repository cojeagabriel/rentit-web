import { Image } from "./image";

export interface Product {
    _id?: string,
    title: string,
    _ownerId: string,
    category: string,
    description: string,
    quantity: number,
    available: number,
    price: number,
    pricePer: string,
    images: Image[],
    rating?: number
}