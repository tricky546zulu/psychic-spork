document.addEventListener('DOMContentLoaded', function () {

            // --- Content Population Function ---
            function populateAccordion(wrapperId, data) {
                const wrapper = document.getElementById(wrapperId);
                if (!wrapper) return;
                data.forEach(item => {
                    const accordionItem = document.createElement('div');
                    accordionItem.className = 'accordion-item bg-theme-content rounded-lg shadow-md overflow-hidden';
                    accordionItem.dataset.keywords = item.keywords;

                    accordionItem.innerHTML = `
                        <button class="accordion-toggle flex justify-between items-center w-full p-6 text-left" aria-expanded="false">
                            <h3 class="text-xl font-bold text-theme-heading">${item.title}</h3>
                            <svg class="indicator w-6 h-6 transform text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                        </button>
                        <div class="accordion-content hidden px-6 pb-6 pt-4 border-t border-gray-700/50">
                            ${item.html}
                        </div>
                    `;
                    wrapper.appendChild(accordionItem);
                });
            }

            // --- Populate All Sections ---
            populateAccordion('procedures-content-wrapper', contentData.procedures);
            populateAccordion('policies-content-wrapper', contentData.policies);

            // --- UI Element Selectors ---
            const searchInputDesktop = document.getElementById('search-input-desktop');
            const searchInputMobile = document.getElementById('search-input-mobile');
            const noResultsMessage = document.getElementById('no-results');
            const backToTopButton = document.getElementById('back-to-top');
            const mobileMenuButton = document.getElementById('mobile-menu-button');
            const sidebar = document.getElementById('sidebar');
            const sidebarLinks = document.querySelectorAll('.sidebar-link');
            const allContentSections = document.querySelectorAll('.protocol-section');

            // --- Event Listeners ---
            function handleSearch(event) {
                const searchTerm = event.target.value.toLowerCase().trim();

                if (event.target.id === 'search-input-desktop') searchInputMobile.value = searchTerm;
                else searchInputDesktop.value = searchTerm;

                let resultsFound = false;

                document.querySelectorAll('.accordion-item').forEach(content => {
                    const text = content.textContent.toLowerCase();
                    const keywords = (content.dataset.keywords || '').toLowerCase();

                    if (text.includes(searchTerm) || keywords.includes(searchTerm)) {
                        content.style.display = 'block';
                        resultsFound = true;
                    } else {
                        content.style.display = 'none';
                    }
                });

                allContentSections.forEach(section => {
                    const visibleContent = section.querySelectorAll('.accordion-item[style*="display: block"]');
                    if (section.id === 'home' && searchTerm !== '') {
                        section.style.display = 'none';
                    } else if (section.id === 'home' && searchTerm === '') {
                        section.style.display = 'block';
                    } else {
                        section.style.display = (visibleContent.length > 0) ? 'block' : 'none';
                    }
                });

                noResultsMessage.style.display = (resultsFound || searchTerm === '') ? 'none' : 'block';
            }

            document.getElementById('content-display').addEventListener('click', function(event) {
                const toggle = event.target.closest('.accordion-toggle');
                if (toggle) {
                    const content = toggle.nextElementSibling;
                    const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
                    toggle.setAttribute('aria-expanded', !isExpanded);
                    content.classList.toggle('hidden');
                }
            });

            searchInputDesktop.addEventListener('keyup', handleSearch);
            searchInputMobile.addEventListener('keyup', handleSearch);
            mobileMenuButton.addEventListener('click', e => { e.stopPropagation(); sidebar.classList.toggle('-translate-x-full'); });
            document.body.addEventListener('click', () => { if (window.innerWidth < 768 && !sidebar.classList.contains('-translate-x-full')) sidebar.classList.add('-translate-x-full'); });
            sidebar.addEventListener('click', e => e.stopPropagation());
            sidebarLinks.forEach(link => { link.addEventListener('click', () => { if (window.innerWidth < 768) sidebar.classList.add('-translate-x-full'); }); });
            window.addEventListener('scroll', () => { if (window.scrollY > 300) backToTopButton.classList.remove('hidden'); else backToTopButton.classList.add('hidden'); });
            backToTopButton.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

            // --- Intersection Observer for Active Nav Link ---
            const observer = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        sidebarLinks.forEach(link => {
                            link.classList.remove('active');
                            if (link.getAttribute('href').substring(1) === entry.target.id) link.classList.add('active');
                        });
                    }
                });
            }, { rootMargin: "-40% 0px -60% 0px" });
            allContentSections.forEach(section => observer.observe(section));
        });
