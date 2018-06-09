export interface Review {
    _id?: string,
    _userId: string,
    userFirstName: string,
    userLastName: string,
    _productId: string,
    rating: number,
    review: string,
    title: string,
    dateYear: number,
    dateMonth: number,
    dateDay: number,
}