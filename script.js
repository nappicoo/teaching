/* ==========================================================
   ENGLISH TEACHING METHODOLOGY QUIZ
   ========================================================== */

/* ---------- QUESTIONS ---------- */
const QUESTIONS = [
  { 
    section: "Methodology", 
    q: "What is the primary goal of Communicative Language Teaching (CLT)?", 
    options: ["To focus strictly on grammar rules and translation", "To help students use language effectively in real-life situations", "To memorize long lists of vocabulary words", "To prepare students only for written exams"], 
    correct: 1 
  },
  { 
    section: "Methodology", 
    q: "In a learner-centered classroom, who should ideally do most of the talking (TTT vs. STT)?", 
    options: ["The teacher (High TTT)", "The students (High STT)", "Both should speak exactly the same amount", "The textbook"], 
    correct: 1 
  },
  { 
    section: "Skills", 
    q: "Which of the following are considered 'Receptive Skills'?", 
    options: ["Speaking and Writing", "Reading and Listening", "Grammar and Vocabulary", "Speaking and Reading"], 
    correct: 1 
  },
  { 
    section: "Skills", 
    q: "Which of the following are considered 'Productive Skills'?", 
    options: ["Listening and Reading", "Reading and Writing", "Speaking and Writing", "Listening and Speaking"], 
    correct: 2 
  },
  { 
    section: "Methodology", 
    q: "What does the acronym PPP stand for in lesson planning?", 
    options: ["Practice, Perfect, Perform", "Presentation, Practice, Production", "Plan, Prepare, Present", "Primary, Private, Public"], 
    correct: 1 
  },
  { 
    section: "Techniques", 
    q: "What is 'Eliciting' in the context of teaching English?", 
    options: ["Telling students the answers directly", "Drawing language or answers out of the students", "Giving students a written test", "Translating words into the native language"], 
    correct: 1 
  },
  { 
    section: "Assessment", 
    q: "What is the main purpose of Concept Checking Questions (CCQs)?", 
    options: ["To see if students understand the meaning of the target language", "To test students' spelling", "To give students homework", "To check if the classroom is clean"], 
    correct: 0 
  },
  { 
    section: "Techniques", 
    q: "What does 'Scaffolding' mean in language teaching?", 
    options: ["Building a new classroom", "Giving students temporary support to help them complete a task", "Teaching without a lesson plan", "Removing all support so students fail"], 
    correct: 1 
  },
  { 
    section: "Methodology", 
    q: "What is TPR (Total Physical Response) commonly used for?", 
    options: ["Teaching complex grammar", "Teaching language through physical movement and commands", "Writing academic essays", "Listening to podcasts"], 
    correct: 1 
  },
  { 
    section: "Assessment", 
    q: "What is 'Formative Assessment'?", 
    options: ["A final exam at the end of the year", "Ongoing feedback and assessment during the learning process", "A test that determines a student's grade permanently", "A test that students take before joining the class"], 
    correct: 1 
  },
  { 
    section: "Vocabulary", 
    q: "What is a highly effective way to teach new vocabulary (Lexis)?", 
    options: ["Teaching isolated words from a dictionary", "Teaching words in context and collocations (chunks of language)", "Asking students to copy the dictionary", "Only focusing on spelling"], 
    correct: 1 
  },
  { 
    section: "Classroom Management", 
    q: "When should a teacher use delayed correction?", 
    options: ["During a speaking fluency activity, so you don't interrupt them", "During a written grammar test", "Immediately after every single mistake", "Only at the end of the school year"], 
    correct: 0 
  },
  { 
    section: "Lesson Planning", 
    q: "What is the most important part of a lesson plan?", 
    options: ["The font used in the document", "Clear, measurable aims and objectives", "The number of pages", "The teacher's script"], 
    correct: 1 
  },
  { 
    section: "Materials", 
    q: "What are 'Authentic Materials'?", 
    options: ["Materials created specifically for grammar teaching", "Real-world texts, audio, or videos not adapted for learners (e.g., newspapers, menus)", "Old textbooks from the 1980s", "Copies of the teacher's notes"], 
    correct: 1 
  },
  { 
    section: "Motivation", 
    q: "Intrinsic motivation refers to...", 
    options: ["Learning for a reward like money or a certificate", "Learning for personal enjoyment, curiosity, or self-improvement", "Learning because your parents force you", "Learning to pass a specific exam"], 
    correct: 1 
  }
];

