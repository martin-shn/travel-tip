import { locService } from './services/loc.service.js';
import { mapService } from './services/map.service.js';
import { storageService } from './services/storage-service.js';
import { weatherService } from './services/weather.service.js';

export const controller = {
    renderLocTable,
    onWeatherUpdate
};

window.onload = onInit;
window.onAddMarker = onAddMarker;
window.onPanTo = onPanTo;
// window.onGetLocs = onGetLocs;
// window.onGetUserPos = onGetUserPos;
window.onSearch = onSearch;
window.onMyLocation = onMyLocation;
window.onDelLoc = onDelLoc;
window.onCopyLoc = onCopyLoc;

function onInit() {
    renderLocTable();
    mapService
        .initMap()
        .then(() => {
            // console.log('Map is ready');
            const urlPos = getUrlParams();
            onPanTo(urlPos.lat, urlPos.lng, urlPos.currLoc)
            onWeatherUpdate(urlPos.lat,urlPos.lng)
        })
        .catch(() => console.log('Error: cannot init map'));
}

function getUrlParams(){
    let queryStr=window.location.search;
    const urlParams = new URLSearchParams(queryStr);
    if (!queryStr) return {lat: 32.0749831, lng: 34.9120554,currLoc:''};
    return {lat:+urlParams.get('lat'), lng:+urlParams.get('lng'), currLoc:urlParams.get('name')};
}

function onSearch() {
    var elInput = document.querySelector('.search');
    if (!elInput.value.trim()) return;

    locService.searchLoc(elInput.value.trim());
    elInput.value = '';
    renderLocTable();
}

function renderLocTable() {
    locService.getLocs().then((locs) => {
        onRenderLocations(locs);
        // document.querySelector('.locs').innerText = JSON.stringify(locs)
    });
}

function onMyLocation() {
    getPosition().then((res) => {
        res = res.coords;
        // console.log(res);
        onPanTo(res.latitude, res.longitude,'Home');
        onAddMarker(res.latitude, res.longitude);
    });
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
    // console.log('Getting Pos');
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
    });
}

function onAddMarker(lat, lng) {
    // console.log('Adding a marker');
    mapService.addMarker({ lat, lng });
}

// function onGetLocs() {
//     locService.getLocs().then((locs) => {
//         // console.log('Locations:', locs);
//         // document.querySelector('.locs').innerText = JSON.stringify(locs)
//     });
// }

// function onGetUserPos() {
//     getPosition()
//         .then((pos) => {
//             console.log('User position is:', pos.coords);
//             document.querySelector('.user-pos').innerText = `Latitude: ${pos.coords.latitude} - Longitude: ${pos.coords.longitude}`;
//         })
//         .catch((err) => {
//             console.log('err!!!', err);
//         });
// }
function onPanTo(lat, lng, currLoc) {
    // console.log('Panning the Map');
    onAddMarker(lat, lng);
    mapService.panTo(lat, lng);
    updateCurrLoc(currLoc, lat, lng);
    onWeatherUpdate(lat,lng);
}

function updateCurrLoc(currLoc, lat, lng) {
    document.querySelector('.curr-location label').innerText = currLoc;
    document.querySelector('.curr-location label').dataset.lat = lat;
    document.querySelector('.curr-location label').dataset.lng = lng;
}

function onDelLoc(locId) {
    locService.deleteLoc(locId)
    .then(()=>{
        // console.log('del promise ok');
        renderLocTable();
    });
}

function onCopyLoc() {
    const lat = document.querySelector('.curr-location label').dataset.lat;
    const lng = document.querySelector('.curr-location label').dataset.lng;
    const locName = document.querySelector('.curr-location label').innerText;
    const url = mapService.getGithubUrl(lat, lng, locName);

    navigator.clipboard.writeText(url);
    Swal.fire({
        title:'Saved to clipboard!',
        icon: 'success',
        timer: 2000,
        timerProgressBar: true,
        didOpen: () => {
            Swal.showLoading()
          },
    });
}

function onWeatherUpdate(lat,lng){
    weatherService.getWeather(lat, lng).then((res)=>{
        document.querySelector('.weather label').innerText=`🌡Temp: ${(res.res.temp-273.15).toFixed(2)}°C`;
        document.querySelector('.weather p').innerText=`Feels like: ${(res.res.feels_like-273.15).toFixed(2)}°C
        Max temp: ${(res.res.temp_max-273.15).toFixed(2)}°C
        Min temp: ${(res.res.temp_min-273.15).toFixed(2)}°C
        `;
        document.querySelector('.weather img').src=res.icon;
    });
}