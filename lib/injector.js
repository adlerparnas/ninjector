var fs = require('fs');

var _instance;

var _holdingToInstantiate = [];

function _instantiate(classConstructor) {
	var dependecies = [];

	if (_holdingToInstantiate[ classConstructor.name ]) {
		throw classConstructor.name + 'cyclic dependecies';
	}

	_holdingToInstantiate[ classConstructor.name ] = true;

	function instantiator(args) {
		_holdingToInstantiate[ classConstructor.name ] = false;
		return classConstructor.apply(this, dependecies);
	}	

	instantiator.prototype = classConstructor.prototype;

	if ('$inject' in classConstructor) {
		classConstructor.$inject.forEach(function(dep) {
			dependecies.push(_instance.createInstance(dep));
		});	
	}

	return new instantiator();
}

function Injector() {
	this._classMapping = {};
}

Injector.prototype.registerClasses = function(classes) {
	var _self = this,
		_classMapping = this._classMapping,
		className;

	classes.forEach(function(classConfig) {
		className = classConfig.name;

		if (className in _classMapping) {
			throw className + ' already mapped';
		}

		_classMapping[className] =  classConfig;
	});
};


Injector.prototype.createInstance = function(className) {
	var classConfig;

	if (!(className in this._classMapping)) {
		throw className + ' is not mapped';
	}

	classConfig = this._classMapping[className];

	if (!classConfig._constructor) {
		classConfig._constructor = require(classConfig.path);
	}

	if (classConfig.singleton) {
		if (!classConfig._instance) {
			classConfig._instance  = _instantiate(classConfig._constructor);
		}

		return classConfig._instance;
	} else {
		return _instantiate(classConfig._constructor);
	}
}

Injector.getInstance = function() {
	if (!_instance) {
		_instance = new Injector();
	}

	return _instance;
};

exports = module.exports = Injector;