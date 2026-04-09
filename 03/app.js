export default function randomNumber(min, max) {
	if (typeof min !== 'number' || typeof max !== 'number') {
		throw new Error('Arguments must be numbers');
	}

	if (min > max) {
		throw new Error('Min cannot be greater than max');
	}

	return Math.floor(Math.random() * (max - min + 1)) + min;
}
