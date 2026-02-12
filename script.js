const skyInput = document.getElementById('skyInput');
const suggestionBox = document.getElementById('autocomplete-list');
const API_KEY = "your_openweathermap_api_key_here";

async function runSkyCast() {
    const city = skyInput.value;
    if (!city) return;

    try {
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`);
        const data = await res.json();

        if (data.cod === 200) {
            document.getElementById('bigTemp').innerText = Math.round(data.main.temp);
            document.getElementById('skyCity').innerText = `${data.name}`;
            document.getElementById('skyCond').innerText = data.weather[0].main;
            document.getElementById('skyHum').innerText = data.main.humidity + "%";
            
            const icon = document.getElementById('weatherIconLarge');
            const cond = data.weather[0].main.toLowerCase();
            if(cond.includes('clear')) icon.innerHTML = '<i class="fas fa-sun"></i>';
            else if(cond.includes('cloud')) icon.innerHTML = '<i class="fas fa-cloud"></i>';
            else if(cond.includes('rain')) icon.innerHTML = '<i class="fas fa-cloud-showers-heavy"></i>';
            else icon.innerHTML = '<i class="fas fa-smog"></i>';
        }
    } catch (e) { console.error("Error:", e); }
}

skyInput.addEventListener('input', async () => {
    const val = skyInput.value;
    if (val.length < 3) { suggestionBox.style.display = 'none'; return; }
    const res = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${val}&limit=5&appid=${API_KEY}`);
    const cities = await res.json();
    if (cities.length > 0) {
        suggestionBox.innerHTML = '';
        suggestionBox.style.display = 'block';
        cities.forEach(c => {
            const div = document.createElement('div');
            div.className = 'suggestion-item';
            div.innerText = `${c.name}, ${c.country}`;
            div.onclick = () => { skyInput.value = c.name; suggestionBox.style.display = 'none'; runSkyCast(); };
            suggestionBox.appendChild(div);
        });
    }
});