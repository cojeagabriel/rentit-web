export interface Product {
    _id?: string;
    title: string;
    _ownerId: string;
    category: string;
    description: string;
    quantity: number;
    price: number;
    pricePer: string;
}