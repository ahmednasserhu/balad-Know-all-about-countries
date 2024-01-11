const countriesSelectBox = document.getElementById('countries-selectBox');
const mainBodySection = document.getElementById('main-body-section');
const newsSection = document.getElementById('newsSection');
const fromDropDown = document.getElementById('fromCurrency');
const toDropDown = document.getElementById('toCurrency');
const result = document.getElementById('result');

countriesSelectBox.addEventListener('change', function (event) {
    var selectedOption = countriesSelectBox.options[countriesSelectBox.selectedIndex];
    getCountryInformation(selectedOption.textContent);
 });

 window.addEventListener('load', () => {
    disableSectionAtStart();
 });

 async function fetchCountries() {
    try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching countries:', error);
        throw error;
    }
}

async function populateCountriesSelect() {
    
    try {
        const countries = await fetchCountries();
        
        countries.forEach(country => {
            const option = document.createElement('option');
            option.value = country.name.common;
            option.text = country.name.common;
            countriesSelectBox.appendChild(option);
        });
    } catch (error) {
        console.error('Error populating countries select box:', error);
    }
}

function populateCurrencySelect(selectedCountry){
    fromDropDown.innerHTML = "";

    currencyCodes = Object.keys(selectedCountry.currencies);

    currencyCodes.forEach(code => {
        const currOption = document.createElement('option');
        currOption.value = code;
        currOption.text = code;
        fromDropDown.appendChild(currOption);
    });

}
populateCountriesSelect();

let currentCountryName = "";
async function getCountryInformation(countryName) {
    try {
        // Fetch country information from Restcountries API
        const countryResponse = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);
        const countryData = await countryResponse.json();

        const country = countryData[0];
        console.log(country);
        
        // Fetch news using the World News API
        const news = await fetchNews(country.cca2);
        console.log(news);

        // Update UI with fetched data
        updateCityNews(news);
        updateCountryInformation(country.flags.png, country.coatOfArms.png);
        updateCountyFacts(country.population, country.region, country.startOfWeek, country.timezones[0], country.capital[0]);

        isUnMember(country.unMember);
        isIndependnt(country.independent);
        changeMap(country.name.common);
        populateCurrencySelect(country);
        
        currentCountryName = country.name.common;
        result.innerHTML = '';
        showSection();
        
    } catch (error) {
        console.error('Error getting country information:', error);
    }
}

async function fetchNews(countryCode) {
    const worldNewsApiKey = '4f310bbbf9864f908f798c67309afd75';
    const apiUrl = `https://api.worldnewsapi.com/search-news?api-key=${worldNewsApiKey}&source-countries=${countryCode}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching news:', error);
        throw error;
    }
}


var mapButton = document.getElementById("mapButton");
    mapButton.addEventListener('click',function(){
        const Url = `https://www.google.com/maps?q=${currentCountryName}`
        window.open(Url);
    })

function updateCountryInformation(flagSrc, coatOfArmsSrc) {
    let countryFlag = document.getElementById("countryFlag");
    let coatOfArms = document.getElementById("coatOfArms");
    

    countryFlag.innerHTML = `
        <img src="${flagSrc}" alt="">
        <h6> <a href="#">Flag</a> </h6>
    `;
    coatOfArms.innerHTML = `
    <img src="${coatOfArmsSrc}" alt="">
    <h6> <a href="#">Coat of Arms</a> </h6>
    `;
}

function updateCountyFacts(population,region,startOfTheWeek,timezone,capital){
    let Population = document.getElementById("Population");
    let Region = document.getElementById("Region");
    let weekStart = document.getElementById("weekStart");
    let timeZone = document.getElementById("timeZone");
    let Capital = document.getElementById("Capital");

    Population.innerHTML = `${population.toLocaleString()}`;
    Region.innerHTML = `${region}`;
    weekStart.innerHTML = `${startOfTheWeek}`;
    timeZone.innerHTML = `${timezone}`;
    Capital.innerHTML = `${capital}`;
}

function isUnMember(member){
    let unMember = document.getElementById("unMember");
    if(member == true){
        unMember.innerHTML = `<a href="aboutus.html#">United Nations
        <i class="fas fa-check"></i>`
    }
    else{
        unMember.innerHTML =`<a href="aboutus.html#">United Nations
        <i class="fas fa-times"></i>`
    }
}

