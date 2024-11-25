// Elementos do modal
const managePharmaciesLink = document.getElementById('managePharmacies');
const managePharmaciesModal = document.getElementById('managePharmaciesModal');
const addPharmacyModal = document.getElementById('addPharmacyModal');
const closeManagePharmaciesModalButton = document.getElementById('closeModalP');
const addPharmacyButton = document.getElementById('addPharmacy');
const closeAddPharmacyModalButton = document.getElementById('closeModalC');
const addPharmacyForm = document.getElementById('addPharmacyForm');
const pharmaciesList = document.getElementById('pharmaciesList');

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

// Abrir o modal de Adicionar Farmácia
addPharmacyButton.addEventListener('click', () => {
  addPharmacyModal.classList.remove('hidden');
});

// Fechar o modal de Adicionar Farmácia
closeAddPharmacyModalButton.addEventListener('click', () => {
  addPharmacyModal.classList.add('hidden');
});

// Função para carregar a lista de farmácias do backend
async function loadPharmacies() {
  try {
    const response = await fetch('http://localhost:8080/pharmacy/user-pharmacies', {
      headers: {
        'method': 'GET',
        'adminId': userId // use a variável userId ou substitua por uma maneira de capturar o ID do usuário logado
      }
    });

    if (!response.ok) throw new Error('Erro ao carregar as farmácias.');

    const pharmacies = await response.json();

    // Limpar a lista e adicionar as farmácias
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

    // Adicionar eventos para editar e deletar
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

// Função para abrir o modal de edição com dados da farmácia
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

// Função para deletar farmácia
async function deletePharmacy(pharmacyId) {
  try {
    const response = await fetch(`http://localhost:8080/pharmacy/${pharmacyId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}` // Passe o token de autenticação aqui
      }
    });

    if (!response.ok) throw new Error('Erro ao deletar a farmácia.');

    alert('Farmácia deletada com sucesso!');
    await loadPharmacies(); // Atualizar a lista
  } catch (error) {
    console.error('Erro ao deletar farmácia:', error.message);
    alert('Não foi possível deletar a farmácia.');
  }
}

// Função para adicionar uma nova farmácia
addPharmacyForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const newPharmacy = {
    name: document.getElementById('pharmacyName').value,
    address: document.getElementById('pharmacyAddress').value,
    city: document.getElementById('pharmacyCity').value,
    state: document.getElementById('pharmacyState').value,
    phone: document.getElementById('pharmacyPhone').value,
    latitude: document.getElementById('pharmacyLatitude').value,
    longitude: document.getElementById('pharmacyLongitude').value
  };

  try {
    const response = await fetch('http://localhost:8080/pharmacy/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Passe o token de autenticação aqui
      },
      body: JSON.stringify(newPharmacy)
    });

    if (!response.ok) throw new Error('Erro ao adicionar a farmácia.');

    alert('Farmácia adicionada com sucesso!');
    addPharmacyModal.classList.add('hidden');
    await loadPharmacies(); // Atualizar a lista de farmácias
  } catch (error) {
    console.error('Erro ao adicionar farmácia:', error.message);
    alert('Não foi possível adicionar a farmácia.');
  }
});

function closeModal() {
    managePharmaciesModal.classList.add('hidden');
    body.classList.remove('blurred');
  }
  