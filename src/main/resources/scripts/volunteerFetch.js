// /scripts/fetchRequests.js


async function fetchHelpRequests(categories) {
    try {
        const response = await fetch('/applications/getApplicationsByCategories', { // Ensure this URL matches your backend endpoint
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(categories)
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return data; // Should be an array of help requests
    } catch (error) {
        console.error('Error fetching help requests:', error);
        throw error; // Re-throw to handle it in the calling function
    }
}


 async function acceptHelpRequest(requestId) {
    try {
        const response = await fetch(`/applications/${requestId}/accept`, { // Adjust the endpoint as needed
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: 'В процесі' })
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.status} ${response.statusText}`);
        }

        const updatedRequest = await response.json();
        return updatedRequest;
    } catch (error) {
        console.error('Error accepting help request:', error);
        throw error;
    }
}
async function getUserApplications() {
    try {
        const response = await fetch('/applications/getUserApplications', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Помилка: ${response.statusText}`);
        }

        const helpRequests = await response.json();
        return helpRequests;
    } catch (error) {
        console.error('Помилка при отримані заявок:', error);
        throw error;
    }
}
window.getUserApplications = getUserApplications;
window.fetchHelpRequests = fetchHelpRequests;
window.acceptHelpRequest = acceptHelpRequest;
