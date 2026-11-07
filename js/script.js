/**
 * K EXPLORE — Main Application Engine
 * Handles theme toggling, event discovery, search, filter, sort,
 * live countdown timers, registration validation, and LocalStorage persistence.
 */

document.addEventListener('DOMContentLoaded', () => {
    // -------------------------------------------------------------------------
    // 1. Application State & Storage Keys
    // -------------------------------------------------------------------------
    const STORAGE_KEYS = {
        THEME: 'kexplore_theme',
        REGISTRATIONS: 'kexplore_registrations'
    };

    let appState = {
        theme: 'dark',
        activeCategory: 'All',
        searchQuery: '',
        sortBy: 'upcoming',
        countdownInterval: null,
        selectedEventForModal: null
    };

    // -------------------------------------------------------------------------
    // 2. DOM Elements Cache
    // -------------------------------------------------------------------------
    const elements = {
        html: document.documentElement,
        themeToggleBtn: document.getElementById('themeToggleBtn'),
        themeIcon: document.getElementById('themeIcon'),
        hamburgerBtn: document.getElementById('hamburgerBtn'),
        mobileDrawer: document.getElementById('mobileDrawer'),
        navLinks: document.querySelectorAll('.nav-link, .mobile-nav-link'),
        
        // Hero quick search
        heroSearchInput: document.getElementById('heroSearchInput'),
        heroSearchBtn: document.getElementById('heroSearchBtn'),
        
        // Explore section controls
        searchInput: document.getElementById('searchInput'),
        clearSearchBtn: document.getElementById('clearSearchBtn'),
        categoryPillList: document.getElementById('categoryPillList'),
        sortSelect: document.getElementById('sortSelect'),
        resultsCountText: document.getElementById('resultsCountText'),
        resetFiltersBtn: document.getElementById('resetFiltersBtn'),
        
        // Grids & containers
        featuredEventsGrid: document.getElementById('featuredEventsGrid'),
        exploreEventsGrid: document.getElementById('exploreEventsGrid'),
        registrationsGrid: document.getElementById('registrationsGrid'),
        
        // Event Details Modal
        eventDetailsModal: document.getElementById('eventDetailsModal'),
        closeDetailsBtn: document.getElementById('closeDetailsBtn'),
        modalHeroImg: document.getElementById('modalHeroImg'),
        modalCategoryBadge: document.getElementById('modalCategoryBadge'),
        modalStatusBadge: document.getElementById('modalStatusBadge'),
        modalTitle: document.getElementById('modalTitle'),
        modalOrganizer: document.getElementById('modalOrganizer'),
        modalDate: document.getElementById('modalDate'),
        modalTime: document.getElementById('modalTime'),
        modalVenue: document.getElementById('modalVenue'),
        modalSeats: document.getElementById('modalSeats'),
        modalDeadline: document.getElementById('modalDeadline'),
        modalPrice: document.getElementById('modalPrice'),
        modalDescription: document.getElementById('modalDescription'),
        modalTagsList: document.getElementById('modalTagsList'),
        modalRegisterBtn: document.getElementById('modalRegisterBtn'),
        
        // Countdown Elements
        timerDays: document.getElementById('timerDays'),
        timerHours: document.getElementById('timerHours'),
        timerMinutes: document.getElementById('timerMinutes'),
        timerSeconds: document.getElementById('timerSeconds'),
        timerStatusText: document.getElementById('timerStatusText'),
        
        // Registration Modal
        registrationModal: document.getElementById('registrationModal'),
        closeRegModalBtn: document.getElementById('closeRegModalBtn'),
        registrationForm: document.getElementById('registrationForm'),
        regEventSelect: document.getElementById('regEventSelect'),
        regFullName: document.getElementById('regFullName'),
        regEmail: document.getElementById('regEmail'),
        regPhone: document.getElementById('regPhone'),
        regOrganization: document.getElementById('regOrganization'),
        regTerms: document.getElementById('regTerms'),
        regSubmitBtn: document.getElementById('regSubmitBtn'),
        
        // Registration Success Modal
        regSuccessModal: document.getElementById('regSuccessModal'),
        closeSuccessModalBtn: document.getElementById('closeSuccessModalBtn'),
        successTicketId: document.getElementById('successTicketId'),
        successParticipant: document.getElementById('successParticipant'),
        successEventTitle: document.getElementById('successEventTitle'),
        successEventDate: document.getElementById('successEventDate'),
        successVenue: document.getElementById('successVenue'),
        viewMyRegsFromSuccessBtn: document.getElementById('viewMyRegsFromSuccessBtn'),
        
        // Contact Form
        contactForm: document.getElementById('contactForm'),
        contactName: document.getElementById('contactName'),
        contactEmail: document.getElementById('contactEmail'),
        contactSubject: document.getElementById('contactSubject'),
        contactMessage: document.getElementById('contactMessage'),
        contactSuccessBanner: document.getElementById('contactSuccessBanner'),
        
        // Back to top & Toasts
        backToTopBtn: document.getElementById('backToTopBtn'),
        toastContainer: document.getElementById('toastContainer')
    };

    // -------------------------------------------------------------------------
    // 3. Theme Management (Dark / Light)
    // -------------------------------------------------------------------------
    function initTheme() {
        const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME);
        if (savedTheme === 'light' || savedTheme === 'dark') {
            appState.theme = savedTheme;
        } else {
            // Respect system preference if available
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            appState.theme = prefersDark ? 'dark' : 'dark'; // Dark as primary default
        }
        applyTheme(appState.theme);
    }

    function applyTheme(theme) {
        appState.theme = theme;
        elements.html.setAttribute('data-theme', theme);
        try {
            localStorage.setItem(STORAGE_KEYS.THEME, theme);
        } catch (e) {
            console.warn('LocalStorage unavailable for theme:', e);
        }

        // Update Theme Toggle Icon
        if (elements.themeIcon) {
            if (theme === 'light') {
                // Moon icon for switching back to dark
                elements.themeIcon.innerHTML = `
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                `;
                elements.themeToggleBtn.setAttribute('aria-label', 'Switch to dark theme');
                elements.themeToggleBtn.setAttribute('title', 'Switch to dark theme');
            } else {
                // Sun icon for switching to light
                elements.themeIcon.innerHTML = `
                    <circle cx="12" cy="12" r="5" fill="none" stroke="currentColor" stroke-width="2"/>
                    <line x1="12" y1="1" x2="12" y2="3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    <line x1="12" y1="21" x2="12" y2="23" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    <line x1="1" y1="12" x2="3" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    <line x1="21" y1="12" x2="23" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                `;
                elements.themeToggleBtn.setAttribute('aria-label', 'Switch to light theme');
                elements.themeToggleBtn.setAttribute('title', 'Switch to light theme');
            }
        }
    }

    function toggleTheme() {
        const newTheme = appState.theme === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
        showToast(`Switched to ${newTheme} mode`, 'info');
    }

    // -------------------------------------------------------------------------
    // 4. LocalStorage Helpers for Registrations
    // -------------------------------------------------------------------------
    function getStoredRegistrations() {
        try {
            const raw = localStorage.getItem(STORAGE_KEYS.REGISTRATIONS);
            return raw ? JSON.parse(raw) : [];
        } catch (e) {
            console.error('Failed to read registrations from localStorage:', e);
            return [];
        }
    }

    function saveStoredRegistrations(registrations) {
        try {
            localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(registrations));
            return true;
        } catch (e) {
            console.error('Failed to save registrations to localStorage:', e);
            showToast('Unable to save to Local Storage. Please check storage permissions.', 'error');
            return false;
        }
    }

    // -------------------------------------------------------------------------
    // 5. Toast Notifications
    // -------------------------------------------------------------------------
    function showToast(message, type = 'info') {
        if (!elements.toastContainer) return;

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;

        let iconSvg = '';
        if (type === 'success') {
            iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>`;
        } else if (type === 'error') {
            iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`;
        } else {
            iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`;
        }

        toast.innerHTML = `${iconSvg} <span>${message}</span>`;
        elements.toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(10px) scale(0.95)';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 3600);
    }

    // -------------------------------------------------------------------------
    // 6. Navigation, Mobile Menu, Active Link Spy
    // -------------------------------------------------------------------------
    function setupNavigation() {
        // Mobile Hamburger
        if (elements.hamburgerBtn && elements.mobileDrawer) {
            elements.hamburgerBtn.addEventListener('click', () => {
                const isOpen = elements.mobileDrawer.classList.toggle('open');
                elements.hamburgerBtn.classList.toggle('active', isOpen);
                elements.hamburgerBtn.setAttribute('aria-expanded', isOpen);
                document.body.style.overflow = isOpen ? 'hidden' : '';
            });
        }

        // Close mobile drawer when clicking links
        elements.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (elements.mobileDrawer && elements.mobileDrawer.classList.contains('open')) {
                    elements.mobileDrawer.classList.remove('open');
                    elements.hamburgerBtn.classList.remove('active');
                    elements.hamburgerBtn.setAttribute('aria-expanded', 'false');
                    document.body.style.overflow = '';
                }
            });
        });

        // Scrollspy for active nav link
        const sections = document.querySelectorAll('section[id]');
        window.addEventListener('scroll', () => {
            const scrollY = window.pageYOffset;

            sections.forEach(section => {
                const sectionHeight = section.offsetHeight;
                const sectionTop = section.offsetTop - 120;
                const sectionId = section.getAttribute('id');

                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    document.querySelectorAll(`.nav-link[href*="${sectionId}"]`).forEach(link => {
                        link.classList.add('active');
                    });
                } else {
                    document.querySelectorAll(`.nav-link[href*="${sectionId}"]`).forEach(link => {
                        link.classList.remove('active');
                    });
                }
            });

            // Back to top button visibility
            if (elements.backToTopBtn) {
                if (scrollY > 350) {
                    elements.backToTopBtn.classList.add('visible');
                } else {
                    elements.backToTopBtn.classList.remove('visible');
                }
            }
        });

        // Back to top action
        if (elements.backToTopBtn) {
            elements.backToTopBtn.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }
    }

    // -------------------------------------------------------------------------
    // 7. Event Card Markup Generator
    // -------------------------------------------------------------------------
    function generateEventCardHTML(event) {
        const isClosed = event.registrationStatus === 'closed' || new Date(event.isoDate) < new Date();
        const statusBadge = isClosed 
            ? `<span class="badge badge-danger">Closed</span>`
            : (event.seatsLeft < 15 
                ? `<span class="badge badge-warning">Fast Filling</span>` 
                : `<span class="badge badge-success">Open</span>`);

        const featuredBadge = event.featured 
            ? `<span class="badge badge-primary" style="margin-right: 0.35rem;">★ Featured</span>` 
            : '';

        // Safe seat progress calculation
        const percentFilled = Math.min(100, Math.round(((event.capacity - event.seatsLeft) / event.capacity) * 100));

        // SVG fallback placeholder in case network image fails
        const fallbackSvg = `data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22600%22%20height%3D%22400%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F200%2Fsvg%22%20viewBox%3D%220%200%20600%20400%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3ClinearGradient%20id%3D%22g%22%20x1%3D%220%25%22%20y1%3D%220%25%22%20x2%3D%22100%25%22%20y2%3D%22100%25%22%3E%3Cstop%20offset%3D%220%25%22%20stop-color%3D%22%23191924%22%2F%3E%3Cstop%20offset%3D%22100%25%22%20stop-color%3D%22%232d2b4a%22%2F%3E%3C%2FlinearGradient%3E%3C%2Fdefs%3E%3Crect%20width%3D%22600%22%20height%3D%22400%22%20fill%3D%22url(%23g)%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20fill%3D%22%23a78bfa%22%20font-family%3D%22sans-serif%22%20font-size%3D%2224%22%20font-weight%3D%22bold%22%20text-anchor%3D%22middle%22%20dy%3D%22.3em%22%3EK%20EXPLORE%3C%2Ftext%3E%3C%2Fsvg%3E`;

        return `
            <article class="event-card" data-event-id="${event.id}">
                <div class="event-card-media">
                    <img 
                        class="event-card-img" 
                        src="${event.image}" 
                        alt="${event.title}" 
                        loading="lazy" 
                        onerror="this.onerror=null; this.src='${fallbackSvg}';"
                    />
                    <div class="event-card-category">
                        ${featuredBadge}
                        <span class="badge badge-primary">${event.category}</span>
                    </div>
                    <div class="event-card-status">
                        ${statusBadge}
                    </div>
                </div>
                <div class="event-card-content">
                    <div class="event-card-date-badge">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                        <span>${event.date} • ${event.time}</span>
                    </div>
                    <h3 class="event-card-title">${event.title}</h3>
                    <p class="event-card-desc">${event.shortDescription}</p>
                    <div class="event-card-venue">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                        <span>${event.venue}</span>
                    </div>
                    <div class="event-card-footer">
                        <div class="event-seats-indicator">
                            <span>${event.seatsLeft} seats left</span>
                            <div class="seats-bar" title="${percentFilled}% reserved">
                                <div class="seats-fill" style="width: ${percentFilled}%;"></div>
                            </div>
                        </div>
                        <div style="display: flex; gap: 0.5rem;">
                            <button class="btn btn-outline btn-sm view-details-btn" data-id="${event.id}">
                                Details
                            </button>
                            ${!isClosed ? `
                                <button class="btn btn-primary btn-sm quick-register-btn" data-id="${event.id}">
                                    Register
                                </button>
                            ` : `
                                <button class="btn btn-secondary btn-sm" disabled style="opacity: 0.6; cursor: not-allowed;">
                                    Closed
                                </button>
                            `}
                        </div>
                    </div>
                </div>
            </article>
        `;
    }

    // -------------------------------------------------------------------------
    // 8. Render Featured Events on Homepage
    // -------------------------------------------------------------------------
    function renderFeaturedEvents() {
        if (!elements.featuredEventsGrid) return;
        const featuredList = eventsData.filter(e => e.featured);
        elements.featuredEventsGrid.innerHTML = featuredList.map(generateEventCardHTML).join('');
        attachCardListeners(elements.featuredEventsGrid);
    }

    // -------------------------------------------------------------------------
    // 9. Explore Events: Search, Filter, Sort Engine
    // -------------------------------------------------------------------------
    function renderCategoryPills() {
        if (!elements.categoryPillList) return;
        
        elements.categoryPillList.innerHTML = eventCategories.map(cat => {
            const isActive = cat === appState.activeCategory;
            // Calculate count for this category
            const count = cat === "All" 
                ? eventsData.length 
                : eventsData.filter(e => e.category.toLowerCase() === cat.toLowerCase()).length;

            return `
                <button 
                    class="category-pill ${isActive ? 'active' : ''}" 
                    data-category="${cat}"
                    type="button"
                >
                    ${cat} (${count})
                </button>
            `;
        }).join('');

        // Attach click listeners to category pills
        elements.categoryPillList.querySelectorAll('.category-pill').forEach(pill => {
            pill.addEventListener('click', () => {
                appState.activeCategory = pill.getAttribute('data-category');
                renderCategoryPills();
                applyFiltersAndSort();
            });
        });
    }

    function applyFiltersAndSort() {
        if (!elements.exploreEventsGrid) return;

        let filtered = [...eventsData];

        // A. Filter by Category
        if (appState.activeCategory && appState.activeCategory !== 'All') {
            filtered = filtered.filter(e => 
                e.category.toLowerCase() === appState.activeCategory.toLowerCase()
            );
        }

        // B. Filter by Search Query
        const query = appState.searchQuery.trim().toLowerCase();
        if (query) {
            filtered = filtered.filter(e => {
                const titleMatch = e.title.toLowerCase().includes(query);
                const descMatch = e.shortDescription.toLowerCase().includes(query) || e.detailedDescription.toLowerCase().includes(query);
                const venueMatch = e.venue.toLowerCase().includes(query) || e.location.toLowerCase().includes(query);
                const organizerMatch = e.organizer.toLowerCase().includes(query);
                const tagsMatch = e.tags && e.tags.some(t => t.toLowerCase().includes(query));
                const catMatch = e.category.toLowerCase().includes(query);

                return titleMatch || descMatch || venueMatch || organizerMatch || tagsMatch || catMatch;
            });
        }

        // C. Sort
        switch (appState.sortBy) {
            case 'upcoming':
                // Earliest date first
                filtered.sort((a, b) => new Date(a.isoDate) - new Date(b.isoDate));
                break;
            case 'furthest':
                // Furthest upcoming date first
                filtered.sort((a, b) => new Date(b.isoDate) - new Date(a.isoDate));
                break;
            case 'alphabetical':
                // A-Z
                filtered.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'capacity':
                // Highest capacity seats
                filtered.sort((a, b) => b.seatsLeft - a.seatsLeft);
                break;
            default:
                break;
        }

        // Update results counter
        if (elements.resultsCountText) {
            elements.resultsCountText.textContent = `Showing ${filtered.length} of ${eventsData.length} events`;
        }

        // Update Clear Search Button visibility
        if (elements.clearSearchBtn) {
            elements.clearSearchBtn.classList.toggle('visible', appState.searchQuery.length > 0);
        }

        // Render Cards or Empty State
        if (filtered.length === 0) {
            elements.exploreEventsGrid.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                    </div>
                    <h4 class="empty-state-title">No Matching Events Found</h4>
                    <p class="empty-state-text">
                        We couldn't find any events matching "<strong>${escapeHTML(appState.searchQuery)}</strong>" in <strong>${escapeHTML(appState.activeCategory)}</strong>. Try adjusting your search query or reset all filters.
                    </p>
                    <button class="btn btn-secondary btn-sm" id="emptyStateResetBtn">
                        Reset All Filters
                    </button>
                </div>
            `;
            const emptyReset = document.getElementById('emptyStateResetBtn');
            if (emptyReset) {
                emptyReset.addEventListener('click', resetAllFilters);
            }
        } else {
            elements.exploreEventsGrid.innerHTML = filtered.map(generateEventCardHTML).join('');
            attachCardListeners(elements.exploreEventsGrid);
        }
    }

    function resetAllFilters() {
        appState.activeCategory = 'All';
        appState.searchQuery = '';
        appState.sortBy = 'upcoming';

        if (elements.searchInput) elements.searchInput.value = '';
        if (elements.heroSearchInput) elements.heroSearchInput.value = '';
        if (elements.sortSelect) elements.sortSelect.value = 'upcoming';

        renderCategoryPills();
        applyFiltersAndSort();
        showToast('Filters reset to default', 'info');
    }

    function attachCardListeners(container) {
        if (!container) return;

        // View Details buttons
        container.querySelectorAll('.view-details-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const eventId = btn.getAttribute('data-id');
                openEventDetailsModal(eventId);
            });
        });

        // Quick Register buttons
        container.querySelectorAll('.quick-register-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const eventId = btn.getAttribute('data-id');
                openRegistrationModal(eventId);
            });
        });

        // Whole card click (secondary trigger for details)
        container.querySelectorAll('.event-card').forEach(card => {
            card.addEventListener('click', (e) => {
                // If user clicked a button inside, let button listener handle it
                if (e.target.closest('button')) return;
                const eventId = card.getAttribute('data-event-id');
                if (eventId) {
                    openEventDetailsModal(eventId);
                }
            });
        });
    }

    // -------------------------------------------------------------------------
    // 10. Event Details Modal & Live Countdown Timer
    // -------------------------------------------------------------------------
    function openEventDetailsModal(eventId) {
        const event = eventsData.find(e => e.id === eventId);
        if (!event) {
            showToast('Event not found or has been removed.', 'error');
            return;
        }

        appState.selectedEventForModal = event;

        // Populate Modal Fields
        if (elements.modalHeroImg) {
            elements.modalHeroImg.src = event.image;
            elements.modalHeroImg.alt = event.title;
        }
        if (elements.modalCategoryBadge) elements.modalCategoryBadge.textContent = event.category;
        
        const isClosed = event.registrationStatus === 'closed' || new Date(event.isoDate) < new Date();
        if (elements.modalStatusBadge) {
            elements.modalStatusBadge.textContent = isClosed ? 'Closed' : 'Registration Open';
            elements.modalStatusBadge.className = isClosed ? 'badge badge-danger' : 'badge badge-success';
        }

        if (elements.modalTitle) elements.modalTitle.textContent = event.title;
        if (elements.modalOrganizer) elements.modalOrganizer.textContent = `${event.organizer} (${event.organizerContact})`;
        if (elements.modalDate) elements.modalDate.textContent = event.date;
        if (elements.modalTime) elements.modalTime.textContent = `${event.time} - ${event.endTime}`;
        if (elements.modalVenue) elements.modalVenue.textContent = `${event.venue}, ${event.location}`;
        if (elements.modalSeats) elements.modalSeats.textContent = `${event.seatsLeft} / ${event.capacity} seats remaining`;
        if (elements.modalDeadline) elements.modalDeadline.textContent = event.registrationDeadline;
        if (elements.modalPrice) elements.modalPrice.textContent = event.price;
        if (elements.modalDescription) elements.modalDescription.textContent = event.detailedDescription;

        // Tags
        if (elements.modalTagsList) {
            elements.modalTagsList.innerHTML = event.tags.map(tag => `
                <span class="modal-tag">#${tag}</span>
            `).join('');
        }

        // Register button inside modal
        if (elements.modalRegisterBtn) {
            if (isClosed) {
                elements.modalRegisterBtn.textContent = 'Registration Closed';
                elements.modalRegisterBtn.disabled = true;
                elements.modalRegisterBtn.className = 'btn btn-secondary';
            } else {
                elements.modalRegisterBtn.textContent = 'Register for this Event';
                elements.modalRegisterBtn.disabled = false;
                elements.modalRegisterBtn.className = 'btn btn-primary';
                elements.modalRegisterBtn.onclick = () => {
                    closeEventDetailsModal();
                    openRegistrationModal(event.id);
                };
            }
        }

        // Start Live Countdown Timer
        startCountdownTimer(event.isoDate);

        // Show Modal
        elements.eventDetailsModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeEventDetailsModal() {
        if (!elements.eventDetailsModal) return;
        elements.eventDetailsModal.classList.remove('active');
        document.body.style.overflow = '';
        stopCountdownTimer();
        appState.selectedEventForModal = null;
    }

    function startCountdownTimer(targetIsoDate) {
        stopCountdownTimer();

        const targetDate = new Date(targetIsoDate).getTime();

        function update() {
            const now = new Date().getTime();
            const difference = targetDate - now;

            if (difference <= 0) {
                // Event started or already passed
                if (elements.timerDays) elements.timerDays.textContent = '00';
                if (elements.timerHours) elements.timerHours.textContent = '00';
                if (elements.timerMinutes) elements.timerMinutes.textContent = '00';
                if (elements.timerSeconds) elements.timerSeconds.textContent = '00';
                if (elements.timerStatusText) elements.timerStatusText.textContent = 'Event has commenced or ended';
                stopCountdownTimer();
                return;
            }

            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);

            if (elements.timerDays) elements.timerDays.textContent = String(days).padStart(2, '0');
            if (elements.timerHours) elements.timerHours.textContent = String(hours).padStart(2, '0');
            if (elements.timerMinutes) elements.timerMinutes.textContent = String(minutes).padStart(2, '0');
            if (elements.timerSeconds) elements.timerSeconds.textContent = String(seconds).padStart(2, '0');
            if (elements.timerStatusText) elements.timerStatusText.textContent = 'Countdown to opening keynote';
        }

        update();
        appState.countdownInterval = setInterval(update, 1000);
    }

    function stopCountdownTimer() {
        if (appState.countdownInterval) {
            clearInterval(appState.countdownInterval);
            appState.countdownInterval = null;
        }
    }

    // -------------------------------------------------------------------------
    // 11. Event Registration Form & Validation
    // -------------------------------------------------------------------------
    function populateRegistrationDropdown(preselectEventId = null) {
        if (!elements.regEventSelect) return;

        elements.regEventSelect.innerHTML = `
            <option value="" disabled ${!preselectEventId ? 'selected' : ''}>-- Choose an Event --</option>
            ${eventsData.map(event => {
                const isClosed = event.registrationStatus === 'closed' || new Date(event.isoDate) < new Date();
                const disabledAttr = isClosed ? 'disabled' : '';
                const selectedAttr = (preselectEventId && event.id === preselectEventId) ? 'selected' : '';
                return `
                    <option value="${event.id}" ${disabledAttr} ${selectedAttr}>
                        ${event.title} (${event.date}) ${isClosed ? '[CLOSED]' : ''}
                    </option>
                `;
            }).join('')}
        `;
    }

    function openRegistrationModal(preselectEventId = null) {
        populateRegistrationDropdown(preselectEventId);
        clearFormErrors(elements.registrationForm);
        if (elements.registrationModal) {
            elements.registrationModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeRegistrationModal() {
        if (!elements.registrationModal) return;
        elements.registrationModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Validation Rules
    function validateRegistrationForm() {
        let isValid = true;
        clearFormErrors(elements.registrationForm);

        // A. Full Name
        const nameVal = elements.regFullName.value.trim();
        const nameRegex = /^[a-zA-Z\s]{3,50}$/;
        if (!nameVal) {
            showFieldError(elements.regFullName, 'Full name is required.');
            isValid = false;
        } else if (!nameRegex.test(nameVal)) {
            showFieldError(elements.regFullName, 'Please enter a valid full name (minimum 3 alphabetical characters).');
            isValid = false;
        } else {
            showFieldSuccess(elements.regFullName);
        }

        // B. Email
        const emailVal = elements.regEmail.value.trim();
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailVal) {
            showFieldError(elements.regEmail, 'Email address is required.');
            isValid = false;
        } else if (!emailRegex.test(emailVal)) {
            showFieldError(elements.regEmail, 'Please enter a valid email address (e.g. name@domain.com).');
            isValid = false;
        } else {
            showFieldSuccess(elements.regEmail);
        }

        // C. Phone Number (10-digit Indian Mobile Number)
        const phoneVal = elements.regPhone.value.trim();
        const phoneRegex = /^[6-9]\d{9}$/;
        if (!phoneVal) {
            showFieldError(elements.regPhone, 'Mobile phone number is required.');
            isValid = false;
        } else if (!phoneRegex.test(phoneVal)) {
            showFieldError(elements.regPhone, 'Please enter a valid 10-digit Indian mobile number (e.g. 9876543210).');
            isValid = false;
        } else {
            showFieldSuccess(elements.regPhone);
        }

        // D. Event Selection
        const selectedEventId = elements.regEventSelect.value;
        if (!selectedEventId) {
            showFieldError(elements.regEventSelect, 'Please select an upcoming event.');
            isValid = false;
        } else {
            const eventObj = eventsData.find(e => e.id === selectedEventId);
            if (!eventObj) {
                showFieldError(elements.regEventSelect, 'Selected event is invalid.');
                isValid = false;
            } else if (eventObj.registrationStatus === 'closed' || new Date(eventObj.isoDate) < new Date()) {
                showFieldError(elements.regEventSelect, 'Registration for this event is closed or the event has already concluded.');
                isValid = false;
            } else {
                showFieldSuccess(elements.regEventSelect);
            }
        }

        // E. Terms Agreement
        if (elements.regTerms && !elements.regTerms.checked) {
            showToast('Please accept the event code of conduct to proceed.', 'error');
            isValid = false;
        }

        // F. Prevent Duplicate Registration
        if (isValid) {
            const existingRegs = getStoredRegistrations();
            const duplicate = existingRegs.find(r => 
                r.eventId === selectedEventId && 
                r.email.toLowerCase() === emailVal.toLowerCase()
            );

            if (duplicate) {
                showFieldError(elements.regEmail, `You are already registered for this event with this email (Registration ID: ${duplicate.ticketId}).`);
                showToast(`Duplicate registration prevented for ${emailVal}.`, 'error');
                isValid = false;
            }
        }

        return isValid;
    }

    function showFieldError(inputElement, message) {
        inputElement.classList.add('is-invalid');
        inputElement.classList.remove('is-valid');
        let errorMsg = inputElement.parentElement.querySelector('.form-error-msg');
        if (!errorMsg) {
            errorMsg = document.createElement('div');
            errorMsg.className = 'form-error-msg';
            inputElement.parentElement.appendChild(errorMsg);
        }
        errorMsg.textContent = message;
        errorMsg.style.display = 'block';
    }

    function showFieldSuccess(inputElement) {
        inputElement.classList.remove('is-invalid');
        inputElement.classList.add('is-valid');
        const errorMsg = inputElement.parentElement.querySelector('.form-error-msg');
        if (errorMsg) {
            errorMsg.style.display = 'none';
        }
    }

    function clearFormErrors(form) {
        if (!form) return;
        form.querySelectorAll('.form-control').forEach(input => {
            input.classList.remove('is-invalid');
            input.classList.remove('is-valid');
        });
        form.querySelectorAll('.form-error-msg').forEach(msg => {
            msg.style.display = 'none';
        });
    }

    function handleRegistrationSubmit(e) {
        e.preventDefault();

        if (!validateRegistrationForm()) {
            return;
        }

        const selectedEventId = elements.regEventSelect.value;
        const targetEvent = eventsData.find(e => e.id === selectedEventId);
        const fullName = elements.regFullName.value.trim();
        const email = elements.regEmail.value.trim();
        const phone = elements.regPhone.value.trim();
        const organization = elements.regOrganization.value.trim() || 'Independent Participant';

        // Generate unique ticket ID: KX-2026-XXXX
        const uniqueNumber = Math.random().toString(36).substring(2, 7).toUpperCase();
        const ticketId = `KX-2026-${uniqueNumber}`;
        const registrationTimestamp = new Date().toISOString();

        const newRegistration = {
            ticketId,
            eventId: targetEvent.id,
            eventTitle: targetEvent.title,
            eventCategory: targetEvent.category,
            eventDate: targetEvent.date,
            eventTime: targetEvent.time,
            eventVenue: targetEvent.venue,
            fullName,
            email,
            phone,
            organization,
            registeredAt: registrationTimestamp,
            status: 'Confirmed'
        };

        // Save to LocalStorage
        const currentList = getStoredRegistrations();
        currentList.unshift(newRegistration);
        const saved = saveStoredRegistrations(currentList);

        if (!saved) {
            showToast('Error saving registration. LocalStorage may be full or blocked.', 'error');
            return;
        }

        // Close registration modal & reset form
        closeRegistrationModal();
        elements.registrationForm.reset();
        clearFormErrors(elements.registrationForm);

        // Render My Registrations section
        renderMyRegistrations();

        // Show Success Confirmation Modal with Ticket
        displayRegistrationSuccess(newRegistration);
        showToast(`Registration confirmed! ID: ${ticketId}`, 'success');
    }

    function displayRegistrationSuccess(reg) {
        if (elements.successTicketId) elements.successTicketId.textContent = reg.ticketId;
        if (elements.successParticipant) elements.successParticipant.textContent = reg.fullName;
        if (elements.successEventTitle) elements.successEventTitle.textContent = reg.eventTitle;
        if (elements.successEventDate) elements.successEventDate.textContent = `${reg.eventDate} • ${reg.eventTime}`;
        if (elements.successVenue) elements.successVenue.textContent = reg.eventVenue;

        if (elements.regSuccessModal) {
            elements.regSuccessModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeSuccessModal() {
        if (!elements.regSuccessModal) return;
        elements.regSuccessModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    // -------------------------------------------------------------------------
    // 12. My Registrations Management & Cancellation
    // -------------------------------------------------------------------------
    function renderMyRegistrations() {
        if (!elements.registrationsGrid) return;

        const registrations = getStoredRegistrations();

        if (registrations.length === 0) {
            elements.registrationsGrid.innerHTML = `
                <div class="empty-state" style="grid-column: 1 / -1;">
                    <div class="empty-state-icon">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                    </div>
                    <h4 class="empty-state-title">No Active Registrations</h4>
                    <p class="empty-state-text">
                        You have not registered for any events yet. Discover premier hackathons, conferences, and workshops in the Explore section.
                    </p>
                    <a href="#explore" class="btn btn-primary btn-sm">
                        Explore Events & Register
                    </a>
                </div>
            `;
            return;
        }

        elements.registrationsGrid.innerHTML = registrations.map(reg => {
            const registeredDateFormatted = new Date(reg.registeredAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });

            return `
                <div class="reg-card" data-ticket="${reg.ticketId}">
                    <div class="reg-card-top">
                        <span class="reg-id-badge">${reg.ticketId}</span>
                        <span class="badge badge-success">${reg.status || 'Confirmed'}</span>
                    </div>
                    <h3 class="reg-event-title">${escapeHTML(reg.eventTitle)}</h3>
                    <div class="reg-meta-list">
                        <div class="reg-meta-item">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                            <span>Attendee: <strong>${escapeHTML(reg.fullName)}</strong></span>
                        </div>
                        <div class="reg-meta-item">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                            <span>Date: ${escapeHTML(reg.eventDate)} (${escapeHTML(reg.eventTime)})</span>
                        </div>
                        <div class="reg-meta-item">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                            <span>Venue: ${escapeHTML(reg.eventVenue)}</span>
                        </div>
                        <div class="reg-meta-item" style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.25rem;">
                            <span>Booked on: ${registeredDateFormatted}</span>
                        </div>
                    </div>
                    <div class="reg-card-actions">
                        <button class="btn btn-outline btn-sm print-pass-btn" data-ticket="${reg.ticketId}">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
                            Print Pass
                        </button>
                        <button class="btn btn-outline btn-sm cancel-reg-btn" data-ticket="${reg.ticketId}" style="color: var(--danger); border-color: rgba(239, 68, 68, 0.3);">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                            Cancel
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        // Attach Print and Cancel listeners
        elements.registrationsGrid.querySelectorAll('.cancel-reg-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const ticketId = btn.getAttribute('data-ticket');
                confirmAndCancelRegistration(ticketId);
            });
        });

        elements.registrationsGrid.querySelectorAll('.print-pass-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const ticketId = btn.getAttribute('data-ticket');
                printPass(ticketId);
            });
        });
    }

    function confirmAndCancelRegistration(ticketId) {
        const confirmed = window.confirm(`Are you sure you want to cancel registration ticket "${ticketId}"? This action cannot be undone.`);
        if (!confirmed) return;

        let registrations = getStoredRegistrations();
        const initialCount = registrations.length;
        registrations = registrations.filter(r => r.ticketId !== ticketId);

        if (registrations.length < initialCount) {
            saveStoredRegistrations(registrations);
            renderMyRegistrations();
            showToast(`Registration ${ticketId} has been cancelled.`, 'info');
        }
    }

    function printPass(ticketId) {
        const registrations = getStoredRegistrations();
        const reg = registrations.find(r => r.ticketId === ticketId);
        if (!reg) return;

        const printWindow = window.open('', '_blank', 'width=700,height=600');
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>K EXPLORE Digital Pass - ${reg.ticketId}</title>
                <style>
                    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 40px; color: #111; }
                    .pass { border: 2px solid #000; border-radius: 12px; padding: 24px; max-width: 500px; margin: 0 auto; }
                    .header { display: flex; justify-content: space-between; border-bottom: 2px dashed #999; padding-bottom: 12px; margin-bottom: 20px; }
                    .brand { font-size: 20px; font-weight: bold; letter-spacing: 1px; }
                    .id { font-size: 16px; font-family: monospace; font-weight: bold; }
                    h2 { margin: 0 0 10px 0; font-size: 22px; }
                    .row { margin-bottom: 12px; }
                    .label { font-size: 11px; text-transform: uppercase; color: #666; font-weight: bold; }
                    .val { font-size: 15px; font-weight: 500; }
                    .footer { margin-top: 25px; padding-top: 15px; border-top: 1px solid #ddd; font-size: 12px; color: #777; text-align: center; }
                </style>
            </head>
            <body>
                <div class="pass">
                    <div class="header">
                        <div class="brand">K EXPLORE PASS</div>
                        <div class="id">${reg.ticketId}</div>
                    </div>
                    <h2>${reg.eventTitle}</h2>
                    <div class="row">
                        <div class="label">Attendee</div>
                        <div class="val">${reg.fullName} (${reg.organization})</div>
                    </div>
                    <div class="row">
                        <div class="label">Email & Phone</div>
                        <div class="val">${reg.email} • ${reg.phone}</div>
                    </div>
                    <div class="row">
                        <div class="label">Date & Time</div>
                        <div class="val">${reg.eventDate} at ${reg.eventTime}</div>
                    </div>
                    <div class="row">
                        <div class="label">Venue</div>
                        <div class="val">${reg.eventVenue}</div>
                    </div>
                    <div class="row">
                        <div class="label">Status</div>
                        <div class="val">${reg.status || 'Confirmed'}</div>
                    </div>
                    <div class="footer">
                        Present this pass at the registration desk for badge collection.<br/>
                        K EXPLORE — Discover. Experience. Connect.
                    </div>
                </div>
                <script>
                    window.onload = function() { window.print(); };
                </script>
            </body>
            </html>
        `);
        printWindow.document.close();
    }

    // -------------------------------------------------------------------------
    // 13. Contact Form Submission (Demo Client Validation)
    // -------------------------------------------------------------------------
    function setupContactForm() {
        if (!elements.contactForm) return;

        elements.contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            let isValid = true;
            clearFormErrors(elements.contactForm);

            const name = elements.contactName.value.trim();
            const email = elements.contactEmail.value.trim();
            const subject = elements.contactSubject.value.trim();
            const message = elements.contactMessage.value.trim();

            if (!name || name.length < 3) {
                showFieldError(elements.contactName, 'Please enter your full name (minimum 3 characters).');
                isValid = false;
            }

            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!email || !emailRegex.test(email)) {
                showFieldError(elements.contactEmail, 'Please enter a valid email address.');
                isValid = false;
            }

            if (!subject || subject.length < 4) {
                showFieldError(elements.contactSubject, 'Subject line must be at least 4 characters.');
                isValid = false;
            }

            if (!message || message.length < 15) {
                showFieldError(elements.contactMessage, 'Please write a message with at least 15 characters.');
                isValid = false;
            }

            if (!isValid) return;

            // Display clear demo feedback
            if (elements.contactSuccessBanner) {
                elements.contactSuccessBanner.style.display = 'block';
                elements.contactSuccessBanner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }

            showToast('Thank you! Your demo message has been received.', 'success');
            elements.contactForm.reset();
            clearFormErrors(elements.contactForm);

            setTimeout(() => {
                if (elements.contactSuccessBanner) {
                    elements.contactSuccessBanner.style.display = 'none';
                }
            }, 8000);
        });
    }

    // -------------------------------------------------------------------------
    // 14. Event Listeners Setup
    // -------------------------------------------------------------------------
    function setupEventListeners() {
        // Theme toggle button
        if (elements.themeToggleBtn) {
            elements.themeToggleBtn.addEventListener('click', toggleTheme);
        }

        // Hero quick search
        if (elements.heroSearchBtn && elements.heroSearchInput) {
            const triggerHeroSearch = () => {
                const query = elements.heroSearchInput.value.trim();
                appState.searchQuery = query;
                if (elements.searchInput) elements.searchInput.value = query;
                applyFiltersAndSort();
                
                // Scroll to explore section
                const exploreSection = document.getElementById('explore');
                if (exploreSection) {
                    exploreSection.scrollIntoView({ behavior: 'smooth' });
                }
            };

            elements.heroSearchBtn.addEventListener('click', triggerHeroSearch);
            elements.heroSearchInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    triggerHeroSearch();
                }
            });
        }

        // Explore live search input
        if (elements.searchInput) {
            elements.searchInput.addEventListener('input', (e) => {
                appState.searchQuery = e.target.value;
                applyFiltersAndSort();
            });
        }

        // Clear search button
        if (elements.clearSearchBtn) {
            elements.clearSearchBtn.addEventListener('click', () => {
                appState.searchQuery = '';
                if (elements.searchInput) elements.searchInput.value = '';
                applyFiltersAndSort();
                if (elements.searchInput) elements.searchInput.focus();
            });
        }

        // Sort select
        if (elements.sortSelect) {
            elements.sortSelect.addEventListener('change', (e) => {
                appState.sortBy = e.target.value;
                applyFiltersAndSort();
            });
        }

        // Reset filters button
        if (elements.resetFiltersBtn) {
            elements.resetFiltersBtn.addEventListener('click', resetAllFilters);
        }

        // Event Details Modal Close
        if (elements.closeDetailsBtn) {
            elements.closeDetailsBtn.addEventListener('click', closeEventDetailsModal);
        }
        if (elements.eventDetailsModal) {
            elements.eventDetailsModal.addEventListener('click', (e) => {
                if (e.target === elements.eventDetailsModal) {
                    closeEventDetailsModal();
                }
            });
        }

        // Registration Modal Close
        if (elements.closeRegModalBtn) {
            elements.closeRegModalBtn.addEventListener('click', closeRegistrationModal);
        }
        if (elements.registrationModal) {
            elements.registrationModal.addEventListener('click', (e) => {
                if (e.target === elements.registrationModal) {
                    closeRegistrationModal();
                }
            });
        }

        // Registration Form Submit
        if (elements.registrationForm) {
            elements.registrationForm.addEventListener('submit', handleRegistrationSubmit);
        }

        // Registration Success Modal Close
        if (elements.closeSuccessModalBtn) {
            elements.closeSuccessModalBtn.addEventListener('click', closeSuccessModal);
        }
        if (elements.regSuccessModal) {
            elements.regSuccessModal.addEventListener('click', (e) => {
                if (e.target === elements.regSuccessModal) {
                    closeSuccessModal();
                }
            });
        }

        // View in My Registrations button from success modal
        if (elements.viewMyRegsFromSuccessBtn) {
            elements.viewMyRegsFromSuccessBtn.addEventListener('click', () => {
                closeSuccessModal();
                const myRegsSection = document.getElementById('registrations');
                if (myRegsSection) {
                    myRegsSection.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }

        // Global Esc key to close any active modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (elements.eventDetailsModal && elements.eventDetailsModal.classList.contains('active')) {
                    closeEventDetailsModal();
                }
                if (elements.registrationModal && elements.registrationModal.classList.contains('active')) {
                    closeRegistrationModal();
                }
                if (elements.regSuccessModal && elements.regSuccessModal.classList.contains('active')) {
                    closeSuccessModal();
                }
            }
        });
    }

    // -------------------------------------------------------------------------
    // 15. Helper Utilities
    // -------------------------------------------------------------------------
    function escapeHTML(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    // -------------------------------------------------------------------------
    // 16. App Initialization
    // -------------------------------------------------------------------------
    function initApp() {
        initTheme();
        setupNavigation();
        setupEventListeners();
        setupContactForm();
        
        renderFeaturedEvents();
        renderCategoryPills();
        applyFiltersAndSort();
        renderMyRegistrations();
        populateRegistrationDropdown();
    }

    initApp();
});
