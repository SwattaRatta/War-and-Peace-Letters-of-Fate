/* ================== ELEMENTS ================== */
const menuScreen = document.getElementById('menu');
const prologueScreen = document.getElementById('prologue');
const charScreen = document.getElementById('char-setup');
const letterScreen = document.getElementById('letter-scene');
const salonScreen = document.getElementById('salon');

const startBtn = document.getElementById('start-button');
const settingsBtn = document.getElementById('settings-button');
const quitBtn = document.getElementById('quit-button');

const letterEl = document.getElementById('letterText');
const continueBtn = document.getElementById('continue-button');
const skipBtn = document.getElementById('skip-typing');
const backBtn = document.getElementById('back-to-menu');

const roleGrid = document.getElementById('roleGrid');
const roleDetails = document.getElementById('roleDetails');
const roleName = document.getElementById('roleName');
const roleBlurb = document.getElementById('roleBlurb');
const statList = document.getElementById('statList');
const beginBtn = document.getElementById('begin-button');
const charBackBtn = document.getElementById('char-back');

const rollBoonsBtn = document.getElementById('roll-boons');
const boonRow = document.getElementById('boonRow');
const letterInput = document.getElementById('letterInput');
const toneButtons = document.querySelectorAll('.tone-btn');
const baseStatEl = document.getElementById('baseStat');
const boonTotalEl = document.getElementById('boonTotal');
const inspoDieEl = document.getElementById('inspoDie');
const totalScoreEl = document.getElementById('totalScore');
const rollInspoBtn = document.getElementById('roll-inspo');
const sendLetterBtn = document.getElementById('send-letter');
const backToRolesBtn = document.getElementById('back-to-roles');
const resultPanel = document.getElementById('resultPanel');
const resultTitle = document.getElementById('resultTitle');
const resultText = document.getElementById('resultText');
const continueFromResult = document.getElementById('continue-from-result');

const encounterGrid = document.getElementById('encounterGrid');
const encPanel = document.getElementById('encounterPanel');
const encTitle = document.getElementById('encTitle');
const encBlurb = document.getElementById('encBlurb');
const encApproach = document.getElementById('encApproach');
const encDC = document.getElementById('encDC');
const rollD20Btn = document.getElementById('roll-d20');
const salonBackBtn = document.getElementById('salon-back');
const encResultBox = document.getElementById('encResult');
const encOutcomeTitle = document.getElementById('encOutcomeTitle');
const encOutcomeText = document.getElementById('encOutcomeText');
const encLeftEl = document.getElementById('encLeft');
const endEveningBtn = document.getElementById('end-evening');
const salonToMenuBtn = document.getElementById('salon-to-menu');

/* ================== STATE ================== */
const state = {
  role: null,
  stats: {},
  tone: null,
  boons: [],
  inspoDie: null,
  world: {
    generalBoldness: 0,
    officerCaution: 0,
    courtRumor: 0,
    alliancePressure: 0
  },
  encountersRemaining: 2,
  currentEncounter: null
};

/* ================== TEXT ================== */
const invitationText =
`To the Honored Guest,

If you are not otherwise engaged, do come to my little gathering this evening.
We shall speak of the latest news from Petersburg and of that tiresome
Corsican—though I promise you better company than the Gazette provides.
There will be music, a little soup, and—if Providence smiles upon us—some
diversion from the anxieties of war.

Pray arrive at eight o’clock. Your presence will lend our salon
a grace it sorely needs.

— A. P. Scherer`;

/* ================== TYPEWRITER ================== */
let typer = null;
function typeText(element, text, cps = 42) {
  clearType();
  element.textContent = '';
  let i = 0; const delay = 1000 / cps;
  typer = setInterval(() => {
    element.textContent += text[i++];
    if (i >= text.length) clearType();
  }, delay);
}
function clearType(){ if (typer){ clearInterval(typer); typer = null; } }

/* ================== SCREENS ================== */
function show(screen) {
  [menuScreen, prologueScreen, charScreen, letterScreen, salonScreen].forEach(s => s.classList.add('hidden'));
  if (screen === 'menu') menuScreen.classList.remove('hidden');
  if (screen === 'prologue') prologueScreen.classList.remove('hidden');
  if (screen === 'char') charScreen.classList.remove('hidden');
  if (screen === 'letter') letterScreen.classList.remove('hidden');
  if (screen === 'salon') salonScreen.classList.remove('hidden');
}

