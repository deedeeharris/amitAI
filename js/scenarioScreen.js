// Scenario Screen Management
class ScenarioScreen {
    constructor() {
        this.initializeElements();
        this.attachEventListeners();
        this.loadState();
    }

    initializeElements() {
        // Bot Type Selection
        this.botTypeSimple = document.getElementById('bot-type-simple');
        this.botTypeDynamic = document.getElementById('bot-type-dynamic');
        
        // Prompt Sections
        this.simplePromptSection = document.getElementById('simple-prompt-section');
        this.dynamicPromptSection = document.getElementById('dynamic-prompt-section');
        
        // Simple Prompt Elements
        this.promptIdea = document.getElementById('prompt-idea');
        this.generatePromptBtn = document.getElementById('generate-prompt');
        this.generatedPrompt = document.getElementById('generated-prompt');
        this.editPromptBtn = document.getElementById('edit-prompt');
        
        // Dynamic Prompt Table
        this.dynamicTable = document.getElementById('dynamic-prompt-table');
        this.addRowBtn = document.getElementById('add-table-row');
    }

    attachEventListeners() {
        // Bot Type Selection
        this.botTypeSimple.addEventListener('change', () => this.togglePromptType('simple'));
        this.botTypeDynamic.addEventListener('change', () => this.togglePromptType('dynamic'));
        
        // Simple Prompt
        this.generatePromptBtn.addEventListener('click', () => this.generatePrompt());
        this.editPromptBtn.addEventListener('click', () => this.editPrompt());
        this.promptIdea.addEventListener('input', () => this.saveState());
        this.generatedPrompt.addEventListener('input', () => this.saveState());
        
        // Dynamic Table
        this.addRowBtn.addEventListener('click', () => this.addTableRow());
    }

    togglePromptType(type) {
        this.simplePromptSection.style.display = type === 'simple' ? 'block' : 'none';
        this.dynamicPromptSection.style.display = type === 'dynamic' ? 'block' : 'none';
        this.saveState();
    }

    async generatePrompt() {
        const idea = this.promptIdea.value.trim();
        if (!idea) {
            alert('נא להזין רעיון למלווה הלמידה');
            return;
        }

        this.generatePromptBtn.disabled = true;
        this.generatePromptBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> מייצר...';

        try {
            const prompt = await mockService.generatePrompt(idea);
            this.generatedPrompt.value = prompt;
            this.generatedPrompt.style.display = 'block';
            this.editPromptBtn.style.display = 'block';
        } catch (error) {
            console.error('Failed to generate prompt:', error);
            alert('שגיאה ביצירת ההנחיה');
        } finally {
            this.generatePromptBtn.disabled = false;
            this.generatePromptBtn.innerHTML = 'צור הנחיה';
            this.saveState();
        }
    }

    editPrompt() {
        this.generatedPrompt.readOnly = !this.generatedPrompt.readOnly;
        this.editPromptBtn.textContent = this.generatedPrompt.readOnly ? 'ערוך הנחיה' : 'שמור שינויים';
        
        if (this.generatedPrompt.readOnly) {
            this.saveState();
        }
    }

    addTableRow() {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <input type="text" class="condition-input" placeholder="תנאי">
            </td>
            <td>
                <textarea class="prompt-input" placeholder="הנחיה"></textarea>
            </td>
            <td>
                <button class="remove-row" title="הסר שורה">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </td>
        `;

        const tbody = this.dynamicTable.querySelector('tbody');
        tbody.appendChild(row);

        // Add event listeners
        const removeBtn = row.querySelector('.remove-row');
        removeBtn.addEventListener('click', () => this.removeTableRow(row));

        const inputs = row.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', () => this.saveState());
        });

        this.saveState();
    }

    removeTableRow(row) {
        row.remove();
        this.saveState();
    }

    getDynamicTableData() {
        const rows = this.dynamicTable.querySelectorAll('tbody tr');
        return Array.from(rows).map(row => ({
            condition: row.querySelector('.condition-input').value,
            prompt: row.querySelector('.prompt-input').value
        }));
    }

    setDynamicTableData(data) {
        const tbody = this.dynamicTable.querySelector('tbody');
        tbody.innerHTML = '';
        
        data.forEach(row => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>
                    <input type="text" class="condition-input" value="${row.condition}" placeholder="תנאי">
                </td>
                <td>
                    <textarea class="prompt-input" placeholder="הנחיה">${row.prompt}</textarea>
                </td>
                <td>
                    <button class="remove-row" title="הסר שורה">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(tr);

            // Add event listeners
            const removeBtn = tr.querySelector('.remove-row');
            removeBtn.addEventListener('click', () => this.removeTableRow(tr));

            const inputs = tr.querySelectorAll('input, textarea');
            inputs.forEach(input => {
                input.addEventListener('input', () => this.saveState());
            });
        });
    }

    saveState() {
        const state = JSON.parse(localStorage.getItem('botGeneratorState') || '{}');
        state.scenario = {
            type: this.botTypeSimple.checked ? 'simple' : 'dynamic',
            simplePrompt: {
                idea: this.promptIdea.value,
                generated: this.generatedPrompt.value
            },
            dynamicPrompt: this.getDynamicTableData()
        };
        localStorage.setItem('botGeneratorState', JSON.stringify(state));
    }

    loadState() {
        const state = JSON.parse(localStorage.getItem('botGeneratorState') || '{}');
        if (state.scenario) {
            const { type, simplePrompt, dynamicPrompt } = state.scenario;
            
            // Set bot type
            if (type === 'simple') {
                this.botTypeSimple.checked = true;
                this.togglePromptType('simple');
            } else {
                this.botTypeDynamic.checked = true;
                this.togglePromptType('dynamic');
            }
            
            // Set simple prompt data
            if (simplePrompt) {
                this.promptIdea.value = simplePrompt.idea || '';
                this.generatedPrompt.value = simplePrompt.generated || '';
                if (simplePrompt.generated) {
                    this.generatedPrompt.style.display = 'block';
                    this.editPromptBtn.style.display = 'block';
                }
            }
            
            // Set dynamic prompt data
            if (dynamicPrompt) {
                this.setDynamicTableData(dynamicPrompt);
            }
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.scenarioScreen = new ScenarioScreen();
});
