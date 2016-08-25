/**
 * Author: James Hickey
 * GitHub: https://github.com/jamesmh
 *
 * Description: JavaScript library that provides SQL like syntax to semantically / logically perform "queries" on JavaScript arrays.
 */
	/**
	 * Polyfill for String.prototype.includes().
	 */
	if(typeof String.prototype.includes === 'undefined'){
		string.prototype.includes = function(pattern){
			return this.indexOf(pattern) >= 0;
		};
	}
$ql = (function() {

	/**
	 * Create a new $QL object that allows chaining additional methods.
	 *
	 * Creating a new $QL object is very similar to (as a familiar reference...) creating a new JQuery object. 
	 * The only difference is you must supply a JavaScript array as the constructor parameter. 
	 * 
	 * @param  {Array} array 			Some Javascript Array
	 * @return {SemnaticJs}      		Returns a new $QL object that allows chaining additiona methods.
	 */
	var $QL = function(array) {
		return new $QL.fn(array);
	};

	/**
	 * Called by constructor (which acts as a factory function) to create a new $QL object.
	 * @param {Array} array 			Some Javascript Array
	 */
	$QL.fn = function(array){
		if(array.jquery && array.selector){
			array = array.toArray();
		}

		this._array = array;
	};

	/**
	 * Prototype contains all chainable methods available to a $QL object.
	 * @type {Prototype Object}
	 */
	$QL.fn.prototype = {
		/**
		 * Like an SQL Where or JavaScript Filter method, this filters items in the supplied collection.
		 * @return {Array} 				New array with filtered collection.
		 */
		where: function(){ 			
			var $help = $ql.fn.prototype._helpers;
			var args = arguments;	

			/**
			 * The $QL version of the Where method, allows caller to 
			 * supply $ql string parameters for the collection
			 * filtering instead of a Function.
			 * @return $QLObject 		Chainable $QL Object
			 */
			var $qlWhere = function(item){
					var options;

					if(args.length === 3){
						options = {
			 			property: args[0],
			 			operator: args[1],
			 			value: args[2]
					};
				}
				else if(args.length === 2){
					options = {
			 			property: null,
			 			operator: args[0],
			 			value: args[1]
					};
				}
				else {
						throw "$ql.where: Incorrect number of arguments.";
					}

					var obj = $help.getPropertyFromDotNotation(options.property, item);
					var propertyToUpper = options.operator.toUpperCase();

					switch(options.operator){
						case '=':
						case '==':
						case (propertyToUpper.includes('EQUAL') ? options.operator : false):
						case (propertyToUpper === 'IS' ? options.operator : false):
							return $help.getObjectValue(obj) == options.value;
						case '===':
							return $help.getObjectValue(obj) === options.value;
						case '!=':
						case (options.operator.toUpperCase().includes('NOT') ? options.operator : false):
							return $help.getObjectValue(obj) != options.value;
						case '!==':
							return $help.getObjectValue(obj) !== options.value;
						case '<':
						case (options.operator.toUpperCase().includes('LESS') ? options.operator : false):
							return $help.getObjectValue(obj) < options.value;
						case '>':
						case (options.operator.toUpperCase().includes('GREATER') ? options.operator : false):
							return $help.getObjectValue(obj) > options.value;
						case '<=':
							return $help.getObjectValue(obj) <= options.value;
						case '>=':
							return $help.getObjectValue(obj) >= options.value;
						case (propertyToUpper === 'LIKE' ? options.operator : false):
						return $help.getObjectValue(obj).includes(options.value);
						default:
							throw "$ql: Invalid Operator '" + options.operator + "'.";
					}
				};
			this._array = $help.exec$qlFunction.call(this, args, Array.prototype.filter, $qlWhere);
			return this;
		},

		/**
		 * Like an Sql Select - it will map all objects to the specified property of the object.
		 * @return {$QLObject} 			Chainable $QL Object
		 */
		select: function(){
			var $help = $ql.fn.prototype._helpers;
			var args = arguments;

			var options = {
				property: args[0]
			};

			var $qlSelect = function(item){
				return $help.getObjectValue($help.getPropertyFromDotNotation(options.property, item));
			};

			return $help.exec$qlFunction.call(this, args, Array.prototype.map, $qlSelect);
		},

		/**
		 * Acts like an Sql OrderBy statement. Performs the native sort function on array.
		 * @return {$QLObject} 			Chainable $QL Object
		 */
		orderBy: function() {
			var $help = $ql.fn.prototype._helpers;
			var args = arguments;

			var options;

			if(args.length === 1){
				 options = {
				 	clause: 'ASC',
					property: args[0] 				
				};
			}
			else if(args.length === 2){
				options = {
					clause: args[0],
					property: args[1] 				
				};
			}
			else{
				throw "$ql.orderBy: Incorrect number of arguments...";
			}

			var $qlOrderBy = function(a, b){
				var aValue = $help.getObjectValue($help.getPropertyFromDotNotation(options.property, a));
				var bValue = $help.getObjectValue($help.getPropertyFromDotNotation(options.property, b));

				var switchValue = options.clause.toUpperCase().trim();
				switch(true){
					case switchValue.indexOf('ASC') === 0:
						if(aValue < bValue)
							return -1;
						else if(aValue > bValue)
							return 1;
						else
							return 0;
						break;
					case switchValue.indexOf('DESC') === 0:
						if(aValue < bValue)
							return 1;
						else if(aValue > bValue)
							return -1;
						else
							return 0;
						break;
					default:
						throw "$sql.orderBy: There's something wrong with the clause '" + options.clause + "'....";
				}
			};

			this._array = $help.exec$qlFunction.call(this, args, Array.prototype.sort, $qlOrderBy);
			return this;
		},

		join: function(){
			var $help = $ql.fn.prototype._helpers;
			var args = arguments;
			var options;
			if(args.length == 3){
				options = {
					clause: 'LEFT',
					array: args[0],	 				
					leftProperty: args[1],
					rightProperty: args[2]	 				
				};
			}
			else if(args.length == 4){
				options = {
					clause: args[0].toUpperCase().trim(),
					array: args[1],	 				
					leftProperty: args[2],
					rightProperty: args[3]	 				
				};
			}
			else {
				throw "$ql.join: Incorrect number of arguments...";
			}

			if(options.array instanceof $QL)
				options.array = options.array._array;
			else if(options.array.jquery)
				options.array = options.array.toArray();

			var isLeftJoin = options.clause.includes('LEFT');
			var isInnerJoin = options.clause.includes('INNER');

			this._array.forEach(function(left){
				var rightMatches = options.array.filter(function(right){
					return $help.getObjectValue($help.getPropertyFromDotNotation(options.leftProperty, left)) == $help.getObjectValue($help.getPropertyFromDotNotation(options.rightProperty, right));
				});

				if(isLeftJoin){
					left.$joined = rightMatches;
				}
				else if(isInnerJoin){
				if(rightMatches.length === 0){
						left.$destroy = true;
					}
					else{
						left.$joined = rightMatches;
					}
				}
			});

			//If inner join, we remove all items that had no joins.
			if(isInnerJoin){
				this._array = this._array.filter(function(item){ return !item.$destroy; });
			}

			return this;
		},

		explode: function(){
			var $help = $ql.fn.prototype._helpers;
			var args = arguments;

			if(args.length !== 0){
				throw "$ql.explode: Doesn't take any arguments...";
			}

			var explodedArray = [];
			this._array.forEach(function(left){
				if(left.$joined && left.$joined.length){
					left.$joined.forEach(function(right){
						explodedArray.push({left: left, right: right});
					});
					left.$joined = undefined;
				}
			});

			this._array = explodedArray;
			return this;
		}
	}; 	

	return $QL;
})();
/**
 * All Helper methods, usually private to the SQL library, are here!
 */
 $ql.fn.prototype._helpers = (function(){
	
	var module = {};

	/**
 	 * Is the object supplied a Function?
 	 * @param  {Object}  f 			Object to test
 	 * @return {Boolean}   			Is this object a function?
 	 */
 	module.isFunction = function(f){ 
 		return f instanceof Function;
 	};

 	/**
 	 * Is the object supplied a string?
 	 * @param  {Object}  s 			Object to test
 	 * @return {Boolean}   			Is this object a string?
 	 */
 	module.isString = function(s){
 		return typeof s === 'string';
 	};

 	/**
 	 * Common logic used throughout the $ql Js chainable methods to supply polymorphic behavior / arguments.
 	 * @param  {String} functionName            		Name of the function caller is executing
 	 * @param  {ArgumentList} args                   	Arguments supplied to the inital chainable method
 	 * @param  {Function} nativeVersionCallback   		The native function that is used to perform action
 	 * @param  {Function} $qlVersionCallback 			The $QL version of the callback method to use when calling native method
 	 * @return {Object}                         		Result of chosen method
 	 */
 	module.exec$qlFunction = function(args, nativeVersionCallback, $qlVersionCallback){
	 	if(module.isFunction(args[0])){
			return nativeVersionCallback.call(this._array, args[0]);
		}
	 	else{
	 		return nativeVersionCallback.call(this._array, $qlVersionCallback);
	 	}
 	};

 	module.getPropertyFromDotNotation = function(dotNotationProperty, object){
 		if(dotNotationProperty === undefined || dotNotationProperty === null)
 			return object;

 		var propertyKeys = dotNotationProperty.split('.');
 		var propertyIndex = 0;

 		var nextProperty = object[propertyKeys[0]];
 		var currentProperty = null;

 		while(nextProperty !== undefined){
 			//Cache the property that was found previously.		
 			currentProperty = nextProperty;

 			propertyIndex++; 	
 			nextPropertyKey = propertyKeys[propertyIndex];
 			nextProperty = currentProperty[nextPropertyKey];
 		}
 		return currentProperty; 	
 	};

 	/**
 	 * Will return the value of the supplied object. 
 	 * If it's a function, we call the function and return the result.
 	 * Otherwise, just return the object.
 	 * @param  {Object} obj 	Some Javascript object
 	 * @return {Object}     	A Javacript Object
 	 */
 	module.getObjectValue = function(obj){
 		if(typeof obj === 'function')
 			return obj();
 		else
 			return obj;
 	};

 	return module;
 })();