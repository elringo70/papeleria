import { bucket } from '../utils/firebase-admin';
import { extname } from 'path';

export const uploadImageToFirestorage = (image) => {
	return new Promise(async (resolve, reject) => {
		const fileType = image.type;
		const extensionType = extname(image.name);
		const uint8Array = new Uint8Array(await image.arrayBuffer());

		const uuid = crypto.randomUUID();
		const fileName = uuid + extensionType;

		await bucket
			.file('images/' + uuid + extensionType)
			.save(uint8Array, {
				metadata: {
					contentType: fileType,
					resumable: true
				}
			})
			.catch((error) => {
				if (error) reject(error);
			});

		resolve(fileName);
	});
};

export const getImageLinkFromFirestorage = (imageName) => {
	return new Promise(async (resolve, reject) => {
		const options = {
			prefix: 'images/',
			delimiter: '/'
		};

		const [files] = await bucket.getFiles(options).catch((error) => {
			if (error) reject(error);
		});

		const urlIndex = files.find((file) => {
			const fileName = file.name.split('/');
			return fileName[1] === imageName;
		});

		if (urlIndex) {
			const fileURL = await signedURL(urlIndex.name);
			resolve(fileURL);
		} else {
			resolve(null);
		}
	});
};

const signedURL = (fileName) => {
	return new Promise(async (resolve, reject) => {
		const options = {
			version: 'v2',
			action: 'read',
			expires: Date.now() + 1000 * 60 * 60
		};

		const [url] = await bucket
			.file(fileName)
			.getSignedUrl(options)
			.catch((error) => {
				if (error) reject(error);
			});

		resolve(url);
	});
};
