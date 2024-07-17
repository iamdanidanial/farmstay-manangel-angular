export interface Booking {
    id           : number
    startDate    : string;
    endDate      : string;
    totalPrice   : number;
    roomId       : number;
    guestId      : number;
    bookingMethod: string;
    paymentMethod: string;
    paymentStatus: string;
    paymentDate  : string;
    bookingNumber: string;
}