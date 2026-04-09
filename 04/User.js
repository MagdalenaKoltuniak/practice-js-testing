export default class User {
	constructor({ email, password }) {
		this.email = this.assertValidEmail(email);
		this.password = this.assertValidPassword(password);
	}

	assertValidEmail(email) {
		const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!pattern.test(email)) {
			throw new Error('Email format is invalid');
		}
		return email;
	}

	assertValidPassword(password) {
		if (password.length < 6) {
			throw new Error('Password must be at least 6 characters long');
		}
		return password;
	}

	getEmail() {
		return this.email;
	}

	getPassword() {
		return this.password;
	}

	login() {
		return this.email.endsWith('devmentor.pl');
	}
}
