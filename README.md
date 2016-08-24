# JavaScript-Sql

One day, I realized that the frameworks and libraries I enjoy using have a common trait in their public api: semantics. If an api or library is very "semantic", then they are - in general - very easy to use and understand. One of these frameworks - if not THE framework - that shines in this way is [Laravel](https://laravel.com/).

That being said, I have occasionally looked for a nice JavaScript library that offers a semantic api to provide "SQL" like functionality. I've see bits and pieces of what I would like in other libraries like Underscore, LoDash etc. - but nothing complete. Yes, we have JavaScript map and filter functions....but that's still not semantic enough.

What if I took the simplicity and semantics of a framework like Laravel and created a pseudo SQL JavaScript library?...

Here's my attempt....

# Compatibility

Probably "IE 9 and higher". ES5 functions like map and filter are being used internally, but not ES6.

# Dependencies

None. Just Plain-old JavaScript (ES5).

# Methods
### [Select](#select-1)
### [OrderBy](#orderby-1)
### [Where](#where-1)
### [Join](#join-1)

# How To Use

## Creating New $QL Object
Creating a new $QL object is very similar to (as a familiar reference...) creating a new JQuery object. The only difference is you must supply a JavaScript array as the constructor parameter. 
```
var $people = $ql(arrayOfPeople);
```

Also, for JQuery support, you can pass in a JQuery object to the constructor. Internally, the constructor will call .toArray().
```
var $people = $ql($jqueryPeople);
```

Just like JQuery, the returned object is a chainable "$QL" object. We can chain further methods, such as select(), like:
```
var array = $ql(peopleArray).select();
```

## Select

The select is the equivalent of the JavaScript map() method. In fact, it uses map internally. The ways to use it are:

#### Select On A Specific Property:
Use "dot notation" and tell the select() exactly which property you want.
```
  var firstNames = $ql(peopleArray).select('name.first');
```

If the property you want to select on is a function (without any parameters), the select will just call that function and use the result.
```
  // name.fullname is a function that returns the person's full name...
  var fullNames = $ql(peopleArray).select('name.fullname');
```

#### Just Return Full Objects:
Call select() with no parameters to get the array with full objects.
```
  var array = $ql(peopleArray).select();
```

#### Full Control:
Supply a function that will be internally supplied to the map() function. Useful for more complex scenarios (the example is not a complex scenario...).
```
  var firstNames = $ql(peopleArray).select( (person) => person.name.first + ' ' + person.name.last);
```
## OrderBy

Order By will sort your array. The ways to use it are:

#### Just Tell It What To Order By:
Just like the SQL Order By statement, we can just tell the method what property to sort on.
```
var people = $ql(peopleArray).orderBy("name.first").select();
```

You can also type of sorting you want- ascending vs. descending. (Leaving out the type of sorting you want will default to an ascending sort.)
```
var people = $ql(peopleArray).orderBy("DESC", "name.first").select();
```

As long as the string starts with "asc" or "desc" it will work.
```
var people = $ql(peopleArray).orderBy("descending", "name.first").select();

var people = $ql(peopleArray).orderBy("ascending", "name.first").select();

var people = $ql(peopleArray).orderBy("ASCENDING", "name.first").select();

var people = $ql(peopleArray).orderBy("ASC", "name.first").select();

// Etc... they all work!
```

#### Want More Control? 
Internally, the orderBy() uses the sort() method provided natively on array objects. If you need full control for more complex scenarios, just provide the function to be used by sort().
```
var someSortFunctionYouDefined = function(a, b,) { /* sort... */ };

var people = $ql(peopleArray).orderBy(someSortFunctionYouDefined).select();
```

## Where
The where() is a filter on your array. It will include or exclude items based on a certain condition. The ways to use it are:

#### Full Semantic Where!
This code would perform the where just like you think it would...it's so easy to understand because of the semantics - I don't need to explain!
```
var canadians = $ql(peopleArray).where("address.country.code", "==", "CA").select();
```

However, there are things to know.
##### Omitting the property to match on just uses the full object when testing:
```
var canadaString = $ql(countriesStringArray).where("==", "CA").select();
```

##### The available "operators":
* "=" and "==" use `==`
* "===" uses `===`
* "!=" uses `!=`
* "!==" uses  `!==`
* "<" uses `<`
* ">" uses `>`
* "<=" uses `<=`
* ">=" uses `>=`

##### If you want to provide more verbose operators, you can use the following:
* Some form of "equal" or "is" will use `==`
* Some form of "not" will use `!=`
* Some form of "less" will use `<`
* Some form of "greater" will use `>`

##### You can even use the **LIKE** clause in your where statements!
* Some form of "like" will check if the value to test against is found in the property as a substring (usually only used with strings). This is case sensitive.

#### Full Control?
Internally, the where() uses the filter() method. You can just supply the function to be used by the filter.
```
var canadians = $ql(peopleArray).where( person => person.country.code === 'CA' ).select();
```

## Join
#### Semantic Left Join
A left join will keep all the items in the origial array (i.e. the "left" side) regardless of whether they have a match or not.
To do a left join you can supply 3 parameters (array to join, left property to join on, right property to join on). 
```
var joinedPeople = $ql(peopleArray).join(countriesArray, "address.country", "name").select();
```

The code above would check each person in the peopleArray, and if their property "address.country" (ex. "Canada") matched a property "name" in any of the countries in "countriesArray", the country would be "joined".

#### Semantic Inner Join
Like the left join, but we do not keep any items on the "left" side (i.e. the original array) if they have no matches. You must specify that this is an "inner" join using some form of "inner" as the first parameter.
```
var innerJoinedPeople = $ql(peopleArray).join("inner", countriesArray, "address.country", "name").select();
```

#### How To Use Joined Objects?
Once you perform a join, each item in the original array will have a new property added: "$joined". This is an array holding all the joined objects. Running a select() on an $ql object that had a join performed will allow you to access the joined items.
```
var peopleWithCountries = $ql(peopleArray).join(countriesArray, "address.country", "name").select();
var firstPersonsCountries = peopleWithCountries[0].$joined;

// "firstPersonsCountries" is now the array of all the countries 
// from the "countriesArray" that joined on the first person!
```

#### Exploding Join Results
Normally, when you perform a join in SQL, you get one row per result. So, if a person is joined with - let's say - other people having the same last name, you might get multiple joins and mutliple rows. Can we do this with $QL? Yes!

With multiple results for one "record" or item in the $ql array, the $joined property will just be an arrray with mutliple entries in it. You can call the explode() method after a join to "explode" the results into "one record" per match.
```
var explodedPeople = $ql(peopleArray).join(countriesArray, "address.country", "name").explode().select();

// "explodedPeople" now looks like { left: [personObject], right: [countryObject] }
```

The objects returned by the select() will now return an array of objects having two poroperties: "left" and "right". Left is the item from the original / $ql array and right is a match from the joined array.

Note that the left item's property $joined is set to undefined after exploding.


# To Do?:

Done:
+ Select
+ Where
+ OrderBy
+ Join (plus explode())

To Do: 
+ Exists
+ Distinct
+ Group BY
+ Having
+ Union
+ Minus
+ Except
+ Count
+ Sum
+ Min
+ Max
+ Avg
