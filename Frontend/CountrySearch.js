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

    var countryInfoDiv = document.getElementById('country-info');
    countryInfoDiv.innerHTML = "<br>"; // Make a clean slate for each search

    if (searchType === 'cc') {
        let countryData = await GetCountryByCountryCode(country);
        if (countryData !== null) {
            var country = JSON.parse(countryData.data);
            CreateCountryDiv(country);
        }

    } else // searching by name
    {
        let countryData = await GetCountryByCountryName(country);
        if (countryData !== null) {
            var countries = JSON.parse(countryData.data);
            countries.forEach(country => {
                CreateCountryDiv(country);
                var br = document.createElement('br');
                document.getElementById('country-info').appendChild(br);
            });
            CompileStats(countries);
        }
    }
}

/**
    Compiles the following items for the array of countries
    Total number of Countries
    A list of all regions and subregions and their appearances
*/
function CompileStats(countries) {
    var numCountries = countries.length;
    var regionsDict = {};
    var subregionsDict = {};

    countries.forEach(country => {
        var region = country.region;
        var subregion = country.sub_region;

        if (regionsDict.hasOwnProperty(region)) {
            regionsDict[region] = regionsDict[region] + 1;
        }
        else {
            regionsDict[region] = 1;
        }

        if (subregionsDict.hasOwnProperty(subregion)) {
            subregionsDict[subregion] = subregionsDict[subregion] + 1;
        }
        else {
            subregionsDict[subregion] = 1;
        }
    });

    return [numCountries, regionsDict, subregionsDict];
}

// Creates the div based on the passed country information
function CreateCountryDiv(country) {
    // Create the div for the country information
            var countryDiv = document.createElement('div');
            countryDiv.id = country.alpha2;
            countryDiv.name = country.alpha2;
            countryDiv.style.paddingLeft = "500px"; // Proof of concept to show that the elements should be centered

            // Create the first span for the Country's name and picture
            var namePicDiv = document.createElement('div');
            namePicDiv.class = "name-picture";
            namePicDiv.style.display = "inline-block";
            namePicDiv.style.textAlign = "left";
            namePicDiv.setAttribute('height','100');
            namePicDiv.setAttribute('width', '210');

            var picLabel = document.createElement('label');
            picLabel.setAttribute("for", country.alpha3);
            picLabel.innerHTML = country.full_name;
            namePicDiv.appendChild(picLabel);

            var breakTag = document.createElement('br');
            namePicDiv.appendChild(breakTag);

            var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('height', '100');
            svg.setAttribute('width', '200');
            svg.setAttribute('id', country.alpha3);
            namePicDiv.appendChild(svg);

            var pic = document.createElementNS('http://www.w3.org/2000/svg','image');
            pic.setAttribute('height', '100');
            pic.setAttribute('width', '200');
            pic.setAttribute('id', country.alpha2 + "image");
            pic.setAttribute('href', country.flag);

            svg.appendChild(pic);
            countryDiv.appendChild(namePicDiv);

            // Create the second span for the remaining Country information

            var infoDiv = document.createElement('div');
            infoDiv.name = "info";
            infoDiv.style.display = "inline-block";
            infoDiv.style.textAlign = "left";

            var infoList = document.createElement('ul');
            infoList.style.margin = "auto";
            infoList.style.listStyleType = "none";

            createLi(infoList, "alpha2", country.alpha2);
            createLi(infoList, "alpha3", country.alpha3);
            createLi(infoList, "population", country.population);
            createLi(infoList, "region", country.region);
            createLi(infoList, "subregion", country.sub_region)

            var languagesCSV = country.languages.join(", "); // convert the array of languages to a CSV for display
            createLi(infoList, "languages", languagesCSV);

            infoDiv.appendChild(infoList);
            countryDiv.appendChild(infoDiv);

            // Apply new Div to parent div
             document.getElementById('country-info').appendChild(countryDiv);
}

// Creates a li for the passed Unordered List
function createLi(parentUl, liDescriptor, liData) {
    var item = document.createElement('li');
    // set the contents
    item.appendChild(document.createTextNode(liDescriptor + ": " + liData));
    parentUl.appendChild(item);
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