/* ================== ROLES ================== */
const ROLES = [
  {
    key: 'officer',
    name: 'Young Officer (Aide-de-camp)',
    initials: 'YO',
    blurb: 'A rising star at court, sworn to duty and glory. You write with clarity and courage; society watches your every word.',
    stats: { Reputation: 3, Nerve: 4, Tact: 2, Insight: 2, Charm: 3 }
  },
  {
    key: 'salon',
    name: 'Salon Wit (Anna Pavlovna’s Circle)',
    initials: 'SW',
    blurb: 'A master of conversation and subtext. Your letters glide through salons, steering opinions without leaving fingerprints.',
    stats: { Reputation: 4, Nerve: 2, Tact: 4, Insight: 3, Charm: 4 }
  },
  {
    key: 'heiress',
    name: 'Provincial Heiress (Rostov Kin)',
    initials: 'PH',
    blurb: 'Warm-hearted and well-connected, you command sympathy and surprise. Affections sway with your pen.',
    stats: { Reputation: 3, Nerve: 2, Tact: 3, Insight: 3, Charm: 5 }
  },
  {
    key: 'attache',
    name: 'Foreign Attaché (Discreet Observer)',
    initials: 'FA',
    blurb: 'A courteous spy with a poet’s hand. You see what others miss and commit it to paper—carefully.',
    stats: { Reputation: 2, Nerve: 3, Tact: 3, Insight: 5, Charm: 3 }
  }
];

function renderRoles() {
  roleGrid.innerHTML = ROLES.map(r => `
    <article class="card" data-role="${r.key}">
      <div class="card-header">
        <div class="portrait">${r.initials}</div>
        <div>
          <h4>${r.name}</h4>
          <p>${r.blurb}</p>
        </div>
      </div>
    </article>
  `).join('');

  roleGrid.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', () => {
      roleGrid.querySelectorAll('.card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');

      const key = card.getAttribute('data-role');
      const role = ROLES.find(r => r.key === key);
      state.role = role.name;
      state.stats = role.stats;

      roleDetails.classList.remove('hidden');
      roleName.textContent = role.name;
      roleBlurb.textContent = role.blurb;
      statList.innerHTML = Object.entries(role.stats)
        .map(([k,v]) => `<span class="stat">${k}: <strong>${v}</strong></span>`)
        .join('');
      beginBtn.disabled = false;
    });
  });
}

/* ================== BOONS ================== */
const BOONS = [
  { key:'wax',   name:'Imperial Wax Seal',        boosts:'Reputation', bonus:2, lore:'A shard of court authority; your letters carry official weight.' },
  { key:'icon',  name:'Icon of St. George',       boosts:'Nerve',      bonus:2, lore:'A talisman of courage, warm in the palm before bold words.' },
  { key:'fan',   name:'Jasper-Edged Fan',         boosts:'Charm',      bonus:2, lore:'Its bearer is ever the room’s center; whispers turn friendly.' },
  { key:'snuff', name:'Amber Snuff Box',          boosts:'Tact',       bonus:2, lore:'A gift passed between ministers; encourages graceful phrasing.' },
  { key:'cipher',name:'French Cipher Wheel',      boosts:'Insight',    bonus:2, lore:'Hidden turns reveal hidden meanings; subtext comes easily.' },
  { key:'cameo', name:'Cameo of the Empress',     boosts:'Reputation', bonus:3, lore:'A relic said to have touched imperial silk; doors open.' },
  { key:'sabre', name:'Officer’s Sabre Charm',    boosts:'Nerve',      bonus:3, lore:'Steel memory of the Danube; steadies the hand that signs.' },
  { key:'medal', name:'Order of St. Andrew Pin',  boosts:'Tact',       bonus:3, lore:'The wearer offends none and persuades many.' },
  { key:'lorg',  name:'Jeweled Lorgnette',        boosts:'Insight',    bonus:3, lore:'Through crystal, one sees motives as clearly as faces.' },
  { key:'ribbon',name:'Rostov Dancing Ribbon',    boosts:'Charm',      bonus:3, lore:'Still scented with summer; hearts remember you fondly.' }
];
function rollBoons(n=3){
  const pool = [...BOONS], picks=[];
  for(let i=0;i<n && pool.length;i++){ picks.push(pool.splice(Math.floor(Math.random()*pool.length),1)[0]); }
  return picks;
}

