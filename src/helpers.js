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