import test from 'node:test';
import assert from 'node:assert/strict';
import { XmlReservationParser } from '../src/services/xml-parser.service.js';
import { Logger } from '../src/utils/logger.js';
import { ErrorManager } from '../src/utils/errorManager.js';

const logger = new Logger(50);
const errorManager = new ErrorManager(logger);
const parser = new XmlReservationParser(logger, errorManager);

test('Le parseur XML extrait les champs d’une réservation', () => {
  const xml = `
    <RES_DETAIL>
      <LIST_G_GROUP_BY1>
        <G_GROUP_BY1>
          <LIST_G_RESERVATION>
            <G_RESERVATION>
              <CONFIRMATION_NO>270967100</CONFIRMATION_NO>
              <ARRIVAL>14/09/26</ARRIVAL>
              <DEPARTURE>16/09/26</DEPARTURE>
              <ROOM_NO>11</ROOM_NO>
              <ROOM_CATEGORY_LABEL>SUP</ROOM_CATEGORY_LABEL>
              <FULL_NAME>STERNBERG,Adam,MR</FULL_NAME>
              <ADULTS>2</ADULTS>
              <CHILDREN>0</CHILDREN>
              <RATE_CODE>SMART10</RATE_CODE>
              <EFFECTIVE_RATE_AMOUNT>376.2</EFFECTIVE_RATE_AMOUNT>
              <SHORT_RESV_STATUS>DEPO</SHORT_RESV_STATUS>
              <MARKET_CODE>INDIV</MARKET_CODE>
              <ORIGIN_OF_BOOKING>OTA</ORIGIN_OF_BOOKING>
              <PAYMENT_METHOD>CB VAD</PAYMENT_METHOD>
              <CURRENCY_CODE>EUR</CURRENCY_CODE>
              <PRODUCTS>TXSEJOUR</PRODUCTS>
              <EXTERNAL_REFERENCE>6925267064</EXTERNAL_REFERENCE>
              <COMPANY_NAME>Booking.com</COMPANY_NAME>
              <BILL_TO_ADDRESS>131 Upper Richmond R</BILL_TO_ADDRESS>
            </G_RESERVATION>
          </LIST_G_RESERVATION>
        </G_GROUP_BY1>
      </LIST_G_GROUP_BY1>
    </RES_DETAIL>
  `;

  const result = parser.parse(xml, 'test.xml');

  assert.equal(result.length, 1);
  assert.equal(result[0].guestName, 'STERNBERG,Adam,MR');
  assert.equal(result[0].roomNo, '11');
  assert.deepEqual(result[0].products, ['TXSEJOUR']);
});

test('La mémoire de logs se limite à 1000 entrées', () => {
  const smallLogger = new Logger(3);
  smallLogger.add('info', '1');
  smallLogger.add('info', '2');
  smallLogger.add('info', '3');
  smallLogger.add('info', '4');

  assert.equal(smallLogger.getAll().length, 3);
  assert.equal(smallLogger.getAll()[0].message, '2');
});
