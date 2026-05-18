/**
 * Vidyavaidya Frontend API Integration Service
 * Bridges React components directly to the Node.js + Firebase Express backend.
 */

const API_BASE_URL = '/api';

/**
 * Helper to standardise API requests and parse standard response shapes
 */
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Set JSON headers by default
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  // Automatically attach auth token if available in localStorage
  const token = localStorage.getItem('vv_token');
  if (token && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || `HTTP error! status: ${response.status}`);
  }

  return data;
}

const api = {
  /**
   * 1. Authentication Handlers
   */
  auth: {
    async register(email, phone, fullName, password) {
      return apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, phone, fullName, password })
      });
    },

    async login(idToken) {
      const data = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ idToken })
      });
      // Store tokens on successful authentication
      if (data.success && data.token) {
        localStorage.setItem('vv_token', data.token);
        localStorage.setItem('vv_auth', 'true');
      }
      return data;
    },

    async sendOtp(email) {
      return apiRequest('/auth/send-otp', {
        method: 'POST',
        body: JSON.stringify({ email })
      });
    },

    async verifyOtp(email, otp) {
      const data = await apiRequest('/auth/verify-otp', {
        method: 'POST',
        body: JSON.stringify({ email, otp })
      });
      
      // Store JWT token on successful verification
      if (data.success && data.token) {
        localStorage.setItem('vv_token', data.token);
        localStorage.setItem('vv_auth', 'true');
      }
      return data;
    },

    async adminLogin(email, password) {
      const data = await apiRequest('/auth/admin-login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      if (data.success) {
        // Cache static demo token or session
        localStorage.setItem('vv_token', data.token);
        localStorage.setItem('vv_auth', 'true');
        localStorage.setItem('vv_admin_auth', JSON.stringify({ loggedIn: true, time: Date.now() }));
      }
      return data;
    },

    async logout() {
      try {
        await apiRequest('/auth/logout', { method: 'POST' });
      } catch (err) {
        console.warn('Backend session logout sync skipped:', err.message);
      }
      localStorage.removeItem('vv_token');
      localStorage.removeItem('vv_auth');
      localStorage.removeItem('vv_admin_auth');
    },

    async getMe() {
      return apiRequest('/auth/me');
    }
  },

  /**
   * 2. User & Personal Dashboard Handlers
   */
  user: {
    async getProfile() {
      return apiRequest('/user/profile');
    },

    async updateProfile(updates) {
      return apiRequest('/user/profile', {
        method: 'PUT',
        body: JSON.stringify(updates)
      });
    },

    async getDashboardStats() {
      return apiRequest('/user/dashboard');
    },

    async getDonations(page = 1, limit = 10, filters = {}) {
      const queryParams = new URLSearchParams({ page, limit, ...filters }).toString();
      return apiRequest(`/user/donations?${queryParams}`);
    },

    async getReceiptUrl(donationId) {
      return apiRequest(`/user/receipt/${donationId}`);
    },

    async changeEmail(newEmail) {
      return apiRequest('/user/change-email', {
        method: 'PUT',
        body: JSON.stringify({ newEmail })
      });
    },

    async deleteAccount(reason) {
      return apiRequest('/user/delete-account', {
        method: 'POST',
        body: JSON.stringify({ reason })
      });
    }
  },

  /**
   * 3. Public Donation & Settings Handlers
   */
  donate: {
    async getSettings() {
      return apiRequest('/donate/settings');
    }
  },

  /**
   * 4. Payment & Checkout Gateways (Razorpay)
   */
  payment: {
    async createOrder(amount, category, subcategory, donorDetails, donationType = 'one-time') {
      return apiRequest('/payment/create-order', {
        method: 'POST',
        body: JSON.stringify({ amount, category, subcategory, donorDetails, donationType })
      });
    },

    async createSubscription(planAmount, duration, donorDetails) {
      return apiRequest('/payment/create-subscription', {
        method: 'POST',
        body: JSON.stringify({ planAmount, duration, donorDetails })
      });
    },

    async verifyPayment(razorpayResponse) {
      return apiRequest('/payment/verify', {
        method: 'POST',
        body: JSON.stringify(razorpayResponse)
      });
    }
  },

  /**
   * 5. Events Handlers
   */
  events: {
    async list(filters = {}) {
      const params = new URLSearchParams(filters).toString();
      return apiRequest(`/events?${params}`);
    },

    async getBySlug(slug) {
      return apiRequest(`/events/${slug}`);
    },

    async register(eventId) {
      return apiRequest(`/events/${eventId}/register`, {
        method: 'POST'
      });
    }
  },

  /**
   * 6. Stories, Blogs & Gallery Handlers
   */
  stories: {
    async list(filters = {}) {
      const params = new URLSearchParams(filters).toString();
      return apiRequest(`/stories?${params}`);
    },

    async getBySlug(slug) {
      return apiRequest(`/stories/${slug}`);
    },

    async getPhotos() {
      return apiRequest('/stories/gallery/photos');
    },

    async getVideos() {
      return apiRequest('/stories/gallery/videos');
    }
  },

  /**
   * 7. Contact Helpdesk Handlers
   */
  contact: {
    async submit(inquiry) {
      return apiRequest('/contact', {
        method: 'POST',
        body: JSON.stringify(inquiry)
      });
    },

    async submitForeign(inquiry) {
      return apiRequest('/contact/foreign-inquiry', {
        method: 'POST',
        body: JSON.stringify(inquiry)
      });
    }
  },

  /**
   * 8. Community Application Handlers
   */
  community: {
    async apply(type, details) {
      const body = { type };
      if (type === 'volunteer') body.volunteerDetails = details;
      if (type === 'corporate') body.corporateDetails = details;
      if (type === 'hospital') body.hospitalDetails = details;
      if (type === 'donor') body.donorDetails = details;

      return apiRequest('/community/apply', {
        method: 'POST',
        body: JSON.stringify(body)
      });
    },

    async getMyApplications() {
      return apiRequest('/community/my-applications');
    }
  },

  /**
   * 9. Administrative Control Panel Handlers
   */
  admin: {
    async getOverview() {
      return apiRequest('/admin/overview');
    },

    async getDonations(page = 1, limit = 10, filters = {}) {
      const params = new URLSearchParams({ page, limit, ...filters }).toString();
      return apiRequest(`/admin/donations?${params}`);
    },

    async getDonationById(donationId) {
      return apiRequest(`/admin/donations/${donationId}`);
    },

    async updateDonationStatus(donationId, status, notes) {
      return apiRequest(`/admin/donations/${donationId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status, notes })
      });
    },

    async getUsers(page = 1, limit = 10, filters = {}) {
      const params = new URLSearchParams({ page, limit, ...filters }).toString();
      return apiRequest(`/admin/users?${params}`);
    },

    async updateUserStatus(uid, isActive) {
      return apiRequest(`/admin/users/${uid}/status`, {
        method: 'PUT',
        body: JSON.stringify({ isActive })
      });
    },

    async getContacts(page = 1, limit = 10, status) {
      const params = new URLSearchParams({ page, limit, ...(status ? { status } : {}) }).toString();
      return apiRequest(`/admin/contacts?${params}`);
    },

    async updateContactStatus(contactId, updates) {
      return apiRequest(`/admin/contacts/${contactId}`, {
        method: 'PUT',
        body: JSON.stringify(updates)
      });
    },

    async getApplications(page = 1, limit = 10, filters = {}) {
      const params = new URLSearchParams({ page, limit, ...filters }).toString();
      return apiRequest(`/admin/applications?${params}`);
    },

    async reviewApplication(applicationId, status, adminNotes) {
      return apiRequest(`/admin/applications/${applicationId}`, {
        method: 'PUT',
        body: JSON.stringify({ status, adminNotes })
      });
    },

    async updateSettings(settings) {
      return apiRequest('/admin/settings', {
        method: 'POST',
        body: JSON.stringify(settings)
      });
    },

    getExportCsvUrl(filters = {}) {
      const token = localStorage.getItem('vv_token') || '';
      const params = new URLSearchParams({ ...filters, token }).toString();
      return `${API_BASE_URL}/admin/export/donations?${params}`;
    }
  }
};

export default api;
