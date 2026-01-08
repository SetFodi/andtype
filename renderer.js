const state = {
    words: [],
    currentWordIndex: 0,
    currentLetterIndex: 0,
    isStarted: false,
    startTime: 0,
    timerInterval: null,
    timeLeft: 30,
    timeElapsed: 0,
    wordLimit: 0,
    mode: 'time', // 'time' or 'words'
    correctChars: 0,
    incorrectChars: 0,
    totalCharCount: 0,
    rawWpm: 0,
    isFinished: false,
    sessionKeyErrors: {},
    sessionKeyTotals: {}
};

const userStats = JSON.parse(localStorage.getItem('userStats')) || {
    testsTaken: 0,
    bestWpm: 0,
    totalWpm: 0,
    history: [],
    keyErrors: {},
    keyTotals: {}
};

const wordPool = [
    'the', 'be', 'of', 'and', 'a', 'to', 'in', 'he', 'have', 'it', 'that', 'for', 'they', 'i', 'with', 'as', 'not', 'on', 'she', 'at', 'by', 'this', 'we', 'you', 'do', 'but', 'from', 'or', 'which', 'one', 'would', 'all', 'will', 'there', 'say', 'who', 'make', 'when', 'can', 'more', 'if', 'no', 'man', 'out', 'other', 'so', 'what', 'time', 'up', 'go', 'about', 'than', 'into', 'could', 'state', 'only', 'new', 'year', 'some', 'take', 'come', 'these', 'know', 'see', 'use', 'get', 'like', 'then', 'first', 'any', 'work', 'now', 'may', 'such', 'give', 'over', 'think', 'most', 'even', 'find', 'day', 'also', 'after', 'way', 'many', 'must', 'look', 'before', 'great', 'back', 'through', 'long', 'where', 'much', 'should', 'well', 'people', 'down', 'own', 'just', 'because', 'good', 'each', 'those', 'feel', 'seem', 'how', 'high', 'too', 'place', 'little', 'world', 'very', 'still', 'nation', 'hand', 'old', 'life', 'tell', 'write', 'become', 'here', 'show', 'house', 'both', 'between', 'need', 'mean', 'call', 'develop', 'under', 'last', 'right', 'move', 'thing', 'general', 'school', 'never', 'same', 'another', 'begin', 'while', 'number', 'part', 'turn', 'real', 'leave', 'might', 'want', 'point', 'form', 'off', 'child', 'few', 'small', 'since', 'against', 'ask', 'late', 'home', 'interest', 'large', 'person', 'end', 'open', 'public', 'follow', 'during', 'present', 'without', 'again', 'hold', 'govern', 'around', 'possible', 'head', 'consider', 'word', 'program', 'problem', 'however', 'lead', 'system', 'set', 'order', 'eye', 'plan', 'run', 'keep', 'face', 'fact', 'group', 'play', 'stand', 'increase', 'early', 'course', 'change', 'help', 'line'
];

const elements = {
    wordsContainer: document.getElementById('words'),
    inputField: document.getElementById('input-field'),
    wpmDisplay: document.getElementById('wpm'),
    accuracyDisplay: document.getElementById('accuracy'),
    timerDisplay: document.getElementById('timer'),
    restartBtn: document.getElementById('restart-btn'),
    resultsModal: document.getElementById('results-modal'),
    finalWpm: document.getElementById('final-wpm'),
    finalAccuracy: document.getElementById('final-accuracy'),
    finalChars: document.getElementById('final-chars'),
    finalTime: document.getElementById('final-time'),
    restartModalBtn: document.getElementById('restart-modal-btn'),
    modeBtns: document.querySelectorAll('.mode-btn'),
    themeToggle: document.getElementById('theme-toggle'),
    themeDropdown: document.getElementById('theme-dropdown'),
    themeOptions: document.querySelectorAll('.theme-option'),
    caret: document.getElementById('caret'),
    profileBtn: document.getElementById('profile-btn'),
    profileModal: document.getElementById('profile-modal'),
    closeProfileBtn: document.getElementById('close-profile-btn'),
    resetStatsBtn: document.getElementById('reset-stats-btn'),
    loadingScreen: document.getElementById('loading-screen'),
    confirmModal: document.getElementById('confirm-modal'),
    cancelResetBtn: document.getElementById('cancel-reset-btn'),
    confirmResetBtn: document.getElementById('confirm-reset-btn'),

    // Profile Stats Elements
    pTests: document.getElementById('p-tests'),
    pBestWpm: document.getElementById('p-best-wpm'),
    pAvgWpm: document.getElementById('p-avg-wpm'),
    pHistoryList: document.getElementById('p-history-list'),
    pWeakKeys: document.getElementById('p-weak-keys')
};

