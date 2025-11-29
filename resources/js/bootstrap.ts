import axios from 'axios';
window.axios = axios;

// Configure axios defaults
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

/**
 * Function to get CSRF token from the meta tag
 * This can be called dynamically to refresh the token if needed
 */
function getCsrfToken(): string | null {
    return document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || null;
}

/**
 * Function to update the CSRF token in axios defaults
 * Useful when the token needs to be refreshed
 */
function updateCsrfToken(): void {
    const token = getCsrfToken();
    if (token) {
        window.axios.defaults.headers.common['X-CSRF-TOKEN'] = token;
    }
}

// Initialize CSRF token on load
// Use DOMContentLoaded to ensure DOM is ready, or execute immediately if already loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateCsrfToken);
} else {
    // DOM is already loaded
    updateCsrfToken();
}

// Request interceptor to ensure CSRF token is always present
// This handles cases where the token might not have been set initially
window.axios.interceptors.request.use(
    (config) => {
        // Ensure CSRF token is set for state-changing methods
        if (['post', 'put', 'patch', 'delete'].includes(config.method?.toLowerCase() || '')) {
            const token = getCsrfToken();
            if (token) {
                // Set the token in headers (axios headers are typically a plain object)
                // Type assertion is safe here as we're setting a common header
                const headers = config.headers as Record<string, string>;
                if (!headers['X-CSRF-TOKEN']) {
                    headers['X-CSRF-TOKEN'] = token;
                }
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor to handle 419 errors (CSRF token mismatch or expired session)
// This provides a better user experience when sessions expire
window.axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 419) {
            // CSRF token mismatch or expired session
            // Try to get a new token from the meta tag
            const newToken = getCsrfToken();
            if (newToken && error.config) {
                // Update the token and retry the request
                updateCsrfToken();
                // Update the specific request config
                error.config.headers['X-CSRF-TOKEN'] = newToken;
                // Retry the original request
                return window.axios.request(error.config);
            } else {
                // If no token available, prompt user to refresh
                if (confirm('Your session has expired. Please refresh the page to continue.')) {
                    window.location.reload();
                }
            }
        }
        return Promise.reject(error);
    }
);
