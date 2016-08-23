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
##### Omitting the property to match on just uses the full object when testing
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
TODO

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
