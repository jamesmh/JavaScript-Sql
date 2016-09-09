/**
 *  Takes the joined $joined array for each array object and explodes them into individual objects like a real sql join would do.
 *  Now each item in the array (this._array) is composed of the left and right matches.
 *  @return {$QLObject} 			Chainable $QL Object
 */
$ql.fn.prototype.explode = function() {
	var $help = $ql.fn.prototype._helpers;
	var args = arguments;

	if (args.length !== 0) {
		throw "$ql.explode: Doesn't take any arguments...";
	}

	var explodedArray = [];
	this._array.forEach(function(left) {
		if (left.$joined && left.$joined.length) {
			left.$joined.forEach(function(right) {
				explodedArray.push({
					left: left,
					right: right
				});
			});
			left.$joined = undefined;
		}
	});

	this._array = explodedArray;
	return this;
};