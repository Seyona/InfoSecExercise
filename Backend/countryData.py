from numerize import numerize


class Country:
    """ Object to contain necessary country data"""
    def __init__(self, data: dict):
        """ data expected be a dictionary constructed from a json string returned from https://restcountries.eu/"""
        self.full_name = data["name"]
        self.alpha2 = data["alpha2Code"]
        self.alpha3 = data["alpha3Code"]
        self.flag = data["flag"]
        self.region = data["region"]
        self.sub_region = data["subregion"]
        self.population = int(data["population"])
        self.languages = []
        for lang in data["languages"]:
            self.languages.append(lang["name"])

    def numerizePopulation(self):
        """ Numerizes the population. If you want to sort by population call this AFTER you are done sorting """
        self.population = numerize.numerize(self.population)
