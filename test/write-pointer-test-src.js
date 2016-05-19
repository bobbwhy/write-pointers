
import test from './write-pointer-test';

import { WritePointer, WritePointerSafe, writePointerAttach } 
				from '../src/index';

test(WritePointer, false, true);
test(WritePointerSafe, true, true);


