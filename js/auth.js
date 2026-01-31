/**
 * Authentication Module
 * Handles user authentication, registration, and session management
 */

(function() {
    'use strict';

    // DOM Elements
    const elements = {
        authSection: document.getElementById('authSection'),
        appSection: document.getElementById('appSection'),
        loadingScreen: document.getElementById('loadingScreen'),
        
        // Auth tabs
        authTabs: document.querySelectorAll('.auth-tab'),
        authForms: document.querySelectorAll('.auth-form'),
        
        // Login form
        loginForm: document.getElementById('loginForm'),
        loginEmail: document.getElementById('loginEmail'),
        loginPassword: document.getElementById('loginPassword'),
        loginError: document.getElementById('loginError'),
        loginBtn: document.getElementById('loginBtn'),
        rememberMe: document.getElementById('rememberMe'),
        
        // Signup form
        signupForm: document.getElementById('signupForm'),
        signupName: document.getElementById('signupName'),
        signupEmail: document.getElementById('signupEmail'),
        signupPassword: document.getElementById('signupPassword'),
        signupError: document.getElementById('signupError'),
        signupBtn: document.getElementById('signupBtn'),
        termsCheckbox: document.getElementById('termsCheckbox'),
        passwordStrength: document.getElementById('passwordStrength'),
        
        // User display
        userName: document.getElementById('userName'),
        userAvatar: document.getElementById('userAvatar'),
        userProgress: document.getElementById('userProgress'),
        userStreak: document.getElementById('userStreak'),
        
        // Menu
        userMenuBtn: document.getElementById('userMenuBtn'),
        userDropdown: document.getElementById('userDropdown'),
        logoutBtn: document.getElementById('logoutBtn'),
        forgotPasswordBtn: document.getElementById('forgotPasswordBtn')
    };

    // Initialize
    function init() {
        setupAuthTabs();
        setupPasswordToggle();
        setupForgotPassword();
        setupPasswordStrength();
        setupFormValidation();
        setupLoginForm();
        setupSignupForm();
        setupLogout();
        setupUserMenu();
        checkRememberedUser();
        observeAuthState();
    }

    // Auth tab switching
    function setupAuthTabs() {
        elements.authTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const targetTab = tab.dataset.tab;
                
                // Update tabs
                elements.authTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                // Update forms
                elements.authForms.forEach(form => {
                    form.classList.remove('active');
                });
                
                const targetForm = targetTab === 'login' ? elements.loginForm : elements.signupForm;
                targetForm.classList.add('active');
                
                // Clear errors
                clearErrors();
                
                // Log event
                window.logEvent && window.logEvent('auth_tab_switch', { tab: targetTab });
            });
        });
    }

    // Password visibility toggle
    function setupPasswordToggle() {
        document.querySelectorAll('.toggle-password').forEach(btn => {
            btn.addEventListener('click', () => {
                const input = btn.previousElementSibling;
                if (!input) return;
                
                const type = input.type === 'password' ? 'text' : 'password';
                input.type = type;
                
                // Update icon
                const eyeIcon = btn.querySelector('.eye-icon');
                if (eyeIcon && type === 'text') {
                    eyeIcon.innerHTML = '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line>';
                } else if (eyeIcon) {
                    eyeIcon.innerHTML = '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle>';
                }
            });
        });
    }

    // Forgot password
    function setupForgotPassword() {
        if (!elements.forgotPasswordBtn) return;
        
        elements.forgotPasswordBtn.addEventListener('click', async () => {
            const email = elements.loginEmail.value.trim();
            
            if (!email) {
                Utils.showToast('Please enter your email address', 'error');
                elements.loginEmail.focus();
                return;
            }

            if (!Utils.validateEmail(email)) {
                Utils.showToast('Please enter a valid email address', 'error');
                return;
            }

            try {
                await auth.sendPasswordResetEmail(email);
                Utils.showToast('Password reset email sent! Check your inbox.', 'success');
                window.logEvent && window.logEvent('password_reset_requested');
            } catch (error) {
                console.error('Password reset error:', error);
                Utils.showToast(getErrorMessage(error.code), 'error');
            }
        });
    }

    // Password strength indicator
    function setupPasswordStrength() {
        if (!elements.signupPassword || !elements.passwordStrength) return;
        
        elements.signupPassword.addEventListener('input', (e) => {
            Utils.updatePasswordStrength(e.target.value, elements.passwordStrength);
        });
    }

    // Form validation
    function setupFormValidation() {
        // Real-time email validation
        [elements.loginEmail, elements.signupEmail].forEach(input => {
            if (!input) return;
            
            input.addEventListener('blur', () => {
                const email = input.value.trim();
                const errorElement = document.getElementById(input.id + 'Error');
                
                if (email && !Utils.validateEmail(email)) {
                    if (errorElement) {
                        errorElement.textContent = 'Please enter a valid email address';
                    }
                    input.style.borderColor = 'var(--danger-500)';
                } else {
                    if (errorElement) {
                        errorElement.textContent = '';
                    }
                    input.style.borderColor = '';
                }
            });
        });

        // Clear error on input
        document.querySelectorAll('.form-group input').forEach(input => {
            input.addEventListener('input', () => {
                input.style.borderColor = '';
                const errorElement = document.getElementById(input.id + 'Error');
                if (errorElement) {
                    errorElement.textContent = '';
                }
            });
        });
    }

    // Login form handler
    function setupLoginForm() {
        if (!elements.loginForm) return;
        
        elements.loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = elements.loginEmail.value.trim();
            const password = elements.loginPassword.value;
            
            // Validation
            if (!email || !password) {
                elements.loginError.textContent = 'Please fill in all fields';
                return;
            }

            if (!Utils.validateEmail(email)) {
                elements.loginError.textContent = 'Please enter a valid email address';
                return;
            }

            Utils.setLoading(elements.loginBtn, true);
            elements.loginError.textContent = '';

            try {
                const userCredential = await auth.signInWithEmailAndPassword(email, password);
                console.log('✅ User logged in:', userCredential.user.email);
                
                // Remember user if checkbox is checked
                if (elements.rememberMe && elements.rememberMe.checked) {
                    Utils.storage.set('rememberedEmail', email);
                } else {
                    Utils.storage.remove('rememberedEmail');
                }

                Utils.showToast('Welcome back!', 'success');
                elements.loginForm.reset();
                
                window.logEvent && window.logEvent('login', { method: 'email' });
            } catch (error) {
                console.error('❌ Login error:', error);
                elements.loginError.textContent = getErrorMessage(error.code);
                Utils.showToast(getErrorMessage(error.code), 'error');
                
                window.logEvent && window.logEvent('login_error', { error: error.code });
            } finally {
                Utils.setLoading(elements.loginBtn, false);
            }
        });
    }

    // Signup form handler
    function setupSignupForm() {
        if (!elements.signupForm) return;
        
        elements.signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const name = elements.signupName.value.trim();
            const email = elements.signupEmail.value.trim();
            const password = elements.signupPassword.value;
            const termsAccepted = elements.termsCheckbox.checked;
            
            // Validation
            if (!name || !email || !password) {
                elements.signupError.textContent = 'Please fill in all fields';
                return;
            }

            if (!Utils.validateEmail(email)) {
                elements.signupError.textContent = 'Please enter a valid email address';
                return;
            }

            if (password.length < 6) {
                elements.signupError.textContent = 'Password must be at least 6 characters';
                return;
            }

            if (!termsAccepted) {
                elements.signupError.textContent = 'Please accept the Terms of Service';
                return;
            }

            Utils.setLoading(elements.signupBtn, true);
            elements.signupError.textContent = '';

            try {
                const userCredential = await auth.createUserWithEmailAndPassword(email, password);
                
                // Update user profile
                await userCredential.user.updateProfile({
                    displayName: name
                });

                // Create user document in Firestore
                await db.collection('users').doc(userCredential.user.uid).set({
                    name: name,
                    email: email,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    progress: {
                        totalProblems: 0,
                        completedProblems: 0,
                        testsCompleted: 0,
                        hoursStudied: 0,
                        currentStreak: 0,
                        lastActivity: null
                    },
                    settings: {
                        notifications: true,
                        emailUpdates: true
                    }
                });

                console.log('✅ User created:', userCredential.user.email);
                Utils.showToast('Account created successfully!', 'success');
                elements.signupForm.reset();
                
                window.logEvent && window.logEvent('sign_up', { method: 'email' });
            } catch (error) {
                console.error('❌ Signup error:', error);
                elements.signupError.textContent = getErrorMessage(error.code);
                Utils.showToast(getErrorMessage(error.code), 'error');
                
                window.logEvent && window.logEvent('sign_up_error', { error: error.code });
            } finally {
                Utils.setLoading(elements.signupBtn, false);
            }
        });
    }

    // Logout handler
    function setupLogout() {
        if (!elements.logoutBtn) return;
        
        elements.logoutBtn.addEventListener('click', async () => {
            try {
                await auth.signOut();
                console.log('✅ User logged out');
                Utils.showToast('Logged out successfully', 'success');
                
                window.logEvent && window.logEvent('logout');
            } catch (error) {
                console.error('❌ Logout error:', error);
                Utils.showToast('Logout failed. Please try again.', 'error');
            }
        });
    }

    // User menu dropdown
    function setupUserMenu() {
        if (!elements.userMenuBtn || !elements.userDropdown) return;
        
        elements.userMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            elements.userDropdown.classList.toggle('hidden');
            elements.userMenuBtn.setAttribute('aria-expanded', 
                elements.userDropdown.classList.contains('hidden') ? 'false' : 'true'
            );
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', () => {
            if (!elements.userDropdown.classList.contains('hidden')) {
                elements.userDropdown.classList.add('hidden');
                elements.userMenuBtn.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // Check for remembered user
    function checkRememberedUser() {
        const rememberedEmail = Utils.storage.get('rememberedEmail');
        if (rememberedEmail && elements.loginEmail) {
            elements.loginEmail.value = rememberedEmail;
            if (elements.rememberMe) {
                elements.rememberMe.checked = true;
            }
        }
    }

    // Auth state observer
    function observeAuthState() {
        auth.onAuthStateChanged(async (user) => {
            // Hide loading screen
            setTimeout(() => {
                if (elements.loadingScreen) {
                    elements.loadingScreen.classList.add('fade-out');
                    setTimeout(() => {
                        elements.loadingScreen.style.display = 'none';
                    }, 300);
                }
            }, 1000);

            if (user) {
                // User is signed in
                console.log('👤 User authenticated:', user.email);
                
                // Update UI
                updateUserDisplay(user);
                
                // Show app, hide auth
                elements.authSection.classList.add('hidden');
                elements.appSection.classList.remove('hidden');
                
                // Initialize app
                if (window.initializeApp) {
                    try {
                        await window.initializeApp(user);
                    } catch (error) {
                        console.error('App initialization error:', error);
                    }
                }
                
                // Load user data
                loadUserData(user.uid);
                
                window.logEvent && window.logEvent('user_authenticated');
            } else {
                // User is signed out
                console.log('👤 No user authenticated');
                
                // Show auth, hide app
                elements.authSection.classList.remove('hidden');
                elements.appSection.classList.add('hidden');
            }
        });
    }

    // Update user display
    function updateUserDisplay(user) {
        const displayName = user.displayName || user.email.split('@')[0];
        
        if (elements.userName) {
            elements.userName.textContent = displayName;
        }
        
        if (elements.userAvatar) {
            elements.userAvatar.textContent = Utils.getAvatarLetter(displayName);
        }
    }

    // Load user data from Firestore
    async function loadUserData(userId) {
        try {
            const userDoc = await db.collection('users').doc(userId).get();
            
            if (userDoc.exists) {
                const userData = userDoc.data();
                const progress = userData.progress || {};
                
                // Update progress display
                if (elements.userProgress) {
                    const progressPercent = Utils.calculateProgress(
                        progress.completedProblems || 0,
                        progress.totalProblems || 1
                    );
                    elements.userProgress.textContent = `${progressPercent}%`;
                }
                
                if (elements.userStreak) {
                    elements.userStreak.textContent = `${progress.currentStreak || 0}🔥`;
                }
                
                // Store user data globally
                window.currentUserData = userData;
            }
        } catch (error) {
            console.error('Error loading user data:', error);
        }
    }

    // Clear errors
    function clearErrors() {
        elements.loginError.textContent = '';
        elements.signupError.textContent = '';
        
        document.querySelectorAll('.field-error').forEach(el => {
            el.textContent = '';
        });
        
        document.querySelectorAll('.form-group input').forEach(input => {
            input.style.borderColor = '';
        });
    }

    // Error message helper
    function getErrorMessage(errorCode) {
        const errorMessages = {
            'auth/email-already-in-use': 'This email is already registered',
            'auth/invalid-email': 'Invalid email address',
            'auth/operation-not-allowed': 'Operation not allowed',
            'auth/weak-password': 'Password is too weak (min 6 characters)',
            'auth/user-disabled': 'This account has been disabled',
            'auth/user-not-found': 'No account found with this email',
            'auth/wrong-password': 'Incorrect password',
            'auth/invalid-credential': 'Invalid email or password',
            'auth/too-many-requests': 'Too many attempts. Please try again later',
            'auth/network-request-failed': 'Network error. Please check your connection',
            'auth/requires-recent-login': 'Please log in again to complete this action'
        };
        
        return errorMessages[errorCode] || 'An error occurred. Please try again.';
    }

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
