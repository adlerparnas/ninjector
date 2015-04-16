'use strict';

var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.should();
chai.use(sinonChai);

describe('#Builder', function() {
	function MySimpleClass () {
		this.prop = 'Yep';
	}

	function MyClass (param1, param2, param3) {
		this.prop1 = param1;
		this.prop2 = param2;
		this.prop3 = param3;
	}

	var Builder = require('./builder.js');

	it('should create a object of a given class', function() {
		var obj = Builder.create(MySimpleClass);

		chai.expect(obj).to.be.instanceof(MySimpleClass);
	});

	it('should create a object of a given class passing parameters', function() {
		var params = ['test', 1, { name: 'object'}];
		var obj = Builder.create(MyClass, params);

		chai.expect(obj).to.be.instanceof(MyClass);
		chai.expect(obj.prop1).equal(params[0]);
		chai.expect(obj.prop2).equal(params[1]);
		chai.expect(obj.prop3).equal(params[2]);
	});

	it('should create a objects of diferent classes', function() {
		var params = ['test', 1, { name: 'object'}];
		var obj = Builder.create(MyClass, params);

		chai.expect(obj).to.be.instanceof(MyClass);
		chai.expect(obj.prop1).equal(params[0]);
		chai.expect(obj.prop2).equal(params[1]);
		chai.expect(obj.prop3).equal(params[2]);

		obj = Builder.create(MySimpleClass);

		chai.expect(obj).to.be.instanceof(MySimpleClass);
		chai.expect(obj.prop).equal('Yep');
	});
});