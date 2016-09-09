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
	$QL.fn.prototype = {}; 	

	return $QL;
})();