function init() {
    setupEventListeners();
    loadTheme();
    updateProfileUI();
    resetGame();

    // Fancy Transition: Hide loading screen after 2.5s (to allow animation to finish)
    setTimeout(() => {
        if (elements.loadingScreen) {
            elements.loadingScreen.classList.add('hidden');
        }
    }, 2500);
}

function setupEventListeners() {
    elements.inputField.addEventListener('input', handleInput);
    elements.inputField.addEventListener('blur', () => elements.inputField.focus());
    document.addEventListener('keydown', () => elements.inputField.focus());

    // TAB to restart
    window.addEventListener('keydown', handleKeyDown);

    elements.restartBtn.addEventListener('click', resetGame);
    elements.restartModalBtn.addEventListener('click', () => {
        closeModal();
        resetGame();
    });

    elements.modeBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            elements.modeBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            state.mode = e.target.dataset.mode;
            const val = parseInt(e.target.dataset.value);
            if (state.mode === 'time') {
                state.timeLeft = val;
            } else {
                state.wordLimit = val;
            }
            resetGame();
        });
    });

    // Theme Logic
    elements.themeToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        elements.themeDropdown.classList.toggle('show');
    });

    document.addEventListener('click', (e) => {
        if (!elements.themeToggle.contains(e.target) && !elements.themeDropdown.contains(e.target)) {
            elements.themeDropdown.classList.remove('show');
        }
    });

    elements.themeOptions.forEach(opt => {
        opt.addEventListener('click', () => {
            const theme = opt.dataset.theme;
            setTheme(theme);
            elements.themeOptions.forEach(o => o.classList.remove('active'));
            opt.classList.add('active');
        });
    });

    // Profile Logic
    elements.profileBtn.addEventListener('click', openProfile);
    elements.closeProfileBtn.addEventListener('click', closeProfile);
    elements.profileModal.addEventListener('click', (e) => {
        if (e.target === elements.profileModal) closeProfile();
    });

    // Reset Stats Logic (Custom Modal)
    if (elements.resetStatsBtn) {
        elements.resetStatsBtn.addEventListener('click', () => {
            elements.confirmModal.classList.add('show');
        });
    }

    if (elements.cancelResetBtn) {
        elements.cancelResetBtn.addEventListener('click', () => {
            elements.confirmModal.classList.remove('show');
        });
    }

    if (elements.confirmResetBtn) {
        elements.confirmResetBtn.addEventListener('click', () => {
            resetStats();
            elements.confirmModal.classList.remove('show');
        });
    }

    // Modal overlay click close
    if (elements.confirmModal) {
        elements.confirmModal.addEventListener('click', (e) => {
            if (e.target === elements.confirmModal) {
                elements.confirmModal.classList.remove('show');
            }
        });
    }

    // Window Controls (IPC)
    document.getElementById('win-min')?.addEventListener('click', () => {
        window.electronAPI?.minimizeWindow();
    });
    document.getElementById('win-max')?.addEventListener('click', () => {
        window.electronAPI?.maximizeWindow();
    });
    document.getElementById('win-close')?.addEventListener('click', () => {
        window.electronAPI?.closeWindow();
    });
}

