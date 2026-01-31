/**
 * Main Application Module
 * Coordinates all app functionality
 */

const App = {
    currentUser: null,
    currentChapter: 'kinematics',
    currentLessonChapter: 'kinematics',
    currentProblemIndex: 0,
    currentProblems: [],

    // Initialize app
    async init(user) {
        this.currentUser = user;
        console.log('🚀 Initializing app for:', user.email);
        
        this.setupNavigation();
        this.setupChapterSelectors();
        this.setupModal();
        this.setupSearch();
        
        // Load all content
        this.loadProblems(this.currentChapter);
        this.loadVideos(this.currentLessonChapter);
        this.loadTests();
        this.loadExams();
        this.loadProgress();
        
        Utils.showToast('Welcome to A', 'success', 2000);
    },

    // Navigation
    setupNavigation() {
        const navTabs = document.querySelectorAll('.nav-tab');
        const sections = document.querySelectorAll('.content-section');
        
        navTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const sectionName = tab.dataset.section;
                
                navTabs.forEach(t => {
                    t.classList.remove('active');
                    t.setAttribute('aria-selected', 'false');
                });
                tab.classList.add('active');
                tab.setAttribute('aria-selected', 'true');
                
                sections.forEach(s => s.classList.remove('active'));
                document.getElementById(`${sectionName}Section`)?.classList.add('active');
                
                window.logEvent && window.logEvent('navigate', { section: sectionName });
            });
        });
    },

    // Chapter selectors
    setupChapterSelectors() {
        const chapterSelect = document.getElementById('chapterSelect');
        const lessonSelect = document.getElementById('lessonChapterSelect');
        
        chapterSelect?.addEventListener('change', (e) => {
            this.currentChapter = e.target.value;
            this.loadProblems(this.currentChapter);
        });
        
        lessonSelect?.addEventListener('change', (e) => {
            this.currentLessonChapter = e.target.value;
            this.loadVideos(this.currentLessonChapter);
        });
    },

    // Load problems
    loadProblems(chapter) {
        const grid = document.getElementById('problemsGrid');
        const empty = document.getElementById('problemsEmpty');
        if (!grid) return;
        
        const chapterData = window.AppData?.chapters[chapter];
        if (!chapterData || !chapterData.problems) {
            if (empty) empty.classList.remove('hidden');
            grid.innerHTML = '';
            return;
        }
        
        if (empty) empty.classList.add('hidden');
        grid.innerHTML = '';
        this.currentProblems = chapterData.problems;
        
        chapterData.problems.forEach(problem => {
            grid.appendChild(UI.createProblemCard(problem));
        });
        
        window.logEvent && window.logEvent('problems_loaded', { chapter, count: chapterData.problems.length });
    },

    // Load videos
    loadVideos(chapter) {
        const list = document.getElementById('videoList');
        if (!list) return;
        
        const chapterData = window.AppData?.chapters[chapter];
        if (!chapterData || !chapterData.videos) {
            list.innerHTML = '<p class="text-center text-secondary p-8">No videos available</p>';
            return;
        }
        
        list.innerHTML = '';
        chapterData.videos.forEach(video => {
            list.appendChild(UI.createVideoItem(video));
        });
        
        window.logEvent && window.logEvent('videos_loaded', { chapter, count: chapterData.videos.length });
    },

    // Load tests
    loadTests() {
        const grid = document.getElementById('testsGrid');
        if (!grid) return;
        
        grid.innerHTML = '';
        window.AppData?.tests.forEach(test => {
            grid.appendChild(UI.createTestCard(test));
        });
    },

    // Load exams
    loadExams() {
        const grid = document.getElementById('examsGrid');
        if (!grid) return;
        
        grid.innerHTML = '';
        window.AppData?.exams.forEach(exam => {
            grid.appendChild(UI.createExamCard(exam));
        });
    },

    // Load progress
    async loadProgress() {
        if (!this.currentUser) return;
        
        try {
            const userDoc = await db.collection('users').doc(this.currentUser.uid).get();
            const userData = userDoc.data();
            const progress = userData?.progress || {};
            
            document.getElementById('totalProblems').textContent = progress.completedProblems || 0;
            document.getElementById('testsCompleted').textContent = progress.testsCompleted || 0;
            document.getElementById('hoursStudied').textContent = `${progress.hoursStudied || 0}h`;
            
            const avgScore = progress.averageScore || 0;
            document.getElementById('averageScore').textContent = `${avgScore}%`;
            
            this.createActivityChart();
        } catch (error) {
            console.error('Error loading progress:', error);
        }
    },

    // Create activity chart
    createActivityChart() {
        const canvas = document.getElementById('activityChart');
        if (!canvas || !window.Chart) return;
        
        const ctx = canvas.getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Problems Solved',
                    data: [5, 8, 12, 7, 15, 10, 14],
                    borderColor: '#6366f1',
                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { beginAtZero: true, grid: { color: '#e5e7eb' } },
                    x: { grid: { display: false } }
                }
            }
        });
    },

    // Modal setup
    setupModal() {
        const modal = document.getElementById('problemModal');
        const closeBtn = document.querySelector('.close-btn');
        const checkBtn = document.getElementById('checkAnswerBtn');
        const userAnswer = document.getElementById('userAnswer');
        const prevBtn = document.getElementById('prevProblemBtn');
        const nextBtn = document.getElementById('nextProblemBtn');
        
        closeBtn?.addEventListener('click', () => UI.closeModal());
        modal?.addEventListener('click', (e) => {
            if (e.target === modal) UI.closeModal();
        });
        
        checkBtn?.addEventListener('click', () => UI.revealAnswer());
        
        userAnswer?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') UI.revealAnswer();
        });
        
        prevBtn?.addEventListener('click', () => this.navigateProblem(-1));
        nextBtn?.addEventListener('click', () => this.navigateProblem(1));
        
        document.addEventListener('keydown', (e) => {
            if (!modal?.classList.contains('active')) return;
            if (e.key === 'Escape') UI.closeModal();
            if (e.key === 'ArrowLeft') this.navigateProblem(-1);
            if (e.key === 'ArrowRight') this.navigateProblem(1);
        });
    },

    // Navigate between problems
    navigateProblem(direction) {
        if (!this.currentProblems.length) return;
        
        const currentProblemId = document.getElementById('answerImage')?.dataset.problemId;
        const currentIndex = this.currentProblems.findIndex(p => p.id === currentProblemId);
        
        let newIndex = currentIndex + direction;
        if (newIndex < 0) newIndex = this.currentProblems.length - 1;
        if (newIndex >= this.currentProblems.length) newIndex = 0;
        
        UI.openProblemModal(this.currentProblems[newIndex]);
    },

    // Search functionality
    setupSearch() {
        const searchInput = document.getElementById('lessonSearch');
        if (!searchInput) return;
        
        searchInput.addEventListener('input', Utils.debounce((e) => {
            const query = e.target.value.toLowerCase();
            const videoItems = document.querySelectorAll('.video-item');
            
            videoItems.forEach(item => {
                const title = item.querySelector('h4')?.textContent.toLowerCase() || '';
                const desc = item.querySelector('p')?.textContent.toLowerCase() || '';
                item.style.display = (title.includes(query) || desc.includes(query)) ? '' : 'none';
            });
        }, 300));
    },

    // Save progress
    async saveProgress(problemId) {
        if (!this.currentUser) return;
        
        try {
            await db.collection('users').doc(this.currentUser.uid).update({
                [`progress.problems.${problemId}`]: {
                    completed: true,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp()
                },
                'progress.completedProblems': firebase.firestore.FieldValue.increment(1),
                'progress.lastActivity': firebase.firestore.FieldValue.serverTimestamp()
            });
            
            window.logEvent && window.logEvent('problem_completed', { problemId });
        } catch (error) {
            console.error('Error saving progress:', error);
        }
    },

    // Start test
    startTest(testId) {
        const test = window.AppData?.tests.find(t => t.id === testId);
        if (!test) return;
        
        Utils.showToast(`Starting ${test.title}...`, 'info');
        window.logEvent && window.logEvent('test_started', { testId });
        
        // TODO: Implement test interface
        console.log('Start test:', test);
    },

    // Start exam
    startExam(examId) {
        const exam = window.AppData?.exams.find(e => e.id === examId);
        if (!exam) return;
        
        Utils.showToast(`Starting ${exam.title}...`, 'info');
        window.logEvent && window.logEvent('exam_started', { examId });
        
        // TODO: Implement exam interface
        console.log('Start exam:', exam);
    }
};

// Export to window
window.App = App;
window.initializeApp = (user) => App.init(user);

// Ready
console.log('📚 LearnSTEM App Ready');
