import { NgbDateStruct, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';

export interface Order {
    _id?: string,
    id?: number,
    _rentorId: string,
    _clientId: string,
    address?: string,
    city?: string,
    region?: string,
    zip?: number,
    _productId: string,
    quantity: number,
    price?: number,
    fromDateYear: number,
    fromDateMonth: number,
    fromDateDay: number,
    fromDateHour: number,
    fromDateMinute: number,
    toDateYear: number,
    toDateMonth: number,
    toDateDay: number,
    toDateHour: number,
    toDateMinute: number,
    status: string
}