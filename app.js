// --- STATE MANAGEMENT ---
let leads = JSON.parse(localStorage.getItem('clientpulse_leads')) || [
  {
    id: '1',
    clientName: 'Alex Mercer',
    companyName: 'Apex Logistics',
    dealValue: 1200,
    stage: 'lead',
    email: 'alex@apex.com',
    phone: '+15550192',
    notes: 'Inquired via web calculator for landing page.'
  },
  {
    id: '2',
    clientName: 'Elena Rostova',
    companyName: 'Vanguard Tech',
    dealValue: 3500,
    stage: 'proposal',
    email: 'elena@vanguard.io',
    phone: '+15550881',
    notes: 'Sent scope document for full SaaS portal.'
  }
];

// --- DOM ELEMENTS ---
const searchInput = document.getElementById('search-input');
const themeToggleBtn = document.getElementById('theme-toggle-btn');
const openAddLeadBtn = document.getElementById('open-add-lead-btn');

const leadModal = document.getElementById('lead-modal');
const closeModalBtn = document.getElementById('close-modal-btn');
const leadForm = document.getElementById('lead-form');
const modalTitle = document.getElementById('modal-title');

// Metrics
const metricTotalDeals = document.getElementById('metric-total-deals');
const metricPipelineValue = document.getElementById('metric-pipeline-value');
const metricWonValue = document.getElementById('metric-won-value');
const metricWinRate = document.getElementById('metric-win-rate');

// Stages
const stages = ['lead', 'contacted', 'proposal', 'won', 'lost'];

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  renderBoard();
});

// --- THEME ENGINE ---
function initTheme() {
  if (localStorage.getItem('clientpulse_theme') === 'dark') {
    document.body.classList.add('dark-mode');
    themeToggleBtn.querySelector('i').className = 'fa-solid fa-sun';
  }
}

themeToggleBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  const isDark = document.body.classList.contains('dark-mode');
  localStorage.setItem('clientpulse_theme', isDark ? 'dark' : 'light');
  themeToggleBtn.querySelector('i').className = isDark ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
});

// --- RENDER BOARD & CALCULATE METRICS ---
function renderBoard() {
  const query = searchInput.value.toLowerCase();

  // Clear column containers
  stages.forEach(stage => {
    const container = document.getElementById(`stage-${stage}`);
    container.innerHTML = '';
  });

  let totalDealsCount = 0;
  let totalPipelineVal = 0;
  let totalWonVal = 0;
  let wonDealsCount = 0;

  const stageTotals = { lead: 0, contacted: 0, proposal: 0, won: 0, lost: 0 };
  const stageCounts = { lead: 0, contacted: 0, proposal: 0, won: 0, lost: 0 };

  leads.forEach(lead => {
    // Search Filter
    if (
      lead.clientName.toLowerCase().includes(query) ||
      lead.companyName.toLowerCase().includes(query)
    ) {
      const card = createLeadCard(lead);
      const targetContainer = document.getElementById(`stage-${lead.stage}`);
      if (targetContainer) targetContainer.appendChild(card);
    }

    // Metrics Calculation
    totalDealsCount++;
    const val = parseFloat(lead.dealValue) || 0;
    stageTotals[lead.stage] += val;
    stageCounts[lead.stage]++;

    if (lead.stage !== 'lost') {
      totalPipelineVal += val;
    }
    if (lead.stage === 'won') {
      totalWonVal += val;
      wonDealsCount++;
    }
  });

  // Update Stage Headers
  stages.forEach(stage => {
    const col = document.querySelector(`.pipeline-column[data-stage="${stage}"]`);
    if (col) {
      col.querySelector('.stage-count').innerText = stageCounts[stage];
      col.querySelector('.stage-total').innerText = `$${stageTotals[stage].toLocaleString()}`;
    }
  });

  // Update Metrics Bar
  metricTotalDeals.innerText = totalDealsCount;
  metricPipelineValue.innerText = `$${totalPipelineVal.toLocaleString()}`;
  metricWonValue.innerText = `$${totalWonVal.toLocaleString()}`;

  const winRate = totalDealsCount > 0 ? ((wonDealsCount / totalDealsCount) * 100).toFixed(0) : 0;
  metricWinRate.innerText = `${winRate}%`;

  localStorage.setItem('clientpulse_leads', JSON.stringify(leads));
}

