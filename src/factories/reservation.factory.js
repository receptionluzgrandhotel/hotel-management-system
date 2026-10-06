import { Reservation } from '../models/reservation.model.js';

export class ReservationFactory {
  static fromRaw(rawReservation) {
    return new Reservation({
      confirmationNo: rawReservation.confirmationNo,
      arrival: rawReservation.arrival,
      departure: rawReservation.departure,
      roomNo: rawReservation.roomNo,
      roomCategoryLabel: rawReservation.roomCategoryLabel,
      guestName: rawReservation.guestName,
      adults: rawReservation.adults,
      children: rawReservation.children,
      rateCode: rawReservation.rateCode,
      effectiveRateAmount: rawReservation.effectiveRateAmount,
      status: rawReservation.status,
      marketCode: rawReservation.marketCode,
      originOfBooking: rawReservation.originOfBooking,
      paymentMethod: rawReservation.paymentMethod,
      currencyCode: rawReservation.currencyCode,
      externalReference: rawReservation.externalReference,
      companyName: rawReservation.companyName,
      billToAddress: rawReservation.billToAddress,
      products: rawReservation.products,
      comments: rawReservation.comments,
      notes: rawReservation.notes,
      sourceFile: rawReservation.sourceFile
    });
  }
}
