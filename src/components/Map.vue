<template>
  <div id="map" style="height: 400px;"></div>
</template>

<script setup>
import { onMounted } from 'vue'
import L from 'leaflet'
import axios from 'axios'
import 'leaflet/dist/leaflet.css'

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix default icon path:
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow
});

let map;

const getChargers = async () => {
  try {
    const res = await axios.get('http://localhost:3009/api/stations/', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });

    const stations = res.data;

    // Find first station with valid lat/lng to center the map
    const firstValid = stations.find(s => s.location?.latitude && s.location?.longitude);

    if (!firstValid) {
      console.warn("No valid location data found.");
      return;
    }

    // Initialize map once valid data is available
    map = L.map('map').setView([firstValid.location.latitude, firstValid.location.longitude], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // Loop through all stations and add markers where location is defined
    stations.forEach(station => {
      const lat = station.location?.latitude;
      const lng = station.location?.longitude;

        L.marker([lat, lng])
          .addTo(map)
          .bindPopup(`<b>${station.name || 'Charging Station'}</b><br>Lat: ${lat}, Lng: ${lng}`);

    });

  } catch (error) {
    console.error("Error fetching stations:", error);
  }
};

onMounted(getChargers);
</script>

