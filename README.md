# JavaScript-Sql
JavaScript library that provides SQL like syntax to semantically / logically perform "queries" on JavaScript arrays.

I realized one day that the frameworks and libraries I enojy using have a common trait in their public api: semantics. If an api or library is very "semantic", then they are - in general - very easy to use and understand. One of these frameworks - if not THE framework - that really imprinted this concept into my own mind, is [Laravel](https://laravel.com/).

That being said, I have occasionally looked for a nice JavaScript library that offers a semantic api to provide "SQL" like functionality. I've see bits and peices of what I would like in other libraries like Underscore, LoDash etc. - but nothing complete. Ya, we have JavaScript map and filter functions....but that's still not semantic enough.

What if I took the simplicity and semantics of a framework like Laravel and created a pseudo SQL JavaScript library?...

Here's my attempt.

## How To Use

### Creating New $QL Object
Creating a new $QL object is very similar to (as a familiar reference...) creating a new JQuery object. The only difference is you must supply a JavaScript array as the constructor parameter. 

```
var $people = $ql(arrayOfPeople);
```

Just like JQuery, the returned object is a chainable "$QL" object. We can chain further methods, such as select(), like:

```
// This would simply return the original array.
var array = $ql(peopleArray).select();
```

### Select

The select is the equivalent of the JavaScript map() method. In fact, it uses map internally. 

There are two ways to use this method.

#### 1. The Semantic Way
One string parameter - which is the property of the objects in the array that will be "mapped".
This parameter accepts "dot notation", so we can access nested properties.

```
  var firstNames = $ql(peopleArray).select('name.first');
```

If parameter is ommitted, the select method will return the stored array with full objects. (Useful when we need to process the array using agregates etc. and return full objects)

```
  var array = $ql(peopleArray).select();
```

If the property selected is a function, the select will map based on the result of that function (must be parameterless).

```
  // name.fullname is a function that returns ther person's full name...
  var fullNames = $ql(peopleArray).select('name.fullname');
```


#### 2. The "Normal" Way
Supply a function that will be internally supplied to the map() function. Useful for more complex scenarios (the example is not a complex scenario...).

```
  var firstNames = $ql(peopleArray).select( (person) => person.name.first + ' ' + person.name.last);
```

### Where

### OrderBy

### Join


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
