var Builder = require('./builder.js');

/**
 * @private
 * Mapping of classes being instantiated 
 * to avoid cyclic depdendencies
 * 
 * @type {object}
 */
var _holdingToInstantiate = Object.create(null);

/**
 * @private
 * Singleton of Injector
 *
 * @type {Injector}
 */
var _instance;


/**
 * @private
 * Private method to instantiate the object
 * respecting all dependencies
 * 
 * @param  {Function} classConstructor Class constructor
 * @return {object}                    Instance of class
 */
function _instantiate(classConstructor, dependencyOverrides) {
	var dependecies = [];
	var className = classConstructor.name;

	dependencyOverrides = dependencyOverrides || {};

	if (_holdingToInstantiate[className]) {
		throw new Error(className + 'cyclic dependecies');
	}

	_holdingToInstantiate[className] = true;

	if ('$inject' in classConstructor) {
		classConstructor.$inject.forEach(function(dep) {
			if (dep in dependencyOverrides) {
				dependecies.push(dependencyOverrides[dep]);
			} else {
				dependecies.push(_instance.createInstance(dep));
			}
		});	
	}

	_holdingToInstantiate[className] = false;
	
	return Builder.create(classConstructor, dependecies);
}

function Injector() {
	this._classMapping = Object.create(null);
}

/**
 * @public
 * Method to register new Classes and constructors 
 * 
 * @param  {Object} classes Class configuration
 */
Injector.prototype.registerClasses = function(classes) {
	var _classMapping = this._classMapping,
		className;

	classes.forEach(function(classConfig) {
		className = classConfig.name;

		if (className in _classMapping) {
			throw new Error(className + ' already mapped');
		}

		_classMapping[className] =  classConfig;
	});
};


/**
 * @public
 * Method to instantiate a object based on a given class name
 * 
 * @param  {string} className 
 * @return {object} Object of the given class
 */
Injector.prototype.createInstance = function(className, dependencyOverrides) {
	var classConfig,
		_classMapping = this._classMapping;

	if (!(className in _classMapping)) {
		throw new Error(className + ' is not mapped');
	}

	classConfig = _classMapping[className];

	if (!classConfig._constructor) {
		classConfig._constructor = require(classConfig.path);
	}

	if (classConfig.singleton) {
		if (!classConfig._instance) {
			classConfig._instance  = _instantiate(classConfig._constructor, dependencyOverrides);
		}

		return classConfig._instance;
	}

	return _instantiate(classConfig._constructor, dependencyOverrides);
}

/**
 * @public
 * Method to retrieve the instance of the injector
 *
 * @static
 * @return {Injector} Injector instance
 */
Injector.getInstance = function() {
	if (!_instance) {
		_instance = new Injector();
	}

	return _instance;
};

exports = module.exports = Injector;