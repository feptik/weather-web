const header = document.querySelector('.header');
const search = document.querySelector('#form');
const inputCity = document.querySelector('#inputCity');

search.onsubmit = async function (event) {
    event.preventDefault();

    const city = inputCity.value.trim();
    if (city.length === 0) {
        alert("Введите название города");
        return;
    }

    try {
        const geoResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}`);
        const geoData = await geoResponse.json();
        if (!geoData.results || geoData.results.length === 0) {
            alert("Город не найден");
            return;
        }

        const { latitude, longitude } = geoData.results[0];

        const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&timezone=Europe%2F${city}`);
        const data = await response.json();

        const html = `
            <div class="card">
                <h2 class="card-city">${city} <span>${geoData.results[0].country}</span></h2>
                <div class="card-weather">
                    <div class="temperature">
                        ${data.current_weather.temperature} <sup>°С</sup>
                        <img class="weather-picture" src="./storm.svg" alt="none"/>
                    </div>
                </div>
                <div class="card-description"> Ветер: ${data.current_weather.windspeed} м/с </div>

                <div class="card-description"> Часовой пояс: ${geoData.results[0].timezone} </div>
            </div>
        `

        header.insertAdjacentHTML('afterend', html);

    } catch (error) {
        console.error('Ошибка при получении данных:', error);
        alert("Не удалось получить данные о погоде. Пожалуйста, попробуйте позже.");
    }
}