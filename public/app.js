document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const promptListNav = document.getElementById('prompt-list-nav');
    const mainContent = document.getElementById('main-content');
    const newPromptBtn = document.getElementById('new-prompt-btn');
    const searchInput = document.getElementById('search-input');
    const exportBtn = document.getElementById('export-btn');
    const importBtn = document.getElementById('import-btn');
    const importFileInput = document.getElementById('import-file-input');

    // --- State ---
    let allPrompts = [];
    let currentPromptId = null;

    // --- API Functions ---
    const API_URL = '/api/prompts';

    const fetchPrompts = async () => {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error('Failed to fetch prompts');
            allPrompts = await response.json();
            renderPromptList();
        } catch (error) {
            console.error(error);
            mainContent.innerHTML = `<div class="error">Failed to load prompts. Is the server running?</div>`;
        }
    };

    // ⚡ Bolt Optimization: Local state update on save
    // Why: Avoids a full network refetch of all prompts after saving.
    // Impact: Saves 1 HTTP request per save/update, prevents N+1 bottleneck on import.
    // Measurement: Network tab should show only POST/PUT, no subsequent GET /api/prompts.
    const savePrompt = async (promptData, skipRender = false) => {
        const isUpdating = !!promptData.id;
        // If it's a new prompt, remove the empty id so the server generates one correctly.
        if (!isUpdating) delete promptData.id;

        const url = isUpdating ? `${API_URL}/${promptData.id}` : API_URL;
        const method = isUpdating ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(promptData),
            });
            if (!response.ok) throw new Error('Failed to save prompt');

            const savedPrompt = await response.json();

            // Local state update
            if (isUpdating) {
                const index = allPrompts.findIndex(p => p.id === savedPrompt.id);
                if (index !== -1) allPrompts[index] = savedPrompt;
            } else {
                allPrompts.push(savedPrompt);
            }

            if (!skipRender) {
                currentPromptId = savedPrompt.id;
                renderPromptList(searchInput.value);
                renderPromptView(savedPrompt); // View the newly saved/created prompt
            }
        } catch (error) {
            console.error(error);
        }
    };

    // ⚡ Bolt Optimization: Local state update on delete
    // Why: Avoids a full network refetch of all prompts after deleting one.
    // Impact: Saves 1 HTTP request per deletion.
    // Measurement: Network tab should show only DELETE, no subsequent GET /api/prompts.
    const deletePrompt = async (id) => {
        if (!confirm('Are you sure you want to delete this prompt?')) return;

        try {
            const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Failed to delete prompt');

            // Local state update
            allPrompts = allPrompts.filter(p => p.id !== id);

            renderWelcomeScreen();
        } catch (error) {
            console.error(error);
        }
    };


    // --- Rendering Functions ---
    const renderPromptList = (filter = '') => {
        promptListNav.innerHTML = '';
        const filteredPrompts = allPrompts.filter(p =>
            p.title.toLowerCase().includes(filter.toLowerCase())
        );

        if (filteredPrompts.length === 0) {
            promptListNav.innerHTML = '<p class="no-prompts">No prompts found.</p>';
            return;
        }

        filteredPrompts.forEach(prompt => {
            const item = document.createElement('div');
            item.className = 'prompt-item';
            item.dataset.id = prompt.id;
            if (prompt.id === currentPromptId) {
                item.classList.add('active');
            }
            item.innerHTML = `
                <h3>${prompt.title}</h3>
                <p>${prompt.primaryTechnique || ''}</p>
            `;
            item.addEventListener('click', () => {
                currentPromptId = prompt.id;

                // ⚡ Bolt Optimization: Targeted DOM manipulation for selection
                // Why: Avoids O(N) layout thrashing caused by fully re-rendering the entire list just to change the 'active' class.
                // Impact: List selection becomes O(1) DOM operations, making UI instantly responsive on huge lists.
                // Measurement: Chrome DevTools Performance profile should show no large Layout tasks upon clicking a prompt.
                const currentActive = promptListNav.querySelector('.prompt-item.active');
                if (currentActive) currentActive.classList.remove('active');
                item.classList.add('active');

                renderPromptView(prompt);
            });
            promptListNav.appendChild(item);
        });
    };

    const renderWelcomeScreen = () => {
        currentPromptId = null;
        mainContent.innerHTML = `
            <div class="welcome-screen">
                <h2>Welcome to Prompt Nebula</h2>
                <p>Select a prompt from the list or create a new one to get started.</p>
            </div>
        `;
        renderPromptList(searchInput.value); // Preserve active search filter
    };

    const renderPromptView = (prompt) => {
        mainContent.innerHTML = `
            <div class="prompt-view-container">
                <h2>${prompt.title}</h2>
                <p><strong>Category:</strong> ${prompt.techniqueCategory}</p>
                <p><strong>Primary Technique:</strong> ${prompt.primaryTechnique}</p>
                <hr>
                <h3>Base Prompt:</h3>
                <pre>${prompt.basePrompt}</pre>
                <div class="form-actions">
                    <button class="edit-btn" data-id="${prompt.id}">Edit</button>
                </div>
            </div>
        `;
        mainContent.querySelector('.edit-btn').addEventListener('click', () => {
            renderPromptForm(prompt);
        });
    };

    const renderPromptForm = (prompt = {}) => {
        // This is a simplified form for demonstration.
        // A real implementation would dynamically build the form based on the schema.
        mainContent.innerHTML = `
            <div class="prompt-form-container">
                <form id="prompt-form">
                    <input type="hidden" name="id" value="${prompt.id || ''}">
                    <div class="form-group">
                        <label for="title">Title</label>
                        <input type="text" name="title" id="title" value="${prompt.title || ''}" required>
                    </div>
                    <div class="form-group">
                        <label for="basePrompt">Base Prompt</label>
                        <textarea name="basePrompt" id="basePrompt" required>${prompt.basePrompt || ''}</textarea>
                    </div>
                     <div class="form-group">
                        <label for="techniqueCategory">Category</label>
                        <input type="text" name="techniqueCategory" id="techniqueCategory" value="${prompt.techniqueCategory || ''}">
                    </div>
                    <div class="form-group">
                        <label for="primaryTechnique">Primary Technique</label>
                        <input type="text" name="primaryTechnique" id="primaryTechnique" value="${prompt.primaryTechnique || ''}">
                    </div>
                    <div class="form-actions">
                        ${prompt.id ? `<button type="button" class="delete-btn" data-id="${prompt.id}">Delete</button>` : ''}
                        <button type="button" class="cancel-btn">Cancel</button>
                        <button type="submit" class="save-btn">Save Prompt</button>
                    </div>
                </form>
            </div>
        `;

        const form = mainContent.querySelector('#prompt-form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            savePrompt(data);
        });

        form.querySelector('.cancel-btn').addEventListener('click', () => {
             if(prompt.id) renderPromptView(prompt); else renderWelcomeScreen();
        });

        if (prompt.id) {
            form.querySelector('.delete-btn').addEventListener('click', () => {
                deletePrompt(prompt.id);
            });
        }
    };


    // --- Event Listeners ---
    newPromptBtn.addEventListener('click', () => renderPromptForm());
    searchInput.addEventListener('input', (e) => renderPromptList(e.target.value));

    exportBtn.addEventListener('click', () => {
        const dataStr = JSON.stringify(allPrompts, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

        const exportFileDefaultName = 'prompts.json';

        let linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    });

    importBtn.addEventListener('click', () => importFileInput.click());

    importFileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                const importedPrompts = JSON.parse(event.target.result);

                // ⚡ Bolt Optimization: Batch DOM updates and local state updates during bulk import
                // Why: Rapidly calling savePrompt without skipRender causes N consecutive full-page re-renders.
                // Calling fetchPrompts() creates an unnecessary full refetch bottleneck.
                // Impact: Eliminates N full-list DOM re-renders and 1 large HTTP request during import.
                // Measurement: UI will remain responsive during import, Chrome profiler shows 1 layout recalculation instead of N.
                const savePromises = importedPrompts.map(p => savePrompt(p, true));
                await Promise.all(savePromises);

                renderPromptList(searchInput.value); // Re-render the list once, preserving search
                renderWelcomeScreen();
            } catch (err) {
                alert('Error importing file. Make sure it is a valid JSON file.');
                console.error(err);
            }
        };
        reader.readAsText(file);
        // Reset file input so the same file can be loaded again
        importFileInput.value = '';
    });


    // --- Initial Load ---
    fetchPrompts();
});
