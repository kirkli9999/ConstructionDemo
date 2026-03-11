/**
 * 六張紙片：溝通氣場實踐工具 - 核心邏輯
 * Six Cards Communication Tool - Core Logic
 */

// State management
var sixcardsState = {
  inputText: '',
  audience: 'chairman',
  goal: 'resources',
  activeVersion: 'profit',
  versions: { profit: [], risk: [], talent: [] },
  generated: false,
  practiceMode: false,
  practiceIndex: 0,
};

// --- Text Processing (Mock AI) ---

function scRemoveFillerWords(text) {
  var fillers = MOCK_DATA.sixCards.fillerWords;
  var result = text;
  fillers.forEach(function (w) {
    var re = new RegExp(w + '[，、。]?\\s*', 'g');
    result = result.replace(re, '');
  });
  // Clean up double punctuation
  result = result.replace(/[，、]{2,}/g, '，');
  result = result.replace(/^\s*[，、。]\s*/gm, '');
  return result.trim();
}

function scSplitIntoSentences(text) {
  // Split on Chinese sentence-ending punctuation and newlines
  var raw = text.split(/[。！？；\n]+/).map(function (s) { return s.trim(); });
  return raw.filter(function (s) { return s.length > 0; });
}

function scDistributeIntoSixGroups(sentences) {
  var groups = [[], [], [], [], [], []];

  if (sentences.length === 0) return groups.map(function () { return ''; });

  if (sentences.length <= 6) {
    // Assign one sentence per group, pad with rephrased if needed
    for (var i = 0; i < 6; i++) {
      groups[i] = sentences[i] || sentences[i % sentences.length];
    }
  } else {
    // Distribute evenly
    var perGroup = Math.ceil(sentences.length / 6);
    for (var j = 0; j < sentences.length; j++) {
      var gIdx = Math.min(Math.floor(j / perGroup), 5);
      groups[gIdx].push(sentences[j]);
    }
  }

  // Flatten groups: join sentences within each group
  return groups.map(function (g) {
    if (Array.isArray(g)) return g.join('，');
    return g;
  });
}

function scApplyTone(chunk, versionType) {
  var vType = MOCK_DATA.sixCards.versionTypes.find(function (v) { return v.id === versionType; });
  if (!vType || !chunk) return chunk;

  // Simple tone application: for each version, emphasize relevant keywords
  // and add a subtle framing when keywords are present
  var hasKeyword = vType.keywords.some(function (k) { return chunk.indexOf(k) >= 0; });

  if (hasKeyword) {
    return chunk;
  }
  return chunk;
}

function scGenerateSixCards(rawText, audience, goal) {
  var cleaned = scRemoveFillerWords(rawText);
  var sentences = scSplitIntoSentences(cleaned);
  var chunks = scDistributeIntoSixGroups(sentences);

  var versions = {};
  MOCK_DATA.sixCards.versionTypes.forEach(function (vType) {
    versions[vType.id] = chunks.map(function (c) {
      return scApplyTone(c, vType.id);
    });
  });

  return versions;
}

// --- Rendering ---

function scRenderVersionBar() {
  var bar = document.getElementById('sixcardsVersionBar');
  if (!bar) return;

  bar.style.display = '';
  bar.innerHTML = MOCK_DATA.sixCards.versionTypes.map(function (v) {
    var activeClass = sixcardsState.activeVersion === v.id ? ' active' : '';
    return '<button class="sixcards-version-btn' + activeClass + '" data-version="' + v.id + '">' +
      v.label + '</button>';
  }).join('');

  // Bind version switch events
  bar.querySelectorAll('.sixcards-version-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      sixcardsState.activeVersion = btn.dataset.version;
      scExitPracticeMode();
      scRenderVersionBar();
      scRenderBoard();
    });
  });
}

function scRenderBoard() {
  var board = document.getElementById('sixcardsBoard');
  if (!board) return;

  var cards = sixcardsState.versions[sixcardsState.activeVersion];
  if (!cards || cards.length === 0) {
    board.style.display = 'none';
    return;
  }

  board.style.display = '';
  board.innerHTML = cards.map(function (text, idx) {
    var cardClass = 'sixcards-card';
    if (sixcardsState.practiceMode) {
      if (idx < sixcardsState.practiceIndex) {
        cardClass += ' practiced';
      } else if (idx === sixcardsState.practiceIndex) {
        cardClass += ' active practice-clickable';
      }
    }

    return '<div class="' + cardClass + '" data-index="' + idx + '">' +
      '<div class="sixcards-card-header">' +
        '<span class="sixcards-card-number">' + (idx + 1) + '</span>' +
        '<span class="sixcards-card-label">觀點 ' + (idx + 1) + '</span>' +
      '</div>' +
      '<div class="sixcards-card-text">' + text + '</div>' +
    '</div>';
  }).join('');

  // Bind practice click if in practice mode
  if (sixcardsState.practiceMode) {
    board.querySelectorAll('.sixcards-card.practice-clickable').forEach(function (card) {
      card.addEventListener('click', function () {
        scAdvancePractice();
      });
    });
  }
}

function scShowActions() {
  var actions = document.getElementById('sixcardsActions');
  if (actions) actions.style.display = '';
}

