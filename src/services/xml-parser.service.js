export class XmlReservationParser {
  constructor(logger, errorManager) {
    this.logger = logger;
    this.errorManager = errorManager;
  }

  parse(xmlString, sourceFile = 'import.xml') {
    try {
      const parser = new DOMParser();
      const xml = parser.parseFromString(xmlString, 'application/xml');

      const parserError = xml.querySelector('parsererror');
      if (parserError) {
        throw new Error(`XML invalide : ${parserError.textContent}`);
      }

      const reservationNodes = xml.querySelectorAll('G_RESERVATION');
      const reservations = [];

      reservationNodes.forEach((node) => {
        const raw = {
          confirmationNo: this.getText(node, 'CONFIRMATION_NO'),
          arrival: this.getText(node, 'ARRIVAL'),
          departure: this.getText(node, 'DEPARTURE'),
          roomNo: this.getText(node, 'ROOM_NO'),
          roomCategoryLabel: this.getText(node, 'ROOM_CATEGORY_LABEL'),
          guestName: this.getText(node, 'FULL_NAME'),
          adults: this.getNumber(node, 'ADULTS'),
          children: this.getNumber(node, 'CHILDREN'),
          rateCode: this.getText(node, 'RATE_CODE'),
          effectiveRateAmount: this.getNumber(node, 'EFFECTIVE_RATE_AMOUNT'),
          status: this.getText(node, 'SHORT_RESV_STATUS'),
          marketCode: this.getText(node, 'MARKET_CODE'),
          originOfBooking: this.getText(node, 'ORIGIN_OF_BOOKING'),
          paymentMethod: this.getText(node, 'PAYMENT_METHOD'),
          currencyCode: this.getText(node, 'CURRENCY_CODE') || 'EUR',
          externalReference: this.getText(node, 'EXTERNAL_REFERENCE'),
          companyName: this.getText(node, 'COMPANY_NAME'),
          billToAddress: this.getText(node, 'BILL_TO_ADDRESS'),
          products: this.extractProducts(node),
          comments: this.extractComments(node),
          notes: this.extractNotes(node),
          sourceFile
        };

        reservations.push(raw);
      });

      this.logger.add('info', 'XML analysé avec succès', {
        sourceFile,
        count: reservations.length
      });

      return reservations;
    } catch (error) {
      this.errorManager.handle(error, {
        sourceFile,
        phase: 'parse-xml'
      });
      throw error;
    }
  }

  getText(parentNode, tagName) {
    const node = parentNode.querySelector(tagName);
    return node ? node.textContent.trim() : '';
  }

  getNumber(parentNode, tagName) {
    const value = this.getText(parentNode, tagName);
    if (!value) return 0;
    return Number(String(value).replace(',', '.')) || 0;
  }

  extractProducts(node) {
    const raw = this.getText(node, 'PRODUCTS');
    if (!raw) return [];

    return raw
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
      .map((item) => item.replace(/\*?\-1\*?/g, '').trim())
      .filter(Boolean);
  }

  extractComments(node) {
    const list = node.querySelectorAll('G_COMMENT_RESV_NAME_ID');
    const comments = [];
    list.forEach((item) => {
      const value = item.querySelector('RES_COMMENT');
      if (value) comments.push(value.textContent.trim());
    });
    return comments;
  }

  extractNotes(node) {
    const list = node.querySelectorAll('G_COMMENT_NAME_ID');
    const notes = [];
    list.forEach((item) => {
      const value = item.querySelector('PROFILE_NOTE');
      if (value) notes.push(value.textContent.trim());
    });
    return notes;
  }
}
