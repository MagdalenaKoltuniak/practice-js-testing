import DB from './DB';

describe('DB', () => {
	it('returns empty array when database is empty', async () => {
		const db = new DB();
		const rows = await db.getRows();

		expect(rows).toEqual([]);
	});
});

describe('.insert()', () => {
	it('inserts a record with a given numeric id', async () => {
		const db = new DB();
		const data = { id: 1, name: 'Ola', age: 5 };

		const result = await db.insert(data);

		expect(result).toEqual(data);
	});

	it('rejects when id is not a number', async () => {
		const db = new DB();
		const data = { id: 'a', name: 'Ola', age: 5 };

		await expect(db.insert(data)).rejects.toEqual('ID can be only number!');
	});

	it('rejects when id is duplicated', async () => {
		const db = new DB();

		await db.insert({ id: 1, name: 'Ola', age: 5 });

		await expect(db.insert({ id: 1, name: 'Marta', age: 7 })).rejects.toEqual("ID can't be duplicated!");
	});

	it('assign id = 1 when inserting first record without id', async () => {
		const db = new DB();

		const result = await db.insert({ name: 'Ola', age: 5 });

		expect(result.id).toBe(1);
	});

	it('assign next id based on the highest existing id', async () => {
		const db = new DB();

		await db.insert({ id: 1, name: 'Ala', age: 3 });
		await db.insert({ id: 3, name: 'Ola', age: 6 });
		await db.insert({ id: 2, name: 'Jan', age: 8 });

		const newUser = { name: 'Monika', age: 5 };
		const result = await db.insert(newUser);

		expect(result.id).toBe(4);
	});

	it('stores inserted records in the database', async () => {
		const db = new DB();

		const user = await db.insert({ name: 'Ola', age: 5 });
		const rows = await db.getRows();

		expect(rows).toContainEqual(user);
	});
});

describe('.select()', () => {
	it('returns the row with the given ID', async () => {
		const db = new DB();
		const data = { id: 1, name: 'Ola', age: 5 };

		await db.insert(data);

		await expect(db.select(1)).resolves.toEqual(data);
	});

	it('rejects when ID does not exist', async () => {
		const db = new DB();

		await db.insert({ id: 1, name: 'Ola', age: 5 });

		await expect(db.select(22)).rejects.toEqual('ID not found');
	});
});

describe('.remove()', () => {
	it('removes the row with the given ID', async () => {
		const db = new DB();

		await db.insert({ id: 1, name: 'Ala', age: 3 });
		await db.insert({ id: 3, name: 'Ola', age: 6 });
		await db.insert({ id: 2, name: 'Jan', age: 8 });

		await expect(db.remove(3)).resolves.toBe('Item was remove!');

		const rows = await db.getRows();
		expect(rows).not.toContainEqual({ id: 3, name: 'Ola', age: 6 });
	});

	it('removes only the specified record', async () => {
		const db = new DB();

		await db.insert({ id: 1, name: 'Ala', age: 3 });
		await db.insert({ id: 2, name: 'Jan', age: 8 });

		await db.remove(2);

		const rows = await db.getRows();
		expect(rows).toEqual([{ id: 1, name: 'Ala', age: 3 }]);
	});

	it('rejects when ID does not exist', async () => {
		const db = new DB();

		await db.insert({ id: 1, name: 'Ala', age: 3 });

		await expect(db.remove(55)).rejects.toBe('Item not exist!');
	});
});

describe('.update()', () => {
	it('rejects when record does not have ID', async () => {
		const db = new DB();

		await expect(db.update({ name: 'Ala', age: 3 })).rejects.toBe('ID have to be set!');
	});

	it('rejects when ID does not exist in the database', async () => {
		const db = new DB();

		await db.insert({ id: 2, name: 'Jan', age: 8 });

		await expect(db.update({ id: 1, name: 'Ala', age: 3 })).rejects.toBe('ID not found!');
	});

	it('update only the specified record', async () => {
		const db = new DB();

		await db.insert({ id: 1, name: 'Ala', age: 3 });
		await db.insert({ id: 3, name: 'Ola', age: 6 });

		const updatedData = { id: 1, name: 'Marta', age: 3 };

		await expect(db.update(updatedData)).resolves.toEqual(updatedData);

		const rows = await db.getRows();

		expect(rows).toContainEqual(updatedData);
		expect(rows).toContainEqual({ id: 3, name: 'Ola', age: 6 });
	});

	it('returns the updated record', async () => {
		const db = new DB();

		await db.insert({ id: 1, name: 'Ala', age: 3 });

		const updatedData = { id: 1, name: 'Marta', age: 3 };

		const result = await db.update(updatedData);

		expect(result).toEqual(updatedData);
	});
});

describe('.truncate()', () => {
	it('returns true', async () => {
		const db = new DB();

		await db.insert({ id: 1, name: 'Ala', age: 3 });
		await db.insert({ id: 3, name: 'Ola', age: 6 });

		await expect(db.truncate()).resolves.toBe(true);
	});

	it('clears all records from the database', async () => {
		const db = new DB();

		await db.insert({ id: 1, name: 'Ala', age: 3 });
		await db.insert({ id: 3, name: 'Ola', age: 6 });

		await db.truncate();

		const rows = await db.getRows();
		expect(rows).toEqual([]);
	});

	it('works even when the database is empty', async () => {
		const db = new DB();

		await expect(db.truncate()).resolves.toBe(true);

		const rows = await db.getRows();
		expect(rows).toEqual([]);
	});
});

describe('.getRows()', () => {
	it('returns all records from the database', async () => {
		const db = new DB();

		await db.insert({ id: 1, name: 'Ala', age: 3 });
		await db.insert({ id: 3, name: 'Ola', age: 6 });
		await db.insert({ id: 2, name: 'Jan', age: 8 });

		const rows = await db.getRows();

		expect(rows).toHaveLength(3);
		expect(rows).toContainEqual({ id: 1, name: 'Ala', age: 3 });
		expect(rows).toContainEqual({ id: 3, name: 'Ola', age: 6 });
		expect(rows).toContainEqual({ id: 2, name: 'Jan', age: 8 });
	});

	it('returns an empty array when the database is empty', async () => {
		const db = new DB();

		const rows = await db.getRows();

		expect(rows).toEqual([]);
	});
});
