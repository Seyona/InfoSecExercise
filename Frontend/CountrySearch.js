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
            var stats = JSON.parse(countryData.stats);
            PopulateCountryStatsDiv(stats);

        }
    }
}

/**
    Populates the country-stats div
    Takes an object parsed from the "stats" item from the API
*/
function PopulateCountryStatsDiv(countryStats) {

    var regionList = document.getElementById("region-list");
    var subregionList = document.getElementById("subregion-list");

    var statsDiv = document.getElementById("country-stats");
    if (statsDiv.firstChild.outerHTML !== "<hr>") {
        statsDiv.insertBefore(document.createElement("hr"), statsDiv.firstChild);
    }

    document.getElementById("country-pop").innerHTML = "Total Countries Seen: <b>" + countryStats.countries_seen + "</b>";

    regionList.innerHTML = "";
    subregionList.innerHTML = "";

    for (const region in countryStats.regions) {
        createLi(regionList, region, countryStats.regions[region]);
    }

    for (const subregion in countryStats.subregions) {
        createLi(subregionList, subregion, countryStats.subregions[subregion]);
    }
}

// Creates the div based on the passed country information
function CreateCountryDiv(country) {

    var countryTable = document.createElement('table');
    countryTable.id = country.alpha2;
    countryTable.name = country.alpha2;
    countryTable.style.paddingLeft = "600px"; // Padding to "fake" centering for proof of concept

    var tableBody = document.createElement('tbody');
    var nameRow = document.createElement('tr');
    var nameTd = document.createElement('td');

    nameTd.style.wordBreak = "break-word";
    nameTd.style.width = "100px";
    nameTd.innerHTML = country.full_name;

    nameRow.appendChild(nameTd);
    tableBody.appendChild(nameRow);

    // Create the second row, this will contain the picture (first column) and list of information (second column)
    var secondRow = document.createElement('tr');
    var pictureCol = document.createElement('td');
    var infoCol = document.createElement('td');

    // Create Picture Elements
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('height', '100');
    svg.setAttribute('width', '200');
    svg.setAttribute('id', country.alpha3);

    var pic = document.createElementNS('http://www.w3.org/2000/svg','image');
    pic.setAttribute('height', '100');
    pic.setAttribute('width', '200');
    pic.setAttribute('id', country.alpha2 + "image");
    pic.setAttribute('href', country.flag);

    svg.appendChild(pic);
    pictureCol.appendChild(svg);
    secondRow.appendChild(pictureCol);

    // Construct information list
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

    infoCol.appendChild(infoList);
    secondRow.appendChild(infoCol);
    tableBody.appendChild(secondRow);


    // Apply the body to the table
    countryTable.appendChild(tableBody);

    // Apply table to parent div
    document.getElementById('country-info').appendChild(countryTable);
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
     const resp = await fetch("http://localhost:7000/search/CountryCode/" + code)
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
     const resp = await fetch("http://localhost:7000/search/CountryName/" + name)
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