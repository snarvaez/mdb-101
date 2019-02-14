use 101

//Show all insurance customers who are Female, born in 1990, live in Utah and have at least one Life insurance policy for which they are registered as a Smoker


// Query with full document projection
db.Customers.find(
  {
    'address.state': 'UT',
    'policies': {$elemMatch: {'policyType': 'life', 'insured_person.smoking': true}},
    'yob': {$gte: new Date('1990-01-01'), $lte : new Date('1990-12-12')},
    'gender': 'Female'
  }
);

// Explain = COLLSCAN
db.Customers.find(
  {
    'address.state': 'UT',
    'policies': {$elemMatch: {'policyType': 'life', 'insured_person.smoking': true}},
    'yob': {$gte: new Date('1990-01-01'), $lte : new Date('1990-12-12')},
    'gender': 'Female'
  }
).explain();

// Index
db.Customers.createIndex(
  {
      'address.state': 1,
      'policies.policyType': 1,
      'policies.insured_person.smoking': 1,
      'yob': 1,
      'gender': 1
    }
);

// Explain = IXSCAN
db.Customers.find(
  {
    'address.state': 'UT',
    'policies': {$elemMatch: {'policyType': 'life', 'insured_person.smoking': true}},
    'yob': {$gte: new Date('1990-01-01'), $lte : new Date('1990-12-12')},
    'gender': 'Female'
  }
).explain();

// Query with projection
db.Customers.find(
  {
    'address.state': 'UT',
    'policies': {$elemMatch: {'policyType': 'life', 'insured_person.smoking': true}},
    'yob': {$gte: new Date('1990-01-01'), $lte : new Date('1990-12-12')},
    'gender': 'Female'
  },
  {
    _id:0, firstname:1, lastname:1, yob: 1
  }
);

// Sum of premiums for policies due in May 2018 by Policy Type
db.Customers.aggregate([
  { "$match"  : {'policies.nextRenewalDt': {
											"$gte": new Date('2018-05-01'),
											"$lte": new Date('2018-05-30') }}},

	{ "$unwind" : "$policies"},

	{ "$group"  :	{ "_id" : "$policies.policyType",
									"renewalTotal" : { "$sum" : "$policies.premiumYear" }}}
]);
