import randomNumber from './app';

describe('randomNumber', () => {
	it('returns 1 if min and max are both equal to 1', () => {
		expect(randomNumber(1, 1)).toBe(1);
	});

	it('throws an error if min is not a number', () => {
		expect(() => randomNumber('x', 3)).toThrow();
	});

	it('throws an error if max is not a number', () => {
		expect(() => randomNumber(2, 'y')).toThrow();
	});

	it('throws an error if min is greater than max', () => {
		expect(() => randomNumber(5, 3)).toThrow();
	});
});
