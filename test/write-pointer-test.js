

import 'mocha';
import { expect } from 'chai';

import { WritePointer, WritePointerSafe, writePointerAttach } 
				from '../src/index';



const test = (WritePointer, isWritePointerSafe, isSource) => { 

	const className = isWritePointerSafe ? 'WritePointerSafe' : 'WritePointer';
	const sourceOrLib = isSource ? 'source' : 'lib';

	describe(`${className} : ${sourceOrLib} version Test`,
		() => { 
			var writePointer = new WritePointer();

			it('should return a range from 0, 10', 
				() => { 

					const testRange = Array.from(new Array(10).keys());
					const pointedIds = testRange.map((i) => writePointer.next());
					expect(pointedIds).to.deep.equal(testRange);
			});

			it('Should show a count of the 10 items in use. ', 
				() => { 
					expect(writePointer.count()).to.equal(10);
					expect(writePointer.count(true)).to.equal(10);
					expect(writePointer.count(false)).to.equal(10);
			})

			it('Should delete items 2, 3, 7 and get those values in next statements'
					+ ' and all delete statements will return true',
				() => { 
					expect(writePointer.delete(2)).to.equal(true);
					expect(writePointer.delete(3)).to.equal(true);
					expect(writePointer.delete(7)).to.equal(true);
					const testRange = [7, 3, 2];
					const pointedIds = testRange.map( () => writePointer.next());
					expect(pointedIds).to.deep.equal(testRange);
			});

			it('Should show a count of the 7 inUse items and 10 inUse and deleted. ', 
				() => { 
					expect(writePointer.count()).to.equal(7);
					expect(writePointer.count(true)).to.equal(7);
					expect(writePointer.count(false)).to.equal(10);
			})

			it('Should return false when trying to delete an item that has already'
					+ ' been deleted',
					() => { 
						expect(writePointer.delete(2)).to.equal(false);
				}
			);

			it('Should STILL show a count of the 7 inUse items and 10 inUse and deleted.',
				() => { 
					expect(writePointer.count()).to.equal(7);
					expect(writePointer.count(true)).to.equal(7);
					expect(writePointer.count(false)).to.equal(10);
			})

			it('Should return false when trying to delete an item that has not'
				+ ' been created',
				() => { 
					expect(writePointer.delete(20)).to.equal(false);
				}
			)

		}
	);

	if (isWritePointerSafe === false) return;

	describe(`WritePointerSafe: ${sourceOrLib} version validations`,
	() => { 
		var writePointer = new WritePointerSafe();
		Array.from(new Array(5).keys()).map( () => writePointer.next());

		it('should throw errors when trying to delete with wrong datatype id ', 
			() => { 
				expect(()=>writePointer.delete("hi")).to.throw('Invalid Id');
				expect(()=>writePointer.delete('1.4')).to.throw('Invalid Id');
				expect(()=>writePointer.delete(false)).to.throw('Invalid Id');
				expect(()=>writePointer.delete({})).to.throw('Invalid Id');
				expect(()=>writePointer.delete([])).to.throw('Invalid Id');
				expect(()=>writePointer.delete(null)).to.throw('Invalid Id');
		})

		it('should not throw an error when deleting', 
			() => { 
				expect(writePointer.delete(2)).to.equal(true)
		})

		it('should return false when deleting a non existent id', 
			() => { 
				expect(writePointer.delete(7)).to.equal(false);
		})
		
		it('should throw errors when inUse functions called with wrong datatype id ', 
			() => { 
				expect(()=>writePointer.inUse("hi")).to.throw('Invalid Id');
				expect(()=>writePointer.inUse('1.4')).to.throw('Invalid Id');
				expect(()=>writePointer.inUse(false)).to.throw('Invalid Id');
				expect(()=>writePointer.inUse({})).to.throw('Invalid Id');
				expect(()=>writePointer.inUse([])).to.throw('Invalid Id');
				expect(()=>writePointer.inUse(null)).to.throw('Invalid Id');
		})
		
	}
);

}

export { test as default };

// test(WritePointer, false);
// test(WritePointerSafe, true);
