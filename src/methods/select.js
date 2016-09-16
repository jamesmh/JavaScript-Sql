/**
 * Like an Sql Select - it will map all objects to the specified property of the object.
 * @return {$QLObject} 			Chainable $QL Object
 */
$ql.fn.prototype.select = function() {
	var $help = $ql.fn.prototype._helpers;
	var args = arguments;

	var options = {
		property: args[0]
	};

	var $qlSelect = function(item) {
		return $help.getObjectValue($help.getPropertyFromDotNotation(options.property, item));
	};

	return $help.chooseAndExecCallbackFunction(this, args, Array.prototype.map, $qlSelect);
};