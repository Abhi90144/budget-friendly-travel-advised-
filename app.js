document.addEventListener('DOMContentLoaded', function() {
    const chatContainer = document.getElementById('chat-container');
    const chatForm = document.getElementById('chat-form');
    const userInput = document.getElementById('user-input');
    const themeToggle = document.getElementById('theme-toggle');
    
    // Add voice controls to the interface
    const voiceControlsContainer = document.querySelector('.voice-controls-container');
    const voiceControlsHtml = `
        <div class="voice-controls flex items-center justify-end space-x-2 p-2">
            <button id="voice-input-btn" class="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-all transform" title="Voice Input">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
            </button>
            <button id="text-to-speech-btn" class="p-2 rounded-full bg-green-500 text-white hover:bg-green-600 transition-all transform" title="Text to Speech Toggle">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
            </button>
            <div id="voice-status" class="text-sm font-medium text-gray-500 transition-all"></div>
        </div>
    `;
    
    // Insert voice controls into the container
    voiceControlsContainer.innerHTML = voiceControlsHtml;
    
    // Get voice control elements
    const voiceInputBtn = document.getElementById('voice-input-btn');
    const textToSpeechBtn = document.getElementById('text-to-speech-btn');
    const voiceStatus = document.getElementById('voice-status');
    
    // Add welcome message when the page loads
    setTimeout(() => {
        addWelcomeMessage();
    }, 500);
    
    // Function to add stylized welcome message
    function addWelcomeMessage() {
        const welcomeHtml = `
            <div class="flex mb-5">
                <div class="welcome-message">
                    <div class="flex items-center space-x-2 mb-3">
                        <div class="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white">
                            <i class="fas fa-plane text-lg"></i>
                        </div>
                        <div class="text-sm font-semibold text-blue-600 dark:text-blue-400">Budget Traveller</div>
                    </div>
                    <p class="text-xl font-bold mb-3">✈️ Welcome to your Budget Travel Companion!</p>
                    <p class="mb-3">I'm here to help you plan the perfect trip within your budget. Whether you're planning an international adventure or exploring your home country, I'll guide you every step of the way.</p>
                    <p class="mb-3">I can help with:</p>
                    <ul class="feature-list mb-4">
                        <li class="feature-item">Creating customized travel budgets</li>
                        <li class="feature-item">Finding accommodation options that fit your style</li>
                        <li class="feature-item">Suggesting transportation and food choices</li>
                        <li class="feature-item">Recommending activities and attractions</li>
                    </ul>
                    <p class="mb-4">Your adventure begins with a simple question - where would you like to travel?</p>
                    <div class="welcome-cta-container">
                        <button class="welcome-cta-button" id="start-planning-btn">
                            <i class="fas fa-map-marked-alt mr-2"></i> Start Planning My Trip
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        chatContainer.innerHTML = welcomeHtml;
        
        // Add event listener to the start planning button
        setTimeout(() => {
            const startPlanningBtn = document.getElementById('start-planning-btn');
            if (startPlanningBtn) {
                startPlanningBtn.addEventListener('click', function() {
                    askTripType();
                });
            }
        }, 100);
    }
    
    // Voice recognition setup
    let recognition = null;
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
        recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';
        
        recognition.onstart = function() {
            voiceStatus.textContent = "Listening...";
            voiceStatus.classList.add('text-blue-500');
            voiceInputBtn.classList.add('animate-pulse');
            voiceInputBtn.classList.add('bg-red-500');
            voiceInputBtn.classList.remove('bg-blue-500');
        };
        
        recognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript;
            userInput.value = transcript;
            voiceStatus.textContent = "";
            voiceInputBtn.classList.remove('animate-pulse');
            voiceInputBtn.classList.add('bg-blue-500');
            voiceInputBtn.classList.remove('bg-red-500');
            
            // Submit the form with the transcript
            setTimeout(() => {
                chatForm.dispatchEvent(new Event('submit'));
            }, 300);
        };
        
        recognition.onerror = function(event) {
            voiceStatus.textContent = "Error: " + event.error;
            voiceStatus.classList.add('text-red-500');
            voiceInputBtn.classList.remove('animate-pulse');
            voiceInputBtn.classList.add('bg-blue-500');
            voiceInputBtn.classList.remove('bg-red-500');
            
            setTimeout(() => {
                voiceStatus.textContent = "";
                voiceStatus.classList.remove('text-red-500');
            }, 3000);
        };
        
        recognition.onend = function() {
            voiceInputBtn.classList.remove('animate-pulse');
            voiceInputBtn.classList.add('bg-blue-500');
            voiceInputBtn.classList.remove('bg-red-500');
            voiceStatus.textContent = "";
            voiceStatus.classList.remove('text-blue-500');
        };
        
        // Voice input button event
        voiceInputBtn.addEventListener('click', function() {
            if (recognition) {
                recognition.start();
            } else {
                voiceStatus.textContent = "Voice recognition not available";
                voiceStatus.classList.add('text-red-500');
                setTimeout(() => {
                    voiceStatus.textContent = "";
                    voiceStatus.classList.remove('text-red-500');
                }, 3000);
            }
        });
    } else {
        voiceInputBtn.disabled = true;
        voiceInputBtn.classList.add('opacity-50');
        voiceInputBtn.title = "Voice recognition not supported in your browser";
    }
    
    // Text-to-speech setup
    let textToSpeechEnabled = false;
    let speechSynthesis = window.speechSynthesis;
    let speechVoice = null;
    
    // Initialize speech synthesis
    if (speechSynthesis) {
        // Initialize with default voice
        speechSynthesis.onvoiceschanged = function() {
            const voices = speechSynthesis.getVoices();
            // Try to find a female English voice
            speechVoice = voices.find(voice => voice.lang.includes('en') && voice.name.includes('Female')) 
                      || voices.find(voice => voice.lang.includes('en')) 
                      || voices[0];
        };
        
        // Trigger initial voice loading
        speechSynthesis.getVoices();
        
        // Text-to-speech toggle
        textToSpeechBtn.addEventListener('click', function() {
            textToSpeechEnabled = !textToSpeechEnabled;
            textToSpeechBtn.classList.toggle('bg-green-500');
            textToSpeechBtn.classList.toggle('bg-red-500');
            
            if (textToSpeechEnabled) {
                textToSpeechBtn.title = "Turn off Text to Speech";
                speakText("Text to speech is now enabled.");
                textToSpeechBtn.querySelector('svg').innerHTML = `
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                `;
            } else {
                textToSpeechBtn.title = "Turn on Text to Speech";
                speechSynthesis.cancel(); // Stop any current speech
                textToSpeechBtn.querySelector('svg').innerHTML = `
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                `;
            }
        });
    } else {
        textToSpeechBtn.disabled = true;
        textToSpeechBtn.classList.add('opacity-50');
        textToSpeechBtn.title = "Text to speech not supported in your browser";
    }
    
    // Function to speak text using Text-to-Speech
    function speakText(text) {
        if (textToSpeechEnabled && speechSynthesis && speechVoice) {
            // Clean the text by removing HTML tags and formatting
            const cleanText = text.replace(/<[^>]*>/g, '')
                                .replace(/\*\*(.*?)\*\*/g, '$1')
                                .replace(/\n/g, ' ');
            
            // Create speech utterance
            const utterance = new SpeechSynthesisUtterance(cleanText);
            utterance.voice = speechVoice;
            utterance.rate = 1.0;
            utterance.pitch = 1.0;
            
            // Speak the text
            speechSynthesis.speak(utterance);
        }
    }
    
    // Modify the addBotMessage function to include text-to-speech
    const originalAddBotMessage = addBotMessage;
    addBotMessage = function(message) {
        originalAddBotMessage(message);
        speakText(message);
    };
    
    // Travel data object to store user preferences
    let travelData = {
        tripType: null,          // 'international' or 'domestic'
        planType: null,           // 'quick' or 'detailed'
        currency: null,           // Selected currency
        sourceLocation: null,     // Where the user is traveling from
        destinationLocation: null, // Where the user is traveling to
        distance: null,           // Calculated distance between locations
        startDate: null,
        endDate: null,
        travelers: null,
        accommodation: null,
        transportation: null,
        foodPreference: null,
        activities: [],
        budget: null
    };
    
    // Budget estimates based on user preferences (daily costs per person)
    const budgetEstimates = {
        accommodation: {
            budget: { domestic: 50, international: 70 },
            mid_range: { domestic: 120, international: 150 },
            luxury: { domestic: 250, international: 350 }
        },
        transportation: {
            public: { domestic: 15, international: 20 },
            rental: { domestic: 40, international: 50 },
            private: { domestic: 80, international: 100 }
        },
        food: {
            budget: { domestic: 30, international: 40 },
            mid_range: { domestic: 60, international: 80 },
            local_cuisine: { domestic: 45, international: 60 }
        },
        activities: {
            sightseeing: { domestic: 20, international: 30 },
            adventure: { domestic: 50, international: 70 },
            cultural: { domestic: 30, international: 40 },
            relaxation: { domestic: 40, international: 60 }
        }
    };
    
    // Popular attractions by region
    const popularAttractions = {
        "Southeast Asia": [
            "Angkor Wat, Cambodia",
            "Bali Beaches, Indonesia",
            "Ha Long Bay, Vietnam",
            "Bangkok Grand Palace, Thailand",
            "Singapore Gardens by the Bay"
        ],
        "Europe": [
            "Eiffel Tower, Paris",
            "Colosseum, Rome",
            "Santorini Islands, Greece",
            "Sagrada Familia, Barcelona",
            "Neuschwanstein Castle, Germany"
        ],
        "North America": [
            "Grand Canyon, USA",
            "Niagara Falls, Canada/USA",
            "Golden Gate Bridge, San Francisco",
            "Times Square, New York",
            "Banff National Park, Canada"
        ],
        "South America": [
            "Machu Picchu, Peru",
            "Christ the Redeemer, Brazil",
            "Galapagos Islands, Ecuador",
            "Iguazu Falls, Argentina/Brazil",
            "Salar de Uyuni, Bolivia"
        ],
        "Asia": [
            "Great Wall of China",
            "Taj Mahal, India",
            "Mount Fuji, Japan",
            "Petra, Jordan",
            "Bora Bora, French Polynesia"
        ],
        "Africa": [
            "Pyramids of Giza, Egypt",
            "Victoria Falls, Zimbabwe/Zambia",
            "Serengeti National Park, Tanzania",
            "Marrakech Medina, Morocco",
            "Table Mountain, South Africa"
        ],
        "Australia/Oceania": [
            "Sydney Opera House, Australia",
            "Great Barrier Reef, Australia",
            "Milford Sound, New Zealand",
            "Bora Bora, French Polynesia",
            "Uluru/Ayers Rock, Australia"
        ],
        "Domestic": [
            "Local museums and historical sites",
            "National parks and natural attractions",
            "Cultural districts and markets",
            "Popular urban centers",
            "Local festivals and events"
        ]
    };
    
    // Conversation state tracking
    let conversationState = {
        waitingFor: null,         // What input we're waiting for from the user
        lastQuestion: null,       // The last question we asked
        options: [],               // Available options for the current question
        multipleAllowed: false    // Indicates if multiple selections are allowed
    };
    
    // Currency conversion rates
    const currencyRates = {
        'USD': 1,
        'INR': 83.28,
        'EUR': 0.92,
        'GBP': 0.79,
        'CAD': 1.35,
        'AUD': 1.52,
        'SGD': 1.35,
        'JPY': 149.82,
        'CNY': 7.25,
        'THB': 36.18,
        'VND': 25000,
        'IDR': 15750,
        'MYR': 4.47,
        'PHP': 56.80,
        'AED': 3.67,  // UAE Dirham
        'CHF': 0.90,  // Swiss Franc
        'HKD': 7.82,  // Hong Kong Dollar
        'NZD': 1.63,  // New Zealand Dollar
        'SEK': 10.43, // Swedish Krona
        'NOK': 10.56, // Norwegian Krone
        'DKK': 6.86,  // Danish Krone
        'ZAR': 18.62, // South African Rand
        'RUB': 92.35, // Russian Ruble
        'TRY': 32.14, // Turkish Lira
        'BRL': 5.06,  // Brazilian Real
        'MXN': 16.75, // Mexican Peso
        'PLN': 3.93,  // Polish Zloty
        'SAR': 3.75,  // Saudi Riyal
        'ILS': 3.68,  // Israeli Shekel
        'KRW': 1338.97, // South Korean Won
        'EGP': 47.69  // Egyptian Pound
    };
    
    // Currency symbols
    const currencySymbols = {
        'USD': '$',
        'INR': '₹',
        'EUR': '€',
        'GBP': '£',
        'CAD': 'C$',
        'AUD': 'A$',
        'SGD': 'S$',
        'JPY': '¥',
        'CNY': '¥',
        'THB': '฿',
        'VND': '₫',
        'IDR': 'Rp',
        'MYR': 'RM',
        'PHP': '₱',
        'AED': 'د.إ',
        'CHF': 'Fr',
        'HKD': 'HK$',
        'NZD': 'NZ$',
        'SEK': 'kr',
        'NOK': 'kr',
        'DKK': 'kr',
        'ZAR': 'R',
        'RUB': '₽',
        'TRY': '₺',
        'BRL': 'R$',
        'MXN': '$',
        'PLN': 'zł',
        'SAR': '﷼',
        'ILS': '₪',
        'KRW': '₩',
        'EGP': 'E£'
    };
    
    // Theme toggle functionality
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        
        // Update the icon
        const themeIcon = themeToggle.querySelector('i');
        if (document.body.classList.contains('dark-mode')) {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        } else {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
    });
    
    // Check for saved theme preference
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
    }
    
    // Handle form submission
    chatForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const message = userInput.value.trim();
        if (message) {
            addUserMessage(message);
            userInput.value = '';
            processUserInput(message);
        }
    });
    
    // Add user message to chat
    function addUserMessage(message) {
        const msgElement = document.createElement('div');
        msgElement.className = 'flex justify-end mb-3';
        msgElement.innerHTML = `
            <div class="user-message-container flex items-end">
                <div class="user-message">
                    ${escapeHtml(message)}
                </div>
                <div class="user-avatar w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white ml-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                </div>
            </div>
        `;
        chatContainer.appendChild(msgElement);
        scrollToBottom();
    }
    
    // Add bot message to chat
    function addBotMessage(message) {
        showTypingIndicator();
        
        setTimeout(() => {
            // Remove typing indicator
            const typingIndicator = document.querySelector('.typing-indicator-container');
            if (typingIndicator) {
                typingIndicator.remove();
            }
            
            const msgElement = document.createElement('div');
            msgElement.className = 'flex mb-3';
            msgElement.innerHTML = `
                <div class="bot-message-container flex items-end">
                    <div class="bot-avatar w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                    </div>
                    <div class="bot-message">
                        ${formatMessage(message)}
                    </div>
                </div>
            `;
            chatContainer.appendChild(msgElement);
            scrollToBottom();
        }, getRandomInt(800, 1500)); // Simulate typing delay
    }
    
    // Add bot message with options
    function addBotMessageWithOptions(message, options) {
        showTypingIndicator();
        
        setTimeout(() => {
            // Remove typing indicator
            const typingIndicator = document.querySelector('.typing-indicator-container');
            if (typingIndicator) {
                typingIndicator.remove();
            }
            
            const msgElement = document.createElement('div');
            msgElement.className = 'flex flex-col mb-3';
            
            const messageHtml = `
                <div class="flex items-start mb-2">
                    <div class="bot-avatar w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white mr-2 flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                    </div>
                    <div class="bot-message">
                        ${formatMessage(message)}
                    </div>
                </div>
            `;
            
            let optionsHtml = '<div class="options-container ml-10">';
            options.forEach(option => {
                optionsHtml += `
                    <button class="option-button flex items-center" data-value="${escapeHtml(option.value)}">
                        <span class="option-icon mr-2">▶</span>
                        <span>${escapeHtml(option.text)}</span>
                    </button>
                `;
            });
            optionsHtml += '</div>';
            
            msgElement.innerHTML = messageHtml + optionsHtml;
            chatContainer.appendChild(msgElement);
            
            // Save the options to conversation state
            conversationState.options = options;
            
            // Add click event listeners to option buttons
            msgElement.querySelectorAll('.option-button').forEach(button => {
                button.addEventListener('click', function() {
                    const value = this.getAttribute('data-value');
                    const text = this.querySelector('span:last-child').textContent.trim();
                    handleOptionClick(value, text);
                    
                    // Disable all option buttons in this message to prevent multiple selections
                    msgElement.querySelectorAll('.option-button').forEach(btn => {
                        btn.disabled = true;
                        btn.classList.add('opacity-50');
                        btn.classList.remove('hover:bg-blue-100');
                    });
                });
            });
            
            scrollToBottom();
        }, getRandomInt(800, 1500)); // Simulate typing delay
    }
    
    // Handle option clicks
    function handleOptionClick(value, text) {
        if (value === "back") {
            goBack();
            return;
        }
        
        if (conversationState.waitingFor === 'activities') {
            // For activities, we allow multiple selections
            if (!travelData.activities.includes(value)) {
                travelData.activities.push(value);
                addUserMessage(text);
                
                // If it's the first selection, show confirmation
                if (travelData.activities.length === 1) {
                    addBotMessage(`Great! I've added "${text}" to your activities. You can select more activities or type "done" when finished.`);
                } else {
                    // For subsequent selections, show the current list
                    const activitiesList = travelData.activities.map(activity => 
                        `- ${activity.replace('_', ' ').charAt(0).toUpperCase() + activity.replace('_', ' ').slice(1)}`
                    ).join('\n');
                    
                    addBotMessage(`I've added "${text}" to your activities. Your current activities:\n${activitiesList}\n\nYou can select more or type "done" when finished.`);
                }
            } else {
                addUserMessage(text);
                addBotMessage(`You've already selected "${text}". Please choose another activity or type "done" when finished.`);
            }
        } else {
            // For other types, process normally
            addUserMessage(text);
            handleSpecificInput(value, conversationState.waitingFor);
        }
    }
    
    // Show typing indicator
    function showTypingIndicator() {
        const typingElement = document.createElement('div');
        typingElement.className = 'typing-indicator-container flex mb-3';
        typingElement.innerHTML = `
            <div class="typing-indicator">
                <div class="flex items-center space-x-1">
                    <div class="typing-avatar flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                    </div>
                    <div class="flex items-center space-x-1">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            </div>
        `;
        chatContainer.appendChild(typingElement);
        scrollToBottom();
    }
    
    // Format message with basic markdown-like syntax
    function formatMessage(message) {
        // Replace **text** with <strong>text</strong>
        let formattedMessage = message.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        // Replace newlines with <br>
        formattedMessage = formattedMessage.replace(/\n/g, '<br>');
        
        return formattedMessage;
    }
    
    // Scroll to bottom of chat container
    function scrollToBottom() {
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }
    
    // Generate random integer in range
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    // Escape HTML to prevent XSS
    function escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
    
    // Currency conversion utility
    function convertCurrency(amountInUsd, targetCurrency) {
        if (!targetCurrency || targetCurrency === 'USD' || !amountInUsd) {
            return {
                value: parseFloat(amountInUsd) || 0,
                symbol: currencySymbols['USD'] || '$'
            };
        }
        
        const rate = currencyRates[targetCurrency] || 1;
        const symbol = currencySymbols[targetCurrency] || '$';
        
        // Handle NaN, infinite, or null values
        let amount = parseFloat(amountInUsd);
        if (isNaN(amount) || !isFinite(amount)) {
            amount = 0;
        }
        
        return {
            value: Math.round(amount * rate * 100) / 100,
            symbol: symbol
        };
    }
    
    // Format currency for display
    function formatCurrency(amountInUsd, targetCurrency) {
        const converted = convertCurrency(amountInUsd, targetCurrency);
        return `${converted.symbol}${converted.value.toLocaleString('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 2})}`;
    }
    
    // Calculate distance between two locations using Haversine formula
    function calculateDistance(source, destination) {
        // Mock coordinates for known locations (would use geocoding API in production)
        const locationCoords = {
            'new york': { lat: 40.7128, lng: -74.0060 },
            'london': { lat: 51.5074, lng: -0.1278 },
            'paris': { lat: 48.8566, lng: 2.3522 },
            'tokyo': { lat: 35.6762, lng: 139.6503 },
            'sydney': { lat: -33.8688, lng: 151.2093 },
            'mumbai': { lat: 19.0760, lng: 72.8777 },
            'delhi': { lat: 28.6139, lng: 77.2090 },
            'bangalore': { lat: 12.9716, lng: 77.5946 },
            'chennai': { lat: 13.0827, lng: 80.2707 },
            'hyderabad': { lat: 17.3850, lng: 78.4867 },
            'kolkata': { lat: 22.5726, lng: 88.3639 },
            'ongole': { lat: 15.5057, lng: 80.0499 },
            'kerala': { lat: 10.8505, lng: 76.2711 },
            'bangkok': { lat: 13.7563, lng: 100.5018 },
            'singapore': { lat: 1.3521, lng: 103.8198 },
            'dubai': { lat: 25.2048, lng: 55.2708 },
            'kuala lumpur': { lat: 3.1390, lng: 101.6869 }
        };
        
        // Default value if location is not found or computation fails
        let distanceKm = 500;
        
        try {
            source = source.toLowerCase();
            destination = destination.toLowerCase();
            
            // If we have the coordinates, calculate distance
            if (locationCoords[source] && locationCoords[destination]) {
                const R = 6371; // Earth's radius in km
                const dLat = toRad(locationCoords[destination].lat - locationCoords[source].lat);
                const dLng = toRad(locationCoords[destination].lng - locationCoords[source].lng);
                
                const a = 
                    Math.sin(dLat/2) * Math.sin(dLat/2) +
                    Math.cos(toRad(locationCoords[source].lat)) * Math.cos(toRad(locationCoords[destination].lat)) * 
                    Math.sin(dLng/2) * Math.sin(dLng/2);
                
                const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
                distanceKm = R * c;
            } else {
                // If we don't have coordinates, use a reasonable estimate based on location names
                if (source.includes('india') && destination.includes('india')) {
                    distanceKm = getRandomInt(500, 2000); // Within India
                } else if ((source.includes('india') && destination.includes('usa')) || 
                           (source.includes('usa') && destination.includes('india'))) {
                    distanceKm = getRandomInt(12000, 15000); // India to USA
                } else if ((source.includes('india') && destination.includes('europe')) || 
                           (source.includes('europe') && destination.includes('india'))) {
                    distanceKm = getRandomInt(6000, 8000); // India to Europe
                } else {
                    // Random reasonable distance
                    distanceKm = getRandomInt(1000, 10000);
                }
            }
        } catch (e) {
            console.error("Distance calculation error:", e);
            // Default value if calculation fails
            distanceKm = 1000;
        }
        
        return Math.round(distanceKm);
    }
    
    // Helper for distance calculation
    function toRad(value) {
        return value * Math.PI / 180;
    }
    
    // Process user input based on conversation state
    function processUserInput(message) {
        // If we're waiting for a specific input
        if (conversationState.waitingFor) {
            handleSpecificInput(message, conversationState.waitingFor);
            return;
        }
        
        // Check if this is a new conversation
        if (!travelData.tripType) {
            // Check if the message might already contain both source and destination
            const locationPair = extractLocationPair(message);
            if (locationPair) {
                travelData.sourceLocation = locationPair.source;
                travelData.destinationLocation = locationPair.destination;
                askTripType();
                return;
            }
            
            // Start the conversation flow
            askTripType();
            return;
        }
        
        // If we have trip type but not plan type
        if (travelData.tripType && !travelData.planType) {
            askPlanType();
            return;
        }
        
        // If we reach here, it's an open-ended message
        // Try to identify what the user is asking about
        if (message.toLowerCase().includes('currency') || message.toLowerCase().includes('money')) {
            askCurrencyPreference();
        } else if (message.toLowerCase().includes('destination') || message.toLowerCase().includes('where') || message.toLowerCase().includes('location')) {
            askSourceLocation();
        } else if (message.toLowerCase().includes('budget') || message.toLowerCase().includes('cost') || message.toLowerCase().includes('price')) {
            if (travelData.destinationLocation) {
                provideCostEstimate();
            } else {
                askSourceLocation();
            }
        } else {
            // Fallback response
            addBotMessage("I'm not sure what you're asking. Would you like to plan a new trip?");
        }
    }
    
    // Handle specific input based on what we're waiting for
    function handleSpecificInput(message, waitingFor) {
        if (message.toLowerCase() === 'back' || message === 'back') {
            goBack();
            return;
        }
        
        // Add check for the final stage to generate budget
        if (waitingFor === 'activities' && travelData.activities.length > 0) {
            const budget = calculateBudget();
            if (budget) {
                const budgetSummary = generateBudgetSummary();
                addBotMessage(budgetSummary);
                
                // Clear the waiting state since we've completed the flow
                conversationState.waitingFor = null;
                return;
            }
        }
        
        // Call the original function for other cases
        originalHandleSpecificInput(message, waitingFor);
    }
    
    // Extract currency from message
    function extractCurrency(message) {
        message = message.toUpperCase();
        for (const currency in currencyRates) {
            if (message.includes(currency)) {
                return currency;
            }
        }
        
        // Check for currency names
        if (message.includes('DOLLAR') || message.includes('USD')) return 'USD';
        if (message.includes('EURO') || message.includes('EUR')) return 'EUR';
        if (message.includes('POUND') || message.includes('GBP')) return 'GBP';
        if (message.includes('RUPEE') || message.includes('INR')) return 'INR';
        if (message.includes('YEN') || message.includes('JPY')) return 'JPY';
        
        return null;
    }
    
    // Extract locations from a message like "from X to Y"
    function extractLocationPair(message) {
        const fromToPattern = /(?:from|in)\s+([a-zA-Z\s]+)(?:\s+to|\s+and)\s+([a-zA-Z\s]+)/i;
        const match = message.match(fromToPattern);
        
        if (match && match.length >= 3) {
            return {
                source: match[1].trim(),
                destination: match[2].trim()
            };
        }
        
        return null;
    }
    
    // Parse date string
    function parseDate(dateString) {
        try {
            const formats = [
                'MM/DD/YYYY', 
                'DD/MM/YYYY', 
                'YYYY-MM-DD', 
                'MM-DD-YYYY',
                'DD-MM-YYYY'
            ];
            
            // Try different formats
            for (const format of formats) {
                const parts = dateString.split(/[\/\-\.]/);
                let year, month, day;
                
                if (format === 'MM/DD/YYYY' || format === 'MM-DD-YYYY') {
                    month = parseInt(parts[0]);
                    day = parseInt(parts[1]);
                    year = parseInt(parts[2]);
                } else if (format === 'DD/MM/YYYY' || format === 'DD-MM-YYYY') {
                    day = parseInt(parts[0]);
                    month = parseInt(parts[1]);
                    year = parseInt(parts[2]);
                } else if (format === 'YYYY-MM-DD') {
                    year = parseInt(parts[0]);
                    month = parseInt(parts[1]);
                    day = parseInt(parts[2]);
                }
                
                // Validate date components
                if (year >= 2023 && year <= 2030 && month >= 1 && month <= 12 && day >= 1 && day <= 31) {
                    // If validation passes, return a date string in ISO format
                    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
                }
            }
        } catch (e) {
            console.error("Date parsing error:", e);
        }
        
        return null;
    }
    
    // Start conversation by asking plan type
    function askPlanType() {
        conversationState.waitingFor = 'planType';
        addBotMessageWithOptions(
            "Welcome to the AI Travel Budget Planner! 🌍✈️ Do you want a quick budget travel plan or a detailed personalized itinerary?",
            [
                { text: "Quick Budget Plan", value: "quick" },
                { text: "Detailed Personalized Itinerary", value: "detailed" }
            ]
        );
    }
    
    // Ask for currency preference
    function askCurrencyPreference() {
        conversationState.waitingFor = 'currency';
        
        // Create currency option groups based on regions
        const popularCurrencies = [
            { text: "USD ($)", value: "USD" },
            { text: "EUR (€)", value: "EUR" },
            { text: "GBP (£)", value: "GBP" },
            { text: "INR (₹)", value: "INR" },
            { text: "JPY (¥)", value: "JPY" }
        ];
        
        const asianCurrencies = [
            { text: "CNY (¥) - Chinese Yuan", value: "CNY" },
            { text: "SGD (S$) - Singapore Dollar", value: "SGD" },
            { text: "THB (฿) - Thai Baht", value: "THB" },
            { text: "MYR (RM) - Malaysian Ringgit", value: "MYR" },
            { text: "IDR (Rp) - Indonesian Rupiah", value: "IDR" }
        ];
        
        const otherCurrencies = [
            { text: "AUD (A$) - Australian Dollar", value: "AUD" },
            { text: "CAD (C$) - Canadian Dollar", value: "CAD" },
            { text: "CHF (Fr) - Swiss Franc", value: "CHF" },
            { text: "AED (د.إ) - UAE Dirham", value: "AED" },
            { text: "More Currencies", value: "more_currencies" }
        ];
        
        // Determine which currencies to show based on trip type and destination
        let currencyOptions = [...popularCurrencies];
        
        // If it's an international trip, add more currency options
        if (travelData.tripType === 'international') {
            // If destination is in Asia, prioritize Asian currencies
            if (travelData.destinationLocation &&
                ['thailand', 'china', 'japan', 'singapore', 'malaysia', 'indonesia', 'vietnam']
                    .some(country => travelData.destinationLocation.toLowerCase().includes(country))) {
                currencyOptions = [...popularCurrencies, ...asianCurrencies];
            } else {
                currencyOptions = [...popularCurrencies, ...otherCurrencies];
            }
        }
        
        addBotMessageWithOptions(
            "Which currency would you like to see your budget in?",
            currencyOptions
        );
    }
    
    // Ask for source location
    function askSourceLocation() {
        conversationState.waitingFor = 'sourceLocation';
        addBotMessage("Where will you be traveling from?");
    }
    
    // Ask for destination location
    function askDestinationLocation() {
        conversationState.waitingFor = 'destinationLocation';
        addBotMessage(`Great! Where would you like to travel to from ${travelData.sourceLocation}?`);
    }
    
    // Ask for travel start date
    function askTravelDates() {
        conversationState.waitingFor = 'startDate';
        addBotMessage("When do you plan to start your trip? (Please provide a date in MM/DD/YYYY format)");
    }
    
    // Ask for travel end date
    function askEndDate() {
        conversationState.waitingFor = 'endDate';
        addBotMessage("When do you plan to return? (Please provide a date in MM/DD/YYYY format)");
    }
    
    // Ask for number of travelers
    function askTravelerCount() {
        conversationState.waitingFor = 'travelers';
        addBotMessageWithOptions(
            "How many travelers will be joining this trip?",
            [
                { text: "1", value: "1" },
                { text: "2", value: "2" },
                { text: "3", value: "3" },
                { text: "4", value: "4" },
                { text: "5+", value: "5" }
            ]
        );
    }
    
    // Ask for accommodation preference
    function askAccommodationPreference() {
        conversationState.waitingFor = 'accommodation';
        addBotMessageWithOptions(
            "What type of accommodation would you prefer?",
            [
                { text: "Budget/Hostel", value: "budget" },
                { text: "Standard/Mid-range Hotel", value: "standard" },
                { text: "Luxury Resort", value: "luxury" }
            ]
        );
    }
    
    // Ask for transportation preference
    function askTransportationPreference() {
        conversationState.waitingFor = 'transportation';
        
        // Prepare transportation options based on distance
        const options = [];
        
        // Always include these options
        options.push({ text: "Private Transportation (Taxi/Uber)", value: "private" });
        options.push({ text: "Public Transportation", value: "public" });
        
        // If traveling within same country, add train option
        if (isWithinSameCountry(travelData.sourceLocation, travelData.destinationLocation)) {
            options.push({ text: "Train", value: "train" });
        }
        
        // If distance is > 500km, add flight option
        if (travelData.distance > 500) {
            options.push({ text: "Flight", value: "flight" });
        }
        
        // Add self-drive option
        options.push({ text: "Self-drive/Rental", value: "rental" });
        
        addBotMessageWithOptions(
            "What type of transportation would you prefer?",
            options
        );
    }
    
    // Ask for food preference
    function askFoodPreference() {
        conversationState.waitingFor = 'food';
        addBotMessageWithOptions(
            "What's your food preference during the trip?",
            [
                { text: "Budget (Street Food/Self-catering)", value: "budget" },
                { text: "Standard (Mix of restaurants and local food)", value: "standard" },
                { text: "Fine Dining (High-end restaurants)", value: "luxury" }
            ]
        );
    }
    
    // Check if two locations are in the same country
    function isWithinSameCountry(source, destination) {
        if (!source || !destination) return false;
        
        // Basic country detection - this would be more robust with a real geocoding API
        const countries = [
            'india', 'usa', 'uk', 'japan', 'france', 'germany', 'italy', 'spain', 
            'china', 'australia', 'canada', 'brazil', 'russia', 'south africa'
        ];
        
        let sourceCountry = null;
        let destCountry = null;
        
        // Try to identify country from location name
        for (const country of countries) {
            if (source.toLowerCase().includes(country)) {
                sourceCountry = country;
            }
            if (destination.toLowerCase().includes(country)) {
                destCountry = country;
            }
        }
        
        // Handle Indian cities specifically
        const indianCities = [
            'mumbai', 'delhi', 'bangalore', 'chennai', 'hyderabad', 'kolkata',
            'jaipur', 'ahmedabad', 'pune', 'ongole', 'kerala', 'goa', 'kochi'
        ];
        
        let sourceIsIndian = indianCities.some(city => source.toLowerCase().includes(city));
        let destIsIndian = indianCities.some(city => destination.toLowerCase().includes(city));
        
        if (sourceIsIndian) sourceCountry = 'india';
        if (destIsIndian) destCountry = 'india';
        
        // Handle US cities
        const usCities = [
            'new york', 'los angeles', 'chicago', 'houston', 'phoenix', 'philadelphia',
            'san antonio', 'san diego', 'dallas', 'san jose'
        ];
        
        let sourceIsUS = usCities.some(city => source.toLowerCase().includes(city));
        let destIsUS = usCities.some(city => destination.toLowerCase().includes(city));
        
        if (sourceIsUS) sourceCountry = 'usa';
        if (destIsUS) destCountry = 'usa';
        
        // Check if both locations are in the same country
        return sourceCountry && destCountry && sourceCountry === destCountry;
    }
    
    // Provide a quick cost estimate
    function provideCostEstimate() {
        // Calculate costs based on destination and preferences
        const costs = calculateTravelCosts();
        
        // Format message
        let message = `🌍 **Travel Budget Estimate: ${travelData.sourceLocation} to ${travelData.destinationLocation}** 🌍\n\n`;
        
        // Show distance
        message += `Estimated Distance: ${travelData.distance} km\n\n`;
        
        // Suggest transportation based on distance
        message += `**Recommended Transportation Options:**\n`;
        
        if (travelData.distance < 200) {
            message += `- Bus or Car (approx. ${formatCurrency(costs.transportation.bus, travelData.currency)})\n`;
        } 
        
        if (isWithinSameCountry(travelData.sourceLocation, travelData.destinationLocation)) {
            message += `- Train (approx. ${formatCurrency(costs.transportation.train, travelData.currency)})\n`;
        }
        
        if (travelData.distance > 500) {
            message += `- Flight (approx. ${formatCurrency(costs.transportation.flight, travelData.currency)})\n`;
        }
        
        message += `\n**Estimated Costs:**\n`;
        message += `- Accommodation: ${formatCurrency(costs.accommodation, travelData.currency)}\n`;
        message += `- Transportation: ${formatCurrency(costs.transportation.total, travelData.currency)}\n`;
        message += `- Food: ${formatCurrency(costs.food, travelData.currency)}\n`;
        message += `\n**Total Estimated Cost: ${formatCurrency(costs.total, travelData.currency)}**`;
        
        addBotMessage(message);
    }

    // Ask trip type (international or domestic)
    function askTripType() {
        const options = [
            { text: "International Trip", value: "international" },
            { text: "Domestic Trip", value: "domestic" }
        ];
        
        const message = `
        <div class="trip-type-question">
            <p>First, tell me what type of trip you're planning:</p>
            <div class="trip-type-icons">
                <div class="trip-icon international-icon">
                    <i class="fas fa-globe-americas text-3xl text-blue-500"></i>
                    <span>International</span>
                </div>
                <div class="trip-icon domestic-icon">
                    <i class="fas fa-home text-3xl text-green-500"></i>
                    <span>Domestic</span>
                </div>
            </div>
        </div>`;
        
        addBotMessageWithOptions(message, options);
        conversationState.waitingFor = 'tripType';
    }

    // Ask for destination
    function askDestination() {
        const message = `Where would you like to travel${travelData.tripType === 'international' ? ' to' : ' within your country'}?`;
        addBotMessage(message);
        conversationState.waitingFor = 'destination';
    }

    // Ask for currency preference
    function askCurrency() {
        // Group currencies by region
        const currencies = {
            popular: [
                { text: "US Dollar (USD)", value: "USD" },
                { text: "Euro (EUR)", value: "EUR" },
                { text: "British Pound (GBP)", value: "GBP" },
                { text: "Japanese Yen (JPY)", value: "JPY" },
                { text: "Canadian Dollar (CAD)", value: "CAD" }
            ],
            asia: [
                { text: "Chinese Yuan (CNY)", value: "CNY" },
                { text: "Indian Rupee (INR)", value: "INR" },
                { text: "Singapore Dollar (SGD)", value: "SGD" },
                { text: "Thai Baht (THB)", value: "THB" },
                { text: "Malaysian Ringgit (MYR)", value: "MYR" },
                { text: "Vietnamese Dong (VND)", value: "VND" },
                { text: "Indonesian Rupiah (IDR)", value: "IDR" },
                { text: "Philippine Peso (PHP)", value: "PHP" }
            ],
            europe: [
                { text: "Swiss Franc (CHF)", value: "CHF" },
                { text: "Swedish Krona (SEK)", value: "SEK" },
                { text: "Norwegian Krone (NOK)", value: "NOK" },
                { text: "Danish Krone (DKK)", value: "DKK" },
                { text: "Polish Złoty (PLN)", value: "PLN" },
                { text: "Czech Koruna (CZK)", value: "CZK" },
                { text: "Hungarian Forint (HUF)", value: "HUF" }
            ],
            americas: [
                { text: "Mexican Peso (MXN)", value: "MXN" },
                { text: "Brazilian Real (BRL)", value: "BRL" },
                { text: "Argentine Peso (ARS)", value: "ARS" },
                { text: "Chilean Peso (CLP)", value: "CLP" },
                { text: "Colombian Peso (COP)", value: "COP" }
            ],
            oceania: [
                { text: "Australian Dollar (AUD)", value: "AUD" },
                { text: "New Zealand Dollar (NZD)", value: "NZD" }
            ],
            africa: [
                { text: "South African Rand (ZAR)", value: "ZAR" },
                { text: "Egyptian Pound (EGP)", value: "EGP" },
                { text: "Moroccan Dirham (MAD)", value: "MAD" },
                { text: "Nigerian Naira (NGN)", value: "NGN" },
                { text: "Kenyan Shilling (KES)", value: "KES" }
            ]
        };
        
        // Determine which currency options to show based on destination
        let options = [];
        
        if (travelData.tripType === 'domestic') {
            // For domestic trips, try to guess the local currency based on destination
            // This is a simplified version - in a real app, you'd use a more comprehensive mapping
            const destination = travelData.destinationLocation.toLowerCase();
            
            // Try to find the most relevant currency group based on destination
            let relevantGroup = 'popular';
            
            if (/china|japan|india|korea|singapore|thailand|malaysia|indonesia|vietnam|philippines|cambodia|laos|myanmar/i.test(destination)) {
                relevantGroup = 'asia';
            } else if (/france|germany|italy|spain|uk|europe|britain|england|scotland|ireland|switzerland|sweden|norway|denmark|finland|belgium|netherlands|poland|czech|austria|greece/i.test(destination)) {
                relevantGroup = 'europe';
            } else if (/australia|new zealand|fiji|samoa|tahiti|polynesia/i.test(destination)) {
                relevantGroup = 'oceania';
            } else if (/mexico|brazil|argentina|chile|colombia|peru|canada/i.test(destination)) {
                relevantGroup = 'americas';
            } else if (/south africa|egypt|morocco|nigeria|kenya|tanzania|ethiopia/i.test(destination)) {
                relevantGroup = 'africa';
            }
            
            // Add the most relevant group first, then popular currencies
            options = [...currencies[relevantGroup], ...currencies.popular];
        } else {
            // For international trips, include all currency options
            // Start with popular currencies
            options = [...currencies.popular];
            
            // Add currencies from all regions
            Object.keys(currencies).forEach(region => {
                if (region !== 'popular') {
                    options = [...options, ...currencies[region]];
                }
            });
        }
        
        // Remove duplicates
        options = options.filter((option, index, self) => 
            index === self.findIndex((o) => o.value === option.value)
        );
        
        // Add "back" option
        options = addBackOption(options);
        
        const message = `What currency would you like to use for your budget?`;
        addBotMessageWithOptions(message, options.slice(0, 10)); // Show only first 10 options to avoid overwhelming the user
        conversationState.waitingFor = 'currency';
    }

    // Format currency based on selected currency
    function formatCurrency(amount, currency = 'USD') {
        const currencyFormatter = new Intl.NumberFormat(undefined, {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        });
        
        try {
            return currencyFormatter.format(amount);
        } catch (error) {
            // Fallback to simple formatting if Intl is not supported or currency is invalid
            return currency + ' ' + Math.round(amount);
        }
    }

    // Generate budget summary with improved formatting and styling
    function generateBudgetSummary() {
        const budget = calculateBudget();
        if (!budget) return "I don't have enough information to calculate your budget yet.";
        
        const { dailyCost, totalCost, currency, days, travelers } = budget;
        
        // Get popular attractions
        const attractionInfo = getPopularAttractions(travelData.destinationLocation);
        const attractions = attractionInfo.attractions.slice(0, 3); // Get top 3 attractions
        
        // Format all strings for accommodation, transportation, food, and activities with proper capitalization
        const formatPreference = (str) => {
            return str.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        };
        
        let budgetSummary = `
    <div class="budget-summary-container">
        <h2 class="budget-title">Your ${travelData.tripType.charAt(0).toUpperCase() + travelData.tripType.slice(1)} Trip to ${travelData.destinationLocation}</h2>
        
        <div class="budget-overview">
            <div class="budget-overview-item">
                <i class="fas fa-calendar-alt"></i>
                <span><strong>${days}</strong> days</span>
            </div>
            <div class="budget-overview-item">
                <i class="fas fa-users"></i>
                <span><strong>${travelers}</strong> traveler${travelers > 1 ? 's' : ''}</span>
            </div>
            <div class="budget-overview-item">
                <i class="fas fa-plane-departure"></i>
                <span><strong>${travelData.tripType.charAt(0).toUpperCase() + travelData.tripType.slice(1)}</strong> trip</span>
            </div>
        </div>
        
        <div class="budget-total">
            <div class="budget-total-amount">${formatCurrency(totalCost, currency)}</div>
            <div class="budget-total-label">Total Estimated Cost</div>
            <div class="budget-daily-cost">
                <i class="fas fa-sun"></i> ${formatCurrency(dailyCost, currency)} per person per day
            </div>
        </div>
        
        <div class="budget-details">
            <h3 class="budget-section-title">Your Selections</h3>
            <div class="budget-selections">
                <div class="budget-selection-item">
                    <i class="fas fa-hotel"></i>
                    <div>
                        <strong>Accommodation:</strong> 
                        <span>${formatPreference(travelData.accommodation)}</span>
                    </div>
                </div>
                <div class="budget-selection-item">
                    <i class="fas fa-bus"></i>
                    <div>
                        <strong>Transportation:</strong>
                        <span>${formatPreference(travelData.transportation)}</span>
                    </div>
                </div>
                <div class="budget-selection-item">
                    <i class="fas fa-utensils"></i>
                    <div>
                        <strong>Food:</strong>
                        <span>${formatPreference(travelData.foodPreference)}</span>
                    </div>
                </div>
                <div class="budget-selection-item">
                    <i class="fas fa-hiking"></i>
                    <div>
                        <strong>Activities:</strong>
                        <span>${travelData.activities.map(a => formatPreference(a)).join(', ')}</span>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="attractions-container">
            <h3 class="budget-section-title">
                <i class="fas fa-map-marker-alt"></i>
                Popular Attractions in ${attractionInfo.region}
            </h3>
            <ul class="attractions-list">
                ${attractions.map(attr => `<li><i class="fas fa-star"></i> ${attr}</li>`).join('')}
            </ul>
        </div>
        
        <div class="budget-actions">
            <button class="budget-action-btn adjust-btn" data-action="adjust">
                <i class="fas fa-sliders-h"></i> Adjust Preferences
            </button>
            <button class="budget-action-btn details-btn" data-action="details">
                <i class="fas fa-info-circle"></i> More Details
            </button>
            <button class="budget-action-btn save-btn" data-action="save">
                <i class="fas fa-save"></i> Save Itinerary
            </button>
        </div>
    </div>`;

        return budgetSummary;
    }

    // Function to go back to previous question
    function goBack() {
        // Implementation will depend on how you track the current conversation state
        const currentStage = conversationState.waitingFor;
        
        let previousStage = null;
        
        // Determine the previous stage based on current stage
        switch(currentStage) {
            case 'tripType':
                // At the beginning, can't go back further
                addBotMessage("We're at the beginning of the planning process. Let's continue from here!");
                return;
            case 'destination':
                previousStage = 'tripType';
                break;
            case 'currency':
                previousStage = 'destination';
                break;
            case 'startDate':
                previousStage = 'currency';
                break;
            case 'endDate':
                previousStage = 'startDate';
                break;
            case 'travelers':
                previousStage = 'endDate';
                break;
            case 'accommodation':
                previousStage = 'travelers';
                break;
            case 'transportation':
                previousStage = 'accommodation';
                break;
            case 'foodPreference':
                previousStage = 'transportation';
                break;
            case 'activities':
                previousStage = 'foodPreference';
                break;
            default:
                // If we can't determine where to go back to, start over
                addBotMessage("I'm not sure where to go back to. Let's start fresh!");
                askTripType();
                return;
        }
        
        // Reset the current waiting state
        conversationState.waitingFor = null;
        
        // Go back to the previous step
        switch(previousStage) {
            case 'tripType':
                askTripType();
                break;
            case 'destination':
                askDestination();
                break;
            case 'currency':
                askCurrency();
                break;
            case 'startDate':
                askStartDate();
                break;
            case 'endDate':
                askEndDate();
                break;
            case 'travelers':
                askTravelers();
                break;
            case 'accommodation':
                askAccommodation();
                break;
            case 'transportation':
                askTransportation();
                break;
            case 'foodPreference':
                askFoodPreference();
                break;
        }
    }

    // Add a "Back" option to all option groups
    function addBackOption(options) {
        options.push({ text: "← Go Back", value: "back" });
        return options;
    }

    // Modify option-adding functions to include back option
    // For example, in askAccommodation:
    function askAccommodation() {
        const options = [
            { text: "Budget (Hostels, Guesthouses)", value: "budget" },
            { text: "Mid-range (3-star Hotels)", value: "mid_range" },
            { text: "Luxury (4-5 star Hotels)", value: "luxury" }
        ];
        
        addBotMessageWithOptions("What type of accommodation are you looking for?", addBackOption(options));
        conversationState.waitingFor = 'accommodation';
    }

    // Similar modifications to other ask* functions:
    function askTransportation() {
        const options = [
            { text: "Public Transport (Bus, Train, etc.)", value: "public" },
            { text: "Car/Scooter Rental", value: "rental" },
            { text: "Private Transfers/Taxis", value: "private" }
        ];
        
        addBotMessageWithOptions("How would you like to get around?", addBackOption(options));
        conversationState.waitingFor = 'transportation';
    }

    function askFoodPreference() {
        const options = [
            { text: "Budget (Street food, Self-catering)", value: "budget" },
            { text: "Mid-range Restaurants", value: "mid_range" },
            { text: "Local Cuisine Exploration", value: "local_cuisine" }
        ];
        
        addBotMessageWithOptions("What are your food preferences?", addBackOption(options));
        conversationState.waitingFor = 'foodPreference';
    }

    function askActivities() {
        const options = [
            { text: "Sightseeing & Museums", value: "sightseeing" },
            { text: "Adventure & Outdoor Activities", value: "adventure" },
            { text: "Cultural Experiences", value: "cultural" },
            { text: "Relaxation & Wellness", value: "relaxation" }
        ];
        
        addBotMessageWithOptions("What activities are you interested in? (You can select multiple)", addBackOption(options));
        conversationState.waitingFor = 'activities';
        conversationState.multipleAllowed = true;
    }

    // Modified handleSpecificInput to handle the "back" option
    const originalHandleSpecificInput = handleSpecificInput;
    handleSpecificInput = function(message, type) {
        if (message.toLowerCase() === 'back' || message === 'back') {
            goBack();
            return;
        }
        
        // Add check for the final stage to generate budget
        if (type === 'activities' && travelData.activities.length > 0 && message.toLowerCase() === 'done') {
            const budget = calculateBudget();
            if (budget) {
                const budgetSummary = generateBudgetSummary();
                addBotMessage(budgetSummary);
                
                // Clear the waiting state since we've completed the flow
                conversationState.waitingFor = null;
                return;
            }
        }
        
        // Call the original function for other cases
        originalHandleSpecificInput(message, type);
    };

    // Download button functionality
    const downloadBtn = document.getElementById('download-btn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function() {
            // Export conversation to text
            const chatMessages = document.querySelectorAll('.bot-message, .user-message');
            if (chatMessages.length === 0) {
                alert('There is no conversation to export yet.');
                return;
            }
            
            let conversationText = "Budget Traveller - Conversation Log\n";
            conversationText += "==================================\n\n";
            
            chatMessages.forEach(msg => {
                if (msg.classList.contains('bot-message')) {
                    conversationText += "🤖 Budget Traveller: " + msg.innerText.trim() + "\n\n";
                } else if (msg.classList.contains('user-message')) {
                    conversationText += "👤 You: " + msg.innerText.trim() + "\n\n";
                }
            });
            
            // Create blob and download
            const blob = new Blob([conversationText], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'budget-travel-plan.txt';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });
    }
});