function handleKeyDown(e) {
    if (state.isFinished) return; // Modal state handled elsewhere typically

    // Tab to restart
    if (e.key === 'Tab') {
        e.preventDefault();
        resetGame();
        return;
    }

    // Handle space for word navigation
    if (e.key === ' ') {
        e.preventDefault();
        if (elements.inputField.value.length > 0) {
            moveToNextWord();
        }
    }
}

function resetGame() {
    state.isStarted = false;
    state.isFinished = false;
    state.currentWordIndex = 0;
    state.currentLetterIndex = 0;
    state.correctChars = 0;
    state.incorrectChars = 0;
    state.totalCharCount = 0;
    state.timeElapsed = 0;
    state.sessionKeyErrors = {};
    state.sessionKeyTotals = {};
    clearInterval(state.timerInterval);

    // Get current mode settings
    const activeBtn = document.querySelector('.mode-btn.active');
    const val = parseInt(activeBtn.dataset.value);

    if (state.mode === 'time') {
        state.timeLeft = val;
        elements.timerDisplay.textContent = val;
        // Generate enough words
        generateWords(200);
    } else {
        state.wordLimit = val;
        elements.timerDisplay.textContent = 0; // Show elapsed time for word mode
        generateWords(state.wordLimit);
    }

    elements.inputField.value = '';
    renderWords();
    updateCaretPosition();

    elements.wpmDisplay.textContent = '0';
    elements.accuracyDisplay.textContent = '100';
    elements.resultsModal.classList.remove('show');
    elements.inputField.focus();

    // Fade in elements
    document.querySelector('.stats-container').classList.add('active');
    elements.wordsContainer.style.opacity = '1';
}

function generateWords(count) {
    state.words = [];
    for (let i = 0; i < count; i++) {
        const randomIndex = Math.floor(Math.random() * wordPool.length);
        state.words.push(wordPool[randomIndex]);
    }
}

function renderWords() {
    elements.wordsContainer.innerHTML = '';
    state.words.forEach((wordText, index) => {
        const wordDiv = document.createElement('div');
        wordDiv.className = 'word';
        wordDiv.dataset.index = index;

        wordText.split('').forEach((char, charIndex) => {
            const charSpan = document.createElement('span');
            charSpan.className = 'letter';
            charSpan.textContent = char;
            charSpan.dataset.letterIndex = charIndex;
            wordDiv.appendChild(charSpan);
        });

        elements.wordsContainer.appendChild(wordDiv);
    });
}

function startTest() {
    state.isStarted = true;
    state.startTime = Date.now();

    state.timerInterval = setInterval(() => {
        if (state.mode === 'time') {
            state.timeLeft--;
            elements.timerDisplay.textContent = state.timeLeft;
            state.timeElapsed++;

            if (state.timeLeft <= 0) {
                finishTest();
            }
        } else {
            state.timeElapsed++; // Counting up in ms technically, we update per sec logic below
            // For word mode, we display time elapsed
            const elapsedSec = Math.floor((Date.now() - state.startTime) / 1000);
            elements.timerDisplay.textContent = elapsedSec;
        }

        // SMOOTH WPM
        updateLiveStats();
    }, 1000);
}

