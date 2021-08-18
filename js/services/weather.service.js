
export const weatherService={
    getWeather
}

const WEATHER_API = 'https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&APPID=${KEY}';
const iconUrl = 'http://openweathermap.org/img/wn/${icon}';

function getWeather(lat, lng) {
    return axios.get(WEATHER_API.replace('${lat}', lat).replace('${lng}', lng).replace('${KEY}', WEATHER_KEY)).then((res) => {
        return Promise.resolve({res:res.data.main,icon:iconUrl.replace('${icon}',res.data.weather[0].icon+'@2x.png')});
    });
}
