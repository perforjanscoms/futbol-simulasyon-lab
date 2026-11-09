const SIMULATIONS = 20000;
const DEFAULT_PROFILE = Object.freeze({rating:1500, attack:1, defense:1, form:0});
let teams = [];
let selectedType = 'club';
let listFilter = 'all';
let editingSide = 'home';
let activeTarget = 'awayTeam';
let lastResult = null;
let profiles = loadProfiles();
const $ = id => document.getElementById(id);
const clamp = (n,lo,hi) => Math.min(hi,Math.max(lo,n));
const fmt = n => Number(n).toFixed(2);

function loadProfiles(){ try{return JSON.parse(localStorage.getItem('futbolLabProfiles')||'{}')}catch{return {}} }
function saveProfiles(){localStorage.setItem('futbolLabProfiles',JSON.stringify(profiles));}
function profile(name){return {...DEFAULT_PROFILE,...(profiles[name]||{})}}
function normalise(s){return (s||'').toLocaleLowerCase('tr').normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim()}
function teamByName(name){const key=normalise(name);return teams.find(t=>normalise(t.name)===key)}
function toast(msg){let n=$('toast');if(!n){n=document.createElement('div');n.id='toast';n.className='toast';document.body.append(n)}n.textContent=msg;n.classList.add('show');clearTimeout(n._timer);n._timer=setTimeout(()=>n.classList.remove('show'),2600)}

