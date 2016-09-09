/**
 * Acts like an Sql join statement.
 * @return {$QLObject} 			Chainable $QL Object
 */
$ql.fn.prototype.join = function() {
	var $help = $ql.fn.prototype._helpers;
	var args = arguments;
	var options;
	if (args.length == 3) {
		options = {
			clause: 'LEFT',
			array: args[0],
			leftProperty: args[1],
			rightProperty: args[2]
		};
	} else if (args.length == 4) {
		options = {
			clause: args[0].toUpperCase().trim(),
			array: args[1],
			leftProperty: args[2],
			rightProperty: args[3]
		};
	} else {
		throw "$ql.join: Incorrect number of arguments...";
	}

	if (options.array instanceof $QL)
		options.array = options.array._array;
	else if (options.array.jquery)
		options.array = options.array.toArray();

	var isLeftJoin = options.clause.includes('LEFT');
	var isInnerJoin = options.clause.includes('INNER');

	this._array.forEach(function(left) {
		var rightMatches = options.array.filter(function(right) {
			return $help.getObjectValue($help.getPropertyFromDotNotation(options.leftProperty, left)) == $help.getObjectValue($help.getPropertyFromDotNotation(options.rightProperty, right));
		});

		if (isLeftJoin) {
			left.$joined = rightMatches;
		} else if (isInnerJoin) {
			if (rightMatches.length === 0) {
				left.$destroy = true;
			} else {
				left.$joined = rightMatches;
			}
		}
	});

	//If inner join, we remove all items that had no joins.
	if (isInnerJoin) {
		this._array = this._array.filter(function(item) {
			return !item.$destroy;
		});
	}

	return this;
};