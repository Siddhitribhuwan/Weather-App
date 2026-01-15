const apiKey = "f08dc5c9cda412a80f593c9f95fbcfc0";

const popularCities = [
    "Mumbai","Delhi","Bangalore","Chennai","Hyderabad",
    "Pune","Kolkata","Jaipur","Dubai","London",
    "New York","Tokyo","Paris","Singapore","Sydney"
];

let recent = [];

function getWeather(city = null) {
    const cityName = (city || document.getElementById("cityInput").value).trim();
    if (!cityName) return;

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${apiKey}`)
        .then(res => res.json())
        .then(data => {

            if (data.cod !== 200) {
                alert(data.message);
                return;
            }

            // Current weather
            document.getElementById("currentWeather").innerHTML = `
                <h2>${data.name}, ${data.sys.country}</h2>
                <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png">
                <h3>${data.main.temp}°C</h3>
                <p>${data.weather[0].description}</p>
                <p>💧 ${data.main.humidity}% | 💨 ${data.wind.speed} km/h</p>
            `;
            setBackground(data.weather[0].description.toLowerCase());
            // Save full data to recent searches
            addToRecent(data);
        });
}

function addToRecent(data) {
    // Remove duplicate city
    recent = recent.filter(item => item.name !== data.name);

    recent.unshift({
        name: data.name,
        temp: data.main.temp,
        desc: data.weather[0].description,
        icon: data.weather[0].icon
    });

    recent = recent.slice(0, 5);
    updateRecentUI();
}

function updateRecentUI() {
    const container = document.getElementById("recentSearches");
    container.innerHTML = "";

    recent.forEach(item => {
        const card = document.createElement("div");
        card.className = "recent-card";
        card.innerHTML = `
            <h4>${item.name}</h4>
            <img src="https://openweathermap.org/img/wn/${item.icon}.png">
            <p>${item.temp}°C</p>
            <small>${item.desc}</small>
        `;
        card.onclick = () => getWeather(item.name);
        container.appendChild(card);
    });
}
function setBackground(condition) {
    let bg = "img/pexels-hikaique-125510.jpg";

    if (condition.includes("cloud")) bg = "img/pexels-pixabay-414659.jpg";
    else if (condition.includes("rain")) bg = "img/pexels-pixabay-459451.jpg";
    else if (condition.includes("clear")) bg = "img/pexels-elia-clerici-282848-912110.jpg";
    else if (condition.includes("snow")) bg = "img/pexels-adam-lukac-254247-773953.jpg";

    document.body.style.backgroundImage =
        `linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.35)), url(${bg})`;
}

function loadPopularCities() {
    const track = document.getElementById("sliderTrack");

    popularCities.forEach(city => {
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`)
            .then(res => res.json())
            .then(data => {
                const card = document.createElement("div");
                card.className = "weather-card";
                card.innerHTML = `
                    <h4>${data.name}</h4>
                    <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}.png">
                    <p>${data.main.temp}°C</p>
                `;
                track.appendChild(card);
            });
    });
}

loadPopularCities();

document.addEventListener("DOMContentLoaded", () => {
    document.body.style.backgroundImage =
        "linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.35)), url('img/pexels-elia-clerici-282848-912110.jpg')";
});

