const socket = io();

if (navigator.geolocation) {
  navigator.geolocation.watchPosition(
    (position) => {
      const { latitude, longitude } = position.coords;

      socket.emit("send-location", { latitude, longitude });
    },
    (error) => {
      console.log(error);
    },
    {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    }
  );
}

const map = L.map("map").setView([0, 0], 16);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 40, // Set the maximum zoom level
  tileSize: 256,
  zoomOffset: 0,
  detectRetina: true,
}).addTo(map);

const markers = {};
let currentMarker = null;
let routingControl = null;

socket.on("receive-location", (data) => {
  const { id, latitude, longitude } = data;

  if (markers[id]) {
    markers[id].setLatLng([latitude, longitude]);
  } else {
    markers[id] = L.marker([latitude, longitude])
      .addTo(map)
      .bindPopup(`User ${id}`);
  }
  map.setView([latitude, longitude]);
});

// console.log("Markers object ",markers)

socket.on("user-disconnected", (id) => {
  if (markers[id]) {
    map.removeLayer(markers[id]);
    delete markers[id];
  }
});

map.on("click", function (e) {
  const { lat, lng } = e.latlng;

  // Remove the previous marker if it exists
  if (currentMarker) {
    map.removeLayer(currentMarker);
  }

  // Add a new marker at the clicked location
  currentMarker = L.marker([lat, lng])
    .addTo(map)
    .bindPopup(`Clicked location: ${lat}, ${lng}`)
    .openPopup();

  if (routingControl) {
    map.removeControl(routingControl);
  }
  routingControl = L.Routing.control({
    waypoints: [L.latLng(lat, lng), L.latLng(31.634, 74.8723)],
    routeWhileDragging: true,
  }).addTo(map);
});