/* ================== LETTER SCORING ================== */
function getBaseFromTone(){ return state.tone ? (state.stats[state.tone]||0) : 0; }
function getBoonTotal(){ return state.tone ? state.boons.filter(b=>b.boosts===state.tone).reduce((s,b)=>s+b.bonus,0) : 0; }
function currentTotal(){ return getBaseFromTone() + getBoonTotal() + (state.inspoDie||0); }
function updateScoreReadout(){
  document.getElementById('baseStat').textContent = state.tone ? `${state.tone} ${getBaseFromTone()}` : '—';
  document.getElementById('boonTotal').textContent = `+${getBoonTotal()}`;
  document.getElementById('inspoDie').textContent = state.inspoDie ?? '—';
  document.getElementById('totalScore').textContent = state.tone ? currentTotal() : '—';
  sendLetterBtn.disabled = !(state.tone && letterInput.value.trim().length>0 && state.inspoDie!==null);
}
function outcomeForScore(score, tone){
  if(score >= 11) return { title:'A Letter to be Passed from Hand to Hand', text:`Your ${tone.toLowerCase()} phrases land like velvet-wrapped cannon shot. Doors open; an officer requests an introduction.` };
  if(score >= 8)  return { title:'Warmly Received', text:`Praised for ${tone.toLowerCase()} restraint. A quiet favor is banked in your name.` };
  if(score >= 6)  return { title:'Mixed Reception', text:`Admiring murmurs and raised brows in equal measure. Choose allies with care.` };
  return { title:'Social Misstep', text:`Intent misunderstood; a witty line felt as a barb. You may need tact to mend this.` };
}

/* ================== SALON ENCOUNTERS ================== */
const ENCOUNTERS = [
  {
    key: 'general',
    name: 'War General by the Maps',
    icon: 'WG',
    blurb: 'A veteran over campaign charts, goaded by talk of honor and audacity.',
    approach: 'Nerve',
    dc: 12,
    onSuccess: (rollTotal)=>{
      state.world.generalBoldness += rollTotal>=20? 2 : 1; // crit = bigger swing
      return `You kindle valor without insult. The general resolves to press the initiative (${rollTotal>=20?'greatly ':''}increasing Boldness).`;
    },
    onFail: ()=>{
      state.world.generalBoldness += 2; // he gets riled the wrong way
      return 'Your words sting his pride. He vows a reckless maneuver (Boldness surges).';
    }
  },
  {
    key: 'officer',
    name: 'Young Officer near the Windows',
    icon: 'YO',
    blurb: 'Bright-eyed, eager for glory—yet impressionable.',
    approach: 'Charm',
    dc: 11,
    onSuccess: ()=>{
      state.world.officerCaution += 1;
      return 'With gentle admiration you steer him toward prudence (Caution rises among his troop).';
    },
    onFail: ()=>{
      state.world.officerCaution -= 1;
      return 'You stoke his vanity; he speaks of charges and banners (Caution wanes).';
    }
  },
  {
    key: 'gossip',
    name: 'Court Gossip at the Tea Table',
    icon: 'CG',
    blurb: 'News passes through her hands like cards; tone is everything.',
    approach: 'Tact',
    dc: 10,
    onSuccess: ()=>{
      state.world.courtRumor += 1;
      return 'You fold delicate truths into her ear; a favorable rumor begins to spread.';
    },
    onFail: ()=>{
      state.world.courtRumor -= 1;
      return 'A phrase clipped too sharply; a rumor cuts the other way.';
    }
  },
  {
    key: 'envoy',
    name: 'Foreign Envoy by the Fire',
    icon: 'FE',
    blurb: 'A guest from abroad measuring alliances and resolve.',
    approach: 'Insight',
    dc: 13,
    onSuccess: ()=>{
      state.world.alliancePressure -= 1;
      return 'Reading his true concern, you cool the talk of rash treaties (pressure eases).';
    },
    onFail: ()=>{
      state.world.alliancePressure += 1;
      return 'He departs unconvinced; murmurs favor a hasty pact (pressure mounts).';
    }
  }
];

function boonBonusFor(stat){
  return state.boons.filter(b=>b.boosts===stat).reduce((s,b)=>s+b.bonus,0);
}

