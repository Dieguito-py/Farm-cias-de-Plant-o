// main.js

document.addEventListener('DOMContentLoaded', function () {
    var map = L.map('map', {
        zoomControl: false,
        attributionControl: false
    }).setView([-26.867164753064678, -52.418200803351624], 12);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd',
    }).addTo(map);

    const menuButton = document.getElementById('menuButton');
    const sideMenu = document.getElementById('sideMenu');
    const resizeBar = document.getElementById('resizeBar');

    menuButton.addEventListener('click', () => {
        sideMenu.classList.toggle('hidden'); 

        if (sideMenu.classList.contains('hidden')) {
            resizeBar.classList.add('hidden');
        } else {
            resizeBar.classList.remove('hidden');
        }
    });

    let isResizing = false;

    resizeBar.addEventListener('mousedown', (e) => {
        isResizing = true;
        document.body.style.cursor = 'ew-resize';
    });

    document.addEventListener('mousemove', (e) => {
        if (isResizing) {
            const newWidth = e.clientX - sideMenu.getBoundingClientRect().left;
            if (newWidth >= 200 && newWidth <= 600) {
                sideMenu.style.width = newWidth + 'px';
                resizeBar.style.left = newWidth + 58 + 'px';
            }
        }
    });

    document.addEventListener('mouseup', () => {
        isResizing = false;
        document.body.style.cursor = 'default';
    });

    // Função para adicionar o pin no mapa
    function addPin(latitude, longitude) {
        // Adiciona o marcador no mapa com base nas coordenadas fornecidas
        L.marker([latitude, longitude]).addTo(map)
            .bindPopup(`<b>Farmácia</b><br>${latitude}, ${longitude}`).openPopup();
        map.setView([latitude, longitude], 14); // Alinha o mapa para o marcador
    }

    // Expondo a função addPin globalmente
    window.addPin = addPin;
});
