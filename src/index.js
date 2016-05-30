import Bunyan from 'bunyan';
var log = Bunyan.createLogger({name:"WritePointer"});

// Comments written for JSDOC but it does not support es7 syntax.  Will 
// address in the near future.

const W_TYPE = Symbol('WRITE_POINTER');
const WS_TYPE = Symbol('WRITE_POINTER_SAFE');


/** 
 * A class to handle autonumber write pointers 
 * for data stores using a lazy delete format.
 */
class WritePointer {

	BASE_TYPE = W_TYPE
	TYPE = W_TYPE;

	constructor(name = 'anonymousWritePointer', startAt = 0) { 
		// ensures that this name will not pollute an api with invalid function name
		const validName = /^[$A-Z_][0-9A-Z_$]*$/i;
		if (validName.test(name) === false || typeof(name) === 'boolean') { 
			throw new Error('Invalid Instance Name for WritePointer');
		}

		this.name 			= name;
		this._start 		= startAt;
		this._next 			= startAt;
		this._nextOpen 	= -1;
		this._open 			= [];
		this._deleted 	= {};
		this._mode 			= 0;

	}

	/** 
	 * @return { int } the next available write index
	 */
	next = () => ( this._nextOpen === -1 ) 
								? this._next++
								: this._open[this._nextOpen--];
	
	/** 
	 * deletes the item with the id by 
	 * placing the id in the next available pool
	 * and allowing a new record to be created at the 
	 * site of the old one.
	 * @param { uint } id
	 * @return { boolean } true is something deleted, false if not.
	 */
	delete = (id) => {
		this._assertId(id);
		if (id > this._next || this._open.indexOf(id) !== -1) return false;

		this._open[++this._nextOpen] = id;
		return id;
	}

	/** 
	 * returns true if there is a record in use with the given id
	 * or false if not 
	 * @param { uint } id to be checked
	 * @return { boolean } true if in use, false if not.
	 */
	inUse = (id) => 
		(	this._assertId(id) 
			&& this._open.indexOf(id) === -1 
			&& id < this._next)

	count = (inUse = true) => 
									( ( inUse === true ) 
										? this._next - this._open.length 
										: this._next ) 
										- this._start;

	/** 
	 * placeholder for the same function in WritePointerSafe
	 */
	_assertId = (id) => true;
} 

/** 
 * @desc A class to handle autonumber write pointers 
 * for data stores using a lazy delete format.  Unlike
 * WritePointer class, this one will check to see if 
 * id is passed in as a valid type
 */
class WritePointerSafe extends WritePointer { 

	// TYPE = WS_TYPE;

	constructor(name = 'WritePointerSafe', startAt = 0) { 
		super(name, startAt) 
	}

	/** 
	 * @desc checks to see if an id is an unsigned integer
	 * if not an error is thrown 
	 * @param { * } id
	 * @returns {boolean } true if valid.
	 */
	_assertId = (id) => { 
		if(typeof(id) !== 'number' 
				|| Math.floor(id) !== id 
				|| id < this._start) {

			throw new Error('Invalid Id');
		}

		return true
	}
}

	
/** 
 * will attach writePointer methods to the api of a class. 
 * the writePointer commands are proxied as [writePointer.name + commandName]
 * @param { WritePointer } writePointer 
 * @param { object } target
 * @param { boolean } camelCase if true then names are appended as camelcase
 * else as underscores separators between the name of the writePointer 
 * and the command name.  ie. next becomes nextName or next_name depending upon 
 * this setting
 */
const writePointerAttachAsMixin = (writePointer, target, camelCase = true) => { 
	if (writePointer.BASE_TYPE !== W_TYPE ) throw new Error('Invalid Write Pointer');
	if (typeof(target) !== 'object') { 
		throw new Error('Invalid Target for Write Pointer Attach')
	}

	const name = writePointer.name;
	const commandName
		= (camelCase === true) 
			? (cmd) => `${name}${cmd.slice(0,1).toUpperCase()}${cmd.slice(1)}`
			: (cmd) => `${name}_${cmd}`;

	target[commandName('next')] 	= () 							=> writePointer.next();
	target[commandName('inUse')] 	= (id)						=> writePointer.inUse(id);
	target[commandName('delete')] = (id) 						=> writePointer.delete(id);
	target[commandName('count')] 	= (inUse = true) 	=> writePointer.count(inUse);
		
} 

export { WritePointer, WritePointerSafe, writePointerAttachAsMixin }
