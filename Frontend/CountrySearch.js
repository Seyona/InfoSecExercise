const searchBox = document.querySelector('.country-search')
const submitButton = document.querySelector('.search-button')

searchBox.addEventListener('change', (event) => {
    var textVal = document.getElementById('country-search').value
    if (textVal.trim() == '') {
        document.getElementById("search-button").disabled = true
    }
    else
    {
        document.getElementById("search-button").disabled = false
    }
});

submitButton.addEventListener('click', SearchCountry, false);

async function SearchCountry() {
    var country = document.getElementById('country-search').value
    var searchType = document.getElementById('search-type').value
    if (searchType === 'cc') {
        let countryData = await GetCountryByCountryCode(country);
        console.log(countryData);
    } else // searching by name
    {
        let countryData = await GetCountryByCountryName(country);
        console.log(countryData);
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
        alert(error);
        console.log(error);
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
        alert(error);
        console.log(error);
        return null;
    });

    return resp;
}

// Helper function to parse errors from fetch
function handleErrors(response) {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
}