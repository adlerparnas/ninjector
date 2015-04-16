'use strict';

var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.should();
chai.use(sinonChai);

var myClassFilePath = './testFiles/my.class.js';
var dep1FilePath = './testFiles/dep1.class.js';
var dep2FilePath = './testFiles/dep2.class.js';
var dep3FilePath = './testFiles/dep3.class.js';


describe('#DependencyInjector', function() {
	var injector = require('./injector.js');

	var i;

	beforeEach(function() {
		i = injector.getInstance();
	});

	describe('Injector Configuration', function() {

		it('should create a singleton instance of Injector', function() {
			var i2 = injector.getInstance();

			chai.expect(i).to.equal(i2);
		});

		it('should save the many mapping of classes and path', function() {
			i.registerClasses([
				{
					name: 'MyClass',
					path: myClassFilePath
				},
				{
					name: 'MyClass2',
					path: myClassFilePath
				}
			]);

			chai.expect(i._classMapping.MyClass).eql({ name: 'MyClass', path: myClassFilePath });
			chai.expect(i._classMapping.MyClass2).eql({ name: 'MyClass2', path: myClassFilePath });
		});

		it('should support singleton configuration', function() {
			i.registerClasses([
				{
					name: 'single1',
					path: myClassFilePath,
					singleton: true
				}
			]);

			chai.expect(i._classMapping.single1).eql({ name: 'single1', path: myClassFilePath, singleton: true });
		});
	});

	describe('Object creation', function() {
		it('should create a instance of a given Object based on name property', function() {
			var obj = i.createInstance('MyClass');

			chai.expect(obj.constructor.name).equal('MyClass');
		});

		it('should create only one instance for singleton classes', function() {
			var obj1 = i.createInstance('single1');
			var obj2 = i.createInstance('single1');

			chai.expect(obj1).equal(obj2);
		});

		it('should respect the class dependencies', function() {
			var obj;

			i.registerClasses([
				{
					name: 'dep1',
					path: dep1FilePath
				}
			]);

			obj = i.createInstance('dep1');

			chai.expect(obj.myClass.constructor.name).equal('MyClass');
		});

		it('should throw error when find cyclic dependencies', function() {
			var obj;

			i.registerClasses([
				{
					name: 'dep2',
					path: dep2FilePath
				},
				{
					name: 'dep3',
					path: dep3FilePath
				}
			]);

			chai.expect(function() {
				obj = i.createInstance('dep2');
			}).to.throw();
		});
	});

});