/**
 * Like an SQL Where or JavaScript Filter method, this filters items in the supplied collection.
 * @return {Array} 				New array with filtered collection.
 */
$ql.fn.prototype.where = function() {
	var $help = $ql.fn.prototype._helpers;
	var args = arguments;

	/**
	 * The $QL version of the Where method, allows caller to supply $ql string parameters for the collection
	 * filtering instead of a Function.
	 * @return $QLObject 		Chainable $QL Object
	 */
	var $qlWhere = function(item) {
		var options;

		if (args.length === 3) {
			options = {
				property: args[0],
				operator: args[1],
				value: args[2]
			};
		} else if (args.length === 2) {
			options = {
				property: null,
				operator: args[0],
				value: args[1]
			};
		} else {
			throw "$ql.where: Incorrect number of arguments.";
		}

		var obj = $help.getPropertyFromDotNotation(options.property, item);
		var propertyToUpper = options.operator.toUpperCase();

		switch (options.operator) {
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
				return $help.getObjectValue(obj).toUpperCase().includes(options.value.toUpperCase());
			default:
				throw "$ql: Invalid Operator '" + options.operator + "'.";
		}
	};
	this._array = $help.chooseAndExecCallbackFunction(this, args, Array.prototype.filter, $qlWhere);
	return this;
};