function handleInput(e) {
    if (state.isFinished) return;

    const inputValue = e.target.value;

    if (!state.isStarted && inputValue.length > 0) {
        startTest();
    }

    // Identify typed character for stats
    if (state.isStarted && inputValue.length > state.currentLetterIndex) {
        const typedChar = inputValue[inputValue.length - 1];
        const currentWord = state.words[state.currentWordIndex];
        const expectedChar = currentWord[inputValue.length - 1];

        // Track EXPECTED char stats
        if (expectedChar) {
            const key = expectedChar.toLowerCase();
            state.sessionKeyTotals[key] = (state.sessionKeyTotals[key] || 0) + 1;
            if (typedChar !== expectedChar) {
                state.sessionKeyErrors[key] = (state.sessionKeyErrors[key] || 0) + 1;
            }
        }
    }

    state.currentLetterIndex = inputValue.length;

    // Check current word formatting
    const currentWordDiv = elements.wordsContainer.children[state.currentWordIndex];
    const letters = currentWordDiv.querySelectorAll('.letter');

    letters.forEach((letterSpan, index) => {
        const char = inputValue[index];
        if (char == null) {
            letterSpan.className = 'letter';
        } else if (char === letterSpan.textContent) {
            letterSpan.className = 'letter correct';
        } else {
            letterSpan.className = 'letter incorrect';
        }
    });

    updateCaretPosition();

    // AUTO-FINISH LOGIC for Words Mode
    if (state.mode === 'words' && state.currentWordIndex === state.wordLimit - 1) {
        const currentWordText = state.words[state.currentWordIndex];
        if (inputValue.length === currentWordText.length) {
            const isCorrect = Array.from(letters).every(l => l.classList.contains('correct'));
            if (isCorrect) {
                state.correctChars += currentWordText.length;
                finishTest();
                return;
            }
        }
    }
}

function moveToNextWord() {
    const currentInput = elements.inputField.value.trim();
    const targetWord = state.words[state.currentWordIndex];
    let wordCorrectChars = 0;

    // Calculate stats for this word
    for (let i = 0; i < targetWord.length; i++) {
        if (currentInput[i] === targetWord[i]) {
            wordCorrectChars++;
        } else {
            state.incorrectChars++;
        }
    }

    state.correctChars += wordCorrectChars;
    // Count the spacebar as a correct character if we are moving to next word
    state.correctChars++;

    // Penalize missing chars
    if (currentInput.length < targetWord.length) {
        state.incorrectChars += (targetWord.length - currentInput.length);
    }

    state.totalCharCount += targetWord.length + 1;

    // Scroll lines if needed
    const currentWordDiv = elements.wordsContainer.children[state.currentWordIndex];
    const nextWordDiv = elements.wordsContainer.children[state.currentWordIndex + 1];

    if (currentWordDiv && nextWordDiv && currentWordDiv.offsetTop < nextWordDiv.offsetTop) {
        if (currentWordDiv.offsetTop > 60) {
            const scrollAmount = currentWordDiv.offsetTop - 10;
            elements.wordsContainer.scrollTop = scrollAmount;
            Array.from(elements.wordsContainer.children).forEach(child => {
                if (child.dataset.index < state.currentWordIndex) {
                    child.style.opacity = '0.5';
                }
            });
        }
    }

    state.currentWordIndex++;
    state.currentLetterIndex = 0;
    elements.inputField.value = '';

    if (state.mode === 'words' && state.currentWordIndex >= state.wordLimit) {
        finishTest();
    } else {
        updateCaretPosition();
        if (state.mode === 'time' && state.currentWordIndex > state.words.length - 20) {
            addMoreWords();
        }
    }
}

function addMoreWords() {
    for (let i = 0; i < 50; i++) {
        const randomIndex = Math.floor(Math.random() * wordPool.length);
        const word = wordPool[randomIndex];
        state.words.push(word);

        const wordElement = document.createElement('div');
        wordElement.className = 'word';
        wordElement.dataset.index = state.words.length - 1;

        word.split('').forEach((letter, letterIndex) => {
            const letterElement = document.createElement('span');
            letterElement.className = 'letter';
            letterElement.textContent = letter;
            letterElement.dataset.letterIndex = letterIndex;
            wordElement.appendChild(letterElement);
        });

        elements.wordsContainer.appendChild(wordElement);
    }
}