async function init(){
  try{const r=await fetch('./teams.json');if(!r.ok)throw new Error('Takım dosyası yüklenemedi');const source=await r.json();teams=Array.isArray(source)?source:[...source.club.map(name=>({name,type:'club'})),...source.national.map(name=>({name,type:'national'}))];}
  catch(e){$('teamCount').textContent='Takım verisi yüklenemedi';toast('Uygulamayı bir web sunucusu üzerinden açın (GitHub Pages desteklenir).');return;}
  $('teamCount').textContent=`${teams.length} takım`;
  $('teamNames').innerHTML=teams.map(t=>`<option value="${escapeHtml(t.name)}"></option>`).join('');
  renderTeamChips();updateTeamLabels();
  document.querySelectorAll('.tab[data-type]').forEach(b=>b.addEventListener('click',()=>{selectedType=b.dataset.type;document.querySelectorAll('.tab[data-type]').forEach(x=>x.classList.toggle('active',x===b));const first=teams.find(t=>t.type===selectedType);const second=teams.find(t=>t.type===selectedType&&t.name!==first?.name);$('homeTeam').value=first?.name||'';$('awayTeam').value=second?.name||'';updateTeamLabels();}));
  document.querySelectorAll('.tab[data-filter]').forEach(b=>b.addEventListener('click',()=>{listFilter=b.dataset.filter;document.querySelectorAll('.tab[data-filter]').forEach(x=>x.classList.toggle('active',x===b));renderTeamChips()}));
  $('teamSearch').addEventListener('input',renderTeamChips);
  $('homeTeam').addEventListener('focus',()=>activeTarget='homeTeam');$('awayTeam').addEventListener('focus',()=>activeTarget='awayTeam');$('homeTeam').addEventListener('change',updateTeamLabels);$('awayTeam').addEventListener('change',updateTeamLabels);
  $('simulateBtn').addEventListener('click',simulate);$('rerunBtn').addEventListener('click',simulate);
  $('swapBtn').addEventListener('click',()=>{const a=$('homeTeam').value;$('homeTeam').value=$('awayTeam').value;$('awayTeam').value=a;updateTeamLabels();simulate()});
  document.querySelectorAll('[data-edit]').forEach(b=>b.addEventListener('click',()=>openEditor(b.dataset.edit)));
  $('closeEditor').addEventListener('click',()=>$('editor').hidden=true);
  ['rating','attack','defense','form'].forEach(id=>$(id).addEventListener('input',updateEditorOutput));
  $('resetProfile').addEventListener('click',()=>{const t=teamByName($(editingSide+'Team').value);if(!t)return;delete profiles[t.name];saveProfiles();openEditor(editingSide);toast('Takım varsayılan değerlere döndürüldü.')});
  $('exportBtn').addEventListener('click',exportData);$('importFile').addEventListener('change',importData);
  $('teamChips').addEventListener('click',e=>{const b=e.target.closest('[data-team]');if(!b)return;const t=teams.find(x=>x.name===b.dataset.team);if(!t)return;$(activeTarget).value=t.name;updateTeamLabels();window.scrollTo({top:0,behavior:'smooth'});});
}
function escapeHtml(s){return s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function updateTeamLabels(){for(const side of ['home','away']){const t=teamByName($(side+'Team').value);$(side+'Type').textContent=t?(t.type==='club'?'Kulüp takımı':'Milli takım'):'Listede bulunamadı';}}
function renderTeamChips(){const q=normalise($('teamSearch').value);const rows=teams.filter(t=>(listFilter==='all'||t.type===listFilter)&&(!q||normalise(t.name).includes(q)));const shown=rows.slice(0,120);$('teamChips').innerHTML=shown.map(t=>`<button class="team-chip" data-team="${escapeHtml(t.name)}">${escapeHtml(t.name)}</button>`).join('');$('listFooter').textContent=rows.length>120?`${rows.length} eşleşme bulundu · İlk 120 takım gösteriliyor. Aramayı daralt.`:`${rows.length} takım gösteriliyor.`;}
function openEditor(side){const t=teamByName($(side+'Team').value);if(!t){toast('Önce listeden bir takım seçin.');return}editingSide=side;const p=profile(t.name);$('editorTitle').textContent=t.name+' · '+(side==='home'?'Ev sahibi':'Deplasman');$('rating').value=p.rating;$('attack').value=p.attack;$('defense').value=p.defense;$('form').value=p.form;updateEditorOutput();$('editor').hidden=false;$('editor').scrollIntoView({behavior:'smooth',block:'nearest'});}
function updateEditorOutput(){$('ratingOut').textContent=$('rating').value;$('attackOut').textContent=Number($('attack').value).toFixed(2)+'×';$('defenseOut').textContent=Number($('defense').value).toFixed(2)+'×';$('formOut').textContent=Number($('form').value)>0?'+'+$('form').value:$('form').value;const t=teamByName($(editingSide+'Team').value);if(t){profiles[t.name]={rating:+$('rating').value,attack:+$('attack').value,defense:+$('defense').value,form:+$('form').value};saveProfiles();}}
function poisson(lambda,k){let p=Math.exp(-lambda);for(let i=1;i<=k;i++)p*=lambda/i;return p}
function poissonArray(lambda,max=8){return Array.from({length:max+1},(_,k)=>poisson(lambda,k))}
function buildModel(home,away){
  const hp=profile(home.name),ap=profile(away.name),homeAdv=1.09;
  const ratingDelta=(hp.rating-ap.rating)/850;
  const formDelta=(hp.form-ap.form)*.035;
  const homeXg=clamp(1.38*Math.exp(ratingDelta+formDelta)*hp.attack*ap.defense*homeAdv,.15,4.5);
  const awayXg=clamp(1.12*Math.exp(-ratingDelta-formDelta)*ap.attack*hp.defense,.15,4.5);
  const h=poissonArray(homeXg),a=poissonArray(awayXg);let matrix=[],hw=0,d=0,aw=0,over25=0,total=0;
  for(let i=0;i<=8;i++){matrix[i]=[];for(let j=0;j<=8;j++){let p=h[i]*a[j];matrix[i][j]=p;total+=p;if(i>j)hw+=p;else if(i===j)d+=p;else aw+=p;if(i+j>=3)over25+=p;}}
  hw/=total;d/=total;aw/=total;over25/=total;
  const scores=[];for(let i=0;i<=8;i++)for(let j=0;j<=8;j++)scores.push({score:`${i}-${j}`,p:matrix[i][j]/total,goals:i+j});scores.sort((x,y)=>y.p-x.p);
  return {hp,ap,homeXg,awayXg,hw,d,aw,over25,scores,matrix,total,homeAdv};
}
function seededRandom(seed){let x=seed>>>0;return()=>{x=(x+0x6D2B79F5)>>>0;let t=x;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return ((t^(t>>>14))>>>0)/4294967296}}
function samplePoisson(lambda,rng){const limit=Math.exp(-lambda);let k=0,p=1;do{k++;p*=rng()}while(p>limit&&k<20);return k-1}
function simulateStats(m,homeName,awayName){const seed=[...homeName+awayName].reduce((a,c)=>(a*31+c.charCodeAt(0))>>>0,2166136261);const rng=seededRandom(seed);const sums={posH:0,shotsH:0,shotsA:0,onH:0,onA:0,cornersH:0,cornersA:0,foulsH:0,foulsA:0,yellowH:0,yellowA:0,redH:0,redA:0};const possession=clamp(50+(m.hp.rating-m.ap.rating)/35+4,35,65);
  for(let i=0;i<SIMULATIONS;i++){
    const jitter=()=>.86+rng()*.28;
    const sh=samplePoisson((8.8+m.homeXg*2.2)*jitter(),rng),sa=samplePoisson((8.4+m.awayXg*2.2)*jitter(),rng);
    sums.posH+=clamp(possession+(rng()-.5)*14,25,75);sums.shotsH+=sh;sums.shotsA+=sa;
    sums.onH+=Math.min(sh,samplePoisson(m.homeXg*2.3+1.1,rng));sums.onA+=Math.min(sa,samplePoisson(m.awayXg*2.3+1.1,rng));
    sums.cornersH+=samplePoisson(4.2+m.homeXg*.55,rng);sums.cornersA+=samplePoisson(4.0+m.awayXg*.55,rng);
    sums.foulsH+=samplePoisson(11.4,rng);sums.foulsA+=samplePoisson(12.0,rng);
    sums.yellowH+=samplePoisson(1.65,rng);sums.yellowA+=samplePoisson(1.8,rng);
    sums.redH+=rng()<.045?1:0;sums.redA+=rng()<.05?1:0;
  }
  for(const k of Object.keys(sums))sums[k]/=SIMULATIONS;
  return {posH:sums.posH,posA:100-sums.posH,shotsH:sums.shotsH,shotsA:sums.shotsA,onH:sums.onH,onA:sums.onA,cornersH:sums.cornersH,cornersA:sums.cornersA,foulsH:sums.foulsH,foulsA:sums.foulsA,yellowH:sums.yellowH,yellowA:sums.yellowA,redH:sums.redH,redA:sums.redA};
}
function simulate(){const h=teamByName($('homeTeam').value),a=teamByName($('awayTeam').value);if(!h||!a){toast('İki takımı da takım listesinden seçin.');return}if(h.name===a.name){toast('Aynı takım kendisiyle eşleşemez.');return}if(h.type!==a.type){toast('Kulüp takımları ile milli takımları aynı maçta eşleştirmeyin.');return}
  const m=buildModel(h,a),s=simulateStats(m,h.name,a.name);lastResult={h,a,m,s};renderResult(lastResult);$('results').hidden=false;$('results').scrollIntoView({behavior:'smooth',block:'start'});
}
function pct(n){return (n*100).toFixed(1)+'%'}
function renderResult({h,a,m,s}){
  $('resultTitle').innerHTML=`${escapeHtml(h.name)} <small>—</small> ${escapeHtml(a.name)}`;$('resultMeta').textContent=`90 dakika · Poisson olasılık matrisi · ${SIMULATIONS.toLocaleString('tr-TR')} sanal istatistik senaryosu`;
  $('homeProb').textContent=pct(m.hw);$('drawProb').textContent=pct(m.d);$('awayProb').textContent=pct(m.aw);
  $('homeBar').style.width=pct(m.hw);$('drawBar').style.width=pct(m.d);$('awayBar').style.width=pct(m.aw);
  const fav=m.hw>m.aw?h.name:m.aw>m.hw?a.name:'İki takım eşit';$('favoriteText').textContent=fav==='İki takım eşit'?'Belirgin favori yok':`${fav} daha yüksek galibiyet olasılığına sahip`;
  $('expectedGoals').textContent=`${m.homeXg.toFixed(2)} – ${m.awayXg.toFixed(2)}`;$('mostLikely').textContent=m.scores[0].score;$('over25').textContent=pct(m.over25);
  $('scoreList').innerHTML=m.scores.slice(0,6).map(x=>`<div class="score-chip"><strong>${x.score}</strong><span>${pct(x.p)}</span></div>`).join('');
  const stats=[['Topla oynama',s.posH,s.posA,'%'],['Toplam şut',s.shotsH,s.shotsA,''],['İsabetli şut',s.onH,s.onA,''],['Korner',s.cornersH,s.cornersA,''],['Faul',s.foulsH,s.foulsA,''],['Sarı kart',s.yellowH,s.yellowA,''],['Kırmızı kart',s.redH,s.redA,'']];
  $('statsTable').innerHTML=stats.map(([name,x,y,unit])=>{const sum=x+y||1,share=x/sum*100;return `<div class="stat-row"><div class="side-cell"><div class="stat-value">${x.toFixed(unit==='%'?1:1)}${unit}</div><div class="stat-track"><span style="width:${share}%"></span><span style="width:${100-share}%"></span></div></div><div class="stat-name">${name}</div><div class="side-cell"><div class="stat-value right">${y.toFixed(1)}${unit}</div><div class="stat-track"><span style="width:${100-share}%"></span><span style="width:${share}%"></span></div></div></div>`}).join('');
  $('modelDetails').innerHTML=[['Ev sahibi xG',m.homeXg.toFixed(3)],['Deplasman xG',m.awayXg.toFixed(3)],['Elo / SM Rating farkı',(m.hp.rating-m.ap.rating).toFixed(0)],['Ev sahibi avantajı',m.homeAdv.toFixed(2)+'×'],['Form etkisi',`${m.hp.form>=0?'+':''}${m.hp.form} / ${m.ap.form>=0?'+':''}${m.ap.form}`],['Skor matrisi','0–8 / normalize']].map(([a,b])=>`<div class="model-item"><span>${a}</span><strong>${b}</strong></div>`).join('');
}
function exportData(){const data={format:'futbol-lab-profiles-v1',exportedAt:new Date().toISOString(),profiles};const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});download(blob,'futbol-lab-verileri.json')}
function download(blob,name){const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;a.click();URL.revokeObjectURL(url)}
async function importData(e){const f=e.target.files?.[0];if(!f)return;try{const text=await f.text();if(f.name.toLowerCase().endsWith('.csv')){const lines=text.split(/\r?\n/).filter(Boolean),header=lines.shift().split(',').map(x=>x.trim().toLowerCase());for(const line of lines){const vals=line.split(',');const row=Object.fromEntries(header.map((k,i)=>[k,vals[i]?.trim()]));const t=teamByName(row.team||row.name);if(t)profiles[t.name]={rating:clamp(+(row.rating||1500),900,2200),attack:clamp(+(row.attack||1),.65,1.55),defense:clamp(+(row.defense||1),.65,1.55),form:clamp(+(row.form||0),-5,5)}}}else{const obj=JSON.parse(text);const incoming=obj.profiles||obj;if(!incoming||typeof incoming!=='object')throw new Error('JSON biçimi tanınmadı');for(const [name,p] of Object.entries(incoming)){if(teamByName(name))profiles[name]={rating:clamp(+(p.rating||1500),900,2200),attack:clamp(+(p.attack||1),.65,1.55),defense:clamp(+(p.defense||1),.65,1.55),form:clamp(+(p.form||0),-5,5)}}}saveProfiles();toast('Takım güç verileri içe aktarıldı.');if(!$('editor').hidden)openEditor(editingSide)}catch(err){toast('Dosya okunamadı: '+err.message)}finally{e.target.value=''}}
init();