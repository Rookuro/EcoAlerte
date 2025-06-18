/**
 * EcoAlerte - Quiz JavaScript
 * Handles interactive quiz functionality, scoring, and results display
 */

class EcoQuiz {
    constructor() {
        this.currentQuestion = 1;
        this.totalQuestions = 5;
        this.answers = {};
        this.startTime = null;
        this.timer = null;
        this.timeElapsed = 0;
        
        // Initialize quiz when DOM is loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    /**
     * Initialize quiz functionality
     */
    init() {
        console.log('EcoQuiz initialized');
        
        // Cache DOM elements
        this.cacheElements();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Start quiz
        this.startQuiz();
    }

    /**
     * Cache frequently used DOM elements
     */
    cacheElements() {
        this.elements = {
            currentQuestionEl: document.getElementById('current-question'),
            progressBar: document.getElementById('progress-bar'),
            timerEl: document.getElementById('quiz-timer'),
            prevBtn: document.getElementById('prev-btn'),
            nextBtn: document.getElementById('next-btn'),
            submitBtn: document.getElementById('submit-btn'),
            questionCards: document.querySelectorAll('.question-card'),
            quizContainer: document.getElementById('quiz-container'),
            resultsSection: document.getElementById('quiz-results'),
            retryBtn: document.getElementById('retry-quiz')
        };
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Navigation buttons
        this.elements.prevBtn.addEventListener('click', () => this.previousQuestion());
        this.elements.nextBtn.addEventListener('click', () => this.nextQuestion());
        this.elements.submitBtn.addEventListener('click', () => this.submitQuiz());
        
        // Retry button
        if (this.elements.retryBtn) {
            this.elements.retryBtn.addEventListener('click', () => this.restartQuiz());
        }
        
        // Answer selection
        document.addEventListener('change', (e) => {
            if (e.target.type === 'radio') {
                this.handleAnswerSelection(e.target);
            }
        });
        
        // Keyboard navigation (accessibility)
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight' && !e.ctrlKey && !e.shiftKey) {
                this.nextQuestion();
            } else if (e.key === 'ArrowLeft' && !e.ctrlKey && !e.shiftKey) {
                this.previousQuestion();
            }
        });
    }

    /**
     * Start the quiz
     */
    startQuiz() {
        this.startTime = Date.now();
        this.currentQuestion = 1;
        this.answers = {};
        this.updateDisplay();
        this.startTimer();
        
        // Show first question
        this.showQuestion(1);
        
        // Focus on first answer for accessibility
        const firstAnswer = document.querySelector('.question-card.active input[type="radio"]');
        if (firstAnswer) {
            firstAnswer.focus();
        }
    }

    /**
     * Start the timer
     */
    startTimer() {
        this.timer = setInterval(() => {
            this.timeElapsed = Math.floor((Date.now() - this.startTime) / 1000);
            this.updateTimer();
        }, 1000);
    }

    /**
     * Update timer display
     */
    updateTimer() {
        const minutes = Math.floor(this.timeElapsed / 60);
        const seconds = this.timeElapsed % 60;
        const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        this.elements.timerEl.textContent = `⏱️ ${timeString}`;
    }

    /**
     * Handle answer selection
     */
    handleAnswerSelection(radio) {
        const questionName = radio.name;
        const value = radio.value;
        
        // Store answer
        this.answers[questionName] = value;
        
        // Visual feedback
        const answerOptions = document.querySelectorAll(`input[name="${questionName}"]`);
        answerOptions.forEach(option => {
            const label = option.closest('.answer-option');
            label.classList.remove('selected');
        });
        
        const selectedLabel = radio.closest('.answer-option');
        selectedLabel.classList.add('selected');
        
        // Add selection animation
        selectedLabel.style.transform = 'scale(1.02)';
        setTimeout(() => {
            selectedLabel.style.transform = 'scale(1)';
        }, 200);
        
        // Auto-advance after selection (with delay for user feedback)
        setTimeout(() => {
            if (this.currentQuestion < this.totalQuestions) {
                this.nextQuestion();
            } else {
                this.elements.submitBtn.focus();
            }
        }, 800);
    }

    /**
     * Show specific question
     */
    showQuestion(questionNumber) {
        // Hide all questions
        this.elements.questionCards.forEach(card => {
            card.classList.remove('active');
        });
        
        // Show current question
        const currentCard = document.querySelector(`[data-question="q${questionNumber}"]`);
        if (currentCard) {
            currentCard.classList.add('active');
            
            // Add entrance animation
            currentCard.style.opacity = '0';
            currentCard.style.transform = 'translateX(30px)';
            
            setTimeout(() => {
                currentCard.style.opacity = '1';
                currentCard.style.transform = 'translateX(0)';
            }, 100);
        }
    }

    /**
     * Update display elements
     */
    updateDisplay() {
        // Update question counter
        this.elements.currentQuestionEl.textContent = this.currentQuestion;
        
        // Update progress bar
        const progress = (this.currentQuestion / this.totalQuestions) * 100;
        this.elements.progressBar.style.width = `${progress}%`;
        
        // Update navigation buttons
        this.elements.prevBtn.disabled = this.currentQuestion === 1;
        
        if (this.currentQuestion === this.totalQuestions) {
            this.elements.nextBtn.style.display = 'none';
            this.elements.submitBtn.style.display = 'inline-block';
        } else {
            this.elements.nextBtn.style.display = 'inline-block';
            this.elements.submitBtn.style.display = 'none';
        }
    }

    /**
     * Go to previous question
     */
    previousQuestion() {
        if (this.currentQuestion > 1) {
            this.currentQuestion--;
            this.showQuestion(this.currentQuestion);
            this.updateDisplay();
        }
    }

    /**
     * Go to next question
     */
    nextQuestion() {
        if (this.currentQuestion < this.totalQuestions) {
            this.currentQuestion++;
            this.showQuestion(this.currentQuestion);
            this.updateDisplay();
        }
    }

    /**
     * Submit quiz and get results
     */
    async submitQuiz() {
        // Check if all questions are answered
        const unansweredQuestions = [];
        for (let i = 1; i <= this.totalQuestions; i++) {
            if (!this.answers[`q${i}`]) {
                unansweredQuestions.push(i);
            }
        }
        
        if (unansweredQuestions.length > 0) {
            EcoUtils.showNotification(
                `Veuillez répondre à toutes les questions. Questions manquantes: ${unansweredQuestions.join(', ')}`,
                'warning'
            );
            return;
        }
        
        // Stop timer
        clearInterval(this.timer);
        
        // Show loading state
        this.elements.submitBtn.disabled = true;
        this.elements.submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Calcul du score...';
        
        try {
            // Submit to backend
            const response = await fetch('/api/quiz/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    answers: this.answers,
                    timeElapsed: this.timeElapsed
                })
            });
            
            if (!response.ok) {
                throw new Error('Erreur lors de la soumission du quiz');
            }
            
            const results = await response.json();
            this.displayResults(results);
            
        } catch (error) {
            console.error('Quiz submission error:', error);
            EcoUtils.showNotification('Erreur lors de la soumission du quiz. Veuillez réessayer.', 'danger');
            
            // Reset submit button
            this.elements.submitBtn.disabled = false;
            this.elements.submitBtn.innerHTML = '<i class="fas fa-check"></i> Terminer le Quiz';
        }
    }

    /**
     * Display quiz results
     */
    displayResults(results) {
        // Hide quiz container
        this.elements.quizContainer.style.display = 'none';
        document.querySelector('.quiz-navigation').style.display = 'none';
        
        // Show results section
        this.elements.resultsSection.style.display = 'block';
        
        // Update results content
        document.getElementById('score-percentage').textContent = `${Math.round(results.percentage)}%`;
        document.getElementById('score-fraction').textContent = `${results.score}/${results.total}`;
        document.getElementById('eco-level').textContent = results.level;
        document.getElementById('results-message').textContent = results.message;
        
        // Update results icon and title based on score
        const resultsIcon = document.getElementById('results-emoji');
        const resultsTitle = document.getElementById('results-title');
        
        if (results.percentage >= 80) {
            resultsIcon.className = 'fas fa-trophy fa-4x text-warning';
            resultsTitle.textContent = 'Excellent ! 🏆';
        } else if (results.percentage >= 60) {
            resultsIcon.className = 'fas fa-medal fa-4x text-success';
            resultsTitle.textContent = 'Très bien ! 🥇';
        } else if (results.percentage >= 40) {
            resultsIcon.className = 'fas fa-thumbs-up fa-4x text-primary';
            resultsTitle.textContent = 'Pas mal ! 👍';
        } else {
            resultsIcon.className = 'fas fa-seedling fa-4x text-info';
            resultsTitle.textContent = 'C\'est un début ! 🌱';
        }
        
        // Create score chart
        this.createScoreChart(results.percentage);
        
        // Add completion time
        this.addCompletionTime();
        
        // Scroll to results
        this.elements.resultsSection.scrollIntoView({ behavior: 'smooth' });
        
        // Add confetti effect for high scores
        if (results.percentage >= 80) {
            this.showConfetti();
        }
    }

    /**
     * Create animated score chart
     */
    createScoreChart(percentage) {
        const canvas = document.getElementById('score-chart');
        const ctx = canvas.getContext('2d');
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Chart configuration
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = 80;
        const lineWidth = 12;
        
        // Background circle
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.strokeStyle = '#e9ecef';
        ctx.lineWidth = lineWidth;
        ctx.stroke();
        
        // Animated progress circle
        const startAngle = -Math.PI / 2;
        const endAngle = startAngle + (2 * Math.PI * percentage / 100);
        
        // Color based on score
        let color = '#28a745'; // Green
        if (percentage < 40) color = '#dc3545'; // Red
        else if (percentage < 60) color = '#fd7e14'; // Orange
        else if (percentage < 80) color = '#007bff'; // Blue
        
        // Animate the progress circle
        let currentAngle = startAngle;
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Background circle
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
            ctx.strokeStyle = '#e9ecef';
            ctx.lineWidth = lineWidth;
            ctx.stroke();
            
            // Progress circle
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, startAngle, currentAngle);
            ctx.strokeStyle = color;
            ctx.lineWidth = lineWidth;
            ctx.lineCap = 'round';
            ctx.stroke();
            
            currentAngle += (endAngle - startAngle) / 60; // 60 frames animation
            
            if (currentAngle < endAngle) {
                requestAnimationFrame(animate);
            }
        };
        
        setTimeout(animate, 500); // Start animation after delay
    }

    /**
     * Add completion time to results
     */
    addCompletionTime() {
        const minutes = Math.floor(this.timeElapsed / 60);
        const seconds = this.timeElapsed % 60;
        const timeString = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
        
        const timeElement = document.createElement('div');
        timeElement.className = 'completion-time mt-3';
        timeElement.innerHTML = `
            <small class="text-muted">
                <i class="fas fa-clock"></i> Temps de completion: ${timeString}
            </small>
        `;
        
        const resultsMessage = document.getElementById('results-message');
        resultsMessage.parentNode.insertBefore(timeElement, resultsMessage.nextSibling);
    }

    /**
     * Show confetti animation for high scores
     */
    showConfetti() {
        const colors = ['#28a745', '#007bff', '#fd7e14', '#e83e8c', '#6f42c1'];
        const confettiContainer = document.createElement('div');
        confettiContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 9999;
        `;
        document.body.appendChild(confettiContainer);
        
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: absolute;
                width: 10px;
                height: 10px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                left: ${Math.random() * 100}%;
                top: -10px;
                border-radius: 50%;
                animation: confetti-fall 3s linear forwards;
            `;
            confettiContainer.appendChild(confetti);
        }
        
        // Add CSS animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes confetti-fall {
                to {
                    transform: translateY(100vh) rotate(360deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
        
        // Clean up after animation
        setTimeout(() => {
            confettiContainer.remove();
            style.remove();
        }, 3000);
    }

    /**
     * Restart the quiz
     */
    restartQuiz() {
        // Reset state
        this.currentQuestion = 1;
        this.answers = {};
        this.timeElapsed = 0;
        
        // Clear timer
        if (this.timer) {
            clearInterval(this.timer);
        }
        
        // Reset UI
        this.elements.resultsSection.style.display = 'none';
        this.elements.quizContainer.style.display = 'block';
        document.querySelector('.quiz-navigation').style.display = 'flex';
        
        // Clear selections
        document.querySelectorAll('input[type="radio"]').forEach(radio => {
            radio.checked = false;
        });
        
        document.querySelectorAll('.answer-option').forEach(option => {
            option.classList.remove('selected');
        });
        
        // Reset submit button
        this.elements.submitBtn.disabled = false;
        this.elements.submitBtn.innerHTML = '<i class="fas fa-check"></i> Terminer le Quiz';
        
        // Start fresh
        this.startQuiz();
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// Initialize quiz when script loads
const quiz = new EcoQuiz();

// Export for global access
window.EcoQuiz = EcoQuiz;
