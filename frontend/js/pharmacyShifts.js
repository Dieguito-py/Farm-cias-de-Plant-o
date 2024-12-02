const managePharmaciesShiftsModal = document.getElementById("managePharmaciesShiftsModal");
const pharmaciesListShifts = document.getElementById("pharmaciesListShifts");
const modalShifts = document.getElementById('managePharmaciesShiftsModal');
const openModalBtn = document.getElementById('manageShifts');
const closeModalShiftsIcon = document.getElementById('closeModalIcon');
const createShiftModal = document.getElementById("createShiftModal");
const createShiftTitle = document.getElementById("createShiftTitle");

const startTimeInput = document.getElementById('startTime');
const endTimeInput = document.getElementById('endTime');
const recurrenceInput = document.getElementById('recurrence');
const closeModalCreateShiftsIcon = document.getElementById('closeCreateShiftModal');
const calendarEl = document.getElementById('calendar');

let selectedPharmacyId = null;
let calendar;

openModalBtn.addEventListener('click', async () => {
  modalShifts.style.display = 'flex';
  await loadPharmaciesForShifts();
});

closeModalShiftsIcon.addEventListener('click', () => {
  modalShifts.style.display = 'none';
});

modalShifts.addEventListener('click', (event) => {
  if (event.target === modalShifts) {
    modalShifts.style.display = 'none';
  }
});

closeModalCreateShiftsIcon.addEventListener('click', () => {
  createShiftModal.style.display = 'none';
});

async function loadPharmaciesForShifts() {
  try {
    const response = await fetch('http://localhost:8080/pharmacy/user-pharmacies', {
      method: 'GET',
      headers: { 'adminId': userId }
    });

    if (!response.ok) throw new Error('Erro ao carregar as farmácias.');

    const pharmacies = await response.json();

    pharmaciesListShifts.innerHTML = '';
    pharmacies.forEach(pharmacy => {
      const li = document.createElement('li');
      li.classList.add('pharmaciesListShifts');
      li.innerHTML = `<span>${pharmacy.name} - ${pharmacy.address}</span>`;
      li.addEventListener('click', () => openCreateShiftModal(pharmacy));
      pharmaciesListShifts.appendChild(li);
    });

  } catch (error) {
    console.error('Erro ao carregar farmácias:', error.message);
    alert('Não foi possível carregar as farmácias.');
  }
}

function openCreateShiftModal(pharmacy) {
  selectedPharmacyId = pharmacy.pharmacyId;
  createShiftTitle.textContent = `Criar Plantão - ${pharmacy.name}`;
  createShiftModal.style.display = 'flex';
  loadShifts();
}

async function loadShifts() {
  try {
    const response = await fetch(`http://localhost:8080/pharmacy/${selectedPharmacyId}/shifts`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) throw new Error('Erro ao carregar os plantões.');

    const shifts = await response.json();

    const filteredShifts = shifts.filter(shift => shift.pharmacyId === selectedPharmacyId);

    const events = processShiftsWithRecurrence(filteredShifts);

    renderCalendar(events);

  } catch (error) {
    console.error('Erro ao carregar os plantões:', error.message);
    alert('Não foi possível carregar os plantões.');
  }
}


function processShiftsWithRecurrence(shifts) {
  const events = [];

  shifts.forEach(shift => {
    const baseStart = `${shift.date}T${shift.startTime}`;
    const baseEnd = `${shift.date}T${shift.endTime}`;

    events.push({
      start: baseStart,
      end: baseEnd,
      color: '#28a745',
      extendedProps: { pharmacyId: shift.pharmacyId },
    });

    if (shift.recurrenceFrequency) {
      const recurrenceEvents = generateRecurrenceEvents({
        baseStart,
        baseEnd,
        frequency: shift.recurrenceFrequency,
      });
      events.push(...recurrenceEvents);
    }
  });

  return events;
}

