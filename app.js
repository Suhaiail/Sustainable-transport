/**
 * Sustainable Transportation Systems (NOC26_CE107 & 105107210)
 * Modern NPTEL Practice Web Application & Study Material Platform
 */

(function () {
  'use strict';

  // --- STATE ---
  let courseData = null;
  let studyData = null;
  let selectedWeeks = new Set();
  let currentMode = 'practice'; // 'practice' | 'quiz' | 'mock'
  let shuffleQuestions = true;
  let shuffleAnswers = false;

  // Active Quiz State
  let activeQuiz = {
    title: '',
    subtitle: '',
    mode: 'practice',
    questions: [],
    currentIndex: 0,
    isComplete: false,
    results: []
  };

  // Active Flashcards State
  let flashcardsList = [];
  let currentFlashcardIndex = 0;
  let isCardFlipped = false;

  // Active Study Subview
  let currentStudySubmode = 'lectures'; // 'lectures' | 'flashcards' | 'glossary'
  let studySearchQuery = '';
  let selectedWeekFilter = 'all';

  const STORAGE_KEY_WRONG = 'nptel_wrong_answers_NOC26_CE107';

  // --- DOM ELEMENTS ---
  const views = {
    course: document.getElementById('courseView'),
    study: document.getElementById('studyView'),
    quiz: document.getElementById('quizView'),
    results: document.getElementById('resultsView')
  };

  // Nav Elements
  const tabQuizView = document.getElementById('tabQuizView');
  const tabStudyView = document.getElementById('tabStudyView');
  const navHomeLink = document.getElementById('navHomeLink');
  const goToStudyBtn = document.getElementById('goToStudyBtn');
  const studyToQuizBtn = document.getElementById('studyToQuizBtn');
  const studyBackLink = document.getElementById('studyBackLink');

  // Course Home Elements
  const weeksGrid = document.getElementById('weeksGrid');
  const selectAllBtn = document.getElementById('selectAllBtn');
  const bottomActionBar = document.getElementById('bottomActionBar');
  const selectionSummary = document.getElementById('selectionSummary');
  const clearSelectionBtn = document.getElementById('clearSelectionBtn');
  const generateQuizBtn = document.getElementById('generateQuizBtn');
  const modeButtons = document.querySelectorAll('.mode-btn');
  const modeInfoBtn = document.getElementById('modeInfoBtn');
  const modeInfoModal = document.getElementById('modeInfoModal');
  const closeModeInfoBtn = document.getElementById('closeModeInfoBtn');
  const shuffleQuestionsToggle = document.getElementById('shuffleQuestionsToggle');
  const shuffleAnswersToggle = document.getElementById('shuffleAnswersToggle');

  // Wrong Answers Elements
  const wrongAnswersBar = document.getElementById('wrongAnswersBar');
  const wrongCountBadge = document.getElementById('wrongCountBadge');
  const practiceWrongBtn = document.getElementById('practiceWrongBtn');
  const viewWrongBtn = document.getElementById('viewWrongBtn');
  const clearWrongBtn = document.getElementById('clearWrongBtn');
  const wrongAnswersModal = document.getElementById('wrongAnswersModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const modalWrongCount = document.getElementById('modalWrongCount');
  const modalPracticeBtn = document.getElementById('modalPracticeBtn');
  const modalClearBtn = document.getElementById('modalClearBtn');
  const modalWrongList = document.getElementById('modalWrongList');

  // Study Material Elements
  const studyTabBtns = document.querySelectorAll('.study-tab-btn');
  const lecturesSubView = document.getElementById('lecturesContent');
  const flashcardsSubView = document.getElementById('flashcardsContent');
  const glossarySubView = document.getElementById('glossaryContent');
  const studySearchInput = document.getElementById('studySearchInput');
  const clearSearchBtn = document.getElementById('clearSearchBtn');
  const weekFilterSelect = document.getElementById('weekFilterSelect');
  const toggleExpandAllBtn = document.getElementById('toggleExpandAllBtn');
  const studyWeeksAccordion = document.getElementById('studyWeeksAccordion');
  const glossaryGrid = document.getElementById('glossaryGrid');

  // Flashcard Elements
  const activeFlashcard = document.getElementById('activeFlashcard');
  const flashcardCounter = document.getElementById('flashcardCounter');
  const flashcardCategoryBadge = document.getElementById('flashcardCategoryBadge');
  const cardFrontText = document.getElementById('cardFrontText');
  const cardBackText = document.getElementById('cardBackText');
  const cardPageRef = document.getElementById('cardPageRef');
  const prevFlashcardBtn = document.getElementById('prevFlashcardBtn');
  const flipFlashcardBtn = document.getElementById('flipFlashcardBtn');
  const nextFlashcardBtn = document.getElementById('nextFlashcardBtn');
  const shuffleFlashcardsBtn = document.getElementById('shuffleFlashcardsBtn');
  const flashcardCountBadge = document.getElementById('flashcardCountBadge');

  // Quiz Elements
  const quizExitLink = document.getElementById('quizExitLink');
  const quitQuizBtn = document.getElementById('quitQuizBtn');
  const quizHeaderTitle = document.getElementById('quizHeaderTitle');
  const quizHeaderModeBadge = document.getElementById('quizHeaderModeBadge');
  const quizHeaderSubtitle = document.getElementById('quizHeaderSubtitle');
  const quizProgressBar = document.getElementById('quizProgressBar');
  const questionCounter = document.getElementById('questionCounter');
  const questionWeekTag = document.getElementById('questionWeekTag');
  const questionText = document.getElementById('questionText');
  const questionInstruction = document.getElementById('questionInstruction');
  const optionsList = document.getElementById('optionsList');
  const practiceFeedback = document.getElementById('practiceFeedback');
  const prevQuestionBtn = document.getElementById('prevQuestionBtn');
  const nextQuestionBtn = document.getElementById('nextQuestionBtn');

  // Results Elements
  const resultsExitLink = document.getElementById('resultsExitLink');
  const resultsTitle = document.getElementById('resultsTitle');
  const resultsModeBadge = document.getElementById('resultsModeBadge');
  const resultsSubtitle = document.getElementById('resultsSubtitle');
  const scoreFraction = document.getElementById('scoreFraction');
  const scorePercent = document.getElementById('scorePercent');
  const scoreReviewCount = document.getElementById('scoreReviewCount');
  const retryMissedBtn = document.getElementById('retryMissedBtn');
  const newShuffleBtn = document.getElementById('newShuffleBtn');
  const chooseDifferentWeeksBtn = document.getElementById('chooseDifferentWeeksBtn');
  const reviewItemsList = document.getElementById('reviewItemsList');

  // --- INITIALIZATION ---
  async function init() {
    setupEventListeners();
    await loadData();
    renderWeeksGrid();
    renderStudyMaterial();
    renderGlossary();
    initFlashcards();
    updateWrongAnswersBar();
  }

  async function loadData() {
    // 1. Course Questions Data
    if (window.COURSE_DATA) {
      courseData = window.COURSE_DATA;
    } else {
      try {
        const res = await fetch('data/questions.json');
        if (res.ok) courseData = await res.json();
      } catch (err) {
        console.warn('Could not load questions.json via fetch:', err);
      }
    }

    // 2. Study Material Data
    if (window.STUDY_DATA) {
      studyData = window.STUDY_DATA;
    } else {
      try {
        const res = await fetch('data/study_material.json');
        if (res.ok) studyData = await res.json();
      } catch (err) {
        console.warn('Could not load study_material.json via fetch:', err);
      }
    }
  }

  // --- VIEW SWITCHING ---
  function showView(viewName) {
    Object.keys(views).forEach(name => {
      if (name === viewName) {
        views[name].classList.remove('hidden');
        views[name].classList.add('active-view');
      } else {
        views[name].classList.add('hidden');
        views[name].classList.remove('active-view');
      }
    });

    // Update top nav tabs
    if (viewName === 'course' || viewName === 'quiz' || viewName === 'results') {
      tabQuizView.classList.add('active');
      tabQuizView.setAttribute('aria-selected', 'true');
      tabStudyView.classList.remove('active');
      tabStudyView.setAttribute('aria-selected', 'false');
    } else if (viewName === 'study') {
      tabStudyView.classList.add('active');
      tabStudyView.setAttribute('aria-selected', 'true');
      tabQuizView.classList.remove('active');
      tabQuizView.setAttribute('aria-selected', 'false');
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // --- MARKDOWN & TEXT PARSER ---
  function renderMarkdown(text) {
    if (!text) return '';
    let html = text;

    html = html.replace(/\r\n/g, '\n');

    // Parse Markdown Tables
    const tableRegex = /((?:\|[^\n]+\|\n)+)/g;
    html = html.replace(tableRegex, (match) => {
      const lines = match.trim().split('\n').filter(l => l.trim().startsWith('|'));
      if (lines.length < 2) return match;

      let isHeader = true;
      let headerHtml = '';
      let bodyHtml = '';

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.match(/^\|[\s\-:\|]+\|$/)) {
          isHeader = false;
          continue;
        }

        const cells = line.split('|').slice(1, -1).map(c => c.trim());
        if (isHeader) {
          headerHtml += '<tr>' + cells.map(c => `<th>${escapeHtml(c)}</th>`).join('') + '</tr>';
          isHeader = false;
        } else {
          bodyHtml += '<tr>' + cells.map(c => `<td>${escapeHtml(c)}</td>`).join('') + '</tr>';
        }
      }

      return `<div class="table-wrap"><table>${headerHtml ? `<thead>${headerHtml}</thead>` : ''}<tbody>${bodyHtml}</tbody></table></div>`;
    });

    // Parse Markdown Images ![alt](url)
    html = html.replace(/!\[([^\]]*)\]\(([^\)]+)\)/g, (match, alt, src) => {
      return `<img src="${src}" alt="${escapeHtml(alt)}" loading="lazy" />`;
    });

    // Parse bold **text**
    html = html.replace(/\*\*([^\*]+)\*\*/g, '<strong>$1</strong>');

    // Parse italic *text*
    html = html.replace(/\*([^\*]+)\*/g, '<em>$1</em>');

    // Paragraphs / line breaks
    const blocks = html.split(/\n\s*\n/);
    if (blocks.length > 1) {
      html = blocks.map(b => {
        b = b.trim();
        if (b.startsWith('<div class="table-wrap">') || b.startsWith('<img')) return b;
        return `<p>${b.replace(/\n/g, '<br>')}</p>`;
      }).join('');
    } else {
      html = html.replace(/\n/g, '<br>');
    }

    return html;
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // --- WEEKS GRID & SELECTION ---
  function renderWeeksGrid() {
    if (!courseData) return;
    weeksGrid.innerHTML = '';

    const weekKeys = Object.keys(courseData).sort((a, b) => parseInt(a) - parseInt(b));

    weekKeys.forEach(weekNum => {
      const week = courseData[weekNum];
      const isSelected = selectedWeeks.has(parseInt(weekNum));

      const card = document.createElement('div');
      card.className = `week-card ${isSelected ? 'selected' : ''}`;
      card.dataset.week = weekNum;

      card.innerHTML = `
        <div class="card-top">
          <span class="card-title">${week.title}</span>
          <div class="custom-checkbox">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
        </div>
        <p class="card-desc">${week.description || ''}</p>
      `;

      card.addEventListener('click', () => toggleWeekSelection(parseInt(weekNum)));
      weeksGrid.appendChild(card);
    });

    updateActionBar();
  }

  function toggleWeekSelection(weekNum) {
    if (selectedWeeks.has(weekNum)) {
      selectedWeeks.delete(weekNum);
    } else {
      selectedWeeks.add(weekNum);
    }

    const card = weeksGrid.querySelector(`[data-week="${weekNum}"]`);
    if (card) {
      card.classList.toggle('selected', selectedWeeks.has(weekNum));
    }

    updateActionBar();
  }

  function updateActionBar() {
    const count = selectedWeeks.size;
    let totalQuestions = 0;
    selectedWeeks.forEach(w => {
      if (courseData && courseData[w] && courseData[w].questions) {
        totalQuestions += courseData[w].questions.length;
      }
    });

    if (count > 0) {
      bottomActionBar.classList.remove('hidden');
      selectionSummary.textContent = `${count} ${count === 1 ? 'week' : 'weeks'} selected · ${totalQuestions} questions`;
      selectAllBtn.textContent = (count === 12) ? 'Deselect all' : 'Select all';
    } else {
      bottomActionBar.classList.add('hidden');
      selectAllBtn.textContent = 'Select all';
    }
  }

  // --- STUDY MATERIAL RENDERING ---
  function renderStudyMaterial() {
    if (!studyData || !studyData.weeks) return;
    studyWeeksAccordion.innerHTML = '';

    const query = studySearchQuery.toLowerCase().trim();
    let hasMatches = false;

    for (let w = 1; w <= 12; w++) {
      if (selectedWeekFilter !== 'all' && selectedWeekFilter !== String(w)) {
        continue;
      }

      const weekInfo = studyData.weeks[w];
      if (!weekInfo) continue;

      // Filter lectures by search query
      const matchingLectures = weekInfo.lectures.filter(lec => {
        if (!query) return true;
        const haystack = `${lec.number} ${lec.title} ${lec.overview} ${lec.core_topics.join(' ')} ${lec.exam_point}`.toLowerCase();
        return haystack.includes(query);
      });

      const weekMatches = !query || weekInfo.title.toLowerCase().includes(query) || weekInfo.summary.toLowerCase().includes(query) || matchingLectures.length > 0;

      if (!weekMatches && matchingLectures.length === 0) continue;
      hasMatches = true;

      const lecturesToRender = query ? matchingLectures : weekInfo.lectures;

      const weekCard = document.createElement('div');
      weekCard.className = `week-study-card ${query ? 'expanded' : (w === 1 ? 'expanded' : '')}`;
      weekCard.dataset.week = w;

      const takeawaysHtml = weekInfo.key_takeaways.map(t => `<li>${escapeHtml(t)}</li>`).join('');

      let lecturesHtml = '';
      lecturesToRender.forEach(lec => {
        const topicsHtml = lec.core_topics.map(t => `<li>${escapeHtml(t)}</li>`).join('');
        lecturesHtml += `
          <div class="lecture-item">
            <div class="lecture-top-row">
              <span class="lec-num-badge">${lec.number}</span>
              <span class="lec-page-ref">${lec.page_range}</span>
            </div>
            <h4 class="lecture-item-title">${escapeHtml(lec.title)}</h4>
            <p class="lecture-item-overview">${escapeHtml(lec.overview)}</p>
            <ul class="core-topics-list">
              ${topicsHtml}
            </ul>
            <div class="exam-point-tip">&#9733; <strong>Exam Highlight:</strong> ${escapeHtml(lec.exam_point)}</div>
          </div>
        `;
      });

      weekCard.innerHTML = `
        <div class="week-study-header">
          <div class="week-study-title-wrap">
            <span class="week-badge-pill">WEEK ${w}</span>
            <h3 class="week-study-title">${escapeHtml(weekInfo.title)}</h3>
          </div>
          <div class="week-study-actions">
            <button type="button" class="btn-pill-action practice-week-btn" data-week="${w}">
              Practice Week ${w} MCQs
            </button>
            <svg class="accordion-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>
        </div>
        <div class="week-study-body">
          <div class="week-overview-box">
            <div class="overview-heading">Week Overview &amp; Key Milestones</div>
            <p class="overview-text">${escapeHtml(weekInfo.summary)}</p>
            <div class="takeaways-heading">Core Learning Points</div>
            <ul class="takeaways-list">
              ${takeawaysHtml}
            </ul>
          </div>
          <div class="lectures-list">
            ${lecturesHtml || '<p style="color:var(--text-muted); padding:10px;">No matching lectures found for this search filter.</p>'}
          </div>
        </div>
      `;

      // Accordion toggle on header click
      const header = weekCard.querySelector('.week-study-header');
      header.addEventListener('click', (e) => {
        if (e.target.closest('.practice-week-btn')) return;
        weekCard.classList.toggle('expanded');
      });

      // Quick Practice button inside header
      const practiceBtn = weekCard.querySelector('.practice-week-btn');
      practiceBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        launchSingleWeekQuiz(w);
      });

      studyWeeksAccordion.appendChild(weekCard);
    }

    if (!hasMatches) {
      studyWeeksAccordion.innerHTML = `
        <div style="text-align: center; padding: 40px; color: var(--text-muted);">
          <p style="font-size: 16px; margin-bottom: 8px;">No matching lecture notes found for "<strong>${escapeHtml(query)}</strong>"</p>
          <button class="btn btn-secondary" id="resetSearchEmptyBtn">Clear Search</button>
        </div>
      `;
      const btn = document.getElementById('resetSearchEmptyBtn');
      if (btn) btn.addEventListener('click', clearStudySearch);
    }
  }

  function launchSingleWeekQuiz(weekNum) {
    selectedWeeks.clear();
    selectedWeeks.add(weekNum);
    renderWeeksGrid();
    generateQuiz();
  }

  function clearStudySearch() {
    studySearchQuery = '';
    studySearchInput.value = '';
    clearSearchBtn.classList.add('hidden');
    renderStudyMaterial();
  }

  // --- GLOSSARY RENDERING ---
  function renderGlossary() {
    if (!studyData || !studyData.glossary) return;
    glossaryGrid.innerHTML = '';

    studyData.glossary.forEach(item => {
      const card = document.createElement('div');
      card.className = 'glossary-card';
      card.innerHTML = `
        <div class="glossary-card-top">
          <span class="glossary-term">${escapeHtml(item.term)}</span>
          <span class="glossary-full">${escapeHtml(item.full)}</span>
        </div>
        <p class="glossary-desc">${escapeHtml(item.desc)}</p>
      `;
      glossaryGrid.appendChild(card);
    });
  }

  // --- INTERACTIVE FLASHCARDS ---
  function initFlashcards() {
    if (!studyData || !studyData.flashcards) return;
    flashcardsList = [...studyData.flashcards];
    currentFlashcardIndex = 0;
    isCardFlipped = false;
    flashcardCountBadge.textContent = flashcardsList.length;
    renderCurrentFlashcard();
  }

  function renderCurrentFlashcard() {
    if (flashcardsList.length === 0) return;
    const card = flashcardsList[currentFlashcardIndex];

    isCardFlipped = false;
    activeFlashcard.classList.remove('flipped');

    flashcardCounter.textContent = `Card ${currentFlashcardIndex + 1} of ${flashcardsList.length}`;
    flashcardCategoryBadge.textContent = card.category || `Week ${card.week}`;

    cardFrontText.textContent = card.front;
    cardBackText.textContent = card.back;
    cardPageRef.textContent = card.pages ? `NPTEL Course Book ${card.pages}` : `Week ${card.week} · ${card.lecture || ''}`;
  }

  function toggleFlipCard() {
    isCardFlipped = !isCardFlipped;
    activeFlashcard.classList.toggle('flipped', isCardFlipped);
  }

  function nextFlashcard() {
    if (flashcardsList.length === 0) return;
    currentFlashcardIndex = (currentFlashcardIndex + 1) % flashcardsList.length;
    renderCurrentFlashcard();
  }

  function prevFlashcard() {
    if (flashcardsList.length === 0) return;
    currentFlashcardIndex = (currentFlashcardIndex - 1 + flashcardsList.length) % flashcardsList.length;
    renderCurrentFlashcard();
  }

  function shuffleFlashcardsDeck() {
    flashcardsList = shuffleArray(flashcardsList);
    currentFlashcardIndex = 0;
    renderCurrentFlashcard();
  }

  // --- LOCAL STORAGE: WRONG ANSWERS ---
  function getWrongAnswers() {
    try {
      const data = localStorage.getItem(STORAGE_KEY_WRONG);
      return data ? JSON.parse(data) : {};
    } catch (e) {
      return {};
    }
  }

  function saveWrongAnswer(item) {
    try {
      const mistakes = getWrongAnswers();
      const key = `w${item.weekNum}_q${item.id}`;
      mistakes[key] = {
        key,
        weekNum: item.weekNum,
        weekTitle: item.weekTitle,
        id: item.id,
        question: item.question,
        options: item.options,
        correctOption: item.correctOption,
        userAnswer: item.userAnswer,
        date: Date.now()
      };
      localStorage.setItem(STORAGE_KEY_WRONG, JSON.stringify(mistakes));
      updateWrongAnswersBar();
    } catch (e) {
      console.warn('Could not save mistake to localStorage:', e);
    }
  }

  function removeCorrectedAnswer(weekNum, questionId) {
    try {
      const mistakes = getWrongAnswers();
      const key = `w${weekNum}_q${questionId}`;
      if (mistakes[key]) {
        delete mistakes[key];
        localStorage.setItem(STORAGE_KEY_WRONG, JSON.stringify(mistakes));
        updateWrongAnswersBar();
      }
    } catch (e) {}
  }

  function clearAllWrongAnswers() {
    localStorage.removeItem(STORAGE_KEY_WRONG);
    updateWrongAnswersBar();
  }

  function updateWrongAnswersBar() {
    const mistakes = getWrongAnswers();
    const count = Object.keys(mistakes).length;

    if (count > 0) {
      wrongAnswersBar.classList.remove('hidden');
      wrongCountBadge.textContent = count;
      modalWrongCount.textContent = count;
    } else {
      wrongAnswersBar.classList.add('hidden');
      modalWrongCount.textContent = '0';
    }
  }

  // --- SHUFFLE UTILS ---
  function shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // --- QUIZ GENERATION & RUNNER ---
  function generateQuiz(customQuestions = null, customTitle = null) {
    let pool = [];

    if (customQuestions) {
      pool = customQuestions;
    } else {
      if (selectedWeeks.size === 0) return;
      selectedWeeks.forEach(w => {
        const weekObj = courseData[w];
        if (weekObj && weekObj.questions) {
          weekObj.questions.forEach(q => {
            pool.push({
              weekNum: w,
              weekTitle: weekObj.title,
              id: q.id,
              question: q.question,
              options: [...q.options],
              correctOption: q.correctOption
            });
          });
        }
      });
    }

    if (pool.length === 0) return;

    let processed = pool.map(item => {
      let finalOptions = item.options.map((text, idx) => ({
        text,
        originalIndex: idx
      }));

      if (shuffleAnswers) {
        finalOptions = shuffleArray(finalOptions);
      }

      const newCorrectIndex = finalOptions.findIndex(o => o.originalIndex === item.correctOption);

      return {
        ...item,
        options: finalOptions,
        correctOption: newCorrectIndex,
        userAnswer: null,
        isAnswered: false
      };
    });

    if (shuffleQuestions) {
      processed = shuffleArray(processed);
    }

    let title = 'Mixed quiz';
    let subtitle = '';

    if (customTitle) {
      title = customTitle;
      subtitle = `${processed.length} questions`;
    } else if (selectedWeeks.size === 1) {
      const w = Array.from(selectedWeeks)[0];
      title = `Week ${w} quiz`;
      subtitle = `${courseData[w].title} · ${processed.length} questions`;
    } else {
      const sorted = Array.from(selectedWeeks).sort((a, b) => a - b);
      title = 'Mixed quiz';
      subtitle = `Weeks ${sorted.join(', ')} · ${processed.length} questions${shuffleQuestions ? ', shuffled' : ''}`;
    }

    activeQuiz = {
      title,
      subtitle,
      mode: currentMode,
      questions: processed,
      currentIndex: 0,
      isComplete: false,
      results: []
    };

    updateQuizHeaderUI();
    renderCurrentQuestion();
    showView('quiz');
  }

  function updateQuizHeaderUI() {
    quizHeaderTitle.textContent = activeQuiz.title;
    quizHeaderSubtitle.textContent = activeQuiz.subtitle;

    const badge = quizHeaderModeBadge;
    badge.className = 'badge mode-badge';
    if (activeQuiz.mode === 'practice') {
      badge.textContent = 'Practice';
      badge.classList.add('practice-badge');
    } else if (activeQuiz.mode === 'quiz') {
      badge.textContent = 'Quiz';
      badge.classList.add('quiz-badge');
    } else {
      badge.textContent = 'Mock Test';
      badge.classList.add('mock-badge');
    }
  }

  function renderCurrentQuestion() {
    const qIndex = activeQuiz.currentIndex;
    const total = activeQuiz.questions.length;
    const q = activeQuiz.questions[qIndex];

    const percent = ((qIndex + 1) / total) * 100;
    quizProgressBar.style.width = `${percent}%`;

    questionCounter.textContent = `Question ${qIndex + 1} of ${total}`;
    questionWeekTag.textContent = `WEEK ${q.weekNum}`;

    questionText.innerHTML = renderMarkdown(q.question);
    questionInstruction.textContent = 'Select one answer';

    optionsList.innerHTML = '';
    practiceFeedback.classList.add('hidden');
    practiceFeedback.innerHTML = '';

    const isLocked = activeQuiz.mode === 'practice' && q.isAnswered;

    q.options.forEach((opt, idx) => {
      const optCard = document.createElement('div');
      optCard.className = 'option-card';
      if (isLocked) optCard.classList.add('locked');

      const isSelected = q.userAnswer === idx;
      if (isSelected) optCard.classList.add('selected');

      if (isLocked) {
        if (idx === q.correctOption) {
          optCard.classList.add('option-correct');
        } else if (isSelected && idx !== q.correctOption) {
          optCard.classList.add('option-incorrect');
        }
      }

      optCard.innerHTML = `
        <div class="option-radio">
          <div class="option-radio-dot"></div>
        </div>
        <span class="option-index-badge">${idx + 1}</span>
        <div class="option-content">${renderMarkdown(opt.text)}</div>
      `;

      optCard.addEventListener('click', () => {
        if (isLocked) return;
        selectOption(idx);
      });

      optionsList.appendChild(optCard);
    });

    if (isLocked) {
      showPracticeFeedback(q.userAnswer === q.correctOption);
    }

    if (qIndex > 0) {
      prevQuestionBtn.classList.remove('hidden');
    } else {
      prevQuestionBtn.classList.add('hidden');
    }

    if (qIndex === total - 1) {
      nextQuestionBtn.textContent = 'Finish quiz';
    } else {
      nextQuestionBtn.textContent = 'Next question';
    }
  }

  function selectOption(optionIndex) {
    const q = activeQuiz.questions[activeQuiz.currentIndex];
    q.userAnswer = optionIndex;
    q.isAnswered = true;

    if (activeQuiz.mode === 'practice') {
      const isCorrect = optionIndex === q.correctOption;
      if (!isCorrect) {
        saveWrongAnswer(q);
      } else {
        removeCorrectedAnswer(q.weekNum, q.id);
      }
      renderCurrentQuestion();
    } else {
      const cards = optionsList.querySelectorAll('.option-card');
      cards.forEach((c, idx) => {
        c.classList.toggle('selected', idx === optionIndex);
      });
    }
  }

  function showPracticeFeedback(isCorrect) {
    practiceFeedback.classList.remove('hidden');
    if (isCorrect) {
      practiceFeedback.className = 'practice-feedback feedback-correct';
      practiceFeedback.innerHTML = '&#10003; Correct! Well done.';
    } else {
      practiceFeedback.className = 'practice-feedback feedback-incorrect';
      practiceFeedback.innerHTML = '&#10007; Incorrect. Review the correct answer highlighted in green above.';
    }
  }

  function handleNextQuestion() {
    const q = activeQuiz.questions[activeQuiz.currentIndex];

    if (activeQuiz.mode !== 'practice' && q.isAnswered) {
      if (q.userAnswer !== q.correctOption) {
        saveWrongAnswer(q);
      } else {
        removeCorrectedAnswer(q.weekNum, q.id);
      }
    }

    if (activeQuiz.currentIndex < activeQuiz.questions.length - 1) {
      activeQuiz.currentIndex++;
      renderCurrentQuestion();
    } else {
      finishQuiz();
    }
  }

  function handlePrevQuestion() {
    if (activeQuiz.currentIndex > 0) {
      activeQuiz.currentIndex--;
      renderCurrentQuestion();
    }
  }

  // --- RESULTS & REVIEW ---
  function finishQuiz() {
    activeQuiz.isComplete = true;

    let correctCount = 0;
    const reviewItems = [];

    activeQuiz.questions.forEach((q, idx) => {
      const isCorrect = q.userAnswer === q.correctOption;
      if (isCorrect) {
        correctCount++;
        removeCorrectedAnswer(q.weekNum, q.id);
      } else {
        saveWrongAnswer(q);
      }

      reviewItems.push({
        ...q,
        indexNumber: idx + 1,
        isCorrect
      });
    });

    const total = activeQuiz.questions.length;
    const percentage = Math.round((correctCount / total) * 100);
    const missedCount = total - correctCount;

    resultsTitle.textContent = activeQuiz.title;
    resultsSubtitle.textContent = activeQuiz.subtitle;

    const badge = resultsModeBadge;
    badge.className = 'badge mode-badge';
    if (activeQuiz.mode === 'practice') {
      badge.textContent = 'Practice';
      badge.classList.add('practice-badge');
    } else if (activeQuiz.mode === 'quiz') {
      badge.textContent = 'Quiz';
      badge.classList.add('quiz-badge');
    } else {
      badge.textContent = 'Mock Test';
      badge.classList.add('mock-badge');
    }

    scoreFraction.textContent = `${correctCount} / ${total}`;
    scorePercent.textContent = `${percentage}%`;

    if (missedCount > 0) {
      scoreReviewCount.textContent = `${missedCount} ${missedCount === 1 ? 'question' : 'questions'} to review.`;
      retryMissedBtn.classList.remove('hidden');
      retryMissedBtn.textContent = `Retry missed (${missedCount})`;
    } else {
      scoreReviewCount.textContent = 'Perfect score! Outstanding work!';
      retryMissedBtn.classList.add('hidden');
    }

    renderReviewList(reviewItems);
    showView('results');
  }

  function renderReviewList(items) {
    reviewItemsList.innerHTML = '';

    items.forEach(item => {
      const reviewCard = document.createElement('div');
      reviewCard.className = 'review-item';

      const userChoiceText = (item.userAnswer !== null && item.options[item.userAnswer])
        ? item.options[item.userAnswer].text
        : '(No answer provided)';

      const correctChoiceText = item.options[item.correctOption]
        ? item.options[item.correctOption].text
        : '';

      let answerHtml = '';

      if (item.isCorrect) {
        answerHtml = `
          <div class="answer-box correct-answer-box">
            <span class="answer-label">Correct answer</span>
            <span class="answer-text">${renderMarkdown(correctChoiceText)}</span>
          </div>
        `;
      } else {
        answerHtml = `
          <div class="answer-box your-answer-wrong">
            <span class="answer-label">Your answer</span>
            <span class="answer-text">${renderMarkdown(userChoiceText)}</span>
          </div>
          <div class="answer-box correct-answer-box">
            <span class="answer-label">Correct answer</span>
            <span class="answer-text">${renderMarkdown(correctChoiceText)}</span>
          </div>
        `;
      }

      reviewCard.innerHTML = `
        <div class="review-item-header">${item.indexNumber}. WEEK ${item.weekNum}</div>
        <div class="review-item-question">${renderMarkdown(item.question)}</div>
        ${answerHtml}
      `;

      reviewItemsList.appendChild(reviewCard);
    });
  }

  // --- PRACTICE WRONG ANSWERS ---
  function practiceWrongAnswers() {
    const mistakes = Object.values(getWrongAnswers());
    if (mistakes.length === 0) return;

    wrongAnswersModal.classList.add('hidden');

    const questions = mistakes.map(m => ({
      weekNum: m.weekNum,
      weekTitle: m.weekTitle || `Week ${m.weekNum}`,
      id: m.id,
      question: m.question,
      options: [...m.options],
      correctOption: m.correctOption
    }));

    generateQuiz(questions, 'Wrong answers practice');
  }

  function showWrongAnswersModal() {
    const mistakes = Object.values(getWrongAnswers());
    modalWrongList.innerHTML = '';

    if (mistakes.length === 0) {
      modalWrongList.innerHTML = '<p style="color: var(--text-muted); text-align: center; padding: 20px;">No saved wrong answers! Keep practicing!</p>';
    } else {
      mistakes.forEach(m => {
        const item = document.createElement('div');
        item.className = 'wrong-item-card';
        const correctText = m.options[m.correctOption] || '';
        item.innerHTML = `
          <div class="wrong-item-week">WEEK ${m.weekNum}</div>
          <div class="wrong-item-question">${renderMarkdown(m.question)}</div>
          <div class="wrong-item-answer">&#10003; Correct: ${renderMarkdown(correctText)}</div>
        `;
        modalWrongList.appendChild(item);
      });
    }

    wrongAnswersModal.classList.remove('hidden');
  }

  // --- EVENT LISTENERS ---
  function setupEventListeners() {
    // Nav view tabs
    tabQuizView.addEventListener('click', () => showView('course'));
    tabStudyView.addEventListener('click', () => showView('study'));
    goToStudyBtn.addEventListener('click', () => showView('study'));
    studyToQuizBtn.addEventListener('click', () => showView('course'));
    studyBackLink.addEventListener('click', (e) => {
      e.preventDefault();
      showView('course');
    });

    // Brand link / exit links to course home
    navHomeLink.addEventListener('click', (e) => {
      e.preventDefault();
      showView('course');
    });

    quizExitLink.addEventListener('click', (e) => {
      e.preventDefault();
      if (confirm('Leave quiz? Your current progress will be lost.')) {
        showView('course');
      }
    });

    quitQuizBtn.addEventListener('click', () => {
      if (confirm('Leave quiz? Your current progress will be lost.')) {
        showView('course');
      }
    });

    resultsExitLink.addEventListener('click', (e) => {
      e.preventDefault();
      showView('course');
    });

    chooseDifferentWeeksBtn.addEventListener('click', () => {
      showView('course');
    });

    // Select All / Deselect All
    selectAllBtn.addEventListener('click', () => {
      if (selectedWeeks.size === 12) {
        selectedWeeks.clear();
      } else {
        selectedWeeks = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
      }
      renderWeeksGrid();
    });

    // Clear Selection
    clearSelectionBtn.addEventListener('click', () => {
      selectedWeeks.clear();
      renderWeeksGrid();
    });

    // Mode Selector
    modeButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        modeButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentMode = btn.dataset.mode;
      });
    });

    // Mode Info Modal
    modeInfoBtn.addEventListener('click', () => {
      modeInfoModal.classList.remove('hidden');
    });
    closeModeInfoBtn.addEventListener('click', () => {
      modeInfoModal.classList.add('hidden');
    });
    modeInfoModal.addEventListener('click', (e) => {
      if (e.target === modeInfoModal) modeInfoModal.classList.add('hidden');
    });

    // Toggles
    shuffleQuestionsToggle.addEventListener('change', (e) => {
      shuffleQuestions = e.target.checked;
    });
    shuffleAnswersToggle.addEventListener('change', (e) => {
      shuffleAnswers = e.target.checked;
    });

    // Generate Quiz
    generateQuizBtn.addEventListener('click', () => {
      generateQuiz();
    });

    // Quiz Navigation
    nextQuestionBtn.addEventListener('click', handleNextQuestion);
    prevQuestionBtn.addEventListener('click', handlePrevQuestion);

    // Results Actions
    retryMissedBtn.addEventListener('click', () => {
      const missed = activeQuiz.questions.filter(q => q.userAnswer !== q.correctOption);
      if (missed.length > 0) {
        const questions = missed.map(m => ({
          weekNum: m.weekNum,
          weekTitle: m.weekTitle,
          id: m.id,
          question: m.question,
          options: m.options.map(o => o.text),
          correctOption: m.options[m.correctOption].originalIndex
        }));
        generateQuiz(questions, 'Retry missed questions');
      }
    });

    newShuffleBtn.addEventListener('click', () => {
      generateQuiz();
    });

    // Wrong Answers Features
    practiceWrongBtn.addEventListener('click', practiceWrongAnswers);
    viewWrongBtn.addEventListener('click', showWrongAnswersModal);
    clearWrongBtn.addEventListener('click', () => {
      if (confirm('Clear all saved wrong answers?')) {
        clearAllWrongAnswers();
      }
    });

    closeModalBtn.addEventListener('click', () => {
      wrongAnswersModal.classList.add('hidden');
    });
    wrongAnswersModal.addEventListener('click', (e) => {
      if (e.target === wrongAnswersModal) wrongAnswersModal.classList.add('hidden');
    });
    modalPracticeBtn.addEventListener('click', practiceWrongAnswers);
    modalClearBtn.addEventListener('click', () => {
      if (confirm('Clear all saved wrong answers?')) {
        clearAllWrongAnswers();
        showWrongAnswersModal();
      }
    });

    // Study Material Submode Tabs
    studyTabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        studyTabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const mode = btn.dataset.studymode;
        currentStudySubmode = mode;

        lecturesSubView.classList.toggle('hidden', mode !== 'lectures');
        flashcardsSubView.classList.toggle('hidden', mode !== 'flashcards');
        glossarySubView.classList.toggle('hidden', mode !== 'glossary');
      });
    });

    // Study Search
    studySearchInput.addEventListener('input', (e) => {
      studySearchQuery = e.target.value;
      clearSearchBtn.classList.toggle('hidden', !studySearchQuery);
      renderStudyMaterial();
    });

    clearSearchBtn.addEventListener('click', clearStudySearch);

    // Week Filter Select
    weekFilterSelect.addEventListener('change', (e) => {
      selectedWeekFilter = e.target.value;
      renderStudyMaterial();
    });

    // Expand / Collapse all toggle
    let allExpanded = false;
    toggleExpandAllBtn.addEventListener('click', () => {
      allExpanded = !allExpanded;
      const cards = studyWeeksAccordion.querySelectorAll('.week-study-card');
      cards.forEach(c => c.classList.toggle('expanded', allExpanded));
      toggleExpandAllBtn.textContent = allExpanded ? 'Collapse all' : 'Expand all';
    });

    // Flashcard Actions
    activeFlashcard.addEventListener('click', toggleFlipCard);
    flipFlashcardBtn.addEventListener('click', toggleFlipCard);
    nextFlashcardBtn.addEventListener('click', nextFlashcard);
    prevFlashcardBtn.addEventListener('click', prevFlashcard);
    shuffleFlashcardsBtn.addEventListener('click', shuffleFlashcardsDeck);

    // Keyboard Shortcuts
    window.addEventListener('keydown', (e) => {
      if (!wrongAnswersModal.classList.contains('hidden') || !modeInfoModal.classList.contains('hidden')) {
        if (e.key === 'Escape') {
          wrongAnswersModal.classList.add('hidden');
          modeInfoModal.classList.add('hidden');
        }
        return;
      }

      // Quiz mode shortcuts
      if (!views.quiz.classList.contains('hidden')) {
        if (e.key >= '1' && e.key <= '9') {
          const optIdx = parseInt(e.key) - 1;
          const q = activeQuiz.questions[activeQuiz.currentIndex];
          if (q && optIdx < q.options.length) {
            if (!(activeQuiz.mode === 'practice' && q.isAnswered)) {
              selectOption(optIdx);
            }
          }
        } else if (e.key === 'Enter') {
          e.preventDefault();
          handleNextQuestion();
        } else if (e.key === 'ArrowLeft') {
          handlePrevQuestion();
        }
      }

      // Flashcards shortcuts when active
      if (!views.study.classList.contains('hidden') && currentStudySubmode === 'flashcards') {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          toggleFlipCard();
        } else if (e.key === 'ArrowRight') {
          nextFlashcard();
        } else if (e.key === 'ArrowLeft') {
          prevFlashcard();
        }
      }
    });
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
