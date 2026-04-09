function validateRange(min, max) {
	if (typeof min !== 'number' || typeof max !== 'number') {
		throw new Error('Arguments must be numbers');
	}

	if (min > max) {
		throw new Error('Min cannot be greater than max');
	}
}

export default function randomNumber(min, max) {
	validateRange(min, max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
