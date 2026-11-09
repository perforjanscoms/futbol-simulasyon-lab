const SIMULATIONS = 20000;
const DEFAULT_PROFILE = Object.freeze({rating:1500, attack:1, defense:1, form:0, homeEdge:0, fatigue:0, consistency:72, morale:0, motivation:5});
const externalRatings = {club:new Map(),national:new Map()};
const ratingDataStatus = {club:false,national:false};
const ratingAliases = {
  club:{
    'Bayern München':['Bayern Munich'],'Bodo Glimt':['Bodo/Glimt','Bodø/Glimt'],
    'Athletic Bilbao':['Athletic Club','Athletic Club Bilbao'],'Atletico Madrid':['Atlético Madrid','Atlético de Madrid'],
    'Beşiktaş':['Besiktas'],'Çaykur Rizespor':['Rizespor'],'Fenerbahçe':['Fenerbahce'],
    'Göztepe':['Goztepe'],'İstanbul Başaksehir FK':['Istanbul Basaksehir','Başakşehir'],
    'Kasımpaşa':['Kasimpasa'],'Kızılyıldız':['Crvena Zvezda','Red Star Belgrade'],
    'Kopenhag':['FC Copenhagen','Copenhagen'],'Mönchengladbach':['Borussia Mönchengladbach','Borussia Monchengladbach'],
    'Malmö FF':['Malmo FF'],'Paris Saint-Germain':['Paris Saint Germain','PSG'],
    'Porto':['FC Porto'],'RSC Anderlecht':['Anderlecht'],'Shakhtar Donezk':['Shakhtar Donetsk'],
    'Slavia Prag':['Slavia Prague'],'Sparta Prag':['Sparta Prague'],'Sporting Lizbon':['Sporting CP','Sporting Lisbon'],
    'Viktoria Plzen':['Viktoria Plzeň','Viktoria Pilsen'],'Zürich':['Zurich','FC Zurich'],
    'CSKA Moskova':['CSKA Moscow'],'CSKA Sofya':['CSKA Sofia'],'Levski Sofya':['Levski Sofia'],
    'Ferencvaros':['Ferencváros'],'Nordsjaelland':['FC Nordsjælland'],'Tromsö IL':['Tromsø IL'],
    'Olympiakos Piraeus':['Olympiacos','Olympiakos'],'Red Bull Salzburg':['Salzburg'],
    'FCSB':['Steaua Bucharest'],'VfL Wolfsburg':['Wolfsburg'],'Inter Milan':['Inter','Internazionale'],
    'Glasgow Rangers':['Rangers FC'],'Stade Brest':['Stade Brestois 29'],'Stade Rennes':['Stade Rennais'],
    'Celta de Vigo':['Celta Vigo'],'OGC Nice':['Nice'],'Olympique Lyon':['Olympique Lyonnais','Lyon'],
    'Olympique Marseille':['Marseille'],'FC Köln':['1. FC Köln','Cologne'],'KRC Genk':['Genk'],
    'Young Boys':['BSC Young Boys'],'LASK Linz':['LASK'],'AZ Alkmaar':['AZ'],
    'Vissel Kobe':['Vissel Kōbe'],'Atletico Mineiro':['Atlético Mineiro','Atletico-MG']
  },
  national:{
    'ABD':['United States','USA'],'BAE':['United Arab Emirates','UAE'],
    'Almanya':['Germany'],'Arjantin':['Argentina'],'Avustralya':['Australia'],'Avusturya':['Austria'],
    'Belçika':['Belgium'],'Bosna':['Bosnia & Herzegovina','Bosnia and Herzegovina'],
    'Brezilya':['Brazil'],'Çekya':['Czechia','Czech Republic'],'Danimarka':['Denmark'],
    'Ekvador':['Ecuador'],'Fas':['Morocco'],'Fildişi Sahili':['Ivory Coast',"Côte d’Ivoire"],
    'Finlandiya':['Finland'],'Fransa':['France'],'Galler':['Wales'],'Güney Afrika':['South Africa'],
    'Güney Kore':['South Korea'],'Hırvatistan':['Croatia'],'Hollanda':['Netherlands'],
    'İngiltere':['England'],'İran':['Iran'],'İrlanda':['Ireland'],'İskoçya':['Scotland'],
    'İspanya':['Spain'],'İsrail':['Israel'],'İsveç':['Sweden'],'İsviçre':['Switzerland'],
    'İtalya':['Italy'],'İzlanda':['Iceland'],'Jamaika':['Jamaica'],'Japonya':['Japan'],
    'Kamerun':['Cameroon'],'Kanada':['Canada'],'Karadağ':['Montenegro'],'Katar':['Qatar'],
    'Kolombiya':['Colombia'],'Kosova':['Kosovo'],'Kuzey İrlanda':['Northern Ireland'],
    'Kuzey Makedonya':['North Macedonia'],'Macaristan':['Hungary'],'Meksika':['Mexico'],
    'Mısır':['Egypt'],'Nijerya':['Nigeria'],'Norveç':['Norway'],'Özbekistan':['Uzbekistan'],
    'Panama':['Panama'],'Paraguay':['Paraguay'],'Peru':['Peru'],'Polonya':['Poland'],
    'Portekiz':['Portugal'],'Romanya':['Romania'],'Rusya':['Russia'],'Senegal':['Senegal'],
    'Sırbistan':['Serbia'],'Slovakya':['Slovakia'],'Slovenya':['Slovenia'],
    'Suudi Arabistan':['Saudi Arabia'],'Şili':['Chile'],'Tunus':['Tunisia'],
    'Türkiye':['Turkey'],'Ukrayna':['Ukraine'],'Uruguay':['Uruguay'],'Venezuela':['Venezuela'],
    'Yeni Zelanda':['New Zealand'],'Yeşil Burun':['Cape Verde'],'Yunanistan':['Greece'],
    'Kongo DC':['DR Congo','Congo DR'],'Filistin':['Palestine'],'Curaçao':['Curacao'],
    'Gürcistan':['Georgia'],'Belarus':['Belarus'],'Bahreyn':['Bahrain'],'Angola':['Angola']
  }
};
let teams = [];
let selectedType = 'club';
let listFilter = 'all';
let editingSide = 'home';
let activeTarget = 'awayTeam';
let lastResult = null;
let profiles = loadProfiles();
const $ = id => document.getElementById(id);
const API_FOOTBALL_BASE = 'https://v3.football.api-sports.io';
let liveFixtures = [];
let liveMode = 'live';
let liveRefreshTimer = null;
const clamp = (n,lo,hi) => Math.min(hi,Math.max(lo,n));
const fmt = n => Number(n).toFixed(2);

