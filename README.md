# WritePointers Module.
This module is intended to provide write pointer autonumber indices for use in a data store that uses a lazy delete functionality.
When a record is deleted, the index of the deleted record is recovered and re-used for the next available new record.

The Write Pointer functionality is provided as a class so that it can be embedded within a larger module or class and so multiple instances can be embedded in one structure if needed.

WritePointers contains two classes.  **WritePointer** and **WritePointerSafe**.  WritePointer will do no validation of the params for the inUse and delete functions.  WritePointerSafe will ensure datatype for these.  Use WritePointerSafe during development OR when your WritePointer instance is intended to be used by using authors or other end users.

WritePointers also contains a function ( writePointerAttachAsMixin) to attach a WritePointer or WritePointerSafe instance as a mixin to another class or object.

### Usage 

#### Instantiation: 
``` 
import { WritePointer } from 'write-pointers';
writePointer = new WritePointer('dataPointers');
// or
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




