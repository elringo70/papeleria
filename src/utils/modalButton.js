import Swal from 'sweetalert2';

const confirmDeleteModal = Swal.mixin({
	customClass: {
		confirmButton: 'bg-red-700 hover:bg-red-600 text-white px-4 py-2 rounded shadow shadow-red-700',
		cancelButton: 'bg-gray-100 px-4 py-3 ml-5 text-gray-600'
	},
	buttonsStyling: false
});

const confirmModal = Swal.mixin({
	customClass: {
		confirmButton:
			'bg-indigo-700 hover:bg-indigo-600 text-white px-4 py-2 rounded shadow shadow-indigo-700'
	},
	buttonsStyling: false
});

export { confirmDeleteModal, confirmModal };
