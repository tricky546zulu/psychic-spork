document.addEventListener('DOMContentLoaded', function () {
    // --- UI Element Selectors ---
    const searchInput = document.getElementById('search-input');
    const noResultsMessage = document.getElementById('no-results');
    const proceduresWrapper = document.getElementById('procedures-content-wrapper');
    const policiesWrapper = document.getElementById('policies-content-wrapper');
    const homeSection = document.getElementById('home');

    // --- Content Population Function ---
    function populateAccordion(wrapper, data) {
        if (!wrapper) return;
        wrapper.innerHTML = ''; // Clear existing content

        const sectionHeading = document.createElement('h2');
        sectionHeading.className = 'text-2xl font-bold mb-4 text-cyan-400 border-b-2 border-slate-700 pb-2';
        sectionHeading.textContent = wrapper.id === 'procedures-content-wrapper' ? 'Procedures' : 'Policies';
        wrapper.appendChild(sectionHeading);

        data.forEach(item => {
            const accordionItem = document.createElement('div');
            accordionItem.className = 'accordion-item bg-slate-800 rounded-lg shadow-lg overflow-hidden transition-all duration-300 border-t-4 border-t-cyan-500';
            accordionItem.dataset.keywords = item.keywords.toLowerCase();

            accordionItem.innerHTML = `
                <div class="accordion-header p-5 cursor-pointer flex justify-between items-center hover:bg-slate-700 transition-colors duration-200">
                    <h3 class="text-lg font-semibold text-slate-200">${item.title}</h3>
                    <svg class="chevron w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
                <div class="accordion-content border-t border-slate-700">
                    <div class="px-5 sm:px-6 py-4">
                        ${item.html}
                    </div>
                </div>
            `;
            wrapper.appendChild(accordionItem);
        });
    }

    // --- Initial Population ---
    populateAccordion(proceduresWrapper, contentData.procedures);
    populateAccordion(policiesWrapper, contentData.policies);
    const allAccordions = document.querySelectorAll('.accordion-item');

    // --- Search Functionality ---
    function handleSearch() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        let resultsFound = false;

        allAccordions.forEach(item => {
            const title = item.querySelector('h3').textContent.toLowerCase();
            const content = item.querySelector('.accordion-content').textContent.toLowerCase();
            const keywords = item.dataset.keywords;

            const isVisible = title.includes(searchTerm) || content.includes(searchTerm) || keywords.includes(searchTerm);
            item.style.display = isVisible ? 'block' : 'none';
            if (isVisible) resultsFound = true;
        });

        // Hide/show section headings based on visible content
        [proceduresWrapper, policiesWrapper].forEach(wrapper => {
            const visibleItems = wrapper.querySelectorAll('.accordion-item[style*="display: block"]');
            const heading = wrapper.querySelector('h2');
            if (heading) {
                heading.style.display = visibleItems.length > 0 ? 'block' : 'none';
            }
        });

        homeSection.style.display = searchTerm === '' ? 'block' : 'none';
        noResultsMessage.style.display = !resultsFound && searchTerm !== '' ? 'block' : 'none';
    }

    // --- Event Listeners ---
    searchInput.addEventListener('input', handleSearch);

    document.getElementById('content-display').addEventListener('click', function(event) {
        const header = event.target.closest('.accordion-header');
        if (header) {
            const content = header.nextElementSibling;
            header.classList.toggle('open');
            content.classList.toggle('open');
        }
    });
});
