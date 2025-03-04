/**
 * Create Bot Wizard - Main JavaScript
 * Handles initialization and coordination of all wizard components
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize form validation
    const formValidation = new FormValidation();
    
    // Initialize wizard navigation
    const wizardNavigation = new WizardNavigation({
        tabsSelector: '.wizard-tab',
        contentSelector: '.step-content-item',
        prevButtonSelector: '.prev-step-button',
        nextButtonSelector: '.next-step-button',
        activeClass: 'active',
        inactiveClass: 'inactive',
        onStepChange: (step) => {
            // You can add custom logic here when steps change
            console.log(`Changed to step ${step}`);
        }
    });
    
    // Initialize preview chat sidebar
    const previewChatSidebar = new PreviewChatSidebar();
    
    // Initialize file upload
    const fileUpload = new FileUpload('file-upload-container', {
        maxFileSize: 10 * 1024 * 1024, // 10MB
        allowedTypes: ['.pdf', '.doc', '.docx', '.txt']
    });
    
    // Setup bot name sync with preview
    setupBotNameSync(previewChatSidebar);
    
    // Setup save and publish buttons
    setupSavePublishButtons();
    
    // Check if on mobile device
    checkMobileDevice();
    
    // Listen for window resize to recheck mobile status
    window.addEventListener('resize', checkMobileDevice);
    
    // Ensure equal heights for wizard and chat preview
    adjustHeights();
    window.addEventListener('resize', adjustHeights);
    
    // Setup avatar sync with preview
    setupAvatarSync(previewChatSidebar);
    
    // Get the wizard tabs
    const wizardTabs = document.querySelectorAll('.wizard-tab');
    
    // Add click event listeners to tabs
    wizardTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const step = parseInt(tab.dataset.step);
            if (step === 5) {
                // Hide next button on step 5
                document.querySelector('.next-step-button').style.display = 'none';
            }
        });
    });
    
    // Also check for next button clicks
    document.querySelector('.next-step-button').addEventListener('click', function() {
        // Get current active tab
        const activeTab = document.querySelector('.wizard-tab.active');
        const currentStep = parseInt(activeTab.dataset.step);
        
        if (currentStep === 4) {
            // We're moving to step 5, hide the next button
            setTimeout(() => {
                document.querySelector('.next-step-button').style.display = 'none';
            }, 100);
        }
    });

    // Sources and Lessons Library Modal Functionality
    // Modal Elements
    const sourcesLibraryModal = document.getElementById('sources-library-modal');
    const lessonsLibraryModal = document.getElementById('lessons-library-modal');
    
    // Button Elements
    const sourcesLibraryButton = document.querySelector('.sources-library-button:not(.lessons-library-button)');
    const lessonsLibraryButton = document.querySelector('.lessons-library-button');
    
    // Close Buttons
    const closeButtons = document.querySelectorAll('.close-modal-button, .cancel-button');
    
    // Selected Items Containers
    const selectedSourcesContainer = document.getElementById('selected-sources-container');
    const selectedLessonsContainer = document.getElementById('selected-lessons-container');
    const selectedSourcesList = document.getElementById('selected-sources-list');
    const selectedLessonsList = document.getElementById('selected-lessons-list');
    
    // Add Selected Buttons
    const addSelectedSourcesButton = document.getElementById('add-selected-sources');
    const addSelectedLessonsButton = document.getElementById('add-selected-lessons');
    
    // Search and Filter Elements
    const sourcesSearch = document.getElementById('sources-search');
    const lessonsSearch = document.getElementById('lessons-search');
    const disciplineFilter = document.getElementById('discipline-filter');
    const gradeFilter = document.getElementById('grade-filter');
    
    // Lists
    const sourcesList = document.getElementById('sources-list');
    const lessonsList = document.getElementById('lessons-list');
    
    // Selected Items Storage
    let selectedSources = [];
    let selectedLessons = [];
    
    // Open Sources Library Modal
    sourcesLibraryButton.addEventListener('click', function() {
        console.log('Opening Sources Library Modal');
        sourcesLibraryModal.classList.add('active');
        loadSources();
    });
    
    // Open Lessons Library Modal
    lessonsLibraryButton.addEventListener('click', function() {
        console.log('Opening Lessons Library Modal');
        lessonsLibraryModal.classList.add('active');
        loadLessons();
    });
    
    // Close Modals
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            console.log('Closing modals');
            sourcesLibraryModal.classList.remove('active');
            lessonsLibraryModal.classList.remove('active');
        });
    });
    
    // Close Modal When Clicking Outside
    window.addEventListener('click', function(event) {
        if (event.target === sourcesLibraryModal) {
            sourcesLibraryModal.classList.remove('active');
        }
        if (event.target === lessonsLibraryModal) {
            lessonsLibraryModal.classList.remove('active');
        }
    });
    
    // Add Selected Sources
    addSelectedSourcesButton.addEventListener('click', function() {
        console.log('Add Selected Sources button clicked');
        const selectedSourceItems = document.querySelectorAll('#sources-list .source-item.selected');
        
        console.log(`Found ${selectedSourceItems.length} selected sources`);
        
        selectedSourceItems.forEach(item => {
            const sourceId = item.dataset.id;
            const sourceTitle = item.querySelector('.source-item-title').textContent;
            const sourceDescription = item.querySelector('.source-item-description').textContent;
            
            // Check if source is already selected
            if (!selectedSources.some(source => source.id === sourceId)) {
                selectedSources.push({
                    id: sourceId,
                    title: sourceTitle,
                    description: sourceDescription
                });
            }
        });
        
        updateSelectedSourcesList();
        sourcesLibraryModal.classList.remove('active');
    });
    
    // Add Selected Lessons
    addSelectedLessonsButton.addEventListener('click', function() {
        console.log('Add Selected Lessons button clicked');
        const selectedLessonItems = document.querySelectorAll('#lessons-list .lesson-item.selected');
        
        console.log(`Found ${selectedLessonItems.length} selected lessons`);
        
        selectedLessonItems.forEach(item => {
            const lessonId = item.dataset.id;
            const lessonTitle = item.querySelector('.lesson-item-title').textContent;
            const lessonDescription = item.querySelector('.lesson-item-description').textContent;
            
            // Check if lesson is already selected
            if (!selectedLessons.some(lesson => lesson.id === lessonId)) {
                selectedLessons.push({
                    id: lessonId,
                    title: lessonTitle,
                    description: lessonDescription
                });
            }
        });
        
        updateSelectedLessonsList();
        lessonsLibraryModal.classList.remove('active');
    });
    
    // Search Sources
    sourcesSearch.addEventListener('input', debounce(function() {
        loadSources();
    }, 300));
    
    // Filter Sources by Discipline
    disciplineFilter.addEventListener('change', function() {
        loadSources();
    });
    
    // Search Lessons
    lessonsSearch.addEventListener('input', debounce(function() {
        loadLessons();
    }, 300));
    
    // Filter Lessons by Grade
    gradeFilter.addEventListener('change', function() {
        loadLessons();
    });
    
    // Load Sources from API
    function loadSources() {
        const searchQuery = sourcesSearch.value.trim();
        const disciplineValue = disciplineFilter.value;
        
        // Show loading indicator
        sourcesList.innerHTML = `
            <div class="loading-indicator">
                <div class="spinner"></div>
                <p>טוען מקורות...</p>
            </div>
        `;
        
        // Simulate API call with setTimeout (replace with actual API call)
        setTimeout(() => {
            // Mock data - replace with actual API call
            const mockSources = [
                { id: 's1', title: 'מקור מתמטיקה 1', description: 'חומר לימוד במתמטיקה לכיתה ז', discipline: 'math', grade: '7' },
                { id: 's2', title: 'מקור מתמטיקה 2', description: 'חומר לימוד במתמטיקה לכיתה ח', discipline: 'math', grade: '8' },
                { id: 's3', title: 'מקור מדעים 1', description: 'חומר לימוד במדעים לכיתה ט', discipline: 'science', grade: '9' },
                { id: 's4', title: 'מקור היסטוריה 1', description: 'חומר לימוד בהיסטוריה לכיתה י', discipline: 'history', grade: '10' },
                { id: 's5', title: 'מקור ספרות 1', description: 'חומר לימוד בספרות לכיתה יא', discipline: 'literature', grade: '11' },
                { id: 's6', title: 'מקור אנגלית 1', description: 'חומר לימוד באנגלית לכיתה יב', discipline: 'english', grade: '12' }
            ];
            
            // Filter sources based on search and discipline
            let filteredSources = mockSources;
            
            if (searchQuery) {
                filteredSources = filteredSources.filter(source => 
                    source.title.includes(searchQuery) || 
                    source.description.includes(searchQuery)
                );
            }
            
            if (disciplineValue) {
                filteredSources = filteredSources.filter(source => 
                    source.discipline === disciplineValue
                );
            }
            
            // Render sources list
            if (filteredSources.length === 0) {
                sourcesList.innerHTML = `
                    <div class="no-items-message">
                        לא נמצאו מקורות מתאימים
                    </div>
                `;
            } else {
                sourcesList.innerHTML = filteredSources.map(source => `
                    <div class="source-item ${selectedSources.some(s => s.id === source.id) ? 'selected' : ''}" data-id="${source.id}">
                        <input type="checkbox" class="source-item-checkbox" ${selectedSources.some(s => s.id === source.id) ? 'checked' : ''}>
                        <div class="source-item-content">
                            <div class="source-item-title">${source.title}</div>
                            <div class="source-item-description">${source.description}</div>
                            <div class="source-item-meta">
                                <span>${getDisciplineName(source.discipline)}</span>
                                <span>כיתה ${source.grade}</span>
                            </div>
                        </div>
                    </div>
                `).join('');
                
                // Add click event to source items
                document.querySelectorAll('.source-item').forEach(item => {
                    item.addEventListener('click', function(e) {
                        console.log('Source item clicked:', this.dataset.id);
                        this.classList.toggle('selected');
                        const checkbox = this.querySelector('.source-item-checkbox');
                        checkbox.checked = this.classList.contains('selected');
                        
                        // Prevent checkbox from handling its own click event
                        if (e.target === checkbox) {
                            e.preventDefault();
                        }
                    });
                    
                    // Also add click event to the checkbox itself
                    const checkbox = item.querySelector('.source-item-checkbox');
                    if (checkbox) {
                        checkbox.addEventListener('click', function(e) {
                            e.stopPropagation(); // Prevent double-toggling
                            const parentItem = this.closest('.source-item');
                            parentItem.classList.toggle('selected');
                            this.checked = parentItem.classList.contains('selected');
                        });
                    }
                });
            }
        }, 500);
    }
    
    // Load Lessons from API
    function loadLessons() {
        const searchQuery = lessonsSearch.value.trim();
        const gradeValue = gradeFilter.value;
        
        // Show loading indicator
        lessonsList.innerHTML = `
            <div class="loading-indicator">
                <div class="spinner"></div>
                <p>טוען שיעורים...</p>
            </div>
        `;
        
        // Simulate API call with setTimeout (replace with actual API call)
        setTimeout(() => {
            // Mock data - replace with actual API call
            const mockLessons = [
                { id: 'l1', title: 'שיעור מתמטיקה 1', description: 'שיעור במתמטיקה לכיתה ז', discipline: 'math', grade: '7' },
                { id: 'l2', title: 'שיעור מתמטיקה 2', description: 'שיעור במתמטיקה לכיתה ח', discipline: 'math', grade: '8' },
                { id: 'l3', title: 'שיעור מדעים 1', description: 'שיעור במדעים לכיתה ט', discipline: 'science', grade: '9' },
                { id: 'l4', title: 'שיעור היסטוריה 1', description: 'שיעור בהיסטוריה לכיתה י', discipline: 'history', grade: '10' },
                { id: 'l5', title: 'שיעור ספרות 1', description: 'שיעור בספרות לכיתה יא', discipline: 'literature', grade: '11' },
                { id: 'l6', title: 'שיעור אנגלית 1', description: 'שיעור באנגלית לכיתה יב', discipline: 'english', grade: '12' }
            ];
            
            // Filter lessons based on search and grade
            let filteredLessons = mockLessons;
            
            if (searchQuery) {
                filteredLessons = filteredLessons.filter(lesson => 
                    lesson.title.includes(searchQuery) || 
                    lesson.description.includes(searchQuery)
                );
            }
            
            if (gradeValue) {
                filteredLessons = filteredLessons.filter(lesson => 
                    lesson.grade === gradeValue
                );
            }
            
            // Render lessons list
            if (filteredLessons.length === 0) {
                lessonsList.innerHTML = `
                    <div class="no-items-message">
                        לא נמצאו שיעורים מתאימים
                    </div>
                `;
            } else {
                lessonsList.innerHTML = filteredLessons.map(lesson => `
                    <div class="lesson-item ${selectedLessons.some(l => l.id === lesson.id) ? 'selected' : ''}" data-id="${lesson.id}">
                        <input type="checkbox" class="lesson-item-checkbox" ${selectedLessons.some(l => l.id === lesson.id) ? 'checked' : ''}>
                        <div class="lesson-item-content">
                            <div class="lesson-item-title">${lesson.title}</div>
                            <div class="lesson-item-description">${lesson.description}</div>
                            <div class="lesson-item-meta">
                                <span>${getDisciplineName(lesson.discipline)}</span>
                                <span>כיתה ${lesson.grade}</span>
                            </div>
                        </div>
                    </div>
                `).join('');
                
                // Add click event to lesson items
                document.querySelectorAll('.lesson-item').forEach(item => {
                    item.addEventListener('click', function(e) {
                        console.log('Lesson item clicked:', this.dataset.id);
                        this.classList.toggle('selected');
                        const checkbox = this.querySelector('.lesson-item-checkbox');
                        checkbox.checked = this.classList.contains('selected');
                        
                        // Prevent checkbox from handling its own click event
                        if (e.target === checkbox) {
                            e.preventDefault();
                        }
                    });
                    
                    // Also add click event to the checkbox itself
                    const checkbox = item.querySelector('.lesson-item-checkbox');
                    if (checkbox) {
                        checkbox.addEventListener('click', function(e) {
                            e.stopPropagation(); // Prevent double-toggling
                            const parentItem = this.closest('.lesson-item');
                            parentItem.classList.toggle('selected');
                            this.checked = parentItem.classList.contains('selected');
                        });
                    }
                });
            }
        }, 500);
    }
    
    // Update Selected Sources List
    function updateSelectedSourcesList() {
        if (selectedSources.length === 0) {
            selectedSourcesContainer.style.display = 'none';
        } else {
            selectedSourcesContainer.style.display = 'block';
            selectedSourcesList.innerHTML = selectedSources.map(source => `
                <div class="selected-item" data-id="${source.id}">
                    <div class="selected-item-info">
                        <div class="selected-item-title">${source.title}</div>
                        <div class="selected-item-description">${source.description}</div>
                    </div>
                    <button class="remove-selected-item" data-id="${source.id}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
            `).join('');
            
            // Add remove event to buttons
            document.querySelectorAll('#selected-sources-list .remove-selected-item').forEach(button => {
                button.addEventListener('click', function() {
                    const sourceId = this.dataset.id;
                    selectedSources = selectedSources.filter(source => source.id !== sourceId);
                    updateSelectedSourcesList();
                    
                    // Update summary
                    updateSummary();
                });
            });
            
            // Update summary
            updateSummary();
        }
    }
    
    // Update Selected Lessons List
    function updateSelectedLessonsList() {
        if (selectedLessons.length === 0) {
            selectedLessonsContainer.style.display = 'none';
        } else {
            selectedLessonsContainer.style.display = 'block';
            selectedLessonsList.innerHTML = selectedLessons.map(lesson => `
                <div class="selected-item" data-id="${lesson.id}">
                    <div class="selected-item-info">
                        <div class="selected-item-title">${lesson.title}</div>
                        <div class="selected-item-description">${lesson.description}</div>
                    </div>
                    <button class="remove-selected-item" data-id="${lesson.id}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
            `).join('');
            
            // Add remove event to buttons
            document.querySelectorAll('#selected-lessons-list .remove-selected-item').forEach(button => {
                button.addEventListener('click', function() {
                    const lessonId = this.dataset.id;
                    selectedLessons = selectedLessons.filter(lesson => lesson.id !== lessonId);
                    updateSelectedLessonsList();
                    
                    // Update summary
                    updateSummary();
                });
            });
            
            // Update summary
            updateSummary();
        }
    }
    
    // Update Summary
    function updateSummary() {
        const summarySourcesElement = document.getElementById('summary-sources');
        const summaryLessonsElement = document.getElementById('summary-lessons');
        
        if (selectedSources.length === 0) {
            summarySourcesElement.textContent = 'לא נבחרו מקורות';
        } else {
            summarySourcesElement.innerHTML = selectedSources.map(source => 
                `<div>${source.title}</div>`
            ).join('');
        }
        
        if (selectedLessons.length === 0) {
            summaryLessonsElement.textContent = 'לא נבחרו שיעורים';
        } else {
            summaryLessonsElement.innerHTML = selectedLessons.map(lesson => 
                `<div>${lesson.title}</div>`
            ).join('');
        }
    }
    
    // Helper function to get discipline name
    function getDisciplineName(disciplineCode) {
        const disciplines = {
            'math': 'מתמטיקה',
            'science': 'מדעים',
            'history': 'היסטוריה',
            'literature': 'ספרות',
            'english': 'אנגלית'
        };
        
        return disciplines[disciplineCode] || disciplineCode;
    }
    
    // Debounce function for search input
    function debounce(func, wait) {
        let timeout;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                func.apply(context, args);
            }, wait);
        };
    }

    // Prompt Chat Modal Functionality
    const promptChatButton = document.querySelector('.prompt-chat-button');
    const promptChatModal = document.getElementById('prompt-chat-modal');
    const promptChatMessages = document.getElementById('prompt-chat-messages');
    const promptChatInput = document.getElementById('prompt-chat-input');
    const promptChatSend = document.getElementById('prompt-chat-send');
    const applySystemPromptButton = document.getElementById('apply-system-prompt');
    const systemPromptTextarea = document.getElementById('system-prompt');

    // Generated system prompt
    let generatedSystemPrompt = '';

    // Chat state
    let chatState = {
        step: 0,
        answers: {},
        complete: false
    };

    // Questions to ask
    const chatQuestions = [
        "שלום! אני אעזור לך ליצור פרומפט מותאם אישית למלווה הלמידה שלך. מהו התחום העיקרי שהמלווה יעסוק בו?",
        "מצוין! לאיזו קבוצת גיל המלווה מיועד?",
        "איך היית רוצה שהמלווה יתקשר עם התלמידים? (למשל: רשמי, ידידותי, מעודד, מאתגר)",
        "האם יש מיומנויות או נושאים ספציפיים שהמלווה צריך להתמקד בהם?",
        "האם יש גישה פדגוגית מסוימת שהמלווה צריך לאמץ?"
    ];

    // Open Prompt Chat Modal
    promptChatButton.addEventListener('click', function() {
        promptChatModal.classList.add('active');
        
        // Reset chat if it was completed before
        if (chatState.complete) {
            resetChat();
        }
        
        // Start the chat if it's new
        if (chatState.step === 0) {
            setTimeout(() => {
                addBotMessage(chatQuestions[0]);
                chatState.step = 1;
            }, 500);
        }
        
        // Ensure the input is visible and focused
        setTimeout(() => {
            promptChatInput.focus();
        }, 300);
    });

    // Close Prompt Chat Modal
    promptChatModal.querySelectorAll('.close-modal-button, .cancel-button').forEach(button => {
        button.addEventListener('click', function() {
            promptChatModal.classList.remove('active');
        });
    });

    // Send message when clicking send button
    promptChatSend.addEventListener('click', sendUserMessage);

    // Send message when pressing Enter
    promptChatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendUserMessage();
        }
    });

    // Apply generated system prompt
    applySystemPromptButton.addEventListener('click', function() {
        if (generatedSystemPrompt) {
            systemPromptTextarea.value = generatedSystemPrompt;
            promptChatModal.classList.remove('active');
            
            // Also update the summary
            document.getElementById('summary-system-prompt').textContent = generatedSystemPrompt;
        }
    });

    // Function to send user message
    function sendUserMessage() {
        const message = promptChatInput.value.trim();
        if (message) {
            // Add user message to chat
            addUserMessage(message);
            
            // Clear input
            promptChatInput.value = '';
            
            // Store answer
            chatState.answers[`question${chatState.step}`] = message;
            
            // Show typing indicator
            showTypingIndicator();
            
            // Process next step
            setTimeout(() => {
                hideTypingIndicator();
                
                if (chatState.step < chatQuestions.length) {
                    // Show next question
                    addBotMessage(chatQuestions[chatState.step]);
                    chatState.step++;
                } else {
                    // Generate system prompt
                    generateSystemPrompt();
                }
            }, 1500);
        }
    }

    // Function to add bot message
    function addBotMessage(message) {
        const messageElement = document.createElement('div');
        messageElement.className = 'chat-message bot-message';
        messageElement.textContent = message;
        promptChatMessages.appendChild(messageElement);
        scrollToBottom();
    }

    // Function to add user message
    function addUserMessage(message) {
        const messageElement = document.createElement('div');
        messageElement.className = 'chat-message user-message';
        messageElement.textContent = message;
        promptChatMessages.appendChild(messageElement);
        scrollToBottom();
    }

    // Function to show typing indicator
    function showTypingIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'typing-indicator';
        indicator.innerHTML = '<span></span><span></span><span></span>';
        indicator.id = 'typing-indicator';
        promptChatMessages.appendChild(indicator);
        scrollToBottom();
    }

    // Function to hide typing indicator
    function hideTypingIndicator() {
        const indicator = document.getElementById('typing-indicator');
        if (indicator) {
            indicator.remove();
        }
    }

    // Function to scroll chat to bottom - improved version
    function scrollToBottom() {
        // Use requestAnimationFrame to ensure DOM is updated before scrolling
        requestAnimationFrame(() => {
            promptChatMessages.scrollTo(0, promptChatMessages.scrollHeight);
        });
    }

    // Function to generate system prompt
    function generateSystemPrompt() {
        // In a real implementation, this would call your backend LLM
        // For now, we'll create a template-based prompt
        
        const subject = chatState.answers.question1 || '[תחום]';
        const ageGroup = chatState.answers.question2 || '[קבוצת גיל]';
        const communicationStyle = chatState.answers.question3 || '[סגנון תקשורת]';
        const specificTopics = chatState.answers.question4 || '[נושאים ספציפיים]';
        const pedagogicalApproach = chatState.answers.question5 || '[גישה פדגוגית]';
        
        generatedSystemPrompt = `אתה מלווה למידה מומחה ב${subject} עבור ${ageGroup}. 
        
תפקידך:
- לסייע לתלמידים להבין מושגים ב${subject}
- להסביר נושאים מורכבים בצורה ברורה ופשוטה
- לענות על שאלות בסגנון ${communicationStyle}
- להתמקד במיוחד ב${specificTopics}
- לאמץ גישה פדגוגית של ${pedagogicalApproach}

כאשר תלמיד שואל שאלה:
1. הבן את מהות השאלה
2. ספק הסבר ברור ומותאם לרמת התלמיד
3. הוסף דוגמאות רלוונטיות כשנדרש
4. עודד חשיבה ביקורתית
5. הצע שאלות המשך לבדיקת הבנה

אל תספק מידע שגוי. אם אינך בטוח בתשובה, ציין זאת בבירור.`;

        // Add the generated prompt to the chat
        addBotMessage("תודה על המידע! הנה הפרומפט המותאם אישית שיצרתי עבורך:");
        
        // Add system prompt preview
        const promptPreview = document.createElement('div');
        promptPreview.className = 'system-prompt-preview';
        promptPreview.textContent = generatedSystemPrompt;
        promptChatMessages.appendChild(promptPreview);
        
        // Mark chat as complete
        chatState.complete = true;
        
        scrollToBottom();
    }

    // Function to reset chat
    function resetChat() {
        // Clear chat messages
        promptChatMessages.innerHTML = '';
        
        // Reset chat state
        chatState = {
            step: 0,
            answers: {},
            complete: false
        };
        
        // Clear generated prompt
        generatedSystemPrompt = '';
    }
});

/**
 * Adjust heights to ensure wizard and chat preview are the same height
 */
