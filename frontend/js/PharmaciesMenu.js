import { fetchPharmacies } from './getPharmacies.js';

document.addEventListener('DOMContentLoaded', async () => {
    const menuContainer = document.getElementById('sideMenu');
    const toggleButton = document.getElementById('menuButton');

    if (!menuContainer) {
        console.error('Elemento #pharmacies-menu não encontrado no DOM!');
        return;
    }

    menuContainer.style.display = 'flex';
    menuContainer.style.flexDirection = 'column';
    menuContainer.style.overflowY = 'auto';

    const pharmacies = await fetchPharmacies();
    pharmacies.forEach(pharmacy => {
        const card = document.createElement('div');
        card.classList.add('pharmacy-card');
        card.innerHTML = `
            <h3>${pharmacy.name}</h3>
            <p><strong>Endereço:</strong> ${pharmacy.address}, ${pharmacy.city} - ${pharmacy.state}</p>
            <p><strong>Telefone:</strong> ${pharmacy.phone}</p>
        `;

        card.addEventListener('click', () => {
            window.addPin(pharmacy.latitude, pharmacy.longitude);
        });

        menuContainer.appendChild(card);
    });

    toggleButton.addEventListener('click', () => {
        if (menuContainer.style.display === 'none') {
            menuContainer.style.display = 'flex';
        } else {
            menuContainer.style.display = 'none';
        }
    });
});
