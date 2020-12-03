import requests
import re
import json

from fastapi import FastAPI, HTTPException
from Backend.countryData import Country

app = FastAPI()


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

    if re.search('[a-zA-Z][a-zA-Z][a-zA-Z]?', code):  # Check that the passed code is 2 or 3 Alphabetical chars
        response = requests.get(f'https://restcountries.eu/rest/v2/alpha/{code}')
        if response.reason == 'OK':
            country = Country(response.json())
            countryJson = json.dumps(country.__dict__)

            return {"data": countryJson}
        elif response.status_code == "404":
            raise HTTPException(status_code=404, detail="A country with the given code does not exist.")
        else:
            raise HTTPException(status_code=response.status_code, detail="Unexpected status code returned.")

    else:
        raise HTTPException(status_code=400, detail="Passed Country code is not properly formatted."
                                                    "They should be 2 to 3 Alphabetical characters")


@app.get("search/CountryName/{name}", tags=["SCountry,CountrySearch"])
async def search_by_country_name(name: str):
    """
        Searches for a Country or Countries based on the passed name
        Will check if the passed name contains only Alphabetic characters
            If the check fails a 400 Status code is returned
            Otherwise it returns the Country/Countries information

    :param name: The full or partial name of the country being looked up
    :return: The Country or Countries data as json, or a status code and a message describing the problem
    """
    raise NotImplemented
