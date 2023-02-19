// Defina a localização selecionada como um objeto de coordenadas
let selectedLocation = null;

// Crie um mapa Leaflet e adicione um marcador para a localização selecionada
const mymap = L.map('mapid').setView([-15.779445, -47.884973], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
    maxZoom: 18
}).addTo(mymap);



mymap.on('click', function (e) {
    if (selectedLocation) {
        mymap.removeLayer(selectedLocation);
    }
    selectedLocation = L.marker(e.latlng).addTo(mymap);
});

// Função para calcular a distância entre duas coordenadas usando a fórmula Haversine
function calcDistance(lat1, lon1, lat2, lon2) {
    const earthRadius = 6371; // em quilômetros
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = earthRadius * c;
    return distance;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

// Função para obter a localização atual do usuário usando a API de geolocalização do navegador
function getCurrentLocation() {
    if (navigator.geolocation && selectedLocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
}

function showPosition(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    const distance = calcDistance(lat, lon, selectedLocation.getLatLng().lat, selectedLocation.getLatLng().lng);

    alert(`Distância: ${distance.toFixed(2)} km`);

    // Verifique se a distância é igual a 1000 metros e toque um alarme se for
    if (distance * 1000 <= 1000) {
        var audio = new Audio('alarme.mp3');
        audio.play();
    }
}

// Função que é chamada quando o usuário clica no botão "Calcular distância"
function getDistance() {
    if (selectedLocation) {
        getCurrentLocation();
    } else {
        alert('Selecione uma localização no mapa');
    }
}

navigator.geolocation.getCurrentPosition(function (location) {
    var latlng = [location.coords.latitude, location.coords.longitude];
    L.marker(latlng).addTo(mymap);
});

// Função para atualizar a posição do usuário a cada 15 segundos
function updateLocation() {
    navigator.geolocation.getCurrentPosition(showPosition);
}

// Chama a função updateLocation a cada 15 segundos
setInterval(updateLocation, 15000);