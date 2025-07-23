// Inizializzazione mappa
const map = L.map('map').setView([44.4949, 11.3426], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Forza il ridimensionamento dopo 200ms (utile se container è nascosto inizialmente)
setTimeout(() => {
  map.invalidateSize();
}, 200);

let selectedLatLng = null;

// Seleziona punto manuale
map.on('click', function(e) {
  selectedLatLng = e.latlng;
  document.getElementById('coordinates').textContent = `${e.latlng.lat.toFixed(5)}, ${e.latlng.lng.toFixed(5)}`;

  if (window.marker) {
    map.removeLayer(window.marker);
  }

  window.marker = L.marker(e.latlng).addTo(map);

  // Fix visivo per dispositivi mobili o app wrapper
  setTimeout(() => {
    map.invalidateSize();
  }, 200);
});

// Geolocalizzazione
document.getElementById('btnLocate').addEventListener('click', () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(pos => {
      const latlng = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude
      };

      map.setView(latlng, 16);
      selectedLatLng = latlng;
      document.getElementById('coordinates').textContent = `${latlng.lat.toFixed(5)}, ${latlng.lng.toFixed(5)}`;

      if (window.marker) map.removeLayer(window.marker);
      window.marker = L.marker(latlng).addTo(map);

      setTimeout(() => {
        map.invalidateSize();
      }, 200);

    }, err => {
      alert("Errore nella geolocalizzazione: " + err.message);
    });
  } else {
    alert("Geolocalizzazione non supportata dal browser");
  }
});

// Mostra/nasconde categorie ed eventi in base alla selezione
const tipoSegnalazione = document.getElementById('tipoSegnalazione');
const categoriaContainer = document.getElementById('categoriaContainer');
const dataEventoContainer = document.getElementById('dataEventoContainer');

tipoSegnalazione.addEventListener('change', function () {
  categoriaContainer.style.display = (this.value === 'problema') ? 'block' : 'none';
  dataEventoContainer.style.display = (this.value === 'evento') ? 'block' : 'none';
});

// Invia segnalazione (solo stampa su console per ora)
document.getElementById('reportForm').addEventListener('submit', function (e) {
  e.preventDefault();

  if (!selectedLatLng) {
    alert("Seleziona una posizione sulla mappa o usa la geolocalizzazione.");
    return;
  }

  const data = {
    tipo: tipoSegnalazione.value,
    categoria: document.getElementById('categoria').value,
    titolo: document.getElementById('titolo').value,
    dataEvento: document.getElementById('dataEvento').value,
    coordinate: selectedLatLng
  };

  console.log("Segnalazione inviata:", data);
  document.getElementById('status').textContent = "Segnalazione inviata (demo)";
});
