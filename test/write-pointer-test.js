import 'mocha';
import { expect } from 'chai';


const test = 
	(WritePointer, isWritePointerSafe, writePointerAttachAsMixin, isSource) => {

	const className = isWritePointerSafe ? 'WritePointerSafe' : 'WritePointer';
	const sourceOrLib = isSource ? 'source' : 'lib';

	describe(`${className} : ${sourceOrLib} version Test`,
		() => { 
			var writePointer = new WritePointer();

			it('should throw an Error when instantiating with a bad function name',
				() => { 
					expect( () => new WritePointer(23))
						.to.throw('Invalid Instance Name for WritePointer');
					expect( () => new WritePointer({}))
						.to.throw('Invalid Instance Name for WritePointer');
					expect( () => new WritePointer([]))
						.to.throw('Invalid Instance Name for WritePointer');
					expect( () => new WritePointer("-something"))
						.to.throw('Invalid Instance Name for WritePointer');
					expect( () => new WritePointer("+else"))
						.to.throw('Invalid Instance Name for WritePointer');
					expect( () => new WritePointer(true))
						.to.throw('Invalid Instance Name for WritePointer');
					expect( () => new WritePointer("index"))
						.to.not.throw('Invalid Instance Name for WritePointer');

				}
			)

			it('should return a range from 0, 10', 
				() => { 
					const testRange  = Array.from(new Array(10).keys());
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
					+ ' and all delete statements will return the id that was deleted.',
				() => { 
					expect(writePointer.delete(2)).to.equal(2);
					expect(writePointer.delete(3)).to.equal(3);
					expect(writePointer.delete(7)).to.equal(7);
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
						expect(writePointer.delete(2)).to.equal(-1);
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
					
					expect(writePointer.delete(20)).to.equal(-1);
				}
			);

		}
	);

	describe(`${className} version ${sourceOrLib} with startAt index`, 
		() => { 
			var writePointer = new WritePointer('index', 10);
			
			it('should return a range from 10, 19', 
				() => { 
					const testRange  = Array.from(new Array(10).keys())
														.map((item) => item + 10);
					const pointedIds = testRange.map((i) => writePointer.next());
					expect(pointedIds).to.deep.equal(testRange);
			});

			it('should return a count of 10', 
				() => { 
					expect(writePointer.count()).to.equal(10);
			});

			it('should delete 1 and show a count of 9', 
				() => { 
					writePointer.delete(12);
					expect(writePointer.count()).to.equal(9);
			})

		}
	);

	describe(`${className} version ${sourceOrLib} writePointerAttachAsMixin` 
	 	+ 'using underscore notation',
		() => { 

			class SomeClass {
				constructor() { 
					const writePointer = new WritePointer('index');
					writePointerAttachAsMixin(writePointer, this, false);
				}
			}

			const someClass = new SomeClass();

			it('should be able to call next ', () => { 
				expect(someClass.index_next()).to.equal(0);
				expect(someClass.index_next()).to.equal(1);
				expect(someClass.index_next()).to.equal(2);
			});

			it('should show a inUse count value of 2', () => { 
				expect(someClass.index_count()).to.equal(3);
			});

			it('should be able to call inUse', () => { 
				expect(someClass.index_inUse(0)).to.equal(true);
			});

			it('should show an count with inUse = false of 3', () => { 
				expect(someClass.index_count(false)).to.equal(3);
			});

			it('should be able to call delete', () => { 
				expect(someClass.index_delete(0)).to.equal(0);
				expect(someClass.index_delete(0)).to.equal(-1);
			});

			it('should show an count with inUse = true of 2', () => { 
				expect(someClass.index_count()).to.equal(2);
			});

			it('should show an count with inUse = false of 3', () => { 
				expect(someClass.index_count(false)).to.equal(3);
			});
		}
	);

	describe(`${className} version ${sourceOrLib} writePointerAttachAsMixin` 
	 	+ 'using camelCase notation',
		() => { 

			class SomeClass {
				constructor() { 
					const writePointer = new WritePointer('index');
					writePointerAttachAsMixin(writePointer, this);
				}
			}

			const someClass = new SomeClass();

			it('should be able to call next ', () => { 
				expect(someClass.indexNext()).to.equal(0);
				expect(someClass.indexNext()).to.equal(1);
				expect(someClass.indexNext()).to.equal(2);
			});

			it('should show a inUse count value of 2', () => { 
				expect(someClass.indexCount()).to.equal(3);
			});

			it('should be able to call inUse', () => { 
				expect(someClass.indexInUse(0)).to.equal(true);
			});

			it('should show an count with inUse = false of 3', () => { 
				expect(someClass.indexCount(false)).to.equal(3);
			});

			it('should be able to call delete', () => { 
				expect(someClass.indexDelete(0)).to.equal(0);
				expect(someClass.indexDelete(0)).to.equal(-1);
			});

			it('should show an count with inUse = true of 2', () => { 
				expect(someClass.indexCount()).to.equal(2);
			});

			it('should show an count with inUse = false of 3', () => { 
				expect(someClass.indexCount(false)).to.equal(3);
			});

		}
	);


	if (isWritePointerSafe === false) return;

	describe(`WritePointerSafe: ${sourceOrLib} version validations`,
	() => { 
		var writePointer = new WritePointer();
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
				expect(writePointer.delete(2)).to.equal(2);
		})

		it('should return false when deleting a non existent id', 
			() => { 
				expect(writePointer.delete(7)).to.equal(-1);
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
