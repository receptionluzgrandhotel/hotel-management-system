export class Reservation {
  constructor({
    confirmationNo,
    arrival,
    departure,
    roomNo,
    roomCategoryLabel,
    guestName,
    adults,
    children,
    rateCode,
    effectiveRateAmount,
    status,
    marketCode,
    originOfBooking,
    paymentMethod,
    currencyCode,
    externalReference,
    companyName,
    billToAddress,
    products,
    comments,
    notes,
    sourceFile
  }) {
    this.confirmationNo = confirmationNo || '';
    this.arrival = arrival || '';
    this.departure = departure || '';
    this.roomNo = roomNo || '';
    this.roomCategoryLabel = roomCategoryLabel || '';
    this.guestName = guestName || '';
    this.adults = Number(adults || 0);
    this.children = Number(children || 0);
    this.rateCode = rateCode || '';
    this.effectiveRateAmount = Number(effectiveRateAmount || 0);
    this.status = status || '';
    this.marketCode = marketCode || '';
    this.originOfBooking = originOfBooking || '';
    this.paymentMethod = paymentMethod || '';
    this.currencyCode = currencyCode || 'EUR';
    this.externalReference = externalReference || '';
    this.companyName = companyName || '';
    this.billToAddress = billToAddress || '';
    this.products = Array.isArray(products) ? products : [];
    this.comments = Array.isArray(comments) ? comments : [];
    this.notes = Array.isArray(notes) ? notes : [];
    this.sourceFile = sourceFile || 'inconnu';
  }
}
