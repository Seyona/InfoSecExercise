import requests
import re
import json

from fastapi import FastAPI
from fastapi.responses import PlainTextResponse
from fastapi.middleware.cors import CORSMiddleware
from collections import OrderedDict
from countryData import Country

app = FastAPI()

origins = [
    "http://localhost:63342",
    "localhost:63342",
    "localhost:8000",
    "http://localhost:8000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


@app.get("/", tags=["root"])
async def read_root() -> dict:
    return {"message": "This is the API root for the Infosec Coding Exercise"}


@app.get("/search/CountryCode/{code}", tags=["SCC", "CC"])
async def search_by_county_code(code: str):
    """ Searches for a Country by its Country code
        Checks if the passed code is 2 or 3 characters in length, and that is only Alphabetical characters
            If the check fails a 400 HTTP status code is returned
            Otherwise, return the country's information

            :param code: Country code that is being looked up
            :return: The Country's data as json, or a status code and a message describing the problem
    """

    pattern = re.compile('[a-zA-Z][a-zA-Z][a-zA-Z]?')
    if pattern.fullmatch(code) is not None:  # Check that the passed code is 2 or 3 Alphabetical chars
        response = requests.get(f'https://restcountries.eu/rest/v2/alpha/{code}')
        if response.status_code == 200:
            country = Country(response.json())
            countryJson = json.dumps(country.__dict__)

            return {"data": countryJson}
        elif response.status_code == 404:
            return PlainTextResponse("A country with the given code does not exist,or there is a connection issue to "
                                     "the external API.", status_code=404)
        else:
            return PlainTextResponse(response.json()["message"], response.status_code)
    else:
        return PlainTextResponse("Passed Country code is not properly formatted. They should be 2 to 3 Alphabetical "
                                 "characters", status_code=400)


@app.get("/search/CountryName/{name}", tags=["SCountry,CountrySearch"])
async def search_by_country_name(name: str):
    """
        Searches for a Country or Countries based on the passed name
        Will check if the passed name contains only Alphabetic characters
            If the check fails a 400 Status code is returned
            Otherwise it returns the Country/Countries information

    :param name: The full or partial name of the country being looked up
    :return: The Country or Countries data as json, or a status code and a message describing the problem
    """

    if name.isalpha():
        # Get all partial matches for the passed name
        response = requests.get(f'https://restcountries.eu/rest/v2/name/{name}')

        if response.status_code == 200:
            countries = []
            country_data = response.json()

            for value in country_data:
                country = Country(value)
                countries.append(country)

            countries.sort(key=lambda x: x.population, reverse=False)
            sorted_countries = []

            # Stats to be compile, # of countries seen, regions, and sub regions seen and their occurrence rate
            stats = {
                "countries_seen": len(countries),
                "regions": OrderedDict(),
                "subregions": OrderedDict()
            }

            regions = dict()
            subregions = dict()

            for country in countries:
                region = country.region
                subregion = country.sub_region

                if region == "":
                    region = "No Region"
                if subregion == "":
                    subregion = "No Subregion"

                regions[region] = regions.get(region, 0) + 1
                subregions[subregion] = subregions.get(subregion, 0) + 1

                country.numerizePopulation()
                sorted_countries.append(country.__dict__)

            for region in sorted(regions):  # Iterate over regions in alphabetical order and apply it to an ordered dict
                stats["regions"][region] = regions[region]

            for subregion in sorted(subregions):  # Do the same for subregions
                stats["subregions"][subregion] = subregions[subregion]

            return {"stats": json.dumps(stats), "data": json.dumps(sorted_countries)}

        elif response.status_code == 404:
            return PlainTextResponse("A country with the given name does not exist,"
                                     " or there is a connection issue to the external API.", status_code=404)
        else:
            return PlainTextResponse(response.json()["message"], response.status_code)
    else:
        return PlainTextResponse("Country name should only contain Alphabetical characters", status_code=400)
