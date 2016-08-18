window.$ql = (function() {
 	/**
 	 * Polyfill for String.prototype.includes().
 	 */
 	if(typeof String.prototype.includes === 'undefined'){
 		string.prototype.includes = function(pattern){
 			return this.indexOf(pattern) >= 0;
 		};
 	}

 	/**
 	 * Create a new $QL object that allows chaining additional methods.
 	 * @param  {Array} array 			Some Javascript Array
 	 * @return {SemnaticJs}      		Returns a new $QL object that allows chaining additiona methods.
 	 */
 	var constructor = function(array) {
 		return new $QL(array);
 	};

 	/**
 	 * Called by constructor (which acts as a factory function) to create a new $QL object.
 	 * @param {Array} array 			Some Javascript Array
 	 */
 	var $QL = function(array){
 		if(array.jquery && array.selector){
 			array = array.toArray();
 		} 		
 		this._array = array;
 	};

 	/**
 	 * Prototype contains all chainable methods available to a $QL object.
 	 * @type {Prototype Object}
 	 */
 	$QL.prototype = {
 		/**
 		 * Like an SQL Where or JavaScript Filter method, this filters items in the supplied collection.
 		 * @return {Array} 				New array with filtered collection.
 		 */
 		where: function(){ 			
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

 					var obj = getPropertyFromDotNotation(options.property, item);
 					var propertyToUpper = options.operator.toUpperCase();

 					switch(options.operator){
 						case '=':
 						case '==':
 						case (propertyToUpper.includes('EQUAL') ? options.operator : false):
 						case (propertyToUpper === 'IS' ? options.operator : false):
 							return getObjectValue(obj) == options.value;
 						case '===':
 							return getObjectValue(obj) === options.value;
 						case '!=':
 						case (options.operator.toUpperCase().includes('NOT') ? options.operator : false):
 							return getObjectValue(obj) != options.value;
 						case '!==':
 							return getObjectValue(obj) !== options.value;
 						case '<':
 						case (options.operator.toUpperCase().includes('LESS') ? options.operator : false):
 							return getObjectValue(obj) < options.value;
 						case '>':
 						case (options.operator.toUpperCase().includes('GREATER') ? options.operator : false):
 							return getObjectValue(obj) > options.value;
 						case '<=':
 							return getObjectValue(obj) <= options.value;
 						case '>=':
 							return getObjectValue(obj) >= options.value;
 						case (propertyToUpper === 'LIKE' ? options.operator : false):
 						return getObjectValue(obj).search();
 						default:
 							throw "$ql: Invalid Operator '" + options.operator + "'.";
 					}
 				};
 			this._array = exec$qlFunction.call(this, args, Array.prototype.filter, $qlWhere);
 			return this;
 		},

 		/**
 		 * Like an Sql Select - it will map all objects to the specified property of the object.
 		 * @return {$QLObject} 			Chainable $QL Object
 		 */
 		select: function(){
 			var args = arguments;

 			var options = {
 				property: args[0]
 			};

 			var $qlSelect = function(item){
 				return getObjectValue(getPropertyFromDotNotation(options.property, item));
 			};

 			return exec$qlFunction.call(this, args, Array.prototype.map, $qlSelect);
 		},

 		/**
 		 * Acts like an Sql OrderBy statement. Performs the native sort function on array.
 		 * @return {$QLObject} 			Chainable $QL Object
 		 */
 		orderBy: function() {
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
 				var aValue = getObjectValue(getPropertyFromDotNotation(options.property, a));
 				var bValue = getObjectValue(getPropertyFromDotNotation(options.property, b));

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

 			this._array = exec$qlFunction.call(this, args, Array.prototype.sort, $qlOrderBy);
 			return this;
 		},

 		join: function(){
 			var args = arguments;
 			var options;
 			if(args.length == 3){
	 			options = {
	 				clause: 'LEFT',
	 				leftProperty: args[0],
	 				rightProperty: args[1],
	 				array: args[2]
	 			};
	 		}
	 		else if(args.length == 4){
	 			options = {
	 				clause: args[0].toUpperCase().trim(),
	 				leftProperty: args[1],
	 				rightProperty: args[2],
	 				array: args[3]
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
	 				return getObjectValue(getPropertyFromDotNotation(options.leftProperty, left)) == getObjectValue(getPropertyFromDotNotation(options.rightProperty, right));
	 			});

	 			if(isLeftJoin){
	 				left.$joined = rightMatches;
	 			}
	 			else if(isInnerJoin){
					if(rightMatches.length === 0){
	 					left.$destroy= true;
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
 				}
 			});

 			this._array = explodedArray;
 			return this;
 		}
 	};

 	/**
 	 * Is the object supplied a Function?
 	 * @param  {Object}  f 			Object to test
 	 * @return {Boolean}   			Is this object a function?
 	 */
 	var isFunction = function(f){ 
 		return f instanceof Function;
 	};

 	/**
 	 * Is the object supplied a string?
 	 * @param  {Object}  s 			Object to test
 	 * @return {Boolean}   			Is this object a string?
 	 */
 	var isString = function(s){
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
 	var exec$qlFunction = function(args, nativeVersionCallback, $qlVersionCallback){
	 	if(isFunction(args[0])){
			return nativeVersionCallback.call(this._array, args[0]);
		}
	 	else{
	 		return nativeVersionCallback.call(this._array, $qlVersionCallback);
	 	}
 	};

 	var getPropertyFromDotNotation = function(dotNotationProperty, object){
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
 	var getObjectValue = function(obj){
 		if(typeof obj === 'function')
 			return obj();
 		else
 			return obj;
 	};

 	return constructor; 
})();