function updateCaretPosition() {
    // Safety check
    if (!elements.wordsContainer.children[state.currentWordIndex]) return;

    const currentWordDiv = elements.wordsContainer.children[state.currentWordIndex];
    const letters = currentWordDiv.querySelectorAll('.letter');

    // Safety check for letters array
    if (!letters) return;

    // Clamp index to prevent errors
    const safeIndex = Math.min(state.currentLetterIndex, letters.length);
    let targetEl = letters[safeIndex];

    // transitions
    elements.caret.style.transition = 'left 0.1s ease-out, top 0.1s ease-out';

    if (!targetEl) {
        // If typing beyond word length, stay at end
        if (letters.length > 0) {
            const last = letters[letters.length - 1];
            elements.caret.style.left = (last.offsetLeft + last.offsetWidth) + 'px';
            elements.caret.style.top = last.offsetTop + 'px';
        } else {
            // Empty word case (rare)
            elements.caret.style.left = currentWordDiv.offsetLeft + 'px';
            elements.caret.style.top = currentWordDiv.offsetTop + 'px';
        }
    } else {
        elements.caret.style.left = targetEl.offsetLeft + 'px';
        elements.caret.style.top = targetEl.offsetTop + 'px';
    }
}

function getCorrectCharsInCurrentWord() {
    if (!state.isStarted) return 0;
    const currentInput = elements.inputField.value;
    const currentWord = state.words[state.currentWordIndex];
    let correct = 0;
    const len = Math.min(currentInput.length, currentWord.length);
    for (let i = 0; i < len; i++) {
        if (currentInput[i] === currentWord[i]) correct++;
    }
    return correct;
}

function updateLiveStats() {
    const timeInMin = (Date.now() - state.startTime) / 60000;
    if (timeInMin > 0) {
        // Include correctly typed chars from the CURRENT word for live accuracy
        const currentWordCorrect = getCorrectCharsInCurrentWord();
        const totalCorrect = state.correctChars + currentWordCorrect;

        const wpm = Math.floor((totalCorrect / 5) / timeInMin);
        state.rawWpm = wpm;
        elements.wpmDisplay.textContent = wpm;
    }

    // Accuracy
    const totalTyped = state.correctChars + state.incorrectChars + elements.inputField.value.length;
    if (totalTyped > 0) {
        const currentWordCorrect = getCorrectCharsInCurrentWord();
        const totalCorrect = state.correctChars + currentWordCorrect;
        const acc = Math.floor((totalCorrect / totalTyped) * 100);
        elements.accuracyDisplay.textContent = acc;
    }
}

function finishTest() {
    clearInterval(state.timerInterval);
    state.isFinished = true;

    const timeTotalSeconds = (Date.now() - state.startTime) / 1000;
    const timeInMin = timeTotalSeconds / 60;

    // Final check includes current word only if fully correct?
    // Actually standard WPM counts all correct key presses.
    // But 'finishTest' usually implies time valid or word limit reached.
    // We will stick to the accumulated 'state.correctChars' which are validated words.
    // BUT if time ran out mid-word, we should count those chars?
    // Standard practice: Count only fully recognized words or chars?
    // MonkeyType counts chars.

    const currentWordCorrect = getCorrectCharsInCurrentWord();
    const finalTotalCorrect = state.correctChars + currentWordCorrect;

    const finalWpm = Math.round((finalTotalCorrect / 5) / timeInMin);
    const totalTyped = state.correctChars + state.incorrectChars + elements.inputField.value.length;
    const acc = totalTyped > 0 ? Math.round((finalTotalCorrect / totalTyped) * 100) : 100;

    saveUserStats(finalWpm, acc);

    elements.finalWpm.textContent = finalWpm;
    elements.finalAccuracy.textContent = acc + '%';
    elements.finalChars.textContent = `${finalTotalCorrect}/${totalTyped}`;
    elements.finalTime.textContent = Math.round(timeTotalSeconds) + 's';

    elements.resultsModal.classList.add('show');
    elements.restartModalBtn.focus();
}

// ------ Persistence & Stats Logic ------