/* ---------- STATE ---------- */
let order = [];              
let current = 0;             
let answers = {};            

/* ---------- ELEMENTS ---------- */
const $ = (id) => document.getElementById(id);
const views = { start: $('view-start'), quiz: $('view-quiz'), results: $('view-results') };

/* ---------- VIEW SWITCH ---------- */
function showView(name) {
  Object.values(views).forEach(v => v.classList.remove('active'));
  views[name].classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ---------- QUIZ START ---------- */
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function startQuiz() {
  order = shuffle(QUESTIONS.map((_, i) => i));
  current = 0;
  answers = {};
  showView('quiz');
  renderQuestion();
  updateHUD();
}

/* ---------- RENDER QUESTION ---------- */
function renderQuestion() {
  const qIdx = order[current];
  const q = QUESTIONS[qIdx];

  $('section-label').textContent = q.section;
  $('question-text').textContent = q.q;

  const optBox = $('options');
  optBox.innerHTML = '';
  const letters = ['A', 'B', 'C', 'D'];
  const saved = answers[current];

  q.options.forEach((optText, i) => {
    const btn = document.createElement('button');
    btn.className = 'option';
    btn.type = 'button';
    btn.innerHTML = `<span class="opt-letter">${letters[i]}</span><span>${optText}</span>`;

    if (saved) {
      btn.classList.add('disabled');
      if (i === q.correct) btn.classList.add('correct');
      else if (i === saved.chosen) btn.classList.add('wrong');
    } else {
      btn.addEventListener('click', () => selectAnswer(i));
    }
    optBox.appendChild(btn);
  });

  const fb = $('feedback');
  fb.className = 'feedback';
  fb.textContent = '';
  if (saved) {
    fb.classList.add('show', saved.isCorrect ? 'ok' : 'no');
    fb.textContent = saved.isCorrect
      ? '✓ Correct! Well done.'
      : '✗ Incorrect. Correct answer: ' + letters[q.correct] + ') ' + q.options[q.correct];
  }

  const prevBtn = $('btn-prev');
  const nextBtn = $('btn-next');
  prevBtn.disabled = current === 0;
  const isLast = current === order.length - 1;
  nextBtn.textContent = isLast ? '🎀 See Results' : 'Next →';
  nextBtn.classList.toggle('finish', isLast && !!saved);

  if (window.innerWidth < 600) {
    document.querySelector('.question-card').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

/* ---------- SELECT ANSWER ---------- */
function selectAnswer(chosenIdx) {
  if (answers[current]) return;

  const qIdx = order[current];
  const q = QUESTIONS[qIdx];
  const isCorrect = chosenIdx === q.correct;

  answers[current] = { chosen: chosenIdx, isCorrect };

  const opts = document.querySelectorAll('#options .option');
  opts.forEach((btn, i) => {
    btn.classList.add('disabled');
    btn.onclick = null;
    if (i === q.correct) btn.classList.add('correct');
    else if (i === chosenIdx) btn.classList.add('wrong');
  });

  const fb = $('feedback');
  const letters = ['A', 'B', 'C', 'D'];
  fb.classList.add('show', isCorrect ? 'ok' : 'no');
  fb.textContent = isCorrect
    ? '✓ Correct! Well done.'
    : '✗ Incorrect. Correct answer: ' + letters[q.correct] + ') ' + q.options[q.correct];

  const nextBtn = $('btn-next');
  const isLast = current === order.length - 1;
  if (isLast) nextBtn.classList.add('finish');

  updateHUD();
}

/* ---------- HUD ---------- */
function updateHUD() {
  const total = order.length;
  const answeredCount = Object.keys(answers).length;
  const correctCount = Object.values(answers).filter(a => a.isCorrect).length;
  const wrongCount = answeredCount - correctCount;
  const accuracy = answeredCount === 0 ? 0 : Math.round((correctCount / answeredCount) * 100);

  $('current-q').textContent = current + 1;
  $('total-q').textContent = total;
  $('stat-accuracy').textContent = accuracy + '%';
  $('stat-correct').textContent = correctCount;
  $('stat-wrong').textContent = wrongCount;
  $('stat-left').textContent = total - answeredCount;

  const pct = (answeredCount / total) * 100;
  $('progress-fill').style.width = pct + '%';
}

/* ---------- NAVIGATION ---------- */
function goNext() {
  if (!answers[current]) {
    const opts = $('options');
    opts.classList.add('shake');
    setTimeout(() => opts.classList.remove('shake'), 400);
    return;
  }
  if (current < order.length - 1) {
    current++;
    renderQuestion();
    updateHUD();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    showResults();
  }
}

function goPrev() {
  if (current > 0) {
    current--;
    renderQuestion();
    updateHUD();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

/* ---------- RESULTS ---------- */
function showResults() {
  const total = order.length;
  const correctCount = Object.values(answers).filter(a => a.isCorrect).length;
  const wrongCount = total - correctCount;
  const percent = Math.round((correctCount / total) * 100);

  $('score-big').textContent = correctCount + '/' + total;
  $('score-percent').textContent = percent + '%';
  $('res-correct').textContent = correctCount;
  $('res-wrong').textContent = wrongCount;
  $('res-accuracy').textContent = percent + '%';

  let title, text;
  if (correctCount >= 13) {
    title = '🌟 Master Teacher!';
    text = 'Outstanding! You have an excellent grasp of English teaching methodology and classroom practice.';
  } else if (correctCount >= 10) {
    title = '✨ Great Job!';
    text = 'Solid understanding! You know your teaching principles well. Review the ones you missed below.';
  } else if (correctCount >= 7) {
    title = '📚 Good Effort';
    text = 'You are on the right track. Review the correct answers below to sharpen your teaching skills.';
  } else {
    title = '💪 Keep Learning!';
    text = 'Teaching methodology takes time to master. Don\'t worry, look at the correct answers below and try again!';
  }
  $('fb-title').textContent = title;
  $('fb-text').textContent = text;

  const mistakes = $('mistakes-list');
  mistakes.innerHTML = '';
  const letters = ['A', 'B', 'C', 'D'];

  const wrongEntries = [];
  order.forEach((qIdx, i) => {
    const ans = answers[i];
    if (ans && !ans.isCorrect) {
      wrongEntries.push({ qIdx, ans, qNumber: i + 1 });
    }
  });

  if (wrongEntries.length === 0) {
    mistakes.innerHTML = '<div class="mistakes-empty">🎉 Perfect score — no mistakes to review!</div>';
  } else {
    wrongEntries.forEach(({ qIdx, ans, qNumber }) => {
      const q = QUESTIONS[qIdx];
      const card = document.createElement('div');
      card.className = 'mistake-card';
      card.innerHTML = `
        <div class="mistake-num">Question ${qNumber} · ${q.section}</div>
        <div class="mistake-q">${escapeHtml(q.q)}</div>
        <div class="mistake-ans your">
          <b>Your answer:</b> <span>${letters[ans.chosen]}) ${escapeHtml(q.options[ans.chosen])}</span>
        </div>
        <div class="mistake-ans right">
          <b>Correct answer:</b> <span>${letters[q.correct]}) ${escapeHtml(q.options[q.correct])}</span>
        </div>
      `;
      mistakes.appendChild(card);
    });
  }

  showView('results');
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/* ---------- EVENT LISTENERS ---------- */
$('start-btn').addEventListener('click', startQuiz);
$('btn-prev').addEventListener('click', goPrev);
$('btn-next').addEventListener('click', goNext);
$('btn-restart').addEventListener('click', () => {
  if (confirm('Restart the quiz? All current progress will be lost.')) startQuiz();
});
$('btn-restart-results').addEventListener('click', startQuiz);

/* ---------- KEYBOARD ---------- */
document.addEventListener('keydown', (e) => {
  if (!views.quiz.classList.contains('active')) return;

  if (e.key === 'Enter') {
    e.preventDefault();
    goNext();
  } else if (e.key === 'ArrowLeft') {
    e.preventDefault();
    goPrev();
  } else if (e.key === 'ArrowRight') {
    e.preventDefault();
    goNext();
  } else if (['1', '2', '3', '4'].includes(e.key)) {
    const idx = parseInt(e.key) - 1;
    const opts = document.querySelectorAll('#options .option');
    if (opts[idx] && !opts[idx].classList.contains('disabled')) {
      selectAnswer(idx);
    }
  }
});
