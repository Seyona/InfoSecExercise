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
async def SearchByCountyCode(code: str):
    """ Searches for a country by its Country code
        Checks if the passed code is 2 or 3 characters in length, and that is only Alphabetical characters
            If the check fails a 400 HTTP status code is returned
            Otherwise, return the country's information
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
        raise HTTPException(status_code=400, detail="Country code was in the incorrect format.")