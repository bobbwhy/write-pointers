
import test from './write-pointer-test';

import { WritePointer, WritePointerSafe, writePointerAttachAsMixin } 
				from '../src/index';

test(WritePointer, false, writePointerAttachAsMixin, true);
test(WritePointerSafe, true, writePointerAttachAsMixin, true);


