# JavaScript-Sql
JavaScript library that provides SQL like syntax to semantically / logically perform "queries" on JavaScript arrays.

This includes things like performing Sql Left and Inner joins. Also, library supports exploding joins just like databases normally produce join results.

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

## How To Use

### Creating New $QL Object
Creating a new $QL object is very similar to (as a familiar reference...) creating a new JQuery object. The only different is you must supply a JavaScript array as the constructor parameter. 

```
var $people = $ql(arrayOfPeople);
```

Just like JQuery, the returned object is a chainable "$QL" object. We can chain further methods, such as select(), like:

```
// This would simply return the original array.
var array = $ql(arrayOfPeople).select();
```

### Select



### Where

### OrderBy

### Join

