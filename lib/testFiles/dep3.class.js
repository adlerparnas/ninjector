function Dep3(dep2) {
	var _self = this;

	_self.dep2 = dep2;
}

Dep3.$inject = ['dep2'];

exports = module.exports = Dep3;