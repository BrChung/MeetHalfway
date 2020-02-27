import requests
from yelpapi import YelpAPI
from apiInfo import get_my_key
import json


#define api key, endpoint, header
API_KEY = get_my_key()
yelp_api = YelpAPI(API_KEY)
url = 'https://www.yelp.com/developers/documentation/v3/business_search'

''' followed tutorial did not work
#Define parameters
PARAMETERS = {'term': 'coffee',
              'limit': 20,
              'radius': 10000,
              'location': 'tustin'}


response = requests.get(url = ENDPOINT, params = PARAMETERS, headers = HEADERS)

#convert json string to dictionary
business_data = response.json()

print(business_data)'''


coffee = yelp_api.search_query(term='Coffee', latitude = 33.878386, longitude = -117.885096, limit = 5) #csuf 33.878386, -117.885096
print(coffee)

i = 0
for x in coffee['businesses']:
    name = str(x['name'])
    address = str(x['location']['address1']) + " " + str(x['location']['city']) + ", " + x['location']['state'] + " " + x['location']['zip_code']
    rating = str(x['rating']) + " Stars by " + str(x['review_count']) + " reviewers"
    try:
        price = str(x['price'])
    except:
        price = "Unknown Price"
    print("Result: ",i)
    print(name)
    print(address)
    print(rating)
    print(price)
    print("")
    i = i + 1