function adjustHeights() {
    const chatPreview = document.querySelector('.chat-preview');
    const formContainer = document.querySelector('.form-container');
    const wizardContainer = document.querySelector('.wizard-container');
    
    if (chatPreview && formContainer) {
        // Reset heights first
        formContainer.style.height = '';
        chatPreview.style.height = '';
        
        // Get window height and header height
        const windowHeight = window.innerHeight;
        const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
        
        // Calculate available height
        const availableHeight = windowHeight - headerHeight - 20; // 20px for margins
        
        // Set heights
        formContainer.style.height = `${availableHeight}px`;
        chatPreview.style.height = `${availableHeight}px`;
        
        // Adjust step content to fill available space
        if (wizardContainer) {
            const wizardTabsHeight = document.querySelector('.wizard-tabs')?.offsetHeight || 0;
            const stepNavigationHeight = document.querySelector('.step-navigation')?.offsetHeight || 0;
            const stepTitleHeight = document.querySelector('.step-title')?.offsetHeight || 0;
            const stepDescHeight = document.querySelector('.step-description')?.offsetHeight || 0;
            
            const stepContentHeight = availableHeight - wizardTabsHeight - stepNavigationHeight - stepTitleHeight - stepDescHeight - 40; // 40px for padding
            
            const stepContent = document.querySelector('.step-content');
            if (stepContent) {
                stepContent.style.minHeight = `${stepContentHeight}px`;
            }
        }
    }
}

