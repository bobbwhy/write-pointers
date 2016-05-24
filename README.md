# WritePointers Module.
This module is intended to provide write pointer autonumber indices for use in a data store that uses a lazy delete functionality.
When a record is deleted, the index of the deleted record is recovered and re-used for the next available new record.

The Write Pointer functionality is provided as a class so that it can be embedded within a larger module or class and so multiple instances can be embedded in one structure if needed.

WritePointers contains two classes.  **WritePointer** and **WritePointerSafe**.  WritePointer will do no validation of the params for the inUse and delete functions.  WritePointerSafe will ensure datatype for these.  Use WritePointerSafe during development OR when your WritePointer instance is intended to be used by using authors or other end users.

WritePointers also contains a function ( writePointerAttachAsMixin) to attach a WritePointer or WritePointerSafe instance as a mixin to another class or object.

### Commands: 
**next:** gets the next available id  
**inUse:** checks to see if an id is in use   
**delete:** deletes an id from the system and makes it available for the next function for reuse  
**count:** checks to see how many ids are in use OR the number of ids in use + those that have been deleted.

### Usage 

#### Instantiation: 
``` 
import { WritePointer } from 'write-pointers';
writePointer = new WritePointer('dataPointers');
// or to start the index at a specific value: 
writePointer = new WritePointer('dataPointers', 20);
// or to do the same things with id validation.
import { WritePointerSafe } from 'write-pointers';
writePointer = new WritePointerSafe('dataPointersSafe');
```

#### Next Available Write Id: 
``` let newId = writePointer.next() ```

#### Delete an in-use Write Id: 
``` 
// returns true if an in-use record was deleted, false if no record to be deleted 
let didThisDelete = writePointer.delete() 
```

#### Check if an Id is being used for a record: 
``` 
let isThisInUse = writePointer.inUse(<id>)
```
#### How Many Records are in this system.
``` 
// return the number of records that are in use.
let count = writePointer.count();

// return the number of ALL records including ones that were deleted.
let count = writePointer.count(false);
```

### Use as a Mixin
**writePointerAttachAsMixin** function will attach the four api commands to a parent or target class as public function proxy calls to the writePointer instance.  The functions will appear on the parent class.  By default, camelCase will be used, but underscore notation is also possible.

**To use with CamelCase:**

```
const writePointer = new WritePointer('index');
class targetClass {}
writePointerAttachAsMixin(writePointer, targetClass, <camelCase> = true);
/* 
	writePointer.next  .... targetClass.indexNext;
	writePointer.delete  .... targetClass.indexDelete;
	writePointer.inUse  .... targetClass.indexInUse;
	writePointer.count  .... targetClass.indexCount;
*/
```

**To use with underscore:**

```
const writePointer = new WritePointer('index');
class targetClass {}
writePointerAttachAsMixin(writePointer, targetClass, false);
/* 
	writePointer.next  .... targetClass.index_next;
	writePointer.delete  .... targetClass.index_delete;
	writePointer.inUse  .... targetClass.index_inUse;
	writePointer.count  .... targetClass.index_count;
*/
```