function isIndependnt(independnt){
    let independntCountry = document.getElementById("isIndependnt")
    if(independnt == true){
        independntCountry.innerHTML = `<a href="#">Independent
        <i class="fas fa-check"></i>`
    }
    else{
        independntCountry.innerHTML = `<a href="#">Independent
        <i class="fas fa-times"></i>`
    }
}

function disableSectionAtStart() {
    // Initially hide the main body section
    mainBodySection.classList.remove('expanded');
    newsSection.classList.remove('expanded');
}

function showSection() {
    // Add the 'expanded' class to show the main body section
    mainBodySection.classList.add('expanded');
    newsSection.classList.add('expanded');
}


function changeMap(NameOfCountry){
    let mapFrame = document.getElementById("mapIframe");
    const apiKey ='AIzaSyBeFwbxwlie8EhSrN2Npe8rBhbNf5cXSnI';
    const Url = `https://www.google.com/maps?q=${NameOfCountry}&hl=en&z=6&output=embed`;
    mapFrame.src = Url;
}

function updateCityNews(newsData) {
    const cityNewsSection = document.getElementById("newsSection");
    const newsContainer = cityNewsSection.querySelector(".row");

    // Clear existing news
    newsContainer.innerHTML = "";

    // Loop through the news articles and create HTML elements
    newsData.news.forEach(article => {
        const truncatedText = article.text.length > 100 ? `${article.text.slice(0, 100)}...` : article.text;
        const imageUrl = article.image || 'https://em-content.zobj.net/source/google/223/newspaper_1f4f0.png';

        const newsBox = document.createElement("div");
        newsBox.className = "col-md-3 col-sm-6";
        newsBox.innerHTML = `
            <div class="news-box" style="flex: 1; margin: 10px; height: 650px; overflow: hidden;">
                <div class="new-thumb"> 
                    <img src="${imageUrl}" alt="" style="max-width: 100%; height: 200px; object-fit: cover;" onerror="this.src='https://em-content.zobj.net/source/google/223/newspaper_1f4f0.png';">
                </div>
                <div class="new-txt" style="height: 350px; overflow: hidden;">
                    <ul class="news-meta">
                        <li>${formatDate(article.publish_date)}</li>
                    </ul>
                    <h6><a href="${article.url}" target="_blank">${article.title}</a></h6>
                    <p>${truncatedText}</p>
                </div>
                <div class="news-box-f"> 
                    <img src="${imageUrl}" alt="" style="max-width: 100%; height: auto;">
                    ${article.author} 
                    <a href="${article.url}" target="_blank"><i class="fas fa-arrow-right"></i></a> 
                </div>
            </div>
        `;
        newsContainer.appendChild(newsBox);
    });
}


function formatDate(dateString) {
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

const apiKey = "9955db611cf0424c8c979203f470739b"; // Replace with your actual API key
const api = `https://api.currencyfreaks.com/latest?apikey=${apiKey}`;

async function fetchData() {
    try {
      const response = await fetch(api);
      const data = await response.json();
      const currencies = Object.keys(data.rates);
  
      // Create dropdown options for "to" currency
      currencies.forEach((currency) => {
        const option = document.createElement("option");
        option.value = currency;
        option.text = currency;
        toDropDown.add(option);
      });
  
      // Set default values
      toDropDown.value = "USD";
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  
  async function convertCurrency(){
    const amount = document.querySelector("#amount").value;
    const fromCurrency = fromDropDown.value;
    const toCurrency = toDropDown.value;
    result.innerHTML = ''; 
    if (amount.length !== 0) {
      try {
        const response = await fetch(api);
        const data = await response.json();
        const fromExchangeRate = data.rates[fromCurrency];
        const toExchangeRate = data.rates[toCurrency];
        const convertedAmount = (amount / fromExchangeRate) * toExchangeRate;
        result.innerHTML = `${amount} ${fromCurrency} = ${convertedAmount.toFixed(2)} ${toCurrency}`;
      } catch (error) {
        console.error("Error converting currency:", error);
      }
    } else {
      alert("Please fill in the amount");
    }
  };
  
  document.querySelector("#convert-button").addEventListener("click", convertCurrency);
  window.addEventListener("load", async () => {
    await fetchData();
    convertCurrency();
  });