/**
 * Check if the device is mobile and show warning
 */
function checkMobileDevice() {
    const mobileWarning = document.querySelector('.mobile-warning');
    const container = document.querySelector('.container');
    
    if (window.innerWidth <= 768) {
        // Mobile device detected
        if (mobileWarning && container) {
            mobileWarning.style.display = 'flex';
            container.style.display = 'none';
        }
    } else {
        // Desktop device
        if (mobileWarning && container) {
            mobileWarning.style.display = 'none';
            container.style.display = 'block';
        }
    }
}

/**
 * Setup avatar sync with preview sidebar
 */
function setupAvatarSync(previewChatSidebar) {
    // Listen for changes to the selected avatar
    const avatarPreview = document.querySelector('.selected-avatar');
    
    if (avatarPreview && previewChatSidebar) {
        // Set initial avatar in preview
        updatePreviewAvatar(avatarPreview.src);
        
        // Create a MutationObserver to watch for changes to the avatar
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'src') {
                    updatePreviewAvatar(avatarPreview.src);
                }
            });
        });
        
        // Start observing the avatar preview
        observer.observe(avatarPreview, { attributes: true });
        
        // Listen for the custom avatar-updated event
        document.addEventListener('avatar-updated', (event) => {
            if (event.detail && event.detail.src) {
                updatePreviewAvatar(event.detail.src);
            }
        });
    }
    
    function updatePreviewAvatar(src) {
        // Update the avatar in the preview sidebar
        const previewAvatar = document.querySelector('.gpt-avatar-small-inner');
        const chatAvatar = document.querySelector('.gpt-avatar-large');
        
        if (previewAvatar) {
            previewAvatar.style.backgroundImage = `url(${src})`;
            previewAvatar.style.backgroundSize = 'cover';
            previewAvatar.style.backgroundPosition = 'center';
        }
        
        if (chatAvatar) {
            chatAvatar.innerHTML = '';
            const img = document.createElement('img');
            img.src = src;
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.borderRadius = '50%';
            img.style.objectFit = 'cover';
            chatAvatar.appendChild(img);
        }
    }
}

