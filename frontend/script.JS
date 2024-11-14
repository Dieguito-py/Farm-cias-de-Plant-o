// Função para alternar a visibilidade da seção de login e ajustar o mapa
function toggleLogin() {
    const loginSection = document.getElementById("login-section");
    const map = document.getElementById("map");

    // Alterna a exibição da seção de login e ajusta o tamanho do mapa
    loginSection.classList.toggle("active");
    map.classList.toggle("map-with-login");
}

// Inicializa o mapa
var map = L.map('map').setView([-23.5505, -46.6333], 13); // Posição inicial: São Paulo

// Modo Dark do mapa
L.tileLayer('https://basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
}).addTo(map);

var rota;  // Variável para armazenar a rota

// Função para pegar a localização do usuário e criar a rota
function obterLocalizacao() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var latitude = position.coords.latitude;
            var longitude = position.coords.longitude;

            // Ajusta o mapa para a localização do usuário
            map.setView(new L.LatLng(latitude, longitude), 13);

            // Adiciona um marcador na localização do usuário
            L.marker([latitude, longitude]).addTo(map)
                .bindPopup("Você está aqui!")
                .openPopup();

            // Cria a rota inicial para a localização do usuário (sem destino ainda)
            rota = L.Routing.control({
                waypoints: [
                    L.latLng(latitude, longitude), // Localização atual do usuário
                ],
                routeWhileDragging: true, // Atualiza a rota enquanto o usuário arrasta o ponto de destino
                createMarker: function() { return null; }, // Não cria marcador nos pontos
                lineOptions: {
                    styles: [{ color: 'blue', weight: 5 }] // Estilo da linha
                }
            }).addTo(map);

        }, function(error) {
            alert("Erro ao obter a localização: " + error.message);
        });
    } else {
        alert("Geolocalização não é suportada neste navegador.");
    }
}

// Farmácias com coordenadas e nomes
var farmacias = [
    { nome: "Farmácia Panvel", coordenadas: [-26.875503, -52.406799] },
    { nome: "Farmácia Xanxerê", coordenadas: [-26.877769, -52.404751] }
];

// Adiciona marcadores para as farmácias
farmacias.forEach(function(farmacia) {
    var marcador = L.marker(farmacia.coordenadas).addTo(map)
        .bindPopup(farmacia.nome)
        .openPopup();

    // Ao clicar em um marcador de farmácia, atualizar a rota
    marcador.on('click', function() {
        atualizarRota(L.latLng(farmacia.coordenadas));
    });
});

// Função para atualizar a rota com o novo destino
function atualizarRota(destinoLatLng) {
    if (rota) {
        // Atualiza os pontos da rota: ponto de partida (usuário) e novo destino
        rota.setWaypoints([
            rota.getWaypoints()[0], // Mantém o ponto de partida (localização do usuário)
            destinoLatLng // Atualiza o destino
        ]);
    }
}

// Evento de clique no mapa para definir o destino da rota
map.on('click', function(event) {
    var destinoLatLng = event.latlng;  // Pega as coordenadas do clique

    // Atualiza a rota com o novo destino
    atualizarRota(destinoLatLng);

    // Adiciona um marcador no destino clicado
    L.marker(destinoLatLng).addTo(map)
        .bindPopup("Destino")
        .openPopup();
});

// Chama a função ao carregar a página para pegar a localização
window.onload = function() {
    obterLocalizacao();
}