function renderEncounters(){
  encounterGrid.innerHTML = ENCOUNTERS.map(e=>`
    <article class="card" data-enc="${e.key}">
      <div class="card-header">
        <div class="portrait">${e.icon}</div>
        <div>
          <h4>${e.name}</h4>
          <p>${e.blurb}</p>
        </div>
      </div>
    </article>
  `).join('');

  encounterGrid.querySelectorAll('.card').forEach(card=>{
    card.addEventListener('click', ()=>{
      if(state.encountersRemaining<=0) return;
      encounterGrid.querySelectorAll('.card').forEach(c=>c.classList.remove('selected'));
      card.classList.add('selected');

      const key = card.getAttribute('data-enc');
      const enc = ENCOUNTERS.find(e=>e.key===key);
      state.currentEncounter = enc;

      encPanel.classList.remove('hidden');
      encTitle.textContent = enc.name;
      encBlurb.textContent = enc.blurb;
      encApproach.textContent = enc.approach;
      encDC.textContent = enc.dc;
      encResultBox.classList.add('hidden');
    });
  });
}

function doD20Check(enc){
  // d20 + base stat (approach) + matching boon bonus (+ carry-over Inspiration if you decide)
  const d20 = 1 + Math.floor(Math.random()*20);
  const base = state.stats[enc.approach] || 0;
  const boon = boonBonusFor(enc.approach);
  const total = d20 + base + boon;

  let title, text;
  if(d20===20){ // crit success
    title = 'A Turn of the Room';
    text = enc.onSuccess(total);
  } else if(d20===1){ // crit fail
    title = 'An Unfortunate Remark';
    text = enc.onFail(total);
  } else if(total >= enc.dc){
    title = 'You Carry the Conversation';
    text = enc.onSuccess(total);
  } else {
    title = 'You Misjudge the Moment';
    text = enc.onFail(total);
  }

  encOutcomeTitle.textContent = `${title} (d20 ${d20} | +${base} ${enc.approach}${boon?` | +${boon} boons`:''} = ${total})`;
  encOutcomeText.textContent = text;
  encResultBox.classList.remove('hidden');

  // consume one encounter
  state.encountersRemaining = Math.max(0, state.encountersRemaining-1);
  encLeftEl.textContent = state.encountersRemaining;
  endEveningBtn.disabled = state.encountersRemaining>0;
}

/* ================== WIRES ================== */
// Menu → Prologue
startBtn.addEventListener('click', () => { show('prologue'); typeText(letterEl, invitationText); });
settingsBtn.addEventListener('click', () => alert('Settings coming soon.'));
quitBtn.addEventListener('click', () => alert('Goodbye for now.'));

// Prologue controls
skipBtn.addEventListener('click', () => { clearType(); letterEl.textContent = invitationText; });
backBtn.addEventListener('click', () => { clearType(); letterEl.textContent=''; show('menu'); });
continueBtn.addEventListener('click', () => { clearType(); show('char'); renderRoles(); roleDetails.classList.add('hidden'); beginBtn.disabled = true; });

// Character setup
charBackBtn.addEventListener('click', () => show('prologue'));
beginBtn.addEventListener('click', () => {
  // reset letter scene state
  state.tone = null; state.boons = []; state.inspoDie = null;
  letterInput.value = '';
  document.querySelectorAll('.tone-btn').forEach(b=>b.classList.remove('active'));
  document.getElementById('inspoDie').textContent = '—';
  document.getElementById('baseStat').textContent = '—';
  document.getElementById('boonTotal').textContent = '+0';
  document.getElementById('totalScore').textContent = '—';
  boonRow.innerHTML = '';
  resultPanel.classList.add('hidden');
  show('letter');
});

// Letter scene
rollBoonsBtn.addEventListener('click', () => { state.boons = rollBoons(3); renderBoons(); });
document.querySelectorAll('.tone-btn').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    document.querySelectorAll('.tone-btn').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    state.tone = btn.dataset.tone;
    updateScoreReadout();
  });
});
letterInput.addEventListener('input', updateScoreReadout);
rollInspoBtn.addEventListener('click', ()=>{ state.inspoDie = 1 + Math.floor(Math.random()*6); updateScoreReadout(); });
backToRolesBtn.addEventListener('click', ()=> show('char'));

sendLetterBtn.addEventListener('click', ()=>{
  const score = currentTotal();
  const {title, text} = outcomeForScore(score, state.tone || 'Careful');
  resultTitle.textContent = title;
  resultText.textContent = `${text}  (Total ${score})`;
  resultPanel.classList.remove('hidden');
});

continueFromResult.addEventListener('click', ()=>{
  // move to salon; reset encounter flow
  state.encountersRemaining = 2;
  encLeftEl.textContent = state.encountersRemaining;
  encPanel.classList.add('hidden');
  encounterGrid.innerHTML = '';
  renderEncounters();
  endEveningBtn.disabled = true;
  show('salon');
});

