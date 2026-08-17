
const citySelect = document.querySelector("#city");
const showWeatherBtn = document.querySelector("#showWeather");
const weatherResult = document.querySelector("#weatherResult");
const locationName = document.querySelector("#locationName");
const temperature = document.querySelector("#temperature");
const description = document.querySelector("#description");
const humidityVal = document.querySelector("#humidityVal");
const windVal = document.querySelector("#windVal");
const weatherIcon = document.querySelector("#weatherIcon");

const formatWeather = (result) => {
    const tempCelsius = (result.main.temp - 273.15).toFixed(1);
    const weather = result.weather?.[0];
    const iconCode = weather?.icon;

    locationName.textContent = `${result.name}, ${result.sys.country}`;
    temperature.textContent = `${tempCelsius}°C`;
    description.textContent = weather?.description ?? "Clear skies";
    
    if (humidityVal) humidityVal.textContent = `${result.main.humidity}%`;
    if (windVal) windVal.textContent = `${Math.round(result.wind.speed)} m/s`;

    if (iconCode) {
        weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
        weatherIcon.alt = weather.description || "Weather icon";
        weatherIcon.classList.remove("hidden");
    } else {
        weatherIcon.src = "";
        weatherIcon.alt = "";
        weatherIcon.classList.add("hidden");
    }

    // Ensure metrics grid and visual container are visible on success
    const metricsGrid = document.querySelector(".weather-metrics-grid");
    if (metricsGrid) metricsGrid.classList.remove("hidden");
    const weatherVisual = document.querySelector(".weather-visual");
    if (weatherVisual) weatherVisual.classList.remove("hidden");

    weatherResult.classList.remove("hidden");
};

const showError = (message) => {
    locationName.textContent = message;
    temperature.textContent = "";
    description.textContent = "";
    if (humidityVal) humidityVal.textContent = "--%";
    if (windVal) windVal.textContent = "-- m/s";
    weatherIcon.src = "";
    weatherIcon.alt = "";
    weatherIcon.classList.add("hidden");
    
    // Hide visual details and metrics on error
    const metricsGrid = document.querySelector(".weather-metrics-grid");
    if (metricsGrid) metricsGrid.classList.add("hidden");
    const weatherVisual = document.querySelector(".weather-visual");
    if (weatherVisual) weatherVisual.classList.add("hidden");

    weatherResult.classList.remove("hidden");
};

const getWeather = async (cityName) => {
    if (!cityName) {
        showError("Select a city first to see the weather.");
        return;
    }

    const URL = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cityName)},in&APPID=${API_KEY}`;

    try {
        const response = await fetch(URL);
        const result = await response.json();

        if (!response.ok || result.cod !== 200) {
            showError("Unable to retrieve weather for that location.");
            return;
        }

        formatWeather(result);
    } catch (error) {
        showError("Network error occurred. Please try again.");
        console.error("Weather error:", error);
    }
};

showWeatherBtn.addEventListener("click", () => {
    const selectedCity = citySelect.value?.trim();
    if (!selectedCity) {
        showError("Select a city first to see the weather.");
        return;
    }
    getWeather(selectedCity);
});

document.addEventListener("DOMContentLoaded", () => {
    weatherResult.classList.add("hidden");
    if (typeof print_state === "function") {
        print_state("state");
    }
});