import { locService } from './services/loc.service.js';
import { mapService } from './services/map.service.js';
import { storageService } from './services/storage-service.js';

export const controller = {
    renderLocTable
}

window.onload = onInit;
window.onAddMarker = onAddMarker;
window.onPanTo = onPanTo;
window.onGetLocs = onGetLocs;
window.onGetUserPos = onGetUserPos;
window.onSearch = onSearch;
window.onMyLocation = onMyLocation;
window.onDelLoc = onDelLoc;



function onInit() {
    renderLocTable();
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
    renderLocTable();
}

function renderLocTable() {
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
            onAddMarker(res.latitude, res.longitude);
        })
}

function onRenderLocations(locs) {
    let strHtmls = locs
        .map((loc) => {
            return `<tr>
        <td>${loc.name}</td>
        <td>${loc.lat.toFixed(2)}</td>
        <td>${loc.lng.toFixed(2)}</td>
        <td><button onclick="onPanTo(${loc.lat},${loc.lng},'${loc.name}')">GO</button></td>
        <td><button onclick="onDelLoc('${loc.id}')">Delete</button></td>
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

function onAddMarker(lat, lng) {
    console.log('Adding a marker');
    mapService.addMarker({ lat,lng });
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
function onPanTo(lat, lng, currLoc) {
    console.log('Panning the Map');
    onAddMarker(lat,lng)
    mapService.panTo(lat, lng);
    updateCurrLoc(currLoc,lat,lng);
    // updateWeather(loc)
}

function updateCurrLoc(currLoc,lat,lng){
    document.querySelector('.curr-location label').innerText=currLoc;
    document.querySelector('.curr-location label').dataset.lat=lat;
    document.querySelector('.curr-location label').dataset.lng=lng;
}

function onDelLoc(locId) {
    locService.deleteLoc(locId);
    renderLocTable();
}

function onCopyLoc(){
    const lat = document.querySelector('.curr-location label').dataset.lat;
    const lng = document.querySelector('.curr-location label').dataset.lng;
    const url = getGithubUrl(lat,lng);
}


// Swal.fire({
//     title: 'Do you want to save this location in to your favorite list?',
//     // icon: 'info',
//     html: 'Background color: ' + '<input type="color" class="theme"/>',
//     showCloseButton: true,
//     showCancelButton: true,
//     focusConfirm: false,
//     confirmButtonText: 'OK',
//     confirmButtonAriaLabel: 'Thumbs up, great!',
//     cancelButtonText: 'Cancel',
//     cancelButtonAriaLabel: 'Thumbs down',
// })
//.then((res) => {
//     if (res.isConfirmed) document.querySelector('body').style.backgroundColor = keepBright(document.querySelector('.theme').value);
// });
