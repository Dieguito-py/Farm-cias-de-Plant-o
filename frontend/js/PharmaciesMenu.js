let selectedDate = new Date();

function formatDate(date) {
    const dayOfWeek = date.toLocaleString('default', { weekday: 'long' });
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return { dayOfWeek, fullDate: `${day}/${month}/${year}` };
}

function updateDateDisplay() {
    const { dayOfWeek, fullDate } = formatDate(selectedDate);
    document.getElementById('dayOfWeek').textContent = dayOfWeek;
    document.getElementById('fullDate').textContent = fullDate;
}

document.getElementById('prevDay').addEventListener('click', () => {
    selectedDate.setDate(selectedDate.getDate() - 1);
    updateDateDisplay();
    fetchShiftsForSelectedDay();
});

document.getElementById('nextDay').addEventListener('click', () => {
    selectedDate.setDate(selectedDate.getDate() + 1);
    updateDateDisplay();
    fetchShiftsForSelectedDay();
});

async function fetchShiftsForSelectedDay() {
    try {
        const response = await fetch(`http://localhost:8080/pharmacy/on-duty?date=${selectedDate.toISOString().split('T')[0]}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) throw new Error('Erro ao carregar os plantões.');

        const shifts = await response.json();
        updateSideMenu(shifts);
    } catch (error) {
        console.error('Erro ao buscar os plantões:', error.message);
        alert('Não foi possível carregar os plantões.');
    }
}

function updateSideMenu(shifts) {
    const sideMenu = document.getElementById('pharmaciesMenu');
    sideMenu.innerHTML = '';

    if (shifts.length > 0) {
        shifts.forEach(shift => {
            const pharmacy = shift; 
            const shiftDiv = document.createElement('div');
            shiftDiv.classList.add('pharmacy-card');
            shiftDiv.innerHTML = `
                <h3>${pharmacy.name}</h3>
                <p><strong>Endereço:</strong> ${pharmacy.address}, ${pharmacy.city} - ${pharmacy.state}</p>
                <p><strong>Telefone:</strong> ${pharmacy.phone}</p>
                <h4>Horário de Funcionamento</h4>
                <p>${shift.startTime} às ${shift.endTime}</p> 
            `;
            shiftDiv.addEventListener('click', () => {
                window.addPin(pharmacy.latitude, pharmacy.longitude);
            });

            sideMenu.appendChild(shiftDiv);
        });
    } else {
        sideMenu.innerHTML = '<h5>Não há plantões para este dia.</h5>';
    }
}

updateDateDisplay();
fetchShiftsForSelectedDay();
