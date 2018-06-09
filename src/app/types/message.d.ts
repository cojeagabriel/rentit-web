export interface Message {
    _id?: string,
    _senderId: string,
    _recieverId: string,
    title: string,
    content: string,
    dateYear: number,
    dateMonth: number,
    dateDay: number,
    dateHour: number,
    dateMinute: number
}