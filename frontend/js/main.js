document.addEventListener('DOMContentLoaded', function () {
    const DEFAULT_LOCATION = {
        latitude: -26.87152490517185,
        longitude: -52.408455623841206,
    };

    let map = L.map('map', {
        zoomControl: false,
        attributionControl: false,
        minZoom: 6,
    }).setView([DEFAULT_LOCATION.latitude, DEFAULT_LOCATION.longitude], 12);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd',
    }).addTo(map);

    let userLocationMarker = null;
    let markersLayer = L.layerGroup().addTo(map);

    let routingControl = null;

    function addPin(latitude, longitude, iconUrl) {
        const customIcon = L.icon({
            iconUrl: iconUrl,
            iconSize: [32, 39],
            iconAnchor: [16, 32],
            popupAnchor: [0, -32],
        });

        const marker = L.marker([latitude, longitude], { icon: customIcon }).addTo(map);
        marker.on('click', () => {
            if (userLocationMarker) {
                const userLatLng = userLocationMarker.getLatLng();
                drawRoute(userLatLng, [latitude, longitude]);
            } else {
                alert('Localização do usuário não encontrada.');
            }
        });
        return marker;
    }

    function drawRoute(start, end) {
        if (routingControl) {
            map.removeControl(routingControl);
        }

        routingControl = L.Routing.control({
            waypoints: [
                L.latLng(start.lat, start.lng),
                L.latLng(end[0], end[1]),
            ],
            routeWhileDragging: true,
            createMarker: function () { return null; },
            lineOptions: {
                styles: [{ color: 'green', weight: 5, opacity: 0.7 }]
            },
            show: false,
            
        }).addTo(map);
    }

    function getUserLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const userLat = position.coords.latitude;
                    const userLng = position.coords.longitude;

                    if (!userLocationMarker) {
                        userLocationMarker = addPin(userLat, userLng, 'assets/pin1.png');
                    }

                    map.setView([userLat, userLng], 14);
                },
                (error) => {
                    console.warn('Erro ao acessar localização do usuário:', error.message);
                    useDefaultLocation();
                }
            );
        } else {
            console.warn('Geolocalização não suportada pelo navegador.');
            useDefaultLocation();
        }
    }

    function useDefaultLocation() {
        if (!userLocationMarker) {
            userLocationMarker = addPin(DEFAULT_LOCATION.latitude, DEFAULT_LOCATION.longitude, 'assets/pin1.png');
        }
        map.setView([DEFAULT_LOCATION.latitude, DEFAULT_LOCATION.longitude], 12);
    }

    async function fetchShiftsForSelectedDay() {
        try {
            const response = await fetch(`http://localhost:8080/pharmacy/on-duty?date=${selectedDate.toISOString().split('T')[0]}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) throw new Error('Erro ao carregar os plantões.');

            const shifts = await response.json();
            updateSideMenu(shifts);

            markersLayer.clearLayers();
            if (routingControl) {
                map.removeControl(routingControl);
            }

            shifts.forEach(shift => {
                if (shift.latitude && shift.longitude) {
                    const marker = addPin(shift.latitude, shift.longitude, 'assets/pin.png');
                    markersLayer.addLayer(marker);
                } else {
                    console.warn(`Farmácia "${shift.name}" não possui coordenadas válidas.`);
                }
            });
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
                    if (pharmacy.latitude && pharmacy.longitude) {
                        map.setView([pharmacy.latitude, pharmacy.longitude], 14);
                        addPin(pharmacy.latitude, pharmacy.longitude, 'assets/pin.png');
                    } else {
                        alert(`Farmácia "${pharmacy.name}" não possui localização válida.`);
                    }
                });

                sideMenu.appendChild(shiftDiv);
            });
        } else {
            sideMenu.innerHTML = '<h5>Não há plantões para este dia.</h5>';
        }
    }

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

    updateDateDisplay();
    fetchShiftsForSelectedDay();
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