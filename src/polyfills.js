	/**
	 * Polyfill for String.prototype.includes().
	 */
	if(typeof String.prototype.includes === 'undefined'){
		string.prototype.includes = function(pattern){
			return this.indexOf(pattern) >= 0;
		};
	}