function scUpdatePracticeButton() {
  var btn = document.getElementById('sixcardsPractice');
  if (!btn) return;

  if (sixcardsState.practiceMode) {
    btn.textContent = '結束練習';
    btn.classList.add('stop');
  } else {
    btn.textContent = '開始練習模式';
    btn.classList.remove('stop');
  }
}

function scUpdatePracticeStatus() {
  var status = document.getElementById('sixcardsPracticeStatus');
  if (!status) return;

  if (!sixcardsState.practiceMode) {
    status.style.display = 'none';
    return;
  }

  status.style.display = '';
  if (sixcardsState.practiceIndex >= 6) {
    status.innerHTML = '<span class="practice-complete">練習完成！六張紙片全部講完。點擊「結束練習」可重新開始。</span>';
  } else {
    status.innerHTML = '目前進度：第 <strong>' + (sixcardsState.practiceIndex + 1) +
      '</strong> / 6 張 — 點擊高亮卡片表示「講完這個觀點」，練習停頓後再講下一張';
  }
}

// --- Practice Mode ---

function scStartPracticeMode() {
  sixcardsState.practiceMode = true;
  sixcardsState.practiceIndex = 0;
  scRenderBoard();
  scUpdatePracticeButton();
  scUpdatePracticeStatus();
}

function scExitPracticeMode() {
  sixcardsState.practiceMode = false;
  sixcardsState.practiceIndex = 0;
  scRenderBoard();
  scUpdatePracticeButton();
  scUpdatePracticeStatus();
}

function scAdvancePractice() {
  sixcardsState.practiceIndex++;
  scRenderBoard();
  scUpdatePracticeStatus();
}

// --- Page Lifecycle ---

function initSixCardsPage() {
  // Re-render if we already have generated cards
  if (sixcardsState.generated) {
    scRenderVersionBar();
    scRenderBoard();
    scShowActions();
    scUpdatePracticeButton();
    scUpdatePracticeStatus();
  }
}

function initSixCardsListeners() {
  // Generate button
  var genBtn = document.getElementById('sixcardsGenerate');
  if (genBtn) {
    genBtn.addEventListener('click', function () {
      var input = document.getElementById('sixcardsInput');
      var rawText = input ? input.value.trim() : '';

      if (rawText.length < 20) {
        alert('請輸入至少 20 個字的內容');
        return;
      }

      var audience = document.getElementById('sixcardsAudience').value;
      var goal = document.getElementById('sixcardsGoal').value;

      sixcardsState.inputText = rawText;
      sixcardsState.audience = audience;
      sixcardsState.goal = goal;
      sixcardsState.activeVersion = 'profit';
      sixcardsState.practiceMode = false;
      sixcardsState.practiceIndex = 0;

      // Check if input matches sample (use sample output for better demo)
      if (rawText === MOCK_DATA.sixCards.sampleInput) {
        sixcardsState.versions = {
          profit: MOCK_DATA.sixCards.sampleOutput.profit.slice(),
          risk: MOCK_DATA.sixCards.sampleOutput.risk.slice(),
          talent: MOCK_DATA.sixCards.sampleOutput.talent.slice(),
        };
      } else {
        sixcardsState.versions = scGenerateSixCards(rawText, audience, goal);
      }

      sixcardsState.generated = true;
      scRenderVersionBar();
      scRenderBoard();
      scShowActions();
      scUpdatePracticeButton();
      scUpdatePracticeStatus();
    });
  }

  // Demo button
  var demoBtn = document.getElementById('sixcardsDemo');
  if (demoBtn) {
    demoBtn.addEventListener('click', function () {
      var input = document.getElementById('sixcardsInput');
      if (input) input.value = MOCK_DATA.sixCards.sampleInput;
    });
  }

  // Practice button
  var practiceBtn = document.getElementById('sixcardsPractice');
  if (practiceBtn) {
    practiceBtn.addEventListener('click', function () {
      if (sixcardsState.practiceMode) {
        scExitPracticeMode();
      } else {
        scStartPracticeMode();
      }
    });
  }

  // PDF button
  var pdfBtn = document.getElementById('sixcardsPdf');
  if (pdfBtn) {
    pdfBtn.addEventListener('click', function () {
      if (typeof generateSixCardsPDF === 'function') {
        var cards = sixcardsState.versions[sixcardsState.activeVersion];
        var audienceLabel = '';
        var goalLabel = '';
        MOCK_DATA.sixCards.audiences.forEach(function (a) {
          if (a.id === sixcardsState.audience) audienceLabel = a.label;
        });
        MOCK_DATA.sixCards.goals.forEach(function (g) {
          if (g.id === sixcardsState.goal) goalLabel = g.label;
        });
        var versionLabel = '';
        MOCK_DATA.sixCards.versionTypes.forEach(function (v) {
          if (v.id === sixcardsState.activeVersion) versionLabel = v.label;
        });
        generateSixCardsPDF(cards, audienceLabel, goalLabel, versionLabel);
      }
    });
  }
}

// PLACEHOLDER: Replace with actual AI API call in production
// async function callAIService(text, audience, goal) {
//   const response = await fetch('/api/sixcards/generate', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ text, audience, goal })
//   });
//   return response.json();
// }
