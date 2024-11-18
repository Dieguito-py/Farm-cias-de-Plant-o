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

    function addPin(latitude, longitude) {
        const customIcon = L.icon({
            iconUrl: 'assets/pin.png',
            iconSize: [32, 39],
            iconAnchor: [16, 32],
            popupAnchor: [0, -32]
        });

        L.marker([latitude, longitude], { icon: customIcon }).addTo(map)
            .bindPopup(`<b>Farmácia</b><br>${latitude}, ${longitude}`).openPopup();

        map.setView([latitude, longitude], 14);
    }

    window.addPin = addPin;
});
