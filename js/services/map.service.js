
export const mapService = {
    initMap,
    addMarker,
    panTo,
    getCurrPos,
}

var gMap;


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
    var clickedLoc='check';

    // Create the initial InfoWindow.
    let infoWindow = new google.maps.InfoWindow({
        content: "Click the map to get Lat/Lng!",
        position: myLatlng,
    });
    infoWindow.open(gMap);
    // Configure the click listener.
    clickedLoc = gMap.addListener("click", (mapsMouseEvent) => {
        console.log(mapsMouseEvent.latLng);

        // Close the current InfoWindow.
        infoWindow.close();
        // Create a new InfoWindow.
        infoWindow = new google.maps.InfoWindow({
            position: mapsMouseEvent.latLng,
        });
        infoWindow.setContent(
            JSON.stringify(mapsMouseEvent.latLng.toJSON(), null, 2)
        );
        infoWindow.open(gMap);
    });

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
    const API_KEY = GEO_LOCATION_API; //TODO: Enter your API Key
    var elGoogleApi = document.createElement('script');
    elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`;
    elGoogleApi.async = true;
    document.body.append(elGoogleApi);

    return new Promise((resolve, reject) => {
        elGoogleApi.onload = resolve;
        elGoogleApi.onerror = () => reject('Google script failed to load')
    })
}