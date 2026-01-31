/**
 * Application Data
 * Sample content structure - replace with your actual content
 */

const AppData = {
    chapters: {
        kinematics: {
            name: 'Chapter 1: Kinematics',
            problems: [
                {
                    id: 'kin_1',
                    title: 'Velocity and Displacement',
                    description: 'Calculate velocity given distance and time. Understand the relationship between displacement, velocity, and time.',
                    difficulty: 'easy',
                    questionImage: 'assets/problems/linearEquation2.png',
                    answerImage: 'assets/answers/linearEquation2Answer.png',
                    points: 10
                },
                {
                    id: 'kin_2',
                    title: 'Acceleration Problems',
                    description: 'Find acceleration from velocity-time graphs and apply equations of motion.',
                    difficulty: 'medium',
                    questionImage: 'assets/problems/kinematics_2_question.png',
                    answerImage: 'assets/answers/kinematics_2_answer.png',
                    points: 15
                },
                {
                    id: 'kin_3',
                    title: 'Projectile Motion',
                    description: 'Analyze the motion of projectiles in two dimensions.',
                    difficulty: 'hard',
                    questionImage: 'assets/problems/kinematics_3_question.png',
                    answerImage: 'assets/answers/kinematics_3_answer.png',
                    points: 20
                },
                {
                    id: 'kin_4',
                    title: 'Free Fall Motion',
                    description: 'Calculate displacement, velocity, and time for objects in free fall.',
                    difficulty: 'easy',
                    questionImage: 'assets/problems/kinematics_4_question.png',
                    answerImage: 'assets/answers/kinematics_4_answer.png',
                    points: 10
                }
            ],
            videos: [
                { title: 'Introduction to Kinematics', description: 'Position, velocity, and acceleration basics', duration: '12:45', url: 'https://www.youtube.com/watch?v=EXAMPLE1' },
                { title: 'Velocity and Speed', description: 'Understanding the difference between speed and velocity', duration: '8:30', url: 'https://www.youtube.com/watch?v=EXAMPLE2' },
                { title: 'Acceleration Explained', description: 'What is acceleration and how to calculate it', duration: '10:15', url: 'https://www.youtube.com/watch?v=EXAMPLE3' },
                { title: 'Equations of Motion', description: 'Applying the kinematic equations', duration: '15:20', url: 'https://www.youtube.com/watch?v=EXAMPLE4' }
            ]
        },
        forces: {
            name: 'Chapter 2: Forces & Motion',
            problems: [
                { id: 'force_1', title: "Newton's First Law", description: 'Understanding inertia and balanced forces', difficulty: 'easy', questionImage: 'assets/problems/forces_1_question.png', answerImage: 'assets/answers/forces_1_answer.png', points: 10 },
                { id: 'force_2', title: 'F = ma Applications', description: "Solve problems using Newton's second law", difficulty: 'medium', questionImage: 'assets/problems/forces_2_question.png', answerImage: 'assets/answers/forces_2_answer.png', points: 15 },
                { id: 'force_3', title: 'Friction Problems', description: 'Calculate frictional forces in various scenarios', difficulty: 'medium', questionImage: 'assets/problems/forces_3_question.png', answerImage: 'assets/answers/forces_3_answer.png', points: 15 }
            ],
            videos: [
                { title: "Newton's Laws of Motion", description: 'Complete overview of the three laws', duration: '15:20', url: 'https://www.youtube.com/watch?v=EXAMPLE5' },
                { title: 'Free Body Diagrams', description: 'How to draw and analyze force diagrams', duration: '11:00', url: 'https://www.youtube.com/watch?v=EXAMPLE6' }
            ]
        },
        energy: {
            name: 'Chapter 3: Energy & Work',
            problems: [
                { id: 'energy_1', title: 'Work Calculations', description: 'Calculate work done by forces', difficulty: 'easy', questionImage: 'assets/problems/energy_1_question.png', answerImage: 'assets/answers/energy_1_answer.png', points: 10 },
                { id: 'energy_2', title: 'Conservation of Energy', description: 'Apply energy conservation principles', difficulty: 'hard', questionImage: 'assets/problems/energy_2_question.png', answerImage: 'assets/answers/energy_2_answer.png', points: 20 }
            ],
            videos: [
                { title: 'Work and Energy', description: 'Relationship between work and energy', duration: '13:40', url: 'https://www.youtube.com/watch?v=EXAMPLE7' }
            ]
        },
        algebra: {
            name: 'Chapter 4: Algebra Basics',
            problems: [
                { 
                    id: 'alg_1', 
                    title: 'Solving Linear Equations', 
                    description: 'Find x in equations like 2x + 5 = 13', 
                    difficulty: 'easy', 
                    questionImage: 'assets/problems/linearEquation2.png', 
                    answerImage: 'assets/answers/linearEquation2Answer.png', 
                    points: 10 
                },
                { 
                    id: 'alg_2', 
                    title: 'Solving Quadratic Equations', 
                    description: 'Find x in second degree equations', 
                    difficulty: 'medium', 
                    questionImage: 'assets/problems/quadraticEquation1.png', 
                    answerImage: 'assets/answers/quadraticEquation1Answer.png', 
                    points: 15
                },
            
            ],
            videos: [
                { title: 'Algebra Fundamentals', description: 'Variables, expressions, and equations', duration: '14:30', url: 'https://www.youtube.com/watch?v=EXAMPLE8' }
            ]
        },
        calculus: {
            name: 'Chapter 5: Calculus Introduction',
            problems: [
                { id: 'calc_1', title: 'Basic Derivatives', description: 'Find derivatives of simple functions', difficulty: 'medium', questionImage: 'assets/problems/calculus_1_question.png', answerImage: 'assets/answers/calculus_1_answer.png', points: 15 },
                { id: 'calc_2', title: 'Integration Practice', description: 'Evaluate definite integrals', difficulty: 'hard', questionImage: 'assets/problems/calculus_2_question.png', answerImage: 'assets/answers/calculus_2_answer.png', points: 20 }
            ],
            videos: [
                { title: 'Introduction to Limits', description: 'Understanding the concept of limits', duration: '16:00', url: 'https://www.youtube.com/watch?v=EXAMPLE9' }
            ]
        },
        trigonometry: {
            name: 'Chapter 6: Trigonometry',
            problems: [
                { id: 'trig_1', title: 'Basic Trig Ratios', description: 'Find sin, cos, tan of angles', difficulty: 'easy', questionImage: 'assets/problems/trig_1_question.png', answerImage: 'assets/answers/trig_1_answer.png', points: 10 },
                { id: 'trig_2', title: 'Unit Circle', description: 'Navigate the unit circle and find angle values', difficulty: 'medium', questionImage: 'assets/problems/trig_2_question.png', answerImage: 'assets/answers/trig_2_answer.png', points: 15 }
            ],
            videos: [
                { title: 'Trigonometric Functions', description: 'Understanding sine, cosine, and tangent', duration: '12:20', url: 'https://www.youtube.com/watch?v=EXAMPLE10' }
            ]
        }
    },

    tests: [
        { id: 'test_1', title: 'Kinematics Chapter Test', chapter: 'kinematics', questions: 15, duration: 30, description: 'Comprehensive test covering velocity, acceleration, and motion equations', difficulty: 'medium' },
        { id: 'test_2', title: 'Forces & Motion Test', chapter: 'forces', questions: 12, duration: 25, description: "Test your understanding of Newton's laws and force problems", difficulty: 'medium' },
        { id: 'test_3', title: 'Energy & Work Test', chapter: 'energy', questions: 10, duration: 20, description: 'Apply energy conservation and work-energy theorem', difficulty: 'hard' },
        { id: 'test_4', title: 'Algebra Fundamentals Test', chapter: 'algebra', questions: 20, duration: 40, description: 'Equations, inequalities, and algebraic manipulation', difficulty: 'easy' },
        { id: 'test_5', title: 'Calculus Basics Test', chapter: 'calculus', questions: 15, duration: 35, description: 'Derivatives and integrals fundamentals', difficulty: 'hard' },
        { id: 'test_6', title: 'Trigonometry Test', chapter: 'trigonometry', questions: 12, duration: 25, description: 'Trig functions, identities, and applications', difficulty: 'medium' }
    ],

    exams: [
        { id: 'exam_1', title: 'Physics Midterm Exam', subjects: ['Kinematics', 'Forces', 'Energy'], questions: 40, duration: 90, description: 'Comprehensive midterm covering first three physics chapters' },
        { id: 'exam_2', title: 'Mathematics Final Exam', subjects: ['Algebra', 'Calculus', 'Trigonometry'], questions: 50, duration: 120, description: 'Complete final exam covering all mathematics chapters' },
        { id: 'exam_3', title: 'STEM Comprehensive Exam', subjects: ['Physics', 'Mathematics'], questions: 60, duration: 150, description: 'Ultimate challenge covering all topics in physics and mathematics' }
    ]
};

// Export
window.AppData = AppData;
