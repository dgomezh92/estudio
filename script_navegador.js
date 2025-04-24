
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
    // <<< NUEVA REFERENCIA DOM >>>
    const intermediateStatsDiv = document.getElementById('intermediate-stats');

    const resultsContainerDiv = document.getElementById('results-container');
    const scoreText = document.getElementById('score-text');
    const restartButton = document.getElementById('restart-button');

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

    // --- 3. Populate Quiz Selection ---
    function populateQuizSelector() {
      // (Código sin cambios aquí...)
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
                 console.warn(`Quiz data for "${topic}" (variable associated with it) is empty or not an array.`);
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

        currentQuizData = availableQuizzes[selectedTopic];
        // shuffleArray(currentQuizData); // Opcional: barajar preguntas

        currentQuestionIndex = 0;
        score = 0;
        answerSelected = false;

        quizSelectionDiv.classList.add('hidden');
        resultsContainerDiv.classList.add('hidden');
        quizContainerDiv.classList.remove('hidden');
        feedbackDiv.innerHTML = '';
        nextButton.classList.add('hidden');
        // <<< ASEGURAR QUE LAS ESTADÍSTICAS INTERMEDIAS ESTÉN OCULTAS AL INICIO >>>
        intermediateStatsDiv.classList.add('hidden');
        intermediateStatsDiv.innerHTML = ''; // Limpiar contenido anterior

        displayQuestion();
    }

    function displayQuestion() {
        answerSelected = false;
        feedbackDiv.innerHTML = '';
        feedbackDiv.className = '';
        nextButton.classList.add('hidden');
        // <<< OCULTAR ESTADÍSTICAS INTERMEDIAS AL MOSTRAR NUEVA PREGUNTA >>>
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
         if (answerSelected) return;
         answerSelected = true;

        const allAnswerButtons = answerOptionsDiv.querySelectorAll('button');
        allAnswerButtons.forEach(btn => btn.disabled = true);

        // Evaluar respuesta y actualizar puntuación/feedback (sin cambios aquí)
        if (isCorrect) {
            buttonElement.classList.add('correct');
            feedbackDiv.textContent = '¡Correcto!';
            feedbackDiv.className = 'feedback-correct';
            score++;
        } else {
            buttonElement.classList.add('incorrect');
            feedbackDiv.textContent = 'Incorrecto.';
            feedbackDiv.className = 'feedback-incorrect';
            const correctAnswerData = currentQuizData[currentQuestionIndex].answers.find(ans => ans.correct === true);
            if (correctAnswerData) {
                 allAnswerButtons.forEach(btn => {
                    if (btn.textContent === correctAnswerData.text) {
                        btn.classList.add('correct');
                    }
                 });
            }
        }

        // --- <<< INICIO: LÓGICA PARA ESTADÍSTICAS CADA 30 PREGUNTAS >>> ---
        const questionsAnsweredSoFar = currentQuestionIndex + 1;
        const isMilestone = questionsAnsweredSoFar % 30 === 0;
        const isNotLastQuestion = currentQuestionIndex < currentQuizData.length - 1;

        if (isMilestone && isNotLastQuestion) {
            const currentPercentage = Math.round((score / questionsAnsweredSoFar) * 100);
            intermediateStatsDiv.innerHTML = `📊 **Progreso (tras ${questionsAnsweredSoFar} preguntas):** Has acertado ${score} (${currentPercentage}%)`;
            intermediateStatsDiv.classList.remove('hidden');
        } else {
            // Asegurarse de que esté oculto si no es un hito
            intermediateStatsDiv.classList.add('hidden');
        }
        // --- <<< FIN: LÓGICA PARA ESTADÍSTICAS CADA 30 PREGUNTAS >>> ---


        // Mostrar el botón "Siguiente" o los resultados finales (sin cambios aquí)
        if (currentQuestionIndex < currentQuizData.length - 1) {
            nextButton.classList.remove('hidden');
        } else {
            setTimeout(showResults, 1500); // Esperar antes de mostrar resultados finales
        }
    }

    function nextQuestion() {
        currentQuestionIndex++;
        displayQuestion(); // Esto ocultará las stats intermedias y mostrará la sig. pregunta
    }

    function showResults() {
        quizContainerDiv.classList.add('hidden');
        resultsContainerDiv.classList.remove('hidden');
        // <<< OCULTAR STATS INTERMEDIAS AL MOSTRAR RESULTADOS FINALES >>>
        intermediateStatsDiv.classList.add('hidden');
        const percentage = currentQuizData.length > 0 ? Math.round((score / currentQuizData.length) * 100) : 0;
        scoreText.textContent = `Has acertado ${score} de ${currentQuizData.length} preguntas (${percentage}%).`;
    }

    function restartQuiz() {
        resultsContainerDiv.classList.add('hidden');
        quizContainerDiv.classList.add('hidden');
        // <<< OCULTAR STATS INTERMEDIAS AL REINICIAR >>>
        intermediateStatsDiv.classList.add('hidden');
        quizSelectionDiv.classList.remove('hidden');
        quizTopicSelect.value = "";
        startQuizButton.disabled = true;
        // populateQuizSelector(); // Opcional: re-barajar módulos
    }

    // --- 5. Event Listeners ---
    startQuizButton.addEventListener('click', startQuiz);
    nextButton.addEventListener('click', nextQuestion);
    restartButton.addEventListener('click', restartQuiz);

    // --- 6. Initial Setup ---
    populateQuizSelector();

}); // End DOMContentLoaded
