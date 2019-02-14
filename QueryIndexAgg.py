import datetime
import pymongo
from pymongo import MongoClient

client = MongoClient('mongodb://localhost:27017/')
db = client['101']
customers = db['Customers']

# show all insurance customers who are Female, born in 1990, live in Utah and
# have at least one Life insurance policy for which they are registered
# as a Smoker

date_start = datetime.datetime(1990, 1, 1)
date_end = datetime.datetime(1990, 12, 12)

query = {
  'address.state': 'UT',
  'policies': {'$elemMatch': {'policyType': 'life', 'insured_person.smoking': True}},
  'yob': {'$gte': date_start, '$lte' : date_end },
  'gender': 'Female'
}

print("===== QUERY =====")
for customer in customers.find(query):
    print (customer)

# Show all Sum of premiums for policies due in May 2018 by Policy Type
date_start = datetime.datetime(2018, 5, 1)
date_end = datetime.datetime(2018, 5, 30)

pipeline = [
    {"$match": {'policies.nextRenewalDt': {"$gte":date_start, "$lte":date_end }}},
    {"$unwind": "$policies"},
    {"$group": {"_id": "$policies.policyType",
                "renewalTotal" : { "$sum" : "$policies.premiumYear" }}}
]

print("===== AGGREGATION =====")
for customer in customers.aggregate(pipeline):
    print (customer)