function loadProfiles(){ try{return JSON.parse(localStorage.getItem('futbolLabProfiles')||'{}')}catch{return {}} }
function saveProfiles(){localStorage.setItem('futbolLabProfiles',JSON.stringify(profiles));}
function externalRatingForTeam(team){
  const map=externalRatings[team.type];
  if(!map||!map.size)return null;
  const candidates=[team.name,...(ratingAliases[team.type]?.[team.name]||[])];
  for(const candidate of candidates){const hit=map.get(normalise(candidate));if(hit)return hit;}
  const clean=s=>normalise(s).replace(/\\b(fc|afc|cf|sc|fk|krc|rsc|sv|ac|as|club)\\b/g,' ').replace(/[^a-z0-9]+/g,' ').trim().replace(/\\s+/g,' ');
  const target=clean(team.name),targetTokens=new Set(target.split(' ').filter(x=>x.length>2));
  if(!targetTokens.size)return null;
  let best=null,bestScore=0,secondScore=0;
  for(const [key,value] of map){
    const candidate=clean(key),tokens=new Set(candidate.split(' ').filter(x=>x.length>2));
    if(!tokens.size)continue;
    const overlap=[...targetTokens].filter(x=>tokens.has(x)).length;
    const score=overlap/(targetTokens.size+tokens.size-overlap);
    if(score>bestScore){secondScore=bestScore;bestScore=score;best=value;}
    else if(score>secondScore)secondScore=score;
  }
  return bestScore>=.86&&bestScore-secondScore>=.12?best:null;
}
function profile(name){
  const saved=profiles[name]||{},team=teamByName(name),external=team?externalRatingForTeam(team):null;
  const savedRating=Number(saved.rating),hasSaved=Number.isFinite(savedRating);
  const manual=saved.ratingOverride===true||(saved.ratingOverride!==false&&hasSaved&&Math.abs(savedRating-DEFAULT_PROFILE.rating)>.001);
  const rating=manual?savedRating:(external?.rating??(hasSaved?savedRating:DEFAULT_PROFILE.rating));
  const ratingSource=manual?'Kullanıcı profili':external?.source||(hasSaved&&savedRating!==DEFAULT_PROFILE.rating?'Önceki kayıt · kaynak teyitsiz':'Veri yok · 1500 varsayılan');
  return {...DEFAULT_PROFILE,...saved,rating,ratingOverride:manual,ratingSource,ratingAsOf:external?.asOf||null};
}
function normalise(s){return (s||'').toLocaleLowerCase('tr').replace(/ı/g,'i').normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim()}
function teamByName(name){const key=normalise(name);return teams.find(t=>normalise(t.name)===key)}
function parseCsvRows(text){
  const rows=[];let row=[],field='',quoted=false;
  for(let i=0;i<text.length;i++){
    const c=text[i];
    if(c==='"'){if(quoted&&text[i+1]==='"'){field+='"';i++;}else quoted=!quoted;}
    else if(c===','&&!quoted){row.push(field);field='';}
    else if((c==='\n'||c==='\r')&&!quoted){
      if(c==='\r'&&text[i+1]==='\\n')i++;
      row.push(field);if(row.some(v=>v.trim()!==''))rows.push(row);row=[];field='';
    }else field+=c;
  }
  if(field.length||row.length){row.push(field);if(row.some(v=>v.trim()!==''))rows.push(row);}
  return rows;
}
async function loadTeamRatings(){
  const safeFetch=async(url,type)=>{
    try{const r=await fetch(url,{cache:'no-store'});if(!r.ok)throw new Error('HTTP '+r.status);return type==='json'?await r.json():await r.text();}
    catch(error){console.warn('Rating kaynağı alınamadı:',url,error);return null;}
  };
  let clubText=null,nationalData=null;
  const [clubStatic,nationalStatic]=await Promise.allSettled([
    fetch('./club-ratings.csv?v=20261109',{cache:'no-store'}),
    fetch('./national-ratings.json?v=20261109',{cache:'no-store'})
  ]);
  if(clubStatic.status==='fulfilled'&&clubStatic.value.ok)clubText=await clubStatic.value.text();
  if(nationalStatic.status==='fulfilled'&&nationalStatic.value.ok)nationalData=await nationalStatic.value.json().catch(()=>null);
  if(!clubText||clubText.trim().split(/\r?\n/).length<2)clubText=await safeFetch('https://public-api.beyondelo.com/v1/datasets/club-ratings.csv','text');
  if(!nationalData?.teams?.length)nationalData=await safeFetch('https://worldcupelo.com/api/rankings','json');
  if(clubText){
    try{
      const rows=parseCsvRows(clubText);
      if(rows.length>1){
        const headers=rows.shift().map(x=>x.trim().toLowerCase());
        const nameIndex=headers.indexOf('name'),eloIndex=headers.indexOf('elo'),dateIndex=headers.indexOf('as_of');
        if(nameIndex>=0&&eloIndex>=0){
          externalRatings.club.clear();
          for(const row of rows){
            const rating=Number(row[eloIndex]),name=row[nameIndex]?.trim();
            if(name&&Number.isFinite(rating))externalRatings.club.set(normalise(name),{rating,source:'beyondELO',asOf:row[dateIndex]||''});
          }
          ratingDataStatus.club=externalRatings.club.size>0;
        }
      }
    }catch(error){console.warn('Club Elo verisi okunamadı:',error);}
  }
  if(nationalData){
    try{
      externalRatings.national.clear();
      for(const item of nationalData.teams||[]){
        const rating=Number(item.elo??item.rating);
        if(item.name&&Number.isFinite(rating))externalRatings.national.set(normalise(item.name),{rating,source:'World Football Elo',asOf:nationalData.updated||''});
      }
      ratingDataStatus.national=externalRatings.national.size>0;
    }catch(error){console.warn('Milli takım Elo verisi okunamadı:',error);}
  }
  updateRatingCoverage();
}
function updateRatingCoverage(){
  const clubCount=teams.filter(t=>t.type==='club'&&externalRatingForTeam(t)).length;
  const nationalCount=teams.filter(t=>t.type==='national'&&externalRatingForTeam(t)).length;
  const note=$('modelDataNote');if(!note)return;
  const ready=ratingDataStatus.club||ratingDataStatus.national;
  note.textContent=ready
    ? `ELO verisi yüklendi: ${clubCount}/${teams.filter(t=>t.type==='club').length} kulüp, ${nationalCount}/${teams.filter(t=>t.type==='national').length} milli takım. Kaynağı bulunmayan ekiplerde 1500 varsayılanı kullanılır; maç raporu kaynak bilgisini gösterir.`
    : 'ELO kaynak dosyaları alınamadı. Kaynak puanı bulunmayan takımlarda 1500 varsayılanı kullanılır; API anahtarıyla son 5 maç formunu veya takım gücünü elle ekleyin.';
}
function toast(msg){let n=$('toast');if(!n){n=document.createElement('div');n.id='toast';n.className='toast';document.body.append(n)}n.textContent=msg;n.classList.add('show');clearTimeout(n._timer);n._timer=setTimeout(()=>n.classList.remove('show'),2600)}

