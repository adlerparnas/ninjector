function Dep1(myClass) {
	var _self = this;

	_self.myClass = myClass;
}

Dep1.$inject = ['MyClass'];

exports = module.exports = Dep1;