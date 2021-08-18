import { storageService } from './storage-service.js';

export const locService = {
    getLocs,
    searchLoc,
    addLoc,
    deleteLoc
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
                addLoc(res.data.results[0].place_id,res.data.results[0].formatted_address,res.data.results[0].geometry.location.lat,res.data.results[0].geometry.location.lng)
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

function makeId(length = 5) {
    var txt = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return txt;
}

function deleteLoc(locId){
    console.log(locId);
    const existedLoc = locs.findIndex(function (loc, idx) {
        return loc.id === locId;
    });
    if (existedLoc >= 0) {
        locs.splice(existedLoc,1);
        storageService.save('travelTipDB', locs);
    }
}

function addLoc(id=makeId(),name,lat,lng){
    locs.push({id,name,lat,lng,createdAt: Date.now()});
}