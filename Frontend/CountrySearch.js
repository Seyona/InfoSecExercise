const searchBox = document.querySelector('.country-search');
const submitButton = document.querySelector('.search-button');

searchBox.addEventListener('change', (event) => {
    var textVal = document.getElementById('country-search').value;
    if (textVal.trim() == '') {
        document.getElementById("search-button").disabled = true;
    }
    else
    {
        document.getElementById("search-button").disabled = false;
    }
});

submitButton.addEventListener('click', SearchCountry, false);

async function SearchCountry() {
    var country = document.getElementById('country-search').value;
    var searchType = document.getElementById('search-type').value;

    var document.getElementById('country-data');

    if (searchType === 'cc') {
        let countryData = await GetCountryByCountryCode(country);
        if (countryData !== null) {
            var country = JSON.parse(countryData.data);
            console.log(country)
        }

    } else // searching by name
    {
        let countryData = await GetCountryByCountryName(country);
        if (countryData !== null) {
            var countries = JSON.parse(countryData.data);
            countries.forEach(country => console.log(country));
        }
    }
}




/*
    Reaches out to the Country Code API and pulls back the Country's data
*/
async function GetCountryByCountryCode(code) {
     const resp = await fetch("http://localhost:8000/search/CountryCode/" + code)
    .then(handleErrors)
    .then(response => response.json())
    .then(json => {
       return json;
    })
    .catch(error => {
        error.text().then(errorMessage => {
            alert(errorMessage);
            console.log(errorMessage);
        });
        return null;
    });

    return resp;
}

/*
    Reaches out to the Country Name API and pulls back the Country's Data
        Note this will pull back multiple countries if the passed name is a partial match
*/
async function GetCountryByCountryName(name) {
     const resp = await fetch("http://localhost:8000/search/CountryName/" + name)
    .then(handleErrors)
    .then(response => response.json())
    .then(json => {
       return json;
    })
    .catch(error => {
        error.text().then(errorMessage => {
            alert(errorMessage);
            console.log(errorMessage);
        });
        return null;
    });

    return resp;
}

// Helper function to parse errors from fetch
function handleErrors(response) {
    if (!response.ok) {
        throw response; // throw response and parse it in the catch
    }
    return response;
}