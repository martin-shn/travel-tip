import { controller } from '../app.controller.js';
import { locService } from './loc.service.js';

export const mapService = {
    initMap,
    addMarker,
    panTo,
    getCurrPos,
}

var gMap;
const LINK_URL = 'https://${github_url}/index.html?lat=${lat}&lng=${lng}';
const GITHUB_URL = 'martin-shn.github.io/travelTip';

function initMap(lat = 32.0749831, lng = 34.9120554) {
    const myLatlng = { lat, lng };
    return _connectGoogleApi()
        .then(() => {
            console.log('google available');
            gMap = new google.maps.Map(
                document.querySelector('#map'), {
                center: { lat, lng },
                zoom: 15
            })
            onClickMap(myLatlng)
        })

}

function onClickMap(myLatlng) {
    var clickedLoc = 'check';

    // Create the initial InfoWindow.
    let infoWindow = new google.maps.InfoWindow({
        content: "Click the map to get Lat/Lng!",
        position: myLatlng,
    });
    // Configure the click listener.
    clickedLoc = gMap.addListener("click", (mapsMouseEvent) => {
        //get pos object 
        const pos = mapsMouseEvent.latLng.toJSON()
        savePopup(pos)
        
    });

}

function savePopup(pos) {
    Swal.fire({
        title: 'Do you want to save this place?',
        html: '<input type="text" placeholder="Location name" class="loc-name"/>',
        showCancelButton: true,
        confirmButtonText: `Save`,
    }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
            const locName=document.querySelector('.loc-name').value;
            locService.addLoc(locName,pos.lat,pos.lng)
            Swal.fire({
                title:'Saved!',
                icon: 'success',
                timer: 2000,
                timerProgressBar: true,
                didOpen: () => {
                    Swal.showLoading()
                  },
                });
        }
    })
    .then(()=>controller.renderLocTable());
}

function addMarker(loc) {
    var marker = new google.maps.Marker({
        position: loc,
        map: gMap,
        title: 'Hello World!'
    });
    return marker;
}
function mapClicked() {

}

function panTo(lat, lng) {
    var laLatLng = new google.maps.LatLng(lat, lng);
    gMap.panTo(laLatLng);
}

// var currPos;
function getCurrPos() {
    return navigator.geolocation.getCurrentPosition((pos) => {
        const currPos = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        return new Promise(currPos);
    });
    // console.log('currpos:', currPos, 'a: ', a);
    // return currPos;
}

function _connectGoogleApi() {
    if (window.google) return Promise.resolve()
    const API_KEY = MAPS_API; //TODO: Enter your API Key
    var elGoogleApi = document.createElement('script');
    elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`;
    elGoogleApi.async = true;
    document.body.append(elGoogleApi);

    return new Promise((resolve, reject) => {
        elGoogleApi.onload = resolve;
        elGoogleApi.onerror = () => reject('Google script failed to load')
    })
}

function getGithubUrl(lat,lng){
    return LINK_URL.replace('${github_url}',GITHUB_URL).replace('${lat}',lat).replace('${lng}',lng);
}