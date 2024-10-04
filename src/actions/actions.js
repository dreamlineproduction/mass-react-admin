import { API_URL } from "../config";

export const actionFetchState = async () => {
	try {
		let response = await fetch(`${API_URL}/states/101`, {
			method: 'GET',
		});

		if (!response.status) {
			throw new Error(`HTTP error! Status: ${response.status}`);
		}

		return response;
	} catch (error) {
		console.error('Failed to fetch clients data:', error);
	}
}

export const actionDeleteData = async (url, accessToken) => {
	try {
		let response = await fetch(url, {
			headers: {
				"Content-Type": "application/json",
				'Authorization': `Bearer ${accessToken}`
			},
			method: "DELETE",
		});

		if (!response.status) {
			throw new Error(`HTTP error! Status: ${response.status}`);
		}

		return response;
	} catch (error) {
		console.error('Failed to fetch clients data:', error);
	}
}

export const actionPostData = async (url, accessToken, postData, method = 'POST') => {
	try {
		let response = await fetch(url, {
			headers: {
				"Content-Type": "application/json",
				'Authorization': `Bearer ${accessToken}`
			},
			method,
			body: JSON.stringify(postData),
		});

		if (!response.status) {
			throw new Error(`HTTP error! Status: ${response.status}`);
		}

		return response;
	} catch (error) {
		console.error('Failed to fetch clients data:', error);
	}
}

export const actionFetchData = async (url, accessToken) => {
	try {
		let response = await fetch(url, {
			headers: {
				"Content-Type": "application/json",
				'Authorization': `Bearer ${accessToken}`
			},
			method: "GET",
		});

		if (!response.status) {
			throw new Error(`HTTP error! Status: ${response.status}`);
		}

		return response;
	} catch (error) {
		console.error('Failed to fetch clients data:', error);
	}
}

export const actionDownloadPdf = (productId, batchNumber, accessToken) => {
	let downloadUrl = `${API_URL}/qr-codes/download?product_id=${productId}&batch_number=${batchNumber}`;

	fetch(downloadUrl, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/pdf',
			'Authorization': `Bearer ${accessToken}`
		},
	})
		.then((response) => response.blob())
		.then((blob) => {
			const url = window.URL.createObjectURL(
				new Blob([blob]),
			);

			const link = document.createElement('a');
			link.href = url;
			link.setAttribute(
				'download',
				`product-${productId}-batch-${batchNumber}.pdf`
			);

			// Append to html link element page
			document.body.appendChild(link);

			// Start download
			link.click();

			// Clean up and remove the link
			link.parentNode.removeChild(link);
		});
}

export const actionImageUplaod = async (file, accessToken) => {
	try {
		const formData = new FormData();
		formData.append("image", file);

		let response = await fetch(`${API_URL}/file/image-upload`, {
			method: "POST",
			headers: {
				'Authorization': `Bearer ${accessToken}`,
				// Do not set Content-Type header when using FormData
			},
			body: formData
		});

		if (!response.ok) {
			throw new Error(`HTTP error! Status: ${response.status}`);
		}

		// Return the parsed response JSON
		return await response.json();
	} catch (error) {
		console.error('Failed to upload image:', error.message || error);
	}
}