/* Salon encounter events */
rollD20Btn.addEventListener('click', ()=>{
  if(!state.currentEncounter) return;
  doD20Check(state.currentEncounter);
});
salonBackBtn.addEventListener('click', ()=>{
  encPanel.classList.add('hidden');
  encounterGrid.querySelectorAll('.card').forEach(c=>c.classList.remove('selected'));
});
endEveningBtn.addEventListener('click', ()=>{
  const w = state.world;
  alert(
`Evening Ends.

War Boldness: ${w.generalBoldness}
Officer Caution: ${w.officerCaution}
Court Rumor: ${w.courtRumor}
Alliance Pressure: ${w.alliancePressure}

(These will shape campaigns, romances, and letters to come.)`
  );
  // Next scene hook here (e.g., campaign map or romance targets)
});
salonToMenuBtn.addEventListener('click', ()=> show('menu'));

/* ===== Helpers used by Letter Scene ===== */
function renderBoons(){
  boonRow.innerHTML = state.boons.map(b => `
    <div class="boon">
      <div class="boon-head">
        <strong>${b.name}</strong>
        <span class="badge">+${b.bonus} ${b.boosts}</span>
      </div>
      <div class="lore">${b.lore}</div>
    </div>
  `).join('');
  updateScoreReadout();
}
    generalBoldness: 0,
    officerCaution: 0,
    courtRumor: 0,
    alliancePressure: 0
  },
  encountersRemaining: 2,
  currentEncounter: null
};

/* ================== TEXT ================== */
const invitationText =
`To the Honored Guest,

If you are not otherwise engaged, do come to my little gathering this evening.
We shall speak of the latest news from Petersburg and of that tiresome
Corsican—though I promise you better company than the Gazette provides.
There will be music, a little soup, and—if Providence smiles upon us—some
diversion from the anxieties of war.

Pray arrive at eight o’clock. Your presence will lend our salon
a grace it sorely needs.

— A. P. Scherer`;

/* ================== TYPEWRITER ================== */
let typer = null;
function typeText(element, text, cps = 42) {
  clearType();
  element.textContent = '';
  let i = 0; const delay = 1000 / cps;
  typer = setInterval(() => {
    element.textContent += text[i++];
    if (i >= text.length) clearType();
  }, delay);
}
function clearType(){ if (typer){ clearInterval(typer); typer = null; } }

/* ================== SCREENS ================== */
function show(screen) {
  [menuScreen, prologueScreen, charScreen, letterScreen, salonScreen].forEach(s => s.classList.add('hidden'));
  if (screen === 'menu') menuScreen.classList.remove('hidden');
  if (screen === 'prologue') prologueScreen.classList.remove('hidden');
  if (screen === 'char') charScreen.classList.remove('hidden');
  if (screen === 'letter') letterScreen.classList.remove('hidden');
  if (screen === 'salon') salonScreen.classList.remove('hidden');
}

/* ================== ROLES ================== */
const ROLES = [
  {
    key: 'officer',
    name: 'Young Officer (Aide-de-camp)',
    initials: 'YO',
    blurb: 'A rising star at court, sworn to duty and glory. You write with clarity and courage; society watches your every word.',
    stats: { Reputation: 3, Nerve: 4, Tact: 2, Insight: 2, Charm: 3 }
  },
  {
    key: 'salon',
    name: 'Salon Wit (Anna Pavlovna’s Circle)',
    initials: 'SW',
    blurb: 'A master of conversation and subtext. Your letters glide through salons, steering opinions without leaving fingerprints.',
    stats: { Reputation: 4, Nerve: 2, Tact: 4, Insight: 3, Charm: 4 }
  },
  {
    key: 'heiress',
    name: 'Provincial Heiress (Rostov Kin)',
    initials: 'PH',
    blurb: 'Warm-hearted and well-connected, you command sympathy and surprise. Affections sway with your pen.',
    stats: { Reputation: 3, Nerve: 2, Tact: 3, Insight: 3, Charm: 5 }
  },
  {
    key: 'attache',
    name: 'Foreign Attaché (Discreet Observer)',
    initials: 'FA',
    blurb: 'A courteous spy with a poet’s hand. You see what others miss and commit it to paper—carefully.',
    stats: { Reputation: 2, Nerve: 3, Tact: 3, Insight: 5, Charm: 3 }
  }
];

