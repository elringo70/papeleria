export const firstUppercase = (string) => {
	return (
		string.split('')[0].toUpperCase() +
		string.toLowerCase().split('').slice(1, string.length).join('')
	);
};
