
import test from './write-pointer-test';

var writeModule = ( () => { 
	try { 
		var writeModule = require('../lib/index');
		return writeModule;
	} catch(e) { 	}
	return false;
})();

if (!writeModule) { 
	console.log('* * * * *You need to run NPM run build before running the lib test.'
			+ '\nThe source files test will still be run.****');
} else { 
	test(
		writeModule.WritePointer, false, 
		writeModule.writePointerAttachAsMixin, false
	);
	test(
		writeModule.WritePointerSafe, true, 
		writeModule.writePointerAttachAsMixin, false
	);
}
