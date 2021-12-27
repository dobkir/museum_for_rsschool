"use strict"


// ===================== Smooth scroll + remove hash from the browser address bar ===================== //

const smoothScrollElems = document.querySelectorAll('a[href^="#"]:not(a[href="#"])');

smoothScrollElems.forEach(link => {
  link.addEventListener('click', (event) => {
    event.preventDefault();

    const id = link.getAttribute('href').substring(1)
    document.getElementById(id).scrollIntoView({
      behavior: 'smooth'
    })
  })
})

// ================== End of Smooth scroll + remove hash from the browser address bar ================== //



// ======== Progress bar for the custom video frame ======== //

const progressBar = document.querySelector('.progress-bar');

progressBar.addEventListener('input', function () {
  const value = this.value;
  this.style.background = `linear-gradient(to right, #710707 0%, #710707 ${value}%, #ffffff ${value}%, #ffffff 100%)`
})

// ===== End of Progress bar for the custom video frame ==== //



// ======================== Mapbox ======================== //

const mapboxgl = require('mapbox-gl/dist/mapbox-gl.js');

mapboxgl.accessToken = 'pk.eyJ1IjoiZG9ia2lyIiwiYSI6ImNrdThwdmZrZDNraXMydXFoaHdhc3BvM28ifQ.Zytjfeg2anFiKU7SVoSG9Q';
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/light-v10', // style URL
  center: [2.3364, 48.86091], // starting position
  zoom: 15.8 // starting zoom
});

// Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());

// Create a default Marker and add it to the map.
const marker1 = new mapboxgl.Marker({ color: '#61533d' })
  .setLngLat([2.3364, 48.86091])
  .addTo(map);

const marker2 = new mapboxgl.Marker({ color: '#9d8665' })
  .setLngLat([2.3333, 48.8602])
  .addTo(map);

const marker3 = new mapboxgl.Marker({ color: '#9d8665' })
  .setLngLat([2.3397, 48.8607])
  .addTo(map);

const marker4 = new mapboxgl.Marker({ color: '#9d8665' })
  .setLngLat([2.3330, 48.8619])
  .addTo(map);

const marker5 = new mapboxgl.Marker({ color: '#9d8665' })
  .setLngLat([2.3365, 48.8625])
  .addTo(map);


// ===================== End of Mapbox ===================== //

