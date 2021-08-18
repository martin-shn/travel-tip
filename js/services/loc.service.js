import { storageService } from './storage-service.js';

export const locService = {
    getLocs,
    searchLoc,
};

const GOOGLE_GEO_API = 'https://maps.googleapis.com/maps/api/geocode/json?address=${loc}&key=${key}';

const locs = storageService.load('travelTipDB') || [];

function searchLoc(loc) {
    const url = GOOGLE_GEO_API.replace('${loc}', loc).replace('${key}', GEO_LOCATION_API);
    axios
        .get(url)
        .then((res) => {
            console.log(res.data);
            const existedLoc = locs.findIndex(function (loc, idx) {
                return loc.id === res.data.results[0].place_id;
            });
            if (existedLoc >= 0) {
                //update existing loc
                locs[existedLoc].lat = res.data.results[0].geometry.location.lat;
                locs[existedLoc].lng = res.data.results[0].geometry.location.lng;
                locs[existedLoc].updatedAt = Date.now();
            } else {
                //add a new loc
                locs.push({ id: res.data.results[0].place_id, name: res.data.results[0].formatted_address, lat: res.data.results[0].geometry.location.lat, lng: res.data.results[0].geometry.location.lng, createdAt: Date.now() });
            }
        })
        .then(() => {
            storageService.save('travelTipDB', locs);
        });
}

function getLocs() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(locs);
        }, 2000);
    });
}
