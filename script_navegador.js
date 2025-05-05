document.addEventListener('DOMContentLoaded', () => {
    // --- 1. DOM References ---
    const quizSelectionDiv = document.getElementById('quiz-selection');
    const quizTopicSelect = document.getElementById('quiz-topic-select');
    const startQuizButton = document.getElementById('start-quiz-button');

    const quizContainerDiv = document.getElementById('quiz-container');
    const questionCounter = document.getElementById('question-counter');
    const questionText = document.getElementById('question-text');
    const answerOptionsDiv = document.getElementById('answer-options');
    const feedbackDiv = document.getElementById('feedback');
    const nextButton = document.getElementById('next-button');
    const intermediateStatsDiv = document.getElementById('intermediate-stats');

    const resultsContainerDiv = document.getElementById('results-container');
    const scoreText = document.getElementById('score-text');
    const restartButton = document.getElementById('restart-button');

    // --- Semaphore Variables ---
    let semaphoreContainer;
    let semaphoreTimers = [];
    const semaphoreColors = ['green', 'yellow', 'red'];
    const semaphoreIntervals = [15000, 15000]; // 15s then 15s

    // --- 2. State Variables ---
    let availableQuizzes = {};
    let currentQuizData = [];
    let currentQuestionIndex = 0;
    let score = 0;
    let answerSelected = false;

    // --- Helper function to shuffle an array ---
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    // --- Create or reset the semaphore indicator ---
    function initSemaphore() {
        // Remove existing
        if (semaphoreContainer) {
            semaphoreTimers.forEach(clearTimeout);
            semaphoreTimers = [];
            semaphoreContainer.remove();
        }
        // Create
        semaphoreContainer = document.createElement('div');
        semaphoreContainer.id = 'semaphore';
        semaphoreContainer.style.width = '20px';
        semaphoreContainer.style.height = '20px';
        semaphoreContainer.style.borderRadius = '50%';
        semaphoreContainer.style.margin = '10px auto';
        // Start green
        semaphoreContainer.style.backgroundColor = semaphoreColors[0];
        // Insert above question text
        quizContainerDiv.insertBefore(semaphoreContainer, questionText);

        // Schedule color changes
        let cumulative = 0;
        for (let i = 0; i < semaphoreIntervals.length; i++) {
            cumulative += semaphoreIntervals[i];
            const timer = setTimeout(() => {
                semaphoreContainer.style.backgroundColor = semaphoreColors[i + 1];
            }, cumulative);
            semaphoreTimers.push(timer);
        }
    }

    // --- 3. Populate Quiz Selection ---
    function populateQuizSelector() {
        if (typeof domande_a_risposta_chiusa_1 !== 'undefined') availableQuizzes['Modulo 1'] = domande_a_risposta_chiusa_1;
        if (typeof domande_a_risposta_chiusa_2 !== 'undefined') availableQuizzes['Modulo 2'] = domande_a_risposta_chiusa_2;
        if (typeof domande_a_risposta_chiusa_3 !== 'undefined') availableQuizzes['Modulo 3'] = domande_a_risposta_chiusa_3;
        if (typeof domande_a_risposta_chiusa_4 !== 'undefined') availableQuizzes['Modulo 4'] = domande_a_risposta_chiusa_4;
        if (typeof domande_a_risposta_chiusa_5 !== 'undefined') availableQuizzes['Modulo 5'] = domande_a_risposta_chiusa_5;
        if (typeof domande_a_risposta_chiusa_6 !== 'undefined') availableQuizzes['Modulo 6'] = domande_a_risposta_chiusa_6;
        if (typeof domande_a_risposta_chiusa_7 !== 'undefined') availableQuizzes['Modulo 7'] = domande_a_risposta_chiusa_7;
        if (typeof domande_a_risposta_chiusa_8 !== 'undefined') availableQuizzes['Modulo 8'] = domande_a_risposta_chiusa_8;

        quizTopicSelect.innerHTML = '<option value="">-- Elige un módulo --</option>';

        for (const topic in availableQuizzes) {
            if (Array.isArray(availableQuizzes[topic]) && availableQuizzes[topic].length > 0) {
                const option = document.createElement('option');
                option.value = topic;
                option.textContent = topic;
                quizTopicSelect.appendChild(option);
            } else {
                console.warn(`Quiz data for "${topic}" is empty or not an array.`);
            }
        }

        quizTopicSelect.addEventListener('change', () => {
            startQuizButton.disabled = quizTopicSelect.value === "";
        });
    }

    // --- 4. Quiz Logic Functions ---
    function startQuiz() {
        const selectedTopic = quizTopicSelect.value;
        if (!selectedTopic || !availableQuizzes[selectedTopic]) {
            alert("Por favor, selecciona un módulo válido.");
            return;
        }

        currentQuizData = [...availableQuizzes[selectedTopic]];
        shuffleArray(currentQuizData);

        currentQuestionIndex = 0;
        score = 0;
        answerSelected = false;

        quizSelectionDiv.classList.add('hidden');
        resultsContainerDiv.classList.add('hidden');
        quizContainerDiv.classList.remove('hidden');
        feedbackDiv.innerHTML = '';
        nextButton.classList.add('hidden');
        intermediateStatsDiv.classList.add('hidden');
        intermediateStatsDiv.innerHTML = '';

        displayQuestion();
    }

    function displayQuestion() {
        // Reset and start semaphore
        initSemaphore();

        answerSelected = false;
        feedbackDiv.innerHTML = '';
        feedbackDiv.className = '';
        nextButton.classList.add('hidden');
        intermediateStatsDiv.classList.add('hidden');

        if (currentQuestionIndex >= currentQuizData.length) {
            showResults();
            return;
        }

        const questionData = currentQuizData[currentQuestionIndex];
        questionCounter.textContent = `Pregunta ${currentQuestionIndex + 1} de ${currentQuizData.length}`;
        questionText.textContent = questionData.question;

        answerOptionsDiv.innerHTML = '';

        const answersToDisplay = [...questionData.answers];
        shuffleArray(answersToDisplay);

        answersToDisplay.forEach(answer => {
            const button = document.createElement('button');
            button.textContent = answer.text;
            button.addEventListener('click', () => selectAnswer(button, answer.correct === true));
            answerOptionsDiv.appendChild(button);
        });
    }

    function selectAnswer(buttonElement, isCorrect) {
        // Stop semaphore timers
        semaphoreTimers.forEach(clearTimeout);

        if (answerSelected) return;
        answerSelected = true;

        const allAnswerButtons = answerOptionsDiv.querySelectorAll('button');
        allAnswerButtons.forEach(btn => btn.disabled = true);

        if (isCorrect) {
            buttonElement.classList.add('correct');
            feedbackDiv.textContent = '¡Correcto!';
            feedbackDiv.className = 'feedback-correct';
            score++;
        } else {
            buttonElement.classList.add('incorrect');
            feedbackDiv.textContent = 'Incorrecto.';
            feedbackDiv.className = 'feedback-incorrect';
            const correctAnswerData = currentQuizData[currentQuestionIndex].answers.find(ans => ans.correct);
            if (correctAnswerData) {
                allAnswerButtons.forEach(btn => {
                    if (btn.textContent === correctAnswerData.text) btn.classList.add('correct');
                });
            }
        }

        const questionsAnsweredSoFar = currentQuestionIndex + 1;
        const isMilestone = questionsAnsweredSoFar % 10 === 0;
        const isNotLastQuestion = currentQuestionIndex < currentQuizData.length - 1;

        if (isMilestone && isNotLastQuestion) {
            const currentPercentage = Math.round((score / questionsAnsweredSoFar) * 100);
            intermediateStatsDiv.innerHTML = `📊 **Progreso (tras ${questionsAnsweredSoFar} preguntas):** Has acertado ${score} (${currentPercentage}%)`;
            intermediateStatsDiv.classList.remove('hidden');
        }

        if (currentQuestionIndex < currentQuizData.length - 1) {
            nextButton.classList.remove('hidden');
        } else {
            setTimeout(showResults, 1500);
        }
    }

    function nextQuestion() {
        currentQuestionIndex++;
        displayQuestion();
    }

    function showResults() {
        quizContainerDiv.classList.add('hidden');
        resultsContainerDiv.classList.remove('hidden');
        intermediateStatsDiv.classList.add('hidden');
        const percentage = currentQuizData.length > 0 ? Math.round((score / currentQuizData.length) * 100) : 0;
        scoreText.textContent = `Has acertado ${score} de ${currentQuizData.length} preguntas (${percentage}%).`;
    }

    function restartQuiz() {
        resultsContainerDiv.classList.add('hidden');
        quizContainerDiv.classList.add('hidden');
        intermediateStatsDiv.classList.add('hidden');
        quizSelectionDiv.classList.remove('hidden');
        quizTopicSelect.value = "";
        startQuizButton.disabled = true;
    }

    // --- 5. Event Listeners ---
    startQuizButton.addEventListener('click', startQuiz);
    nextButton.addEventListener('click', nextQuestion);
    restartButton.addEventListener('click', restartQuiz);

    // --- 6. Initial Setup ---
    populateQuizSelector();
});
