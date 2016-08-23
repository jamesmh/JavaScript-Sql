# JavaScript-Sql

One day, I realized that the frameworks and libraries I enjoy using have a common trait in their public api: semantics. If an api or library is very "semantic", then they are - in general - very easy to use and understand. One of these frameworks - if not THE framework - that shines in this way is [Laravel](https://laravel.com/).

That being said, I have occasionally looked for a nice JavaScript library that offers a semantic api to provide "SQL" like functionality. I've see bits and pieces of what I would like in other libraries like Underscore, LoDash etc. - but nothing complete. Yes, we have JavaScript map and filter functions....but that's still not semantic enough.

What if I took the simplicity and semantics of a framework like Laravel and created a pseudo SQL JavaScript library?...

Here's my attempt....

# Compatibility

Probably "IE 9 and higher". ES5 functions like map and filter are being used internally, but not ES6.

# Dependencies

None. Just Plain-old JavaScript (ES5).

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
var array = $ql(peopleArray).select().otherMethod(); //etc...
```

## Select

The select is the equivalent of the JavaScript map() method. In fact, it uses map internally. 

There are two ways to use this method.

### 1. The Semantic Way
### Select On A Specific Property:
Use "dot notation" and tell the select exactly which property you want.
```
  var firstNames = $ql(peopleArray).select('name.first');
```

If the property you want to select on is a function (without any parameters), the select will just call that function and use the result.
```
  // name.fullname is a function that returns the person's full name...
  var fullNames = $ql(peopleArray).select('name.fullname');
```

#### Just Return Full Objects:
Just call select() with no parameters to get the array with full objects.
```
  var array = $ql(peopleArray).select();
```

#### Full Control:
Supply a function that will be internally supplied to the map() function. Useful for more complex scenarios (the example is not a complex scenario...).
```
  var firstNames = $ql(peopleArray).select( (person) => person.name.first + ' ' + person.name.last);
```

## Where
TODO
## OrderBy
TODO
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