function saveUserStats(wpm, acc) {
    userStats.testsTaken++;
    userStats.totalWpm += wpm;
    if (wpm > userStats.bestWpm) userStats.bestWpm = wpm;

    userStats.history.unshift({
        wpm: wpm,
        acc: acc,
        date: new Date().toLocaleDateString()
    });
    if (userStats.history.length > 50) userStats.history.pop();

    for (const [key, count] of Object.entries(state.sessionKeyErrors)) {
        userStats.keyErrors[key] = (userStats.keyErrors[key] || 0) + count;
    }
    for (const [key, count] of Object.entries(state.sessionKeyTotals)) {
        userStats.keyTotals[key] = (userStats.keyTotals[key] || 0) + count;
    }

    localStorage.setItem('userStats', JSON.stringify(userStats));
}

function resetStats() {
    userStats.testsTaken = 0;
    userStats.bestWpm = 0;
    userStats.totalWpm = 0;
    userStats.history = [];
    userStats.keyErrors = {};
    userStats.keyTotals = {};
    localStorage.setItem('userStats', JSON.stringify(userStats));
    updateProfileUI();
}

function openProfile() {
    updateProfileUI();
    elements.profileModal.classList.add('show');
}

function closeProfile() {
    elements.profileModal.classList.remove('show');
}

function closeModal() {
    elements.resultsModal.classList.remove('show');
}

function updateProfileUI() {
    elements.pTests.textContent = userStats.testsTaken;
    elements.pBestWpm.textContent = userStats.bestWpm;
    const avg = userStats.testsTaken > 0 ? Math.round(userStats.totalWpm / userStats.testsTaken) : 0;
    elements.pAvgWpm.textContent = avg;

    elements.pHistoryList.innerHTML = '';
    const recent = userStats.history.slice(0, 5);
    if (recent.length === 0) {
        elements.pHistoryList.innerHTML = '<div class="history-placeholder">No records yet</div>';
    } else {
        recent.forEach(run => {
            const dim = document.createElement('div');
            dim.className = 'history-item';
            if (run.wpm >= userStats.bestWpm && run.wpm > 0) dim.classList.add('best-run');
            dim.innerHTML = `
                <span class="run-wpm">${run.wpm} WPM</span>
                <span>${run.acc}% Acc</span>
                <span class="run-date">${run.date}</span>
            `;
            elements.pHistoryList.appendChild(dim);
        });
    }

    elements.pWeakKeys.innerHTML = '';
    const weakKeys = [];

    for (const key in userStats.keyTotals) {
        const total = userStats.keyTotals[key];
        const errors = userStats.keyErrors[key] || 0;

        if (total > 20) {
            const errorRate = errors / total;
            if (errorRate >= 0.10) {
                weakKeys.push({ key, rate: errorRate });
            }
        }
    }

    weakKeys.sort((a, b) => b.rate - a.rate);

    if (weakKeys.length === 0) {
        elements.pWeakKeys.innerHTML = '<span class="weak-key-placeholder">No weak keys found (Need > 20 attempts + 10% error rate).</span>';
    } else {
        weakKeys.slice(0, 8).forEach(item => {
            const k = document.createElement('div');
            k.className = 'weak-key';
            k.textContent = item.key.toUpperCase();
            k.title = `Error Rate: ${Math.round(item.rate * 100)}%`;
            elements.pWeakKeys.appendChild(k);
        });
    }
}

// ------ Theme & Keyboard Logic ------
function loadTheme() {
    const saved = localStorage.getItem('theme') || 'aura';
    setTheme(saved);
}

function setTheme(themeName) {
    document.documentElement.setAttribute('data-theme', themeName);
    localStorage.setItem('theme', themeName);
}

document.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();
    const btn = document.querySelector(`.key[data-key="${key}"]`);
    if (btn) btn.classList.add('active');
});

document.addEventListener('keyup', (e) => {
    const key = e.key.toLowerCase();
    const btn = document.querySelector(`.key[data-key="${key}"]`);
    if (btn) btn.classList.remove('active');
});

init();