function renderRoles() {
  roleGrid.innerHTML = ROLES.map(r => `
    <article class="card" data-role="${r.key}">
      <div class="card-header">
        <div class="portrait">${r.initials}</div>
        <div>
          <h4>${r.name}</h4>
          <p>${r.blurb}</p>
        </div>
      </div>
    </article>
  `).join('');

  roleGrid.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', () => {
      roleGrid.querySelectorAll('.card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');

      const key = card.getAttribute('data-role');
      const role = ROLES.find(r => r.key === key);
      state.role = role.name;
      state.stats = role.stats;

      roleDetails.classList.remove('hidden');
      roleName.textContent = role.name;
      roleBlurb.textContent = role.blurb;
      statList.innerHTML = Object.entries(role.stats)
        .map(([k,v]) => `<span class="stat">${k}: <strong>${v}</strong></span>`)
        .join('');
      beginBtn.disabled = false;
    });
  });
}

/* ================== BOONS ================== */
const BOONS = [
  { key:'wax',   name:'Imperial Wax Seal',        boosts:'Reputation', bonus:2, lore:'A shard of court authority; your letters carry official weight.' },
  { key:'icon',  name:'Icon of St. George',       boosts:'Nerve',      bonus:2, lore:'A talisman of courage, warm in the palm before bold words.' },
  { key:'fan',   name:'Jasper-Edged Fan',         boosts:'Charm',      bonus:2, lore:'Its bearer is ever the room’s center; whispers turn friendly.' },
  { key:'snuff', name:'Amber Snuff Box',          boosts:'Tact',       bonus:2, lore:'A gift passed between ministers; encourages graceful phrasing.' },
  { key:'cipher',name:'French Cipher Wheel',      boosts:'Insight',    bonus:2, lore:'Hidden turns reveal hidden meanings; subtext comes easily.' },
  { key:'cameo', name:'Cameo of the Empress',     boosts:'Reputation', bonus:3, lore:'A relic said to have touched imperial silk; doors open.' },
  { key:'sabre', name:'Officer’s Sabre Charm',    boosts:'Nerve',      bonus:3, lore:'Steel memory of the Danube; steadies the hand that signs.' },
  { key:'medal', name:'Order of St. Andrew Pin',  boosts:'Tact',       bonus:3, lore:'The wearer offends none and persuades many.' },
  { key:'lorg',  name:'Jeweled Lorgnette',        boosts:'Insight',    bonus:3, lore:'Through crystal, one sees motives as clearly as faces.' },
  { key:'ribbon',name:'Rostov Dancing Ribbon',    boosts:'Charm',      bonus:3, lore:'Still scented with summer; hearts remember you fondly.' }
];
function rollBoons(n=3){
  const pool = [...BOONS], picks=[];
  for(let i=0;i<n && pool.length;i++){ picks.push(pool.splice(Math.floor(Math.random()*pool.length),1)[0]); }
  return picks;
}

/* ================== LETTER SCORING ================== */
function getBaseFromTone(){ return state.tone ? (state.stats[state.tone]||0) : 0; }
function getBoonTotal(){ return state.tone ? state.boons.filter(b=>b.boosts===state.tone).reduce((s,b)=>s+b.bonus,0) : 0; }
function currentTotal(){ return getBaseFromTone() + getBoonTotal() + (state.inspoDie||0); }
function updateScoreReadout(){
  document.getElementById('baseStat').textContent = state.tone ? `${state.tone} ${getBaseFromTone()}` : '—';
  document.getElementById('boonTotal').textContent = `+${getBoonTotal()}`;
  document.getElementById('inspoDie').textContent = state.inspoDie ?? '—';
  document.getElementById('totalScore').textContent = state.tone ? currentTotal() : '—';
  sendLetterBtn.disabled = !(state.tone && letterInput.value.trim().length>0 && state.inspoDie!==null);
}
function outcomeForScore(score, tone){
  if(score >= 11) return { title:'A Letter to be Passed from Hand to Hand', text:`Your ${tone.toLowerCase()} phrases land like velvet-wrapped cannon shot. Doors open; an officer requests an introduction.` };
  if(score >= 8)  return { title:'Warmly Received', text:`Praised for ${tone.toLowerCase()} restraint. A quiet favor is banked in your name.` };
  if(score >= 6)  return { title:'Mixed Reception', text:`Admiring murmurs and raised brows in equal measure. Choose allies with care.` };
  return { title:'Social Misstep', text:`Intent misunderstood; a witty line felt as a barb. You may need tact to mend this.` };
}

/* ================== SALON ENCOUNTERS ================== */
const ENCOUNTERS = [
  {
    key: 'general',
    name: 'War General by the Maps',
    icon: 'WG',
    blurb: 'A veteran over campaign charts, goaded by talk of honor and audacity.',
    approach: 'Nerve',
    dc: 12,
    onSuccess: (rollTotal)=>{
      state.world.generalBoldness += rollTotal>=20? 2 : 1; // crit = bigger swing
      return `You kindle valor without insult. The general resolves to press the initiative (${rollTotal>=20?'greatly ':''}increasing Boldness).`;
    },
    onFail: ()=>{
      state.world.generalBoldness += 2; // he gets riled the wrong way
      return 'Your words sting his pride. He vows a reckless maneuver (Boldness surges).';
    }
  },
  {
    key: 'officer',
    name: 'Young Officer near the Windows',
    icon: 'YO',
    blurb: 'Bright-eyed, eager for glory—yet impressionable.',
    approach: 'Charm',
    dc: 11,
    onSuccess: ()=>{
      state.world.officerCaution += 1;
      return 'With gentle admiration you steer him toward prudence (Caution rises among his troop).';
    },
    onFail: ()=>{
      state.world.officerCaution -= 1;
      return 'You stoke his vanity; he speaks of charges and banners (Caution wanes).';
    }
  },
  {
    key: 'gossip',
    name: 'Court Gossip at the Tea Table',
    icon: 'CG',
    blurb: 'News passes through her hands like cards; tone is everything.',
    approach: 'Tact',
    dc: 10,
    onSuccess: ()=>{
      state.world.courtRumor += 1;
      return 'You fold delicate truths into her ear; a favorable rumor begins to spread.';
    },
    onFail: ()=>{
      state.world.courtRumor -= 1;
      return 'A phrase clipped too sharply; a rumor cuts the other way.';
    }
  },
  {
    key: 'envoy',
    name: 'Foreign Envoy by the Fire',
    icon: 'FE',
    blurb: 'A guest from abroad measuring alliances and resolve.',
    approach: 'Insight',
    dc: 13,
    onSuccess: ()=>{
      state.world.alliancePressure -= 1;
      return 'Reading his true concern, you cool the talk of rash treaties (pressure eases).';
    },
    onFail: ()=>{
      state.world.alliancePressure += 1;
      return 'He departs unconvinced; murmurs favor a hasty pact (pressure mounts).';
    }
  }
];

function boonBonusFor(stat){
  return state.boons.filter(b=>b.boosts===stat).reduce((s,b)=>s+b.bonus,0);
}

function renderEncounters(){
  encounterGrid.innerHTML = ENCOUNTERS.map(e=>`
    <article class="card" data-enc="${e.key}">
      <div class="card-header">
        <div class="portrait">${e.icon}</div>
        <div>
          <h4>${e.name}</h4>
          <p>${e.blurb}</p>
        </div>
      </div>
    </article>
  `).join('');

  encounterGrid.querySelectorAll('.card').forEach(card=>{
    card.addEventListener('click', ()=>{
      if(state.encountersRemaining<=0) return;
      encounterGrid.querySelectorAll('.card').forEach(c=>c.classList.remove('selected'));
      card.classList.add('selected');

      const key = card.getAttribute('data-enc');
      const enc = ENCOUNTERS.find(e=>e.key===key);
      state.currentEncounter = enc;

      encPanel.classList.remove('hidden');
      encTitle.textContent = enc.name;
      encBlurb.textContent = enc.blurb;
      encApproach.textContent = enc.approach;
      encDC.textContent = enc.dc;
      encResultBox.classList.add('hidden');
    });
  });
}

function doD20Check(enc){
  // d20 + base stat (approach) + matching boon bonus (+ carry-over Inspiration if you decide)
  const d20 = 1 + Math.floor(Math.random()*20);
  const base = state.stats[enc.approach] || 0;
  const boon = boonBonusFor(enc.approach);
  const total = d20 + base + boon;

  let title, text;
  if(d20===20){ // crit success
    title = 'A Turn of the Room';
    text = enc.onSuccess(total);
  } else if(d20===1){ // crit fail
    title = 'An Unfortunate Remark';
    text = enc.onFail(total);
  } else if(total >= enc.dc){
    title = 'You Carry the Conversation';
    text = enc.onSuccess(total);
  } else {
    title = 'You Misjudge the Moment';
    text = enc.onFail(total);
  }

  encOutcomeTitle.textContent = `${title} (d20 ${d20} | +${base} ${enc.approach}${boon?` | +${boon} boons`:''} = ${total})`;
  encOutcomeText.textContent = text;
  encResultBox.classList.remove('hidden');

  // consume one encounter
  state.encountersRemaining = Math.max(0, state.encountersRemaining-1);
  encLeftEl.textContent = state.encountersRemaining;
  endEveningBtn.disabled = state.encountersRemaining>0;
}

/* ================== WIRES ================== */
// Menu → Prologue
startBtn.addEventListener('click', () => { show('prologue'); typeText(letterEl, invitationText); });
settingsBtn.addEventListener('click', () => alert('Settings coming soon.'));
quitBtn.addEventListener('click', () => alert('Goodbye for now.'));

// Prologue controls
skipBtn.addEventListener('click', () => { clearType(); letterEl.textContent = invitationText; });
backBtn.addEventListener('click', () => { clearType(); letterEl.textContent=''; show('menu'); });
continueBtn.addEventListener('click', () => { clearType(); show('char'); renderRoles(); roleDetails.classList.add('hidden'); beginBtn.disabled = true; });

// Character setup
charBackBtn.addEventListener('click', () => show('prologue'));
beginBtn.addEventListener('click', () => {
  // reset letter scene state
  state.tone = null; state.boons = []; state.inspoDie = null;
  letterInput.value = '';
  document.querySelectorAll('.tone-btn').forEach(b=>b.classList.remove('active'));
  document.getElementById('inspoDie').textContent = '—';
  document.getElementById('baseStat').textContent = '—';
  document.getElementById('boonTotal').textContent = '+0';
  document.getElementById('totalScore').textContent = '—';
  boonRow.innerHTML = '';
  resultPanel.classList.add('hidden');
  show('letter');
});

// Letter scene
rollBoonsBtn.addEventListener('click', () => { state.boons = rollBoons(3); renderBoons(); });
document.querySelectorAll('.tone-btn').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    document.querySelectorAll('.tone-btn').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    state.tone = btn.dataset.tone;
    updateScoreReadout();
  });
});
letterInput.addEventListener('input', updateScoreReadout);
rollInspoBtn.addEventListener('click', ()=>{ state.inspoDie = 1 + Math.floor(Math.random()*6); updateScoreReadout(); });
backToRolesBtn.addEventListener('click', ()=> show('char'));

sendLetterBtn.addEventListener('click', ()=>{
  const score = currentTotal();
  const {title, text} = outcomeForScore(score, state.tone || 'Careful');
  resultTitle.textContent = title;
  resultText.textContent = `${text}  (Total ${score})`;
  resultPanel.classList.remove('hidden');
});

continueFromResult.addEventListener('click', ()=>{
  // move to salon; reset encounter flow
  state.encountersRemaining = 2;
  encLeftEl.textContent = state.encountersRemaining;
  encPanel.classList.add('hidden');
  encounterGrid.innerHTML = '';
  renderEncounters();
  endEveningBtn.disabled = true;
  show('salon');
});

/* Salon encounter events */
rollD20Btn.addEventListener('click', ()=>{
  if(!state.currentEncounter) return;
  doD20Check(state.currentEncounter);
});
salonBackBtn.addEventListener('click', ()=>{
  encPanel.classList.add('hidden');
  encounterGrid.querySelectorAll('.card').forEach(c=>c.classList.remove('selected'));
});
endEveningBtn.addEventListener('click', ()=>{
  const w = state.world;
  alert(
`Evening Ends.

War Boldness: ${w.generalBoldness}
Officer Caution: ${w.officerCaution}
Court Rumor: ${w.courtRumor}
Alliance Pressure: ${w.alliancePressure}

(These will shape campaigns, romances, and letters to come.)`
  );
  // Next scene hook here (e.g., campaign map or romance targets)
});
salonToMenuBtn.addEventListener('click', ()=> show('menu'));

/* ===== Helpers used by Letter Scene ===== */
function renderBoons(){
  boonRow.innerHTML = state.boons.map(b => `
    <div class="boon">
      <div class="boon-head">
        <strong>${b.name}</strong>
        <span class="badge">+${b.bonus} ${b.boosts}</span>
      </div>
      <div class="lore">${b.lore}</div>
    </div>
  `).join('');
  updateScoreReadout();
}
