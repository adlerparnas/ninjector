function Dep2(dep3) {
	var _self = this;

	_self.dep3 = dep3;
}

Dep2.$inject = ['dep3'];

exports = module.exports = Dep1;