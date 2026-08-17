/**
 * Profile Creation - Client-Side Validation & Logic
 * SDM-Lab-3
 */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('profileForm');
  const modal = document.getElementById('profileModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const modalEditBtn = document.getElementById('modalEditBtn');
  const modalPrintBtn = document.getElementById('modalPrintBtn');
  const modalContent = document.getElementById('modalContent');
  const togglePasswordBtn = document.getElementById('togglePassword');
  const passwordInput = document.getElementById('password');
  const dobInput = document.getElementById('dob');
  const toast = document.getElementById('toast');

  // Set maximum date of birth to today
  if (dobInput) {
    const today = new Date().toISOString().split('T')[0];
    dobInput.setAttribute('max', today);
  }

  // Field input definitions
  const fields = {
    firstName: document.getElementById('firstName'),
    lastName: document.getElementById('lastName'),
    department: document.getElementById('department'),
    idNo: document.getElementById('idNo'),
    session: document.getElementById('session'),
    semester: document.getElementById('semester'),
    bloodGroup: document.getElementById('bloodGroup'),
    dob: document.getElementById('dob'),
    mobile: document.getElementById('mobile'),
    email: document.getElementById('email'),
    password: document.getElementById('password'),
    permAddress: document.getElementById('permAddress'),
    presentAddress: document.getElementById('presentAddress'),
  };

  // Helper: Show Error on a Field
  function showError(inputEl, message) {
    if (!inputEl) return;
    const fieldContainer = inputEl.closest('.field');
    if (!fieldContainer) return;

    fieldContainer.classList.add('error');
    fieldContainer.classList.remove('success');

    const errorText = fieldContainer.querySelector('.error-text');
    if (errorText) {
      errorText.textContent = message;
    }
  }

  // Helper: Clear Error on a Field
  function showSuccess(inputEl) {
    if (!inputEl) return;
    const fieldContainer = inputEl.closest('.field');
    if (!fieldContainer) return;

    fieldContainer.classList.remove('error');
    fieldContainer.classList.add('success');

    const errorText = fieldContainer.querySelector('.error-text');
    if (errorText) {
      errorText.textContent = '';
    }
  }

  // Helper: Clear Field Status
  function clearStatus(inputEl) {
    if (!inputEl) return;
    const fieldContainer = inputEl.closest('.field');
    if (!fieldContainer) return;

    fieldContainer.classList.remove('error', 'success');
    const errorText = fieldContainer.querySelector('.error-text');
    if (errorText) {
      errorText.textContent = '';
    }
  }

  // Toast notification helper
  let toastTimer = null;
  function showToast(message, type = 'info') {
    if (!toast) return;
    toast.textContent = message;
    toast.className = `toast ${type} show`;

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 3500);
  }

  // Validation Rules
  const validators = {
    firstName: (val) => {
      const trimmed = val.trim();
      if (!trimmed) return 'First Name is required.';
      if (trimmed.length < 2) return 'First Name must be at least 2 characters.';
      if (!/^[a-zA-Z\s.'-]+$/.test(trimmed)) return 'First Name can only contain letters and spaces.';
      return '';
    },

    lastName: (val) => {
      const trimmed = val.trim();
      if (!trimmed) return 'Last Name is required.';
      if (trimmed.length < 2) return 'Last Name must be at least 2 characters.';
      if (!/^[a-zA-Z\s.'-]+$/.test(trimmed)) return 'Last Name can only contain letters and spaces.';
      return '';
    },

    department: (val) => {
      if (!val || val === '') return 'Please select a department.';
      return '';
    },

    idNo: (val) => {
      const trimmed = val.trim();
      if (!trimmed) return 'ID No is required.';
      if (trimmed.length < 4) return 'ID No must be at least 4 characters.';
      // Accepts IDs such as 2003008, Ex-2003008, 042003008, CSE-2003008
      if (!/^[a-zA-Z0-9-]{4,20}$/.test(trimmed)) return 'Please enter a valid ID (e.g. 2003008 or Ex-2003008).';
      return '';
    },

    session: (val) => {
      const trimmed = val.trim();
      if (!trimmed) return 'Session is required.';
      // Accepts formats like 2020-2021, Ex-2020-2021, 2020-21
      const sessionRegex = /^(?:Ex-)?\d{4}-\d{2,4}$/i;
      if (!sessionRegex.test(trimmed)) {
        return 'Session format should be like 2020-2021 or Ex-2020-2021.';
      }
      return '';
    },

    semester: (val) => {
      if (!val || val === '') return 'Please select a semester.';
      return '';
    },

    bloodGroup: (val) => {
      const trimmed = val.trim().toUpperCase().replace(/\s+/g, '');
      if (!trimmed) return 'Blood Group is required.';
      const bloodRegex = /^(A|B|AB|O)[+-](?:VE)?$/i;
      if (!bloodRegex.test(trimmed)) {
        return 'Enter a valid Blood Group (e.g. A+, A-, B+, B-, AB+, AB-, O+, O-).';
      }
      return '';
    },

    dob: (val) => {
      if (!val) return 'Date of Birth is required.';
      const birthDate = new Date(val);
      const today = new Date();

      if (isNaN(birthDate.getTime())) return 'Please enter a valid date.';
      if (birthDate > today) return 'Date of Birth cannot be in the future.';

      // Calculate approximate age
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      if (age < 12) return 'Age must be at least 12 years.';
      if (age > 100) return 'Please enter a realistic date of birth.';
      return '';
    },

    mobile: (val) => {
      const trimmed = val.trim().replace(/[\s-]/g, '');
      if (!trimmed) return 'Mobile No. is required.';
      // Matches standard 11 digit BD numbers (013-019) or general 10-15 digit phone numbers with optional +
      const phoneRegex = /^(?:\+?8801|01)[3-9]\d{8}$|^\+?\d{10,14}$/;
      if (!phoneRegex.test(trimmed)) {
        return 'Please enter a valid phone number (e.g. 01700000000 or +8801700000000).';
      }
      return '';
    },

    email: (val) => {
      const trimmed = val.trim();
      if (!trimmed) return 'Email is required.';
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(trimmed)) {
        return 'Please enter a valid email address (e.g. user@example.com).';
      }
      return '';
    },

    password: (val) => {
      if (!val) return 'Password is required.';
      if (val.length < 6) return 'Password must be at least 6 characters.';
      return '';
    },

    permAddress: (val) => {
      const trimmed = val.trim();
      if (!trimmed) return 'Permanent Address is required.';
      if (trimmed.length < 3) return 'Please enter a valid Permanent Address.';
      return '';
    },

    presentAddress: (val) => {
      const trimmed = val.trim();
      if (!trimmed) return 'Present Address or Hall Name is required.';
      if (trimmed.length < 3) return 'Please enter a valid Present Address or Hall Name.';
      return '';
    },
  };

  // Validate a single field
  function validateField(fieldName) {
    const inputEl = fields[fieldName];
    const validator = validators[fieldName];
    if (!inputEl || !validator) return true;

    const errorMsg = validator(inputEl.value);
    if (errorMsg) {
      showError(inputEl, errorMsg);
      return false;
    } else {
      showSuccess(inputEl);
      return true;
    }
  }

  // Attach real-time input & blur event listeners
  Object.keys(fields).forEach((fieldName) => {
    const inputEl = fields[fieldName];
    if (!inputEl) return;

    // Validate on blur
    inputEl.addEventListener('blur', () => {
      if (inputEl.value.trim() !== '') {
        validateField(fieldName);
      }
    });

    // Validate or clear on input if already in error state
    inputEl.addEventListener('input', () => {
      const fieldContainer = inputEl.closest('.field');
      if (fieldContainer && fieldContainer.classList.contains('error')) {
        validateField(fieldName);
      }
    });

    if (inputEl.tagName === 'SELECT') {
      inputEl.addEventListener('change', () => {
        validateField(fieldName);
      });
    }
  });

  // Password visibility toggle handler
  if (togglePasswordBtn && passwordInput) {
    togglePasswordBtn.addEventListener('click', () => {
      const isPassword = passwordInput.getAttribute('type') === 'password';
      passwordInput.setAttribute('type', isPassword ? 'text' : 'password');

      // Update toggle icon
      if (isPassword) {
        togglePasswordBtn.innerHTML = `
          <svg class="eye-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
            <line x1="1" y1="1" x2="23" y2="23"></line>
          </svg>
        `;
        togglePasswordBtn.setAttribute('title', 'Hide Password');
      } else {
        togglePasswordBtn.innerHTML = `
          <svg class="eye-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
        `;
        togglePasswordBtn.setAttribute('title', 'Show Password');
      }
    });
  }

  // Display Submitted Profile in Modal
  function displayProfileModal(data) {
    if (!modalContent || !modal) return;

    modalContent.innerHTML = `
      <div class="profile-card-content">
        <div>
          <div class="profile-section-title">General Information</div>
          <div class="profile-grid">
            <div class="profile-item">
              <span class="profile-label">Full Name</span>
              <span class="profile-val">${escapeHtml(data.firstName)} ${escapeHtml(data.lastName)}</span>
            </div>
            <div class="profile-item">
              <span class="profile-label">Department</span>
              <span class="profile-val">${escapeHtml(data.department)}</span>
            </div>
            <div class="profile-item">
              <span class="profile-label">Student ID</span>
              <span class="profile-val">${escapeHtml(data.idNo)}</span>
            </div>
            <div class="profile-item">
              <span class="profile-label">Session</span>
              <span class="profile-val">${escapeHtml(data.session)}</span>
            </div>
            <div class="profile-item">
              <span class="profile-label">Semester</span>
              <span class="profile-val">${escapeHtml(data.semester)}</span>
            </div>
            <div class="profile-item">
              <span class="profile-label">Blood Group</span>
              <span class="profile-val">${escapeHtml(data.bloodGroup.toUpperCase())}</span>
            </div>
            <div class="profile-item">
              <span class="profile-label">Date of Birth</span>
              <span class="profile-val">${escapeHtml(data.dob)}</span>
            </div>
          </div>
        </div>

        <div>
          <div class="profile-section-title">Contact Information</div>
          <div class="profile-grid">
            <div class="profile-item">
              <span class="profile-label">Mobile Number</span>
              <span class="profile-val">${escapeHtml(data.mobile)}</span>
            </div>
            <div class="profile-item">
              <span class="profile-label">Email Address</span>
              <span class="profile-val">${escapeHtml(data.email)}</span>
            </div>
          </div>
        </div>

        <div>
          <div class="profile-section-title">Address Information</div>
          <div class="profile-grid">
            <div class="profile-item">
              <span class="profile-label">Permanent Address</span>
              <span class="profile-val">${escapeHtml(data.permAddress)}</span>
            </div>
            <div class="profile-item">
              <span class="profile-label">Present Address / Hall</span>
              <span class="profile-val">${escapeHtml(data.presentAddress)}</span>
            </div>
          </div>
        </div>
      </div>
    `;

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
  }

  // Modal Close & Actions
  function closeModal() {
    if (!modal) return;
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
  }

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeModal);
  }

  if (modalEditBtn) {
    modalEditBtn.addEventListener('click', closeModal);
  }

  if (modalPrintBtn) {
    modalPrintBtn.addEventListener('click', () => {
      window.print();
    });
  }

  // Close modal when clicking outside of card
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });
  }

  // Close modal on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
      closeModal();
    }
  });

  // HTML escaping utility for safe display
  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Handle Form Submission
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;
      let firstInvalidInput = null;

      // Validate all fields
      Object.keys(validators).forEach((fieldName) => {
        const valid = validateField(fieldName);
        if (!valid) {
          isValid = false;
          if (!firstInvalidInput && fields[fieldName]) {
            firstInvalidInput = fields[fieldName];
          }
        }
      });

      if (!isValid) {
        showToast('Please correct the highlighted errors in the form.', 'error');
        if (firstInvalidInput) {
          firstInvalidInput.focus();
          firstInvalidInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
      }

      // Collect form data
      const formData = {
        firstName: fields.firstName.value.trim(),
        lastName: fields.lastName.value.trim(),
        department: fields.department.value,
        idNo: fields.idNo.value.trim(),
        session: fields.session.value.trim(),
        semester: fields.semester.value,
        bloodGroup: fields.bloodGroup.value.trim(),
        dob: fields.dob.value,
        mobile: fields.mobile.value.trim(),
        email: fields.email.value.trim(),
        password: fields.password.value,
        permAddress: fields.permAddress.value.trim(),
        presentAddress: fields.presentAddress.value.trim(),
      };

      // Save to localStorage (optional offline persistence)
      try {
        localStorage.setItem('sdm_student_profile', JSON.stringify(formData));
      } catch (err) {
        console.warn('Could not save to localStorage:', err);
      }

      showToast('Profile created successfully!', 'success');
      displayProfileModal(formData);
    });
  }
});
