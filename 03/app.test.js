import randomNumber from './app';

describe('randomNumber', () => {
	it('returns 1 if min and max are both equal to 1', () => {
		expect(randomNumber(1, 1)).toBe(1);
	});
});
