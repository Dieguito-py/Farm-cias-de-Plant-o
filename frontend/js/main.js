let map;
document.addEventListener('DOMContentLoaded', function () {
    var map = L.map('map', {
        zoomControl: false,
        attributionControl: false,
        minZoom: 6,
    }).setView([-26.867164753064678, -52.418200803351624], 12);

    // Adicionar o tile layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd',
    }).addTo(map);

    let routingControl = null; // Controle da rota atual
    let routeLine = null; // Linha simples conectando o trajeto

    const defaultLocation = { lat: -26.867164753064678, lng: -52.418200803351624 }; // Localização padrão

    // Função para adicionar um marcador no mapa
    function addPin(latitude, longitude, pharmacy, isUser = false) {
        const iconUrl = isUser ? 'assets/pin.png' : 'assets/pin.png';
        const customIcon = L.icon({
            iconUrl: iconUrl,
            iconSize: [32, 39],
            iconAnchor: [16, 32],
            popupAnchor: [0, -32]
        });

        window.addPin = addPin;

        const marker = L.marker([latitude, longitude], { icon: customIcon })
            .addTo(map);

        if (!isUser) {
            marker.bindPopup(`
                <button class="route-button" data-lat="${latitude}" data-lng="${longitude}">Traçar Rota</button>
            `);

            marker.on('popupopen', () => {
                document.querySelector('.route-button').addEventListener('click', (event) => {
                    const destLat = parseFloat(event.target.dataset.lat);
                    const destLng = parseFloat(event.target.dataset.lng);

                    traceRoute(destLat, destLng);
                });
            });
        }

        return marker;
    }

    // Função para buscar a localização do usuário
    function getUserLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const userLat = position.coords.latitude;
                    const userLng = position.coords.longitude;

                    // Adiciona marcador para a localização do usuário
                    addPin(userLat, userLng, null, true);

                    // Centraliza o mapa na localização do usuário
                    map.setView([userLat, userLng], 14);
                },
                () => {
                    console.warn('Não foi possível obter a localização do usuário. Usando localização padrão.');
                    useDefaultLocation();
                }
            );
        } else {
            console.warn('Geolocalização não suportada. Usando localização padrão.');
            useDefaultLocation();
        }
    }

    // Função para usar localização padrão
    function useDefaultLocation() {
        addPin(defaultLocation.lat, defaultLocation.lng, null, true);
        map.setView([defaultLocation.lat, defaultLocation.lng], 12);
    }

    function traceRoute(destLat, destLng) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const userLat = position.coords.latitude;
                    const userLng = position.coords.longitude;

                    // Adicionar rota ao mapa (assumindo que `map` é global)
                    if (routingControl) {
                        map.removeControl(routingControl); // Remove rota anterior
                    }
                    routingControl = L.Routing.control({
                        waypoints: [
                            L.latLng(userLat, userLng),
                            L.latLng(destLat, destLng)
                        ],
                        routeWhileDragging: true,
                        createMarker: function () { return null; } // Sem marcadores de rota
                    }).addTo(map);

                    // Ajustar o zoom para incluir toda a rota
                    map.fitBounds([[userLat, userLng], [destLat, destLng]], { padding: [50, 50] });
                },
                (error) => {
                    alert('Não foi possível obter sua localização: ' + error.message);
                }
            );
        } else {
            alert('Seu navegador não suporta geolocalização.');
        }
    }


    // Função para buscar os plantões do dia
    async function fetchShifts() {
        try {
            const selectedDate = new Date();
            const formattedDate = selectedDate.toISOString().split('T')[0];

            const response = await fetch(`http://localhost:8080/pharmacy/on-duty?date=${formattedDate}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) throw new Error('Erro ao carregar os plantões.');

            const shifts = await response.json();

            // Adiciona marcadores das farmácias em plantão
            shifts.forEach(shift => {
                addPin(shift.latitude, shift.longitude, shift);
            });
        } catch (error) {
            console.error('Erro ao buscar os plantões:', error.message);
            alert('Não foi possível carregar os plantões.');
        }
    }

    // Inicializa a busca dos plantões e localização do usuário
    fetchShifts();
    getUserLocation();
});


const menuButton = document.getElementById('menuButton');
const sideMenu = document.getElementById('sideMenu');
const resizeBar = document.getElementById('resizeBar');

if (menuButton && sideMenu && resizeBar) {
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
}

const jwtToken = localStorage.getItem('jwtToken');
const authButtons = document.querySelector('.auth-buttons');
const profileMenu = document.getElementById('profile-menu');
const profileButton = document.getElementById('profile-button');
const profileOptions = document.getElementById('profile-options');

if (authButtons && profileMenu && profileButton && profileOptions) {
    if (jwtToken) {
        authButtons.style.display = 'none';
        profileMenu.style.display = 'block';

        profileButton.addEventListener('click', () => {
            const isVisible = profileOptions.style.display === 'block';
            profileOptions.style.display = isVisible ? 'none' : 'block';
        });

        document.addEventListener('click', (event) => {
            if (!profileMenu.contains(event.target)) {
                profileOptions.style.display = 'none';
            }
        });
    } else {
        authButtons.style.display = 'block';
        profileMenu.style.display = 'none';
    }
}

const logoutButton = document.getElementById('logout-button');
if (logoutButton) {
    logoutButton.addEventListener('click', function () {
        logout();
    });
}

function logout() {
    localStorage.removeItem('jwtToken');
    window.location.href = 'http://localhost/frontend/';
}