async function init(){
  try{const r=await fetch('./teams.json');if(!r.ok)throw new Error('Takım dosyası yüklenemedi');const source=await r.json();teams=Array.isArray(source)?source:[...source.club.map(name=>({name,type:'club'})),...source.national.map(name=>({name,type:'national'}))];}
  catch(e){$('teamCount').textContent='Takım verisi yüklenemedi';toast('Uygulamayı bir web sunucusu üzerinden açın (GitHub Pages desteklenir).');return;}
  await loadTeamRatings();
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
  ['rating','attack','defense','form','homeEdge','fatigue','consistency','morale','motivation'].forEach(id=>$(id).addEventListener('input',updateEditorOutput));
  $('resetProfile').addEventListener('click',()=>{const t=teamByName($(editingSide+'Team').value);if(!t)return;delete profiles[t.name];saveProfiles();openEditor(editingSide);toast('Kayıtlı profil silindi; varsa dış Elo puanı yeniden kullanılır.')});
  $('exportBtn').addEventListener('click',exportData);$('importFile').addEventListener('change',importData);
  $('teamChips').addEventListener('click',e=>{const b=e.target.closest('[data-team]');if(!b)return;const t=teams.find(x=>x.name===b.dataset.team);if(!t)return;$(activeTarget).value=t.name;updateTeamLabels();window.scrollTo({top:0,behavior:'smooth'});});
  initLiveData();
}
function setLiveStatus(text){$('liveStatus').textContent=text}
function getIstanbulDate(){const parts=new Intl.DateTimeFormat('en-US',{timeZone:'Europe/Istanbul',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());const v=Object.fromEntries(parts.map(x=>[x.type,x.value]));return v.year+'-'+v.month+'-'+v.day}
function formatIstanbulTime(value){if(!value)return '—';return new Intl.DateTimeFormat('tr-TR',{timeZone:'Europe/Istanbul',hour:'2-digit',minute:'2-digit'}).format(new Date(value))}
function ensureApiTeam(name){
  let team=teamByName(name);
  if(!team&&name){team={name,type:'club',external:true};teams.push(team);const option=document.createElement('option');option.value=name;$('teamNames').append(option);}
  return team||{name,type:'club'};
}
function liveMatchStatus(f){
  const status=f.fixture?.status||{},short=status.short||'';
  if(status.elapsed!==null&&status.elapsed!==undefined)return short==='HT'?'Devre arası':String(status.elapsed)+"'";
  const labels={NS:'Başlamadı',FT:'Bitti',AET:'Uzatmalar bitti',PEN:'Penaltılar',PST:'Ertelendi',CANC:'İptal',SUSP:'Durduruldu',INT:'Kesildi',BT:'Uzatma arası','1H':'1. yarı','2H':'2. yarı',LIVE:'Canlı'};
  return labels[short]||status.long||short||'Durum bilinmiyor';
}
function renderLiveFixtures(items){
  if(!items.length){
    $('liveFixtures').innerHTML='<div class="live-empty">'+(liveMode==='live'?'Şu anda API tarafından canlı olarak bildirilen maç bulunamadı.':'Bugün için fikstür kaydı bulunamadı.')+'</div>';
    return;
  }
  const sorted=[...items].sort((a,b)=>{
    const active=x=>x.fixture?.status?.elapsed!==null&&x.fixture?.status?.elapsed!==undefined?0:1;
    return active(a)-active(b)||new Date(a.fixture?.date)-new Date(b.fixture?.date);
  });
  $('liveFixtures').innerHTML=sorted.slice(0,100).map(f=>{
    const id=String(f.fixture?.id??''),home=f.teams?.home?.name||'Ev sahibi',away=f.teams?.away?.name||'Deplasman';
    const gh=f.goals?.home,ga=f.goals?.away,league=[f.league?.country,f.league?.name].filter(Boolean).join(' · ');
    const clock=f.fixture?.status?.elapsed!==null&&f.fixture?.status?.elapsed!==undefined?String(f.fixture.status.elapsed)+"'":formatIstanbulTime(f.fixture?.date);
    const events=(f.events||[]).filter(ev=>ev.type==='Goal'||ev.type==='Card').slice(-3).map(ev=>String(ev.time?.elapsed??'')+"' "+(ev.player?.name||ev.type)).join(' · ');
    return '<article class="live-match"><div class="live-match-top"><span>'+escapeHtml(league||'Futbol')+'</span><span class="live-match-state">'+escapeHtml(liveMatchStatus(f))+'</span></div><div class="live-scoreline"><div><span class="live-team">'+escapeHtml(home)+'</span><strong>'+(gh===null||gh===undefined?'–':gh)+'</strong></div><b>:</b><div><strong>'+(ga===null||ga===undefined?'–':ga)+'</strong><span class="live-team">'+escapeHtml(away)+'</span></div></div><div class="live-match-bottom"><span>'+escapeHtml(clock)+(events?' · '+escapeHtml(events):'')+'</span><button class="button subtle" data-live-select="'+escapeHtml(id)+'">Eşleşmeye aktar</button></div></article>';
  }).join('');
}
async function refreshLiveFixtures(mode='live'){
  const key=localStorage.getItem('futbolLabApiSportsKey')||$('liveApiKey').value.trim();
  if(!key){setLiveStatus('API anahtarı gerekli');toast('Canlı veri için API-Football anahtarını kaydedin.');return}
  liveMode=mode;setLiveStatus('Veri alınıyor…');$('refreshLive').disabled=true;$('todayFixtures').disabled=true;
  $('liveFixtures').innerHTML='<div class="live-empty">Maç verileri sağlayıcıdan alınıyor…</div>';
  try{
    const query=mode==='live'?'live=all':'date='+encodeURIComponent(getIstanbulDate());
    const url=API_FOOTBALL_BASE+'/fixtures?'+query+'&timezone=Europe%2FIstanbul';
    const response=await fetch(url,{method:'GET',headers:{'x-apisports-key':key}});
    const remaining=response.headers.get('x-ratelimit-requests-remaining');
    const limit=response.headers.get('x-ratelimit-requests-limit');
    const data=await response.json();
    if(!response.ok){
      const detail=typeof data.message==='string'?data.message:JSON.stringify(data.errors||{});
      if(response.status===401||response.status===403)throw new Error('API anahtarı reddedildi. Anahtarı ve hesap erişimini kontrol edin.');
      if(response.status===429)throw new Error('API istek sınırına ulaşıldı. Kota yenilenince tekrar deneyin.');
      throw new Error(detail||('HTTP '+response.status));
    }
    if(data.errors&&(Array.isArray(data.errors)?data.errors.length:Object.keys(data.errors).length))throw new Error(JSON.stringify(data.errors));
    liveFixtures=Array.isArray(data.response)?data.response:[];
    renderLiveFixtures(liveFixtures);
    $('liveUpdated').textContent='Son güncelleme: '+new Intl.DateTimeFormat('tr-TR',{timeZone:'Europe/Istanbul',hour:'2-digit',minute:'2-digit',day:'2-digit',month:'2-digit'}).format(new Date());
    $('liveQuota').textContent=remaining!==null?'Kalan günlük istek: '+remaining+(limit!==null?'/'+limit:''):'';
    setLiveStatus(mode==='live'?'Canlı veri bağlantısı başarılı':'Günün fikstürü yüklendi');
  }catch(err){
    setLiveStatus('Veri alınamadı');
    $('liveFixtures').innerHTML='<div class="live-error">'+escapeHtml(err.message)+'<br><span>API anahtarı, ücretsiz plan kotası, tarayıcı CORS izni veya bağlantı durumunu kontrol edin.</span></div>';
    toast('Canlı veri alınamadı: '+err.message);
  }finally{$('refreshLive').disabled=false;$('todayFixtures').disabled=false;}
}
async function apiGet(path,key){
  const response=await fetch(API_FOOTBALL_BASE+path,{method:'GET',headers:{'x-apisports-key':key}});
  const remaining=response.headers.get('x-ratelimit-requests-remaining');
  const limit=response.headers.get('x-ratelimit-requests-limit');
  if(remaining!==null)$('liveQuota').textContent='Kalan günlük istek: '+remaining+(limit!==null?'/'+limit:'');
  let data={};try{data=await response.json()}catch{throw new Error('API yanıtı JSON olarak okunamadı.')}
  if(!response.ok){
    if(response.status===401||response.status===403)throw new Error('API anahtarı reddedildi. Hesap/anahtar erişimini kontrol edin.');
    if(response.status===429)throw new Error('API günlük veya dakikalık istek kotası doldu.');
    throw new Error(typeof data.message==='string'?data.message:'API isteği başarısız: HTTP '+response.status);
  }
  if(data.errors&&(Array.isArray(data.errors)?data.errors.length:Object.keys(data.errors).length))throw new Error(JSON.stringify(data.errors));
  return Array.isArray(data.response)?data.response:[];
}
async function resolveApiTeamId(name,key){
  let cache={};try{cache=JSON.parse(localStorage.getItem('futbolLabApiTeamIds')||'{}')}catch{}
  const cached=cache[normalise(name)];if(cached)return Number(cached);
  if(normalise(name).length<3)throw new Error(name+' için takım araması en az 3 karakter gerektiriyor.');
  const matches=await apiGet('/teams?search='+encodeURIComponent(name),key);
  const target=normalise(name);
  const exact=matches.find(x=>normalise(x.team?.name||'')===target);
  const partial=matches.filter(x=>{const n=normalise(x.team?.name||'');return n.includes(target)||target.includes(n)});
  const found=exact||(partial.length===1?partial[0]:(matches.length===1?matches[0]:null));
  if(!found?.team?.id)throw new Error(name+' için tekil API takım eşleşmesi bulunamadı. Takım adını kontrol edin.');
  cache[target]=found.team.id;localStorage.setItem('futbolLabApiTeamIds',JSON.stringify(cache));return Number(found.team.id);
}
function deriveRecentProfile(name,teamId,fixtures){
  const finished=fixtures.filter(x=>['FT','AET','PEN'].includes(x.fixture?.status?.short)&&x.goals?.home!==null&&x.goals?.away!==null)
    .sort((a,b)=>new Date(b.fixture.date)-new Date(a.fixture.date)).slice(0,5);
  if(finished.length<3)throw new Error(name+' için son 5 maçta en az 3 tamamlanmış karşılaşma bulunamadı.');
  const rows=finished.map(x=>{
    const homeId=x.teams?.home?.id,isHome=Number(homeId)===Number(teamId);
    const gf=Number(isHome?x.goals.home:x.goals.away),ga=Number(isHome?x.goals.away:x.goals.home);
    return {gf,ga,diff:gf-ga,points:gf>ga?3:gf===ga?1:0,date:new Date(x.fixture.date)};
  });
  const points=rows.reduce((sum,x)=>sum+x.points,0),avgFor=rows.reduce((sum,x)=>sum+x.gf,0)/rows.length,avgAgainst=rows.reduce((sum,x)=>sum+x.ga,0)/rows.length;
  const form=clamp(Math.round(points/rows.length/3*10-5),-5,5);
  const last3=rows.slice(0,3).reduce((sum,x)=>sum+x.points,0);
  const morale=clamp(Math.round(last3/Math.min(3,rows.length)/3*10-5),-5,5);
  const meanDiff=rows.reduce((sum,x)=>sum+x.diff,0)/rows.length;
  const sd=Math.sqrt(rows.reduce((sum,x)=>sum+Math.pow(x.diff-meanDiff,2),0)/rows.length);
  const consistency=clamp(Math.round(100-sd*22),15,100);
  const lastStamp=rows[0].date.getTime(),daysSince=Number.isFinite(lastStamp)?Math.max(0,(Date.now()-lastStamp)/86400000):5;
  const recent14=rows.filter(x=>Number.isFinite(x.date.getTime())&&(Date.now()-x.date.getTime())/86400000<=14).length;
  const fatigue=clamp(Math.round(Math.max(0,9-daysSince*1.8)+Math.max(0,recent14-2)*1.2),0,10);
  const recentAttack=clamp(.5+avgFor/2.8,.65,1.55);
  const recentDefense=clamp(1.5-avgAgainst/2.8,.65,1.55);
  const current=profile(name);
  return {...current,
    form,morale,fatigue,consistency,
    attack:Number(clamp(current.attack*.6+recentAttack*.4,.65,1.55).toFixed(2)),
    defense:Number(clamp(current.defense*.6+recentDefense*.4,.65,1.55).toFixed(2))
  };
}
async function syncRecentTeamForm(){
  const key=localStorage.getItem('futbolLabApiSportsKey')||$('liveApiKey').value.trim();
  if(!key){toast('Önce API anahtarını kaydedin.');return}
  const home=teamByName($('homeTeam').value),away=teamByName($('awayTeam').value);
  if(!home||!away||home.name===away.name){toast('Önce iki farklı takımı seçin.');return}
  $('syncTeamForm').disabled=true;setLiveStatus('Son maç verileri alınıyor…');
  try{
    const ids=await Promise.all([resolveApiTeamId(home.name,key),resolveApiTeamId(away.name,key)]);
    const histories=await Promise.all(ids.map(id=>apiGet('/fixtures?team='+id+'&last=5&timezone=Europe%2FIstanbul',key)));
    profiles[home.name]=deriveRecentProfile(home.name,ids[0],histories[0]);
    profiles[away.name]=deriveRecentProfile(away.name,ids[1],histories[1]);
    saveProfiles();setLiveStatus('Son maç formu profillere işlendi');
    $('liveUpdated').textContent='Form verisi güncellendi: '+new Intl.DateTimeFormat('tr-TR',{timeZone:'Europe/Istanbul',hour:'2-digit',minute:'2-digit'}).format(new Date());
    if(!$('editor').hidden)openEditor(editingSide);
    if(!$('results').hidden){lastResult={h:home,a:away,m:buildModel(home,away),s:null};lastResult.s=simulateStats(lastResult.m,home.name,away.name);renderResult(lastResult);}
    toast('Son 5 maçtan form, moral, yorgunluk, istikrar, hücum ve savunma verileri güncellendi. Motivasyon manuel kalır.');
  }catch(err){setLiveStatus('Form verisi alınamadı');toast('Form analizi başarısız: '+err.message)}
  finally{$('syncTeamForm').disabled=false;}
}
function initLiveData(){
  const saved=localStorage.getItem('futbolLabApiSportsKey')||'';
  $('liveApiKey').value=saved;
  if(saved)setLiveStatus('Anahtar kayıtlı · bağlantı için yenile');
  $('saveLiveKey').addEventListener('click',()=>{
    const key=$('liveApiKey').value.trim();
    if(key.length<12){toast('Geçerli API anahtarını girin.');return}
    localStorage.setItem('futbolLabApiSportsKey',key);setLiveStatus('Anahtar bu tarayıcıya kaydedildi');toast('API anahtarı tarayıcıya kaydedildi.');
  });
  $('clearLiveKey').addEventListener('click',()=>{
    localStorage.removeItem('futbolLabApiSportsKey');$('liveApiKey').value='';
    if(liveRefreshTimer){clearInterval(liveRefreshTimer);liveRefreshTimer=null}
    $('autoLiveRefresh').checked=false;liveFixtures=[];$('liveFixtures').innerHTML='<div class="live-empty">API anahtarı silindi. Canlı veri bağlantısı kapatıldı.</div>';
    $('liveQuota').textContent='';$('liveUpdated').textContent='Henüz veri alınmadı.';setLiveStatus('API anahtarı gerekli');
  });
  $('refreshLive').addEventListener('click',()=>refreshLiveFixtures('live'));
  $('todayFixtures').addEventListener('click',()=>refreshLiveFixtures('today'));
  $('syncTeamForm').addEventListener('click',syncRecentTeamForm);
  $('autoLiveRefresh').addEventListener('change',()=>{
    if(liveRefreshTimer){clearInterval(liveRefreshTimer);liveRefreshTimer=null}
    if($('autoLiveRefresh').checked){
      if(!localStorage.getItem('futbolLabApiSportsKey')){$('autoLiveRefresh').checked=false;toast('Önce API anahtarını kaydedin.');return}
      liveRefreshTimer=setInterval(()=>refreshLiveFixtures('live'),30*60*1000);
      toast('Canlı maçlar 30 dakikada bir yenilenecek.');
    }
  });
  $('liveFixtures').addEventListener('click',e=>{
    const b=e.target.closest('[data-live-select]');if(!b)return;
    const match=liveFixtures.find(x=>String(x.fixture?.id)===b.dataset.liveSelect);if(!match)return;
    const home=ensureApiTeam(match.teams?.home?.name),away=ensureApiTeam(match.teams?.away?.name);
    try{const ids=JSON.parse(localStorage.getItem('futbolLabApiTeamIds')||'{}');ids[normalise(home.name)]=match.teams?.home?.id;ids[normalise(away.name)]=match.teams?.away?.id;localStorage.setItem('futbolLabApiTeamIds',JSON.stringify(ids));}catch{}
    $('homeTeam').value=home.name;$('awayTeam').value=away.name;updateTeamLabels();
    $('teamCount').textContent=teams.length+' takım';renderTeamChips();
    window.scrollTo({top:0,behavior:'smooth'});toast('Eşleşme simülatöre aktarıldı. Canlı skor tam maç tahminine otomatik eklenmez.');
  });
}
function escapeHtml(s){return s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function updateTeamLabels(){for(const side of ['home','away']){const t=teamByName($(side+'Team').value);$(side+'Type').textContent=t?(t.type==='club'?'Kulüp takımı':'Milli takım'):'Listede bulunamadı';}}
function renderTeamChips(){const q=normalise($('teamSearch').value);const rows=teams.filter(t=>(listFilter==='all'||t.type===listFilter)&&(!q||normalise(t.name).includes(q)));const shown=rows.slice(0,120);$('teamChips').innerHTML=shown.map(t=>`<button class="team-chip" data-team="${escapeHtml(t.name)}">${escapeHtml(t.name)}</button>`).join('');$('listFooter').textContent=rows.length>120?`${rows.length} eşleşme bulundu · İlk 120 takım gösteriliyor. Aramayı daralt.`:`${rows.length} takım gösteriliyor.`;}
function openEditor(side){const t=teamByName($(side+'Team').value);if(!t){toast('Önce listeden bir takım seçin.');return}editingSide=side;const p=profile(t.name);$('editorTitle').textContent=t.name+' · '+(side==='home'?'Ev sahibi':'Deplasman');for(const id of ['rating','attack','defense','form','homeEdge','fatigue','consistency','morale','motivation'])$(id).value=p[id];updateEditorOutput();$('editor').hidden=false;$('editor').scrollIntoView({behavior:'smooth',block:'nearest'});}
function updateEditorOutput(){
  $('ratingOut').textContent=$('rating').value;
  $('attackOut').textContent=Number($('attack').value).toFixed(2)+'×';
  $('defenseOut').textContent=Number($('defense').value).toFixed(2)+'×';
  const signed=id=>(Number($(id).value)>0?'+':'')+$(id).value;
  $('formOut').textContent=signed('form');$('homeEdgeOut').textContent=signed('homeEdge');
  $('fatigueOut').textContent=$('fatigue').value+'/10';$('consistencyOut').textContent=$('consistency').value+'/100';
  $('moraleOut').textContent=signed('morale');$('motivationOut').textContent=$('motivation').value+'/10';
  const t=teamByName($(editingSide+'Team').value);
  if(t){
    const current=profile(t.name),enteredRating=+$('rating').value;
    const ratingOverride=current.ratingOverride||Math.abs(enteredRating-current.rating)>.001;
    profiles[t.name]={rating:enteredRating,ratingOverride,attack:+$('attack').value,defense:+$('defense').value,form:+$('form').value,homeEdge:+$('homeEdge').value,fatigue:+$('fatigue').value,consistency:+$('consistency').value,morale:+$('morale').value,motivation:+$('motivation').value};
    saveProfiles();
  }
}
function poisson(lambda,k){let p=Math.exp(-lambda);for(let i=1;i<=k;i++)p*=lambda/i;return p}
function negativeBinomialArray(mean,shape,max=8){
  const p=shape/(shape+mean),q=1-p;let probability=Math.pow(p,shape),sum=probability;
  const values=[probability];
  for(let k=0;k<max;k++){probability*=((k+shape)/(k+1))*q;values.push(probability);sum+=probability;}
  return values.map(value=>value/sum);
}
function buildModel(home,away){
  const hp=profile(home.name),ap=profile(away.name);
  const ratingDelta=(hp.rating-ap.rating)/850;
  const homeForm=hp.form*(.55+hp.consistency*.0045),awayForm=ap.form*(.55+ap.consistency*.0045);
  const formDelta=(homeForm-awayForm)*.035;
  const homeMind=hp.morale*.018+(hp.motivation-5)*.014;
  const awayMind=ap.morale*.018+(ap.motivation-5)*.014;
  const mentalDelta=homeMind-awayMind;
  const homeAdv=1.09*Math.exp(hp.homeEdge*.05);
  const homeFatigue=Math.exp(-hp.fatigue*.016+ap.fatigue*.009);
  const awayFatigue=Math.exp(-ap.fatigue*.016+hp.fatigue*.009);
  const homeXg=clamp(1.38*Math.exp(ratingDelta+formDelta+mentalDelta)*hp.attack/Math.max(.4,ap.defense)*homeAdv*homeFatigue,.15,4.5);
  const awayXg=clamp(1.12*Math.exp(-ratingDelta-formDelta-mentalDelta)*ap.attack/Math.max(.4,hp.defense)*awayFatigue,.15,4.5);
  const homeShape=2+hp.consistency*.18,awayShape=2+ap.consistency*.18;
  const h=negativeBinomialArray(homeXg,homeShape),a=negativeBinomialArray(awayXg,awayShape);let matrix=[],hw=0,d=0,aw=0,over25=0,total=0;
  for(let i=0;i<=8;i++){matrix[i]=[];for(let j=0;j<=8;j++){let p=h[i]*a[j];matrix[i][j]=p;total+=p;if(i>j)hw+=p;else if(i===j)d+=p;else aw+=p;if(i+j>=3)over25+=p;}}
  hw/=total;d/=total;aw/=total;over25/=total;
  const scores=[];for(let i=0;i<=8;i++)for(let j=0;j<=8;j++)scores.push({score:`${i}-${j}`,p:matrix[i][j]/total,goals:i+j});scores.sort((x,y)=>y.p-x.p);
  return {hp,ap,homeXg,awayXg,hw,d,aw,over25,scores,matrix,total,homeAdv,homeShape,awayShape,formDelta,mentalDelta};
}
function seededRandom(seed){let x=seed>>>0;return()=>{x=(x+0x6D2B79F5)>>>0;let t=x;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return ((t^(t>>>14))>>>0)/4294967296}}
function samplePoisson(lambda,rng){const limit=Math.exp(-lambda);let k=0,p=1;do{k++;p*=rng()}while(p>limit&&k<20);return k-1}
function sampleScore(m){
  let draw=Math.random()*m.total;
  for(let i=0;i<=8;i++)for(let j=0;j<=8;j++){
    draw-=m.matrix[i][j];
    if(draw<=0)return i+'-'+j;
  }
  return m.scores[0].score;
}
function simulateStats(m,homeName,awayName){const pairSeed=[...homeName+awayName].reduce((a,c)=>(a*31+c.charCodeAt(0))>>>0,2166136261);const seed=(pairSeed^Date.now()^Math.floor(Math.random()*4294967296))>>>0;const rng=seededRandom(seed);const sums={posH:0,shotsH:0,shotsA:0,onH:0,onA:0,cornersH:0,cornersA:0,foulsH:0,foulsA:0,yellowH:0,yellowA:0,redH:0,redA:0};const possession=clamp(50+(m.hp.rating-m.ap.rating)/35+4,35,65);
  for(let i=0;i<SIMULATIONS;i++){
    const jitter=()=>.86+rng()*.28;
    const sh=samplePoisson((8.8+m.homeXg*2.2)*jitter()*Math.exp(-m.hp.fatigue*.012),rng),sa=samplePoisson((8.4+m.awayXg*2.2)*jitter()*Math.exp(-m.ap.fatigue*.012),rng);
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
  const m=buildModel(h,a);m.sampledScore=sampleScore(m);const s=simulateStats(m,h.name,a.name);lastResult={h,a,m,s};renderResult(lastResult);$('results').hidden=false;$('results').scrollIntoView({behavior:'smooth',block:'start'});
}
function pct(n){return (n*100).toFixed(1)+'%'}
function calculateScoreMarkets(m){
  const out={btts:0,over15:0,over25:0,over35:0,over45:0,homeBy1:0,homeBy2:0,draw:0,awayBy1:0,awayBy2:0,goals01:0,goals23:0,goals4plus:0};
  for(let i=0;i<=8;i++)for(let j=0;j<=8;j++){
    const p=m.matrix[i][j]/m.total,total=i+j,diff=i-j;
    if(i>0&&j>0)out.btts+=p;
    if(total>=2)out.over15+=p;if(total>=3)out.over25+=p;if(total>=4)out.over35+=p;if(total>=5)out.over45+=p;
    if(diff===1)out.homeBy1+=p;else if(diff>=2)out.homeBy2+=p;else if(diff===0)out.draw+=p;else if(diff===-1)out.awayBy1+=p;else out.awayBy2+=p;
    if(total<=1)out.goals01+=p;else if(total<=3)out.goals23+=p;else out.goals4plus+=p;
  }
  return out;
}
function marketRows(target,rows){
  $(target).innerHTML=rows.map(([label,value])=>'<div class="market-row"><span>'+escapeHtml(label)+'</span><strong>'+pct(value)+'</strong><div class="market-track"><i style="width:'+clamp(value*100,0,100)+'%"></i></div></div>').join('');
}
function renderResult({h,a,m,s}){
  $('resultTitle').innerHTML=`${escapeHtml(h.name)} <small>—</small> ${escapeHtml(a.name)}`;
  $('resultMeta').textContent=`90 dakika · Negatif binom gol modeli · ${SIMULATIONS.toLocaleString('tr-TR')} istatistik senaryosu · ELO ${m.hp.rating} / ${m.ap.rating}`;
  $('homeProb').textContent=pct(m.hw);$('drawProb').textContent=pct(m.d);$('awayProb').textContent=pct(m.aw);
  $('homeBar').style.width=pct(m.hw);$('drawBar').style.width=pct(m.d);$('awayBar').style.width=pct(m.aw);
  const fav=m.hw>m.aw?h.name:m.aw>m.hw?a.name:'İki takım eşit';$('favoriteText').textContent=fav==='İki takım eşit'?'Belirgin favori yok':`${fav} daha yüksek galibiyet olasılığına sahip`;
  $('expectedGoals').textContent=`${m.homeXg.toFixed(2)} – ${m.awayXg.toFixed(2)}`;$('mostLikely').textContent=m.sampledScore||m.scores[0].score;$('over25').textContent=pct(m.over25);
  $('scoreList').innerHTML=m.scores.slice(0,10).map((x,i)=>`<div class="score-chip"><strong><small>#${i+1}</small> ${x.score}</strong><span>${pct(x.p)}</span></div>`).join('');
  const markets=calculateScoreMarkets(m);
  marketRows('goalMarkets',[['Karşılıklı gol var',markets.btts],['Karşılıklı gol yok',1-markets.btts],['1.5 gol üstü',markets.over15],['2.5 gol üstü',markets.over25],['3.5 gol üstü',markets.over35],['4.5 gol üstü',markets.over45]]);
  marketRows('marginMarkets',[[`${h.name} 1 farkla kazanır`,markets.homeBy1],[`${h.name} 2+ farkla kazanır`,markets.homeBy2],['Beraberlik',markets.draw],[`${a.name} 1 farkla kazanır`,markets.awayBy1],[`${a.name} 2+ farkla kazanır`,markets.awayBy2],['Toplam gol 0–1',markets.goals01],['Toplam gol 2–3',markets.goals23],['Toplam gol 4+',markets.goals4plus]]);
  const stats=[['Topla oynama',s.posH,s.posA,'%'],['Toplam şut',s.shotsH,s.shotsA,''],['İsabetli şut',s.onH,s.onA,''],['Korner',s.cornersH,s.cornersA,''],['Faul',s.foulsH,s.foulsA,''],['Sarı kart',s.yellowH,s.yellowA,''],['Kırmızı kart',s.redH,s.redA,'']];
  $('statsTable').innerHTML=stats.map(([name,x,y,unit])=>{const sum=x+y||1,share=x/sum*100;return `<div class="stat-row"><div class="side-cell"><div class="stat-value">${x.toFixed(unit==='%'?1:1)}${unit}</div><div class="stat-track"><span style="width:${share}%"></span><span style="width:${100-share}%"></span></div></div><div class="stat-name">${name}</div><div class="side-cell"><div class="stat-value right">${y.toFixed(1)}${unit}</div><div class="stat-track"><span style="width:${100-share}%"></span><span style="width:${share}%"></span></div></div></div>`}).join('');
  $('modelDetails').innerHTML=[['Ev sahibi xG',m.homeXg.toFixed(3)],['Deplasman xG',m.awayXg.toFixed(3)],['ELO puanları (E / D)',`${m.hp.rating} / ${m.ap.rating}`],['Rating kaynağı (E / D)',`${m.hp.ratingSource} / ${m.ap.ratingSource}`],['Kaynak tarihi (E / D)',`${m.hp.ratingAsOf||'—'} / ${m.ap.ratingAsOf||'—'}`],['SM Rating farkı',(m.hp.rating-m.ap.rating).toFixed(0)],['Ev sahibi saha çarpanı',m.homeAdv.toFixed(2)+'×'],['Form (E / D)',`${m.hp.form>=0?'+':''}${m.hp.form} / ${m.ap.form>=0?'+':''}${m.ap.form}`],['Yorgunluk (E / D)',`${m.hp.fatigue}/10 / ${m.ap.fatigue}/10`],['İstikrar (E / D)',`${m.hp.consistency}/100 / ${m.ap.consistency}/100`],['Moral (E / D)',`${m.hp.morale>=0?'+':''}${m.hp.morale} / ${m.ap.morale>=0?'+':''}${m.ap.morale}`],['Motivasyon (E / D)',`${m.hp.motivation}/10 / ${m.ap.motivation}/10`],['En olası teorik skor',`${m.scores[0].score} · ${pct(m.scores[0].p)}`],['Gösterilen örnek skor',m.sampledScore||m.scores[0].score],['Gol dağılımı',`Negatif binom · k=${m.homeShape.toFixed(1)} / ${m.awayShape.toFixed(1)}`]].map(([a,b])=>`<div class="model-item"><span>${a}</span><strong>${b}</strong></div>`).join('');
}
function exportData(){const data={format:'futbol-lab-profiles-v1',exportedAt:new Date().toISOString(),profiles};const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});download(blob,'futbol-lab-verileri.json')}
function download(blob,name){const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;a.click();URL.revokeObjectURL(url)}
async function importData(e){
  const f=e.target.files?.[0];if(!f)return;
  try{
    const text=await f.text();
    if(f.name.toLowerCase().endsWith('.csv')){
      const lines=text.split(/\r?\n/).filter(Boolean),header=lines.shift().split(',').map(x=>x.trim().toLowerCase());
      for(const line of lines){
        const vals=line.split(','),row=Object.fromEntries(header.map((k,i)=>[k,vals[i]?.trim()]));
        const t=teamByName(row.team||row.name);
        if(t)profiles[t.name]={
          rating:clamp(+(row.rating??1500),900,2200),ratingOverride:true,attack:clamp(+(row.attack??1),.65,1.55),defense:clamp(+(row.defense??1),.65,1.55),
          form:clamp(+(row.form??0),-5,5),homeEdge:clamp(+(row.homeedge??row.home_edge??0),-5,5),
          fatigue:clamp(+(row.fatigue??0),0,10),consistency:clamp(+(row.consistency??72),0,100),
          morale:clamp(+(row.morale??0),-5,5),motivation:clamp(+(row.motivation??5),0,10)
        };
      }
    }else{
      const obj=JSON.parse(text),incoming=obj.profiles||obj;
      if(!incoming||typeof incoming!=='object')throw new Error('JSON biçimi tanınmadı');
      for(const [name,p] of Object.entries(incoming)){
        if(teamByName(name)){
          const v={...DEFAULT_PROFILE,...p};
          profiles[name]={
            rating:clamp(+v.rating,900,2200),ratingOverride:true,attack:clamp(+v.attack,.65,1.55),defense:clamp(+v.defense,.65,1.55),
            form:clamp(+v.form,-5,5),homeEdge:clamp(+v.homeEdge,-5,5),fatigue:clamp(+v.fatigue,0,10),
            consistency:clamp(+v.consistency,0,100),morale:clamp(+v.morale,-5,5),motivation:clamp(+v.motivation,0,10)
          };
        }
      }
    }
    saveProfiles();toast('Takım profilleri içe aktarıldı.');if(!$('editor').hidden)openEditor(editingSide);
  }catch(err){toast('Dosya okunamadı: '+err.message)}finally{e.target.value=''}
}
init();