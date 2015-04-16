'user strict';

/**
 * Build class to instantiate other classes
 * 
 * @param {function} constructor Class constructor
 * @param {array} args           Array of arguments
 */
function Builder(constructor, args) {
	return constructor.apply(this, args);
}	

/**
 * @public
 * Method to instantiate a object based on a constructor and arguments
 *
 * @static
 * @param  {function} constructor Class constructor
 * @param  {array} args           Array of arguments
 * @return {object}               Instance of the given class
 */
Builder.create = function(constructor, args) {
	Builder.prototype = constructor.prototype;

	return new Builder(constructor, args);
}

exports = module.exports = Builder;