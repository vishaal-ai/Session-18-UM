const button = document.getElementById("button");
const weatherContainer = document.getElementById("weather-container");
const cityInput = document.getElementById("cityInput");
const apiKey = "bb25f9238c3291cc549d57651628225a";

button.addEventListener("click", async () => {
  const city = cityInput.value.trim();
  if (!city)
    return (weatherContainer.innerHTML = "<p>Please enter a city name!</p>");

  try {
    const weatherData = await fetchData(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
    );
    const forecastData = await fetchData(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`
    );

    const dailyForecast = {};

    forecastData.list.forEach((entry) => {
      const date = entry.dt_txt.split(" ")[0];

      if (!dailyForecast[date]) {
        dailyForecast[date] = entry;
      }
    });

    const forecastArray = Object.values(dailyForecast).slice(0, 7);

    let forecastHTML = "";
    forecastArray.forEach((entry, i) => {
      forecastHTML += `<li>Day ${i + 1}: ${entry.weather[0].description} - ${
        entry.main.temp
      }°C</li>`;
    });

    weatherContainer.innerHTML = `
            <h3> Weather Report for ${weatherData.name}</h3>
            <p>Temperature: ${weatherData.main.temp}°C</p>
            <p>Condition: ${weatherData.weather[0].description}</p>
            <p>Humidity: ${weatherData.main.humidity}%</p>
            <h4> 7-Day Forecast:</h4>
            <ul>${forecastHTML}</ul>
        `;
  } catch (error) {
    weatherContainer.innerHTML = `<p style="color: red;">${error.message}</p>`;
  }
});

async function fetchData(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error("City not found or API error!");
  return res.json();
}
