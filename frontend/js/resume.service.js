import store from './store.js';

class ResumeService {
    async parseResume(file) {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(`${store.baseUrl}/profile/parse-resume`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${store.token}`
            },
            body: formData
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Failed to parse resume');
        }

        return await response.json();
    }

    async confirmResumeData(data) {
        const response = await fetch(`${store.baseUrl}/profile/confirm-resume-data`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${store.token}`
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Failed to confirm resume data');
        }

        return await response.json();
    }
}

export const resumeService = new ResumeService();