// --- CARD TEMPLATE ---
function createLeadCard(lead) {
  const card = document.createElement('div');
  card.className = 'lead-card';
  card.draggable = true;
  card.dataset.id = lead.id;

  card.innerHTML = `
    <div class="lead-card-header">
      <div>
        <div class="lead-name">${escapeHTML(lead.clientName)}</div>
        <div class="company-name">${escapeHTML(lead.companyName)}</div>
      </div>
      <div class="deal-amount">$${parseFloat(lead.dealValue).toLocaleString()}</div>
    </div>
    <div class="lead-contact-info">
      ${lead.email ? `<div><i class="fa-solid fa-envelope"></i> ${escapeHTML(lead.email)}</div>` : ''}
      ${lead.phone ? `<div><i class="fa-solid fa-phone"></i> ${escapeHTML(lead.phone)}</div>` : ''}
    </div>
    ${lead.notes ? `<div class="lead-notes-preview">"${escapeHTML(lead.notes)}"</div>` : ''}
    <div class="card-actions">
      <button class="card-btn edit-btn" onclick="editLead('${lead.id}')"><i class="fa-solid fa-pen"></i> Edit</button>
      <button class="card-btn delete" onclick="deleteLead('${lead.id}')"><i class="fa-solid fa-trash"></i></button>
    </div>
  `;

  // Drag and Drop Events
  card.addEventListener('dragstart', (e) => {
    e.dataTransfer.setData('text/plain', lead.id);
    card.style.opacity = '0.5';
  });

  card.addEventListener('dragend', () => {
    card.style.opacity = '1';
  });

  return card;
}

// --- DRAG AND DROP COLUMNS ---
document.querySelectorAll('.pipeline-column').forEach(column => {
  column.addEventListener('dragover', (e) => {
    e.preventDefault();
    column.style.background = 'rgba(37, 99, 235, 0.05)';
  });

  column.addEventListener('dragleave', () => {
    column.style.background = 'rgba(0, 0, 0, 0.02)';
  });

  column.addEventListener('drop', (e) => {
    e.preventDefault();
    column.style.background = 'rgba(0, 0, 0, 0.02)';
    const leadId = e.dataTransfer.getData('text/plain');
    const targetStage = column.dataset.stage;

    const lead = leads.find(l => l.id === leadId);
    if (lead) {
      lead.stage = targetStage;
      renderBoard();
    }
  });
});

// --- SEARCH & FILTER ---
searchInput.addEventListener('input', renderBoard);

// --- MODAL CONTROLS ---
openAddLeadBtn.addEventListener('click', () => {
  leadForm.reset();
  document.getElementById('lead-id').value = '';
  modalTitle.innerText = 'Add New Lead';
  leadModal.classList.add('active');
});

closeModalBtn.addEventListener('click', () => leadModal.classList.remove('active'));

window.addEventListener('click', (e) => {
  if (e.target === leadModal) leadModal.classList.remove('active');
});

// --- FORM SUBMISSION (ADD / EDIT) ---
leadForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const id = document.getElementById('lead-id').value;
  const clientName = document.getElementById('client-name').value;
  const companyName = document.getElementById('company-name').value;
  const dealValue = parseFloat(document.getElementById('deal-value').value);
  const stage = document.getElementById('pipeline-stage').value;
  const email = document.getElementById('client-email').value;
  const phone = document.getElementById('client-phone').value;
  const notes = document.getElementById('lead-notes').value;

  if (id) {
    // Edit existing lead
    const lead = leads.find(l => l.id === id);
    if (lead) {
      lead.clientName = clientName;
      lead.companyName = companyName;
      lead.dealValue = dealValue;
      lead.stage = stage;
      lead.email = email;
      lead.phone = phone;
      lead.notes = notes;
    }
  } else {
    // Add new lead
    leads.push({
      id: Date.now().toString(),
      clientName,
      companyName,
      dealValue,
      stage,
      email,
      phone,
      notes
    });
  }

  leadModal.classList.remove('active');
  renderBoard();
});

// --- EDIT & DELETE HANDLERS ---
window.editLead = function(id) {
  const lead = leads.find(l => l.id === id);
  if (!lead) return;

  document.getElementById('lead-id').value = lead.id;
  document.getElementById('client-name').value = lead.clientName;
  document.getElementById('company-name').value = lead.companyName;
  document.getElementById('deal-value').value = lead.dealValue;
  document.getElementById('pipeline-stage').value = lead.stage;
  document.getElementById('client-email').value = lead.email || '';
  document.getElementById('client-phone').value = lead.phone || '';
  document.getElementById('lead-notes').value = lead.notes || '';

  modalTitle.innerText = 'Edit Lead Record';
  leadModal.classList.add('active');
};

window.deleteLead = function(id) {
  if (confirm('Are you sure you want to delete this lead record?')) {
    leads = leads.filter(l => l.id !== id);
    renderBoard();
  }
};

// --- UTILITY ---
function escapeHTML(str) {
  return str ? str.replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  ) : '';
}