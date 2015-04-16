# nodejs-dependency-injector
	Module to implement dependency injection on node application;

# Dependencies

 - mocha
 - chai
 - sinon
 - sinon-chai

# API

	= Injector.getInstance
		Return an instance of the injector

	= Injector.registerClasses
		Register new classes
		
		Parameter:
			- Array(ClassConfig)

			ClassConfig: {
				name: 'MyClass',            // Class Name,
				path: './lib/my.class',     // path to class files',
				singleton: false,           // boolean,
				_constructor: function() {} // 'function to instantiate the class',
			}

	= Injector.createInstance
		Returns an instance of the given Class

		Paramter:
			- String className // Name of the class

# Run the tests

	Install mocha globaly 
		- npm install mocha -g

	Run command:
		npm test