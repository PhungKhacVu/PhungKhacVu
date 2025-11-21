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

    const savePrompt = async (promptData) => {
        const isUpdating = !!promptData.id;
        const url = isUpdating ? `${API_URL}/${promptData.id}` : API_URL;
        const method = isUpdating ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(promptData),
            });
            if (!response.ok) throw new Error('Failed to save prompt');
            await fetchPrompts(); // Refresh the list
            const savedPrompt = await response.json();
            currentPromptId = savedPrompt.id;
            renderPromptView(savedPrompt); // View the newly saved/created prompt
        } catch (error) {
            console.error(error);
        }
    };

    const deletePrompt = async (id) => {
        if (!confirm('Are you sure you want to delete this prompt?')) return;

        try {
            const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Failed to delete prompt');
            await fetchPrompts();
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
                renderPromptList(searchInput.value); // Re-render to update active state
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
        renderPromptList();
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
                // Simple import: just replace everything. A more robust implementation might merge.
                // We'll call our backend to write the new data.
                const savePromises = importedPrompts.map(p => savePrompt(p));
                await Promise.all(savePromises);
                await fetchPrompts(); // Refresh to get the final state
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
