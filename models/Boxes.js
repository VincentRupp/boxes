var mongoose = require('mongoose');

var BoxSchema = new mongoose.Schema({
	value: {type: String, default: '1'}
});

BoxSchema.methods.changeValue = function(value, cb) {
	// console.log('Method:' + this.value + ' --> ' + value + ' for ' + this.id);
	this.value = value;
	this.save(cb);
};

BoxSchema.methods.remove1 = function(cb) {
	this.remove(cb);	
}

mongoose.model('Box',BoxSchema);