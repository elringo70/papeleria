export const firstUppercase = (string) => {
	return (
		string.split('')[0].toUpperCase() +
		string.toLowerCase().split('').slice(1, string.length).join('')
	);
};

export const phoneNumberFormat = (numbers) => {
	const splitNumbers = numbers.split('');
	splitNumbers.splice(0, 0, '(');
	splitNumbers.splice(4, 0, ')');
	splitNumbers.splice(5, 0, ' ');
	splitNumbers.splice(9, 0, '-');
	return splitNumbers.join('');
};

export const customerNameFormat = (customerObject) => {
	const customerString = `${firstUppercase(customerObject.name)}+${
		customerObject.lastName ? firstUppercase(customerObject.lastName) : ''
	}+${customerObject.maternalSurname ? firstUppercase(customerObject.maternalSurname) : ''}`;

	return customerString.split('+').join(' ');
};
