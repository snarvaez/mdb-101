import pymongo
from pymongo import MongoClient

client = MongoClient('mongodb://localhost:27017/')
db = client['101']
people = db['People']

print (people.find_one())

you = {
    'name': 'YOUR NAME',
    'fav_villain': 'YOUR FAV VILLAIN',
    'fav_movies': ['Movie1', 'Movie2', 'Movie3'],
    'fav_relatives':[
        {'name':'Jane', 'relationship':'sister'},
        {'name':'John', 'relationship':'cousin'}
    ]
}
people.insert_one(you)

for person in people.find():
    print (person)
