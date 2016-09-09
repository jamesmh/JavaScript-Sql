/**
 * Acts like an Sql OrderBy statement. Performs the native sort function on array.
 * @return {$QLObject} 			Chainable $QL Object
 */
$ql.fn.prototype.orderBy = function() {
	var $help = $ql.fn.prototype._helpers;
	var args = arguments;

	var options;

	if (args.length === 1) {
		options = {
			clause: 'ASC',
			property: args[0]
		};
	} else if (args.length === 2) {
		options = {
			clause: args[0],
			property: args[1]
		};
	} else {
		throw "$ql.orderBy: Incorrect number of arguments...";
	}

	var $qlOrderBy = function(a, b) {
		var aValue = $help.getObjectValue($help.getPropertyFromDotNotation(options.property, a));
		var bValue = $help.getObjectValue($help.getPropertyFromDotNotation(options.property, b));

		var switchValue = options.clause.toUpperCase().trim();
		switch (true) {
			case switchValue.indexOf('ASC') === 0:
				if (aValue < bValue)
					return -1;
				else if (aValue > bValue)
					return 1;
				else
					return 0;
				break;
			case switchValue.indexOf('DESC') === 0:
				if (aValue < bValue)
					return 1;
				else if (aValue > bValue)
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
};