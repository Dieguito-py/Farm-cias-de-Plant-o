const managePharmaciesLink = document.getElementById('managePharmacies');
const managePharmaciesModal = document.getElementById('managePharmaciesModal');
const addPharmacyModal = document.getElementById('addPharmacyModal');
const closeManagePharmaciesModalButton = document.getElementById('closeModalP');
const addPharmacyButton = document.getElementById('addPharmacy');
const closeAddPharmacyModalButton = document.getElementById('closeModalC');
const addPharmacyForm = document.getElementById('addPharmacyForm');
const pharmaciesList = document.getElementById('pharmaciesList');
const submitButton = document.querySelector('.submitt-button');

managePharmaciesLink.addEventListener('click', async (event) => {
  managePharmaciesModal.classList.remove('hidden');
  body.classList.add('blurred');
  await loadPharmacies();
});

closeManagePharmaciesModalButton.addEventListener('click', closeModal);

managePharmaciesModal.addEventListener('click', (event) => {
  if (event.target === managePharmaciesModal) {
    closeModal();
  }
});

addPharmacyModal.addEventListener('click', (event) => {
  if (event.target === addPharmacyModal) {
    addPharmacyModal.classList.add('hidden');
  }
});

addPharmacyButton.addEventListener('click', () => {
  addPharmacyModal.classList.remove('hidden');
});

closeAddPharmacyModalButton.addEventListener('click', () => {
  addPharmacyModal.classList.add('hidden');
});

async function loadPharmacies() {
  try {
    const response = await fetch('http://localhost:8080/pharmacy/user-pharmacies', {
      headers: {
        'method': 'GET',
        'adminId': userId
      }
    });

    if (!response.ok) throw new Error('Erro ao carregar as farmácias.');

    const pharmacies = await response.json();

    pharmaciesList.innerHTML = '';
    pharmacies.forEach((pharmacy) => {
      const li = document.createElement('li');
      li.classList.add('pharmacy-item');
      li.innerHTML = `
        <span>${pharmacy.name} - ${pharmacy.address}</span>
        <img src="assets/edit.png" alt="Editar" class="edit-icon" data-id="${pharmacy.id}">
        <img src="assets/delete.png" alt="Deletar" class="delete-icon" data-id="${pharmacy.id}">
      `;
      pharmaciesList.appendChild(li);
    });


    document.querySelectorAll('.edit-icon').forEach((icon) =>
      icon.addEventListener('click', (event) => {
        const pharmacyId = event.target.getAttribute('data-id');
        openEditPharmacyModal(pharmacyId);
      })
    );

    document.querySelectorAll('.delete-icon').forEach((icon) =>
      icon.addEventListener('click', (event) => {
        const pharmacyId = event.target.getAttribute('data-id');
        deletePharmacy(pharmacyId);
      })
    );
  } catch (error) {
    console.error('Erro ao carregar farmácias:', error.message);
    alert('Não foi possível carregar as farmácias.');
  }
}

function openEditPharmacyModal(pharmacyId) {
  const pharmacy = pharmacies.find((p) => p.id === Number(pharmacyId));
  if (pharmacy) {
    document.getElementById('pharmacyName').value = pharmacy.name;
    document.getElementById('pharmacyAddress').value = pharmacy.address;
    document.getElementById('pharmacyCity').value = pharmacy.city;
    document.getElementById('pharmacyState').value = pharmacy.state;
    document.getElementById('pharmacyPhone').value = pharmacy.phone;
    document.getElementById('pharmacyLatitude').value = pharmacy.latitude;
    document.getElementById('pharmacyLongitude').value = pharmacy.longitude;
    addPharmacyModal.classList.remove('hidden');
  }
}

async function deletePharmacy(pharmacyId) {
  try {
    const response = await fetch(`http://localhost:8080/pharmacy/${pharmacyId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) throw new Error('Erro ao deletar a farmácia.');

    alert('Farmácia deletada com sucesso!');
    await loadPharmacies();
  } catch (error) {
    console.error('Erro ao deletar farmácia:', error.message);
    alert('Não foi possível deletar a farmácia.');
  }
}

submitButton.addEventListener('click', async (event) => {
  event.preventDefault();

  const newPharmacy = {
    name: document.getElementById('pharmacyName').value.trim(),
    address: document.getElementById('pharmacyAddress').value.trim(),
    city: document.getElementById('pharmacyCity').value.trim(),
    state: document.getElementById('pharmacyState').value.trim(),
    phone: document.getElementById('pharmacyPhone').value.trim(),
    latitude: document.getElementById('pharmacyLatitude').value.trim(),
    longitude: document.getElementById('pharmacyLongitude').value.trim()
  };

  try {
    const response = await fetch('http://localhost:8080/pharmacy/', {
      mode: 'cors',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(newPharmacy)
    });

    if (!response.ok) throw new Error('Erro ao adicionar a farmácia.');

    alert('Farmácia adicionada com sucesso!');
    addPharmacyModal.classList.add('hidden');
    await loadPharmacies();
  } catch (error) {
    console.error('Erro ao adicionar farmácia:', error.message);
    alert('Não foi possível adicionar a farmácia.');
  }
});

function closeModal() {
  managePharmaciesModal.classList.add('hidden');
  body.classList.remove('blurred');
}