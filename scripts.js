const form = document.querySelector(".top-banner form");
const input = document.querySelector(".top-banner input");
const msg = document.querySelector(".top-banner .msg");
const list = document.querySelector(".ajax-section .cities");
const apiKey = "9eb5bba06e1a057dd59797b65873a0ea";

// FORM GÖNDERİLDİĞİNDE ÇALIŞACAK KODLAR
form.addEventListener("submit", (e) => {
    e.preventDefault(); // Sayfanın yeniden yüklenmesini önler

    const inputVal = input.value.trim(); // Kullanıcının girdiği şehri al ve boşlukları temizle

    if (!inputVal) {
        msg.textContent = "Lütfen geçerli bir şehir adı girin.";
        return;
    }

    const listItems = list.querySelectorAll(".ajax-section .city");
    const listItemsArray = Array.from(listItems);

    const filteredArray = listItemsArray.filter(el => {
        const content = el.querySelector('.city-name span').textContent.toLowerCase();
        return content === inputVal.toLowerCase();
    });

    if (filteredArray.length > 0) {
        msg.textContent = `Zaten ${filteredArray[0].querySelector('.city-name span').textContent} şehrinin hava durumunu biliyorsun`;

        form.reset();
        input.focus();
        return;
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputVal}&appid=${apiKey}&units=metric`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Hava durumu bilgileri alınırken bir hata oluştu');
            }
            return response.json();
        })
        .then(data => {
            const { main, name, sys, weather } = data;
            const icon = `https://openweathermap.org/img/wn/${weather[0].icon}.png`; // Doğru ikon URL'si

            const li = document.createElement("li");
            li.classList.add("city");

            const markup = `
                <h2 class="city-name" data-name="${name}, ${sys.country}">
                    <span>${name}</span>
                    <sup>${sys.country}</sup>
                </h2>
                <div class="city-temp">${Math.round(main.temp)}<sup>C</sup></div>
                <figure>
                    <img class="city-icon" src="${icon}" alt="${weather[0].description}" />
                    <figcaption>${weather[0].description}</figcaption>
                </figure>
            `;
            li.innerHTML = markup;
            list.appendChild(li);

            msg.textContent = "";
        })
        .catch(error => {
            msg.textContent = "Geçerli bir şehir adı girin.";
            console.error('Error fetching the weather data:', error);
        });

    form.reset();
    input.focus();
});
