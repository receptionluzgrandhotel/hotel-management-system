import { Logger } from './utils/logger.js';
import { ErrorManager } from './utils/errorManager.js';
import { StorageAdapter } from './db/storage.js';
import { XmlReservationParser } from './services/xml-parser.service.js';
import { ReservationService } from './services/reservation.service.js';

const logger = new Logger(1000);
const errorManager = new ErrorManager(logger);
const storage = new StorageAdapter('grandhotel');
const parser = new XmlReservationParser(logger, errorManager);
storage.set('parser', parser);

const reservationService = new ReservationService(storage, logger, errorManager);

const dashboardStats = {
  total: document.querySelector('#stats-total'),
  arrivals: document.querySelector('#stats-arrivals'),
  rooms: document.querySelector('#stats-rooms'),
  amount: document.querySelector('#stats-amount')
};

const reservationTableBody = document.querySelector('#reservation-table-body');
const recentReservations = document.querySelector('#recent-reservations');
const logList = document.querySelector('#log-list');
const fileInput = document.querySelector('#file-input');

function formatCurrency(value) {
  return `${Number(value || 0).toFixed(2)} €`;
}

function renderStats(reservations) {
  const total = reservations.length;
  const arrivals = reservations.filter((r) => r.arrival === new Date().toLocaleDateString('fr-FR')).length;
  const occupiedRooms = new Set(reservations.filter((r) => r.roomNo).map((r) => r.roomNo)).size;
  const amount = reservations.reduce((sum, item) => sum + Number(item.effectiveRateAmount || 0), 0);

  dashboardStats.total.textContent = String(total);
  dashboardStats.arrivals.textContent = String(arrivals);
  dashboardStats.rooms.textContent = String(occupiedRooms);
  dashboardStats.amount.textContent = formatCurrency(amount);
}

function renderTable(reservations) {
  reservationTableBody.innerHTML = '';

  reservations.forEach((reservation) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${reservation.guestName || '—'}</td>
      <td>${reservation.roomNo || '—'} / ${reservation.roomCategoryLabel || '—'}</td>
      <td>${reservation.arrival || '—'}</td>
      <td>${reservation.departure || '—'}</td>
      <td>${reservation.status || '—'}</td>
      <td>${formatCurrency(reservation.effectiveRateAmount)}</td>
    `;
    reservationTableBody.appendChild(row);
  });
}

function renderRecent(reservations) {
  recentReservations.innerHTML = '';
  const recent = [...reservations].slice(-5).reverse();

  recent.forEach((reservation) => {
    const item = document.createElement('div');
    item.className = 'list-item';
    item.innerHTML = `<strong>${reservation.guestName || 'Client inconnu'}</strong><br>${reservation.arrival || '—'} → ${reservation.departure || '—'} • Chambre ${reservation.roomNo || '—'}`;
    recentReservations.appendChild(item);
  });
}

function renderLogs() {
  const entries = logger.getAll().slice(-20).reverse();
  logList.innerHTML = '';

  entries.forEach((entry) => {
    const item = document.createElement('div');
    item.className = `log-item ${entry.level}`;
    item.innerHTML = `<strong>${entry.level.toUpperCase()}</strong> • ${entry.message}<br><small>${entry.timestamp}</small>`;
    logList.appendChild(item);
  });
}

function activateView(targetId) {
  document.querySelectorAll('.nav-button').forEach((button) => {
    button.classList.toggle('active', button.dataset.view === targetId);
  });

  document.querySelectorAll('.view').forEach((panel) => {
    panel.classList.toggle('active', panel.id === targetId);
  });
}

function applyInitialData() {
  const reservations = reservationService.loadAll();
  renderStats(reservations);
  renderTable(reservations);
  renderRecent(reservations);
  renderLogs();
}

fileInput.addEventListener('change', async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  try {
    const xmlText = await file.text();
    const imported = reservationService.importFromXml(xmlText, file.name);
    const allReservations = reservationService.loadAll();
    renderStats(allReservations);
    renderTable(allReservations);
    renderRecent(allReservations);
    renderLogs();

    if (imported.length === 0) {
      logger.add('warning', 'Aucune réservation importée depuis le fichier XML', { file: file.name });
    } else {
      logger.add('success', 'Import XML terminé', { file: file.name, count: imported.length });
    }

    renderLogs();
  } catch (error) {
    errorManager.handle(error, { file: file.name, phase: 'file-upload' });
    renderLogs();
  }
});

document.querySelectorAll('.nav-button').forEach((button) => {
  button.addEventListener('click', () => activateView(button.dataset.view));
});

logger.add('info', 'Application démarrée');
applyInitialData();