/**
 * Setup bot name sync with preview
 */
function setupBotNameSync(previewChatSidebar) {
    const botNameInput = document.getElementById('bot-name');
    const botDescriptionInput = document.getElementById('bot-description');
    
    if (botNameInput && previewChatSidebar) {
        // Initial update
        previewChatSidebar.updateBotInfo(
            botNameInput.value || 'מלווה חדש',
            botDescriptionInput?.value || 'ברוך הבא! אני כאן כדי לעזור לך ללמוד. איך אוכל לסייע לך היום?'
        );
        
        // Update on input
        botNameInput.addEventListener('input', () => {
            previewChatSidebar.updateBotInfo(
                botNameInput.value || 'מלווה חדש',
                botDescriptionInput?.value || 'ברוך הבא! אני כאן כדי לעזור לך ללמוד. איך אוכל לסייע לך היום?'
            );
        });
        
        if (botDescriptionInput) {
            botDescriptionInput.addEventListener('input', () => {
                previewChatSidebar.updateBotInfo(
                    botNameInput.value || 'מלווה חדש',
                    botDescriptionInput.value || 'ברוך הבא! אני כאן כדי לעזור לך ללמוד. איך אוכל לסייע לך היום?'
                );
            });
        }
    }
}

/**
 * Setup save and publish buttons
 */
function setupSavePublishButtons() {
    const saveButton = document.querySelector('.save-bot-button');
    const publishButton = document.querySelector('.publish-bot-button');
    
    if (saveButton) {
        saveButton.addEventListener('click', () => {
            showLoadingOverlay();
            
            // Simulate saving
            setTimeout(() => {
                hideLoadingOverlay();
                alert('המלווה נשמר בהצלחה!');
            }, 1500);
        });
    }
    
    if (publishButton) {
        publishButton.addEventListener('click', () => {
            showLoadingOverlay();
            
            // Simulate publishing
            setTimeout(() => {
                hideLoadingOverlay();
                alert('המלווה פורסם בהצלחה!');
            }, 1500);
        });
    }
}

/**
 * Show loading overlay
 */
function showLoadingOverlay() {
    const overlay = document.querySelector('.loading-overlay');
    if (overlay) {
        overlay.style.display = 'flex';
    }
}

/**
 * Hide loading overlay
 */
function hideLoadingOverlay() {
    const overlay = document.querySelector('.loading-overlay');
    if (overlay) {
        overlay.style.display = 'none';
    }
}