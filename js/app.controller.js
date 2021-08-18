import { locService } from './services/loc.service.js';
import { mapService } from './services/map.service.js';
import { storageService } from './services/storage-service.js';

window.onload = onInit;
window.onAddMarker = onAddMarker;
window.onPanTo = onPanTo;
window.onGetLocs = onGetLocs;
window.onGetUserPos = onGetUserPos;
window.onSearch = onSearch;
window.onMyLocation = onMyLocation;



function onInit() {
    locService.getLocs().then((locs) => {
        onRenderLocations(locs);
        // document.querySelector('.locs').innerText = JSON.stringify(locs)
    });
    mapService
        .initMap()
        .then(() => {
            console.log('Map is ready');
            console.log(MAPS_API);
        })
        .catch(() => console.log('Error: cannot init map'));
}

function onSearch() {
    var elInput = document.querySelector('.search');
    if (!elInput.value.trim()) return;

    // searchLoc(elInput.value.trim());
    locService.searchLoc(elInput.value.trim());
    // elInput.value = '';
    locService.getLocs().then((locs) => {
        onRenderLocations(locs);
        // document.querySelector('.locs').innerText = JSON.stringify(locs)
    });
}

function onMyLocation() {
    getPosition()
        .then(res => {
            res = res.coords
            mapService.panTo(res.latitude, res.longitude);
            mapService.addMarker({ lat: res.latitude, lng: res.longitude });
        })


    
}

function onRenderLocations(locs) {
    let strHtmls = locs
        .map((loc) => {
            return `<tr>
        <td>${loc.name}</td>
        <td>${loc.lat.toFixed(2)}</td>
        <td>${loc.lng.toFixed(2)}</td>
        <td><button onclick="onPanTo(${loc.lat},${loc.lng})">GO</button></td>
        <td><button onclick="onDelLoc(${loc.id})">Delete</button></td>
        </tr>`;
        })
        .join('');
    document.querySelector('.locs-table').innerHTML = strHtmls;
}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
    console.log('Getting Pos');
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
    });
}

function onAddMarker() {
    console.log('Adding a marker');
    mapService.addMarker({ lat: 32.0749831, lng: 34.9120554 });
}

function onGetLocs() {
    locService.getLocs().then((locs) => {
        console.log('Locations:', locs);
        // document.querySelector('.locs').innerText = JSON.stringify(locs)
    });
}

function onGetUserPos() {
    getPosition()
        .then((pos) => {
            console.log('User position is:', pos.coords);
            document.querySelector('.user-pos').innerText = `Latitude: ${pos.coords.latitude} - Longitude: ${pos.coords.longitude}`;
        })
        .catch((err) => {
            console.log('err!!!', err);
        });
}
function onPanTo(lat,lng) {
    console.log('Panning the Map');
    mapService.panTo(lat, lng);
}
