/**
 * UI Module
 * Handles all UI interactions and updates
 */

const UI = {
    // Create problem card
    createProblemCard(problem) {
        const card = document.createElement('div');
        card.className = 'problem-card';
        card.setAttribute('role', 'listitem');
        card.onclick = () => this.openProblemModal(problem);
        
        const difficultyClass = `difficulty-${problem.difficulty}`;
        card.innerHTML = `
            <h4>${Utils.escapeHtml(problem.title)}</h4>
            <p>${Utils.escapeHtml(problem.description)}</p>
            <div class="flex items-center justify-between mt-4">
                <span class="difficulty-badge ${difficultyClass}">${problem.difficulty.toUpperCase()}</span>
                <span class="text-sm text-secondary">${problem.points || 10} pts</span>
            </div>
        `;
        return card;
    },

    // Create video item
    createVideoItem(video) {
        const item = document.createElement('div');
        item.className = 'video-item';
        item.setAttribute('role', 'listitem');
        item.innerHTML = `
            <div class="video-info">
                <h4>${Utils.escapeHtml(video.title)}</h4>
                <p>${Utils.escapeHtml(video.description)} • ${video.duration}</p>
            </div>
            <a href="${video.url}" target="_blank" rel="noopener noreferrer" class="video-link">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                <span>Watch</span>
            </a>
        `;
        return item;
    },

    // Create test card
    createTestCard(test) {
        const card = document.createElement('div');
        card.className = 'test-card';
        card.setAttribute('role', 'listitem');
        card.innerHTML = `
            <h3>${Utils.escapeHtml(test.title)}</h3>
            <p>${Utils.escapeHtml(test.description)}</p>
            <div class="test-meta">
                <span>📝 ${test.questions} questions</span>
                <span>⏱️ ${test.duration} minutes</span>
                ${test.difficulty ? `<span>📊 ${test.difficulty}</span>` : ''}
            </div>
            <button class="start-test-btn" onclick="App.startTest('${test.id}')">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                <span>Start Test</span>
            </button>
        `;
        return card;
    },

    // Create exam card
    createExamCard(exam) {
        const card = document.createElement('div');
        card.className = 'exam-card';
        card.setAttribute('role', 'listitem');
        const subjects = exam.subjects.join(', ');
        card.innerHTML = `
            <h3>${Utils.escapeHtml(exam.title)}</h3>
            <p>${Utils.escapeHtml(exam.description)}</p>
            <div class="test-meta">
                <span>📚 ${subjects}</span>
            </div>
            <div class="test-meta">
                <span>📝 ${exam.questions} questions</span>
                <span>⏱️ ${exam.duration} minutes</span>
            </div>
            <button class="start-test-btn" onclick="App.startExam('${exam.id}')">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                <span>Start Exam</span>
            </button>
        `;
        return card;
    },

    // Open problem modal
    openProblemModal(problem) {
        const modal = document.getElementById('problemModal');
        if (!modal) return;
        
        document.getElementById('modalTitle').textContent = problem.title;
        
        const questionImg = document.getElementById('questionImage');
        const answerImg = document.getElementById('answerImage');
        
        questionImg.src = problem.questionImage;
        questionImg.alt = `Question for ${problem.title}`;
        
        answerImg.src = problem.answerImage;
        answerImg.alt = `Solution for ${problem.title}`;
        answerImg.classList.add('blurred');
        answerImg.dataset.problemId = problem.id;
        
        document.getElementById('userAnswer').value = '';
        document.getElementById('solutionFeedback')?.classList.add('hidden');
        
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        window.logEvent && window.logEvent('problem_opened', { problemId: problem.id });
    },

    // Close modal
    closeModal() {
        const modal = document.getElementById('problemModal');
        if (!modal) return;
        
        modal.classList.remove('active');
        document.body.style.overflow = '';
        document.getElementById('userAnswer').value = '';
        document.getElementById('answerImage')?.classList.add('blurred');
    },

    // Reveal answer
    revealAnswer() {
        const answerImg = document.getElementById('answerImage');
        const feedback = document.getElementById('solutionFeedback');
        
        if (answerImg) {
            answerImg.classList.remove('blurred');
        }
        
        if (feedback) {
            feedback.classList.remove('hidden');
        }
        
        const problemId = answerImg?.dataset.problemId;
        if (problemId && window.currentUser) {
            App.saveProgress(problemId);
        }
        
        Utils.showToast('Solution revealed! Review the steps carefully.', 'success');
        window.logEvent && window.logEvent('answer_revealed', { problemId });
    }
};

window.UI = UI;
