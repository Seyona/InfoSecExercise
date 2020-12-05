# InfoSec Exercise
Python 3.8 is required to run the webserver 

To install backend requirements run:

` pip install -r requirements.txt`

To start the api server run:

` py Backend/main.py `

You will also need to host a your own webserver with python. To do so, navigate to the directory **ABOVE** the InfosecExercise folder and run

`py -m http.server`

This will start serving HTTP on port 8000

In your favorite browser, navigate to `http://localhost:8000/InfoSecExercise/Frontend/index.html`

You'll see a text box where you can type in the name of a country, or a substring of it, to search for them.

If you want to search by country code, click the drop down to the right of the search bar and select "Country Code".