function generateRecurrenceEvents({ baseStart, baseEnd, frequency }) {
  const events = [];
  const startDate = new Date(baseStart);
  const endDate = new Date(baseEnd);

  switch (frequency) {
    case 'DAILY':
      for (let i = 1; i <= 6; i++) {
        const newStart = new Date(startDate);
        const newEnd = new Date(endDate);
        newStart.setDate(startDate.getDate() + i);
        newEnd.setDate(endDate.getDate() + i);

        events.push({
          start: newStart.toISOString(),
          end: newEnd.toISOString(),
          color: '#28a745',
        });
      }
      break;

    case 'WEEKLY':
      for (let i = 1; i <= 5; i++) {
        const newStart = new Date(startDate);
        const newEnd = new Date(endDate);
        newStart.setDate(startDate.getDate() + i * 7);
        newEnd.setDate(endDate.getDate() + i * 7);

        events.push({
          start: newStart.toISOString(),
          end: newEnd.toISOString(),
          color: '#ffc107',
        });
      }
      break;

    case 'MONTHLY':
      for (let i = 1; i <= 2; i++) {
        const newStart = new Date(startDate);
        const newEnd = new Date(endDate);
        newStart.setMonth(startDate.getMonth() + i);
        newEnd.setMonth(endDate.getMonth() + i);

        events.push({
          start: newStart.toISOString(),
          end: newEnd.toISOString(),
          color: '#17a2b8',
        });
      }
      break;

    default:
      console.warn(`Recorrência desconhecida: ${frequency}`);
      break;
  }

  return events;
}

const selectedDateInput = document.getElementById('selectedDateInput');

function renderCalendar(events) {
  const calendarEl = document.getElementById('calendar');

  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay',
    },
    events: events,
    datesRender: function (info) {
      const daysWithShifts = events.map(event => event.start.toISOString().split('T')[0]);
      const cells = document.querySelectorAll('.fc-day');
      cells.forEach(cell => {
        const date = cell.getAttribute('data-date');
        if (daysWithShifts.includes(date)) {
          cell.classList.add('has-shift');
        } else {
          cell.classList.remove('has-shift');
        }
      });
    },
    dateClick: function (info) {
      const clickedDate = info.dateStr;
      selectedDateInput.value = clickedDate;
    }
  });

  calendar.render();
}

document.getElementById('saveShiftBtn').addEventListener('click', async () => {
  const selectedDate = document.getElementById('selectedDateInput').value;
  const startTime = document.getElementById('startTime').value;
  const endTime = document.getElementById('endTime').value;
  const recurrence = document.getElementById('recurrence').value;

  if (!selectedDate || !startTime || !endTime) {
    alert('Por favor, preencha todos os campos obrigatórios.');
    return;
  }

  const baseDate = new Date(selectedDate);
  const shifts = [];

  shifts.push({
    id: "",
    date: selectedDate,
    startTime,
    endTime,
    recurrenceFrequency: recurrence !== 'none' ? recurrence.toUpperCase() : null,
  });

  if (recurrence === 'daily') {
    for (let i = 1; i <= 6; i++) {
      const nextDate = new Date(baseDate);
      nextDate.setDate(baseDate.getDate() + i);

      shifts.push({
        id: "",
        date: nextDate.toISOString().split('T')[0],
        startTime,
        endTime,
        recurrenceFrequency: 'DAILY',
      });
    }
  } else if (recurrence === 'weekly') {
    for (let i = 1; i <= 5; i++) {
      const nextDate = new Date(baseDate);
      nextDate.setDate(baseDate.getDate() + i * 7);

      shifts.push({
        id: "",
        date: nextDate.toISOString().split('T')[0],
        startTime,
        endTime,
        recurrenceFrequency: 'WEEKLY',
      });
    }
  } else if (recurrence === 'monthly') {
    for (let i = 1; i <= 2; i++) {
      const nextDate = new Date(baseDate);
      nextDate.setMonth(baseDate.getMonth() + i);

      shifts.push({
        id: "",
        date: nextDate.toISOString().split('T')[0],
        startTime,
        endTime,
        recurrenceFrequency: 'MONTHLY',
      });
    }
  }

  try {
    const response = await fetch(`http://localhost:8080/pharmacy/shifts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'mode': 'cors',
        'token': token,
        'pharmacyId': selectedPharmacyId,
      },
      body: JSON.stringify(shifts),
    });

    if (!response.ok) throw new Error('Erro ao salvar os plantões.');

    alert('Plantões criados com sucesso!');
    loadShifts();
  } catch (error) {
    console.error('Erro ao salvar os plantões:', error.message);
    alert('Não foi possível salvar os plantões.');
  }
});
