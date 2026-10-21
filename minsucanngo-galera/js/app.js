/* ===== Centralized Credits Data ===== */
// Photo credits â€” one entry per image used on the website
const photoCredits = [];
// Build from destinations
destinations.forEach((d, i) => {
 photoCredits.push({
  id: 'photo-' + d.id.toLowerCase(),
  type: 'photo',
  contentTitle: d.name,
  destination: d.name,
  photographer: 'Not stated by the original source.',
  publisher: 'Pexels',
  organization: 'Source information unavailable',
  originalImageUrl: d.img,
  license: 'Not stated by the original source.',
  usedOn: 'Explore â€” ' + (catLabels[d.cat] || d.cat),
  notes: 'Image resized and optimized for web display. Display crops may vary depending on screen size.',
  filterCat: 'photos',
  searchText: (d.name + ' ' + (d.area || '') + ' ' + (catLabels[d.cat] || '')).toLowerCase()
 });
});
// Gallery images
galleryItems.forEach((g, i) => {
 photoCredits.push({
  id: 'photo-gallery-' + String(i+1).padStart(3,'0'),
  type: 'photo',
  contentTitle: g.caption,
  destination: g.caption,
  photographer: 'Not stated by the original source.',
  publisher: 'Pexels',
  organization: 'Source information unavailable',
  originalImageUrl: g.src,
  license: 'Not stated by the original source.',
  usedOn: 'Gallery â€” ' + g.cat,
  notes: 'Image resized and optimized for web display. Display crops may vary depending on screen size.',
  filterCat: 'photos',
  searchText: (g.caption + ' ' + g.cat + ' gallery').toLowerCase()
 });
});
// Hero & About images
const siteImages = [
 {id:'photo-hero-001',contentTitle:'Hero Background â€” Beach',photographer:'Not stated by the original source.',publisher:'Pexels',originalImageUrl:'https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg?auto=compress&cs=tinysrgb&w=1920',usedOn:'Hero Section',notes:'Image resized and optimized for web display. Display crops may vary depending on screen size.'},
 {id:'photo-about-001',contentTitle:'About Section â€” Aerial Coast',photographer:'Not stated by the original source.',publisher:'Pexels',originalImageUrl:'https://images.pexels.com/photos/29827505/pexels-photo-29827505.jpeg?auto=compress&cs=tinysrgb&w=1280',usedOn:'About Section',notes:'Image resized and optimized for web display. Display crops may vary depending on screen size.'}
];
siteImages.forEach(s => {
 photoCredits.push({...s, type:'photo', destination:'Puerto Galera', organization:'Source information unavailable', license:'Not stated by the original source.', filterCat:'photos', searchText:(s.contentTitle + ' puerto galera').toLowerCase()});
});

// Information & content sources
const infoSources = [
 {id:'info-epg-001',type:'info',contentTitle:'Tourism Destinations, Descriptions, and Travel Information',source:'Experience Puerto Galera',sourceTitle:'experiencepuertogalera.com',originalPageUrl:'https://experiencepuertogalera.com',publicationDate:'Source information unavailable',accessDate:'Source information unavailable',usedFor:'Destination descriptions, travel planning steps, ferry routes, terminal fees, PG Pass information, and tourism highlights across the website.',notes:'Primary tourism information source referenced throughout the website.',filterCat:'tourism',verified:'Tourism Office',searchText:'experience puerto galera tourism destinations travel ferry terminal pg pass'},
 {id:'info-map-001',type:'info',contentTitle:'Map Tiles and Geographic Data',source:'OpenStreetMap Contributors',sourceTitle:'OpenStreetMap',originalPageUrl:'https://www.openstreetmap.org/copyright',publicationDate:'Continuously updated',accessDate:'Source information unavailable',usedFor:'Interactive map display in Plan Your Trip section.',notes:'Map tiles served via OpenStreetMap. Attribution required by license.',filterCat:'maps',verified:'Community Source',searchText:'openstreetmap map tiles geographic plan trip'},
 {id:'info-unesco-001',type:'info',contentTitle:'UNESCO Man and Biosphere Program Recognition',source:'Source information unavailable',sourceTitle:'Source information unavailable',originalPageUrl:'',publicationDate:'1973 (Presidential Decree 354)',accessDate:'Source information unavailable',usedFor:'About section â€” significance and history of Puerto Galera.',notes:'Referenced via Experience Puerto Galera. Original UNESCO documentation not directly linked.',filterCat:'government',verified:'',searchText:'unesco man biosphere program puerto galera presidential decree 354 history'},
 {id:'info-dive-001',type:'info',contentTitle:'Philippines No. 1 Dive Destination 2025â€“2027',source:'Source information unavailable',sourceTitle:'Source information unavailable',originalPageUrl:'',publicationDate:'Source information unavailable',accessDate:'Source information unavailable',usedFor:'Hero badge and About section.',notes:'Claim referenced via Experience Puerto Galera. Original award documentation not directly available on the website.',filterCat:'tourism',verified:'',searchText:'dive destination 2025 2027 award philippines puerto galera'},
 {id:'info-verde-001',type:'info',contentTitle:'Verde Island Passage â€” Center of Marine Shorefish Biodiversity',source:'Source information unavailable',sourceTitle:'Source information unavailable',originalPageUrl:'',publicationDate:'Source information unavailable',accessDate:'Source information unavailable',usedFor:'Dive site descriptions and About section.',notes:'Scientific designation referenced via Experience Puerto Galera. Original research publication not directly linked.',filterCat:'other',verified:'',searchText:'verde island passage center marine shorefish biodiversity dive'},
 {id:'info-mangyan-001',type:'info',contentTitle:'Iraya Mangyan Community and Cultural Heritage',source:'Experience Puerto Galera',sourceTitle:'experiencepuertogalera.com',originalPageUrl:'https://experiencepuertogalera.com',publicationDate:'Source information unavailable',accessDate:'Source information unavailable',usedFor:'About section and Culture & History destination cards (Ambang, Baclayan).',notes:'Cultural descriptions sourced from Experience Puerto Galera.',filterCat:'tourism',verified:'Tourism Office',searchText:'iraya mangyan community culture heritage ambang baclayan'},
 {id:'info-history-001',type:'info',contentTitle:'Puerto Galera Municipal History (Est. 1927, Act 3415)',source:'Experience Puerto Galera',sourceTitle:'experiencepuertogalera.com',originalPageUrl:'https://experiencepuertogalera.com',publicationDate:'Source information unavailable',accessDate:'Source information unavailable',usedFor:'About section â€” History & Identity.',notes:'Historical dates and legislative reference from Experience Puerto Galera.',filterCat:'government',verified:'',searchText:'puerto galera history 1927 act 3415 municipality founded capital mindoro'}
];

// Build lookup: destination ID -> credit IDs
const destCreditMap = {};
destinations.forEach(d => {
 const pid = 'photo-' + d.id.toLowerCase();
 destCreditMap[d.id] = [pid];
});
// Link info sources to destinations by keyword
function getInfoForDest(d) {
 const results = [];
 const name = d.name.toLowerCase();
 if (name.includes('mangyan') || name.includes('ambang') || name.includes('baclayan')) results.push('info-mangyan-001');
 if (d.cat === 'dive' || name.includes('verde') || name.includes('coral') || name.includes('clam') || name.includes('canyon') || name.includes('channel') || name.includes('wreck')) {
  results.push('info-dive-001', 'info-verde-001');
 }
 results.push('info-epg-001');
 return [...new Set(results)];
}

const allCreditsById = {};
photoCredits.forEach(c => allCreditsById[c.id] = c);
infoSources.forEach(c => allCreditsById[c.id] = c);

/* ===== Utility ===== */
const $=id=>document.getElementById(id);
let currentFilter='all',galleryFilter='all',filteredGallery=[],lightboxIdx=0,modalTrigger=null,lightboxTrigger=null,selected=null,visitorPosition=null,map=null,visitorMarker=null;
const broadLocation='Puerto Galera, Oriental Mindoro';
function locationOf(d){return d.area?d.area+', Puerto Galera, Oriental Mindoro':broadLocation}
function searchURL(d){return 'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent((d?d.name+' ':'Puerto Galera ')+(d?'Puerto Galera Oriental Mindoro':'Oriental Mindoro'))}
function directionsURL(d){const params=new URLSearchParams({api:'1',destination:(d?d.name+' ':'Puerto Galera ')+'Puerto Galera Oriental Mindoro'});if(visitorPosition)params.set('origin',visitorPosition.lat+','+visitorPosition.lng);return 'https://www.google.com/maps/dir/?'+params.toString()}
function selectDestination(d){selected=d;$('selected-map-name').textContent=d.name;$('selected-map-location').textContent='Location: '+locationOf(d);$('selected-map-link').href=searchURL(d);$('selected-map-link').setAttribute('aria-label','Search Google Maps for '+d.name+' in a new tab; exact pin not verified');updateDirections()}
function updateDirections(){const link=$('directions-link');link.classList.toggle('hidden',!visitorPosition);if(visitorPosition){link.href=directionsURL(selected);link.setAttribute('aria-label','Open Google Maps directions from my current position to '+(selected?selected.name:'Puerto Galera')+' in a new tab; destination is a search, not a verified exact pin')}}
function setTabs(group,key,value){document.querySelectorAll('#'+group+' [data-'+key+']').forEach(b=>{const active=b.dataset[key]===value||b.getAttribute('data-'+key.replace(/([A-Z])/g,'-$1').toLowerCase())===value;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active))})}

/* ===== Destinations ===== */
function renderDestinations(){
const query=$('dest-search').value.trim().toLowerCase(),shown=destinations.filter(d=>(currentFilter==='all'||d.cat===currentFilter)&&(!query||d.name.toLowerCase().includes(query)||d.desc.toLowerCase().includes(query)));
const grid=$('dest-grid');grid.replaceChildren();$('no-results').classList.toggle('hidden',shown.length>0);
shown.forEach(d=>{
const card=document.createElement('article');card.className='destination-card tropical-card';card.dataset.category=d.cat;
const visual=document.createElement('div');visual.className='destination-visual';
const image=document.createElement('img');image.src=d.img;image.alt=d.alt;image.loading='lazy';
const tag=document.createElement('span');tag.className='destination-badge';tag.textContent=catLabels[d.cat];visual.append(image,tag);
const info=document.createElement('div');info.className='destination-body';
const title=document.createElement('h3');title.textContent=d.name;
const loc=document.createElement('p');loc.className='destination-location';loc.textContent=locationOf(d);
const desc=document.createElement('p');desc.className='destination-description';desc.textContent=d.desc;
const highlights=document.createElement('div');highlights.className='destination-highlights';(d.highlights||'').split(',').slice(0,2).forEach(item=>{if(!item.trim())return;const chip=document.createElement('span');chip.textContent=item.trim();highlights.append(chip)});
const actions=document.createElement('div');actions.className='destination-actions';
const guide=document.createElement('button');guide.type='button';guide.className='btn-primary px-4 py-2 text-sm';guide.textContent='View Guide';guide.setAttribute('aria-label','View guide for '+d.name);guide.dataset.destinationId=d.id;
const maps=document.createElement('a');maps.href=searchURL(d);maps.target='_blank';maps.rel='noopener noreferrer';maps.className='map-link map-action-btn px-4 py-2 text-sm';maps.textContent='Maps ↗';maps.setAttribute('aria-label','Search Google Maps for '+d.name+' in a new tab; exact pin not verified');maps.addEventListener('click',()=>selectDestination(d));
const srcBtn=document.createElement('button');srcBtn.type='button';srcBtn.className='destination-source';srcBtn.textContent='Photo & sources';srcBtn.dataset.sourceId=d.id;
actions.append(guide,maps);info.append(title,loc,desc,highlights,actions,srcBtn);card.append(visual,info);grid.append(card)
})}

function renderFeatured(){
 const categories=[
  ['beach','Beaches','Find your place by the water','sun'],['dive','Diving','Explore vibrant marine life','waves'],
  ['nature','Nature','Follow the island’s wild side','trees'],['culture','Culture & Heritage','Meet the stories of Puerto Galera','landmark'],
  ['leisure','Island Leisure','Make every day an adventure','sailboat'],['education','Educational Tourism','Learn from the living landscape','graduation-cap']
 ];
 const grid=$('featured-grid');grid.replaceChildren();
 categories.forEach(([cat,label,line,icon])=>{const d=destinations.find(item=>item.cat===cat);if(!d)return;const card=document.createElement('button');card.type='button';card.className='featured-card';card.dataset.category=cat;card.setAttribute('aria-label','Explore '+label);const img=document.createElement('img');img.src=d.img;img.alt='';img.loading='lazy';const content=document.createElement('span');content.className='featured-copy';content.innerHTML='<span class="featured-icon"><i data-lucide="'+icon+'" aria-hidden="true"></i></span><strong>'+label+'</strong><span>'+line+'</span><span class="featured-action">Explore <span aria-hidden="true">↗</span></span>';card.append(img,content);card.addEventListener('click',()=>{currentFilter=cat;setTabs('filter-tabs','cat',cat);renderDestinations();$('explore').scrollIntoView({behavior:'smooth'})});grid.append(card)});
}

function openModal(id,trigger){const d=destinations.find(item=>item.id===id);if(!d)return;selectDestination(d);modalTrigger=trigger||document.activeElement;$('modal-img').src=d.img;$('modal-img').alt=d.alt;$('modal-cat').textContent=catLabels[d.cat];$('modal-name').textContent=d.name;$('modal-desc').textContent=d.desc;$('modal-highlights').textContent=d.highlights?'Highlights: '+d.highlights:'';$('modal-location').textContent='Location: '+locationOf(d);$('modal-tips').textContent='Visitor tips: Check current conditions with the Tourism Office, bring water and sun protection, respect local communities and protected areas, and follow site-specific safety guidance.';$('modal-map-link').href=searchURL(d);$('modal-map-link').setAttribute('aria-label','Search Google Maps for '+d.name+' in a new tab; exact pin not verified');$('dest-modal').classList.remove('hidden');document.body.style.overflow='hidden';$('modal-x').focus();
// Store current dest for sources button
$('modal-sources-btn').onclick=()=>{closeModal();openSourcesModal(d)};
}
function closeModal(){if($('dest-modal').classList.contains('hidden'))return;$('dest-modal').classList.add('hidden');document.body.style.overflow='';if(modalTrigger&&modalTrigger.isConnected)modalTrigger.focus()}

/* ===== Sources Detail Modal ===== */
let sourcesModalTrigger=null;
function openSourcesModal(d){
 sourcesModalTrigger=document.activeElement;
 const body=$('sources-modal-body');
 body.replaceChildren();
 // Photo credit
 const photoId='photo-'+d.id.toLowerCase();
 const pc=allCreditsById[photoId];
 if(pc){
  const div=document.createElement('div');div.className='border-b border-gray-100 pb-3';
  div.innerHTML='<p class="font-bold mb-1" style="color:var(--ocean)">Photo Credit</p>'+
   '<p><span class="credit-label">Photographer:</span> '+esc(pc.photographer)+'</p>'+
   '<p><span class="credit-label">Published by:</span> '+esc(pc.publisher)+'</p>'+
   '<p><span class="credit-label">License:</span> '+esc(pc.license)+'</p>'+
   (pc.originalImageUrl?'<p><a href="'+esc(pc.originalImageUrl)+'" target="_blank" rel="noopener noreferrer" class="source-link">View Source Image â†—</a></p>':'');
  body.append(div);
 }
 // Info sources
 const infoIds=getInfoForDest(d);
 if(infoIds.length){
  const h=document.createElement('p');h.className='font-bold mt-2';h.style.color='var(--ocean)';h.textContent='Information Sources';body.append(h);
  infoIds.forEach(iid=>{
   const info=allCreditsById[iid];if(!info)return;
   const div=document.createElement('div');div.className='pl-3 border-l-2 mb-2';div.style.borderColor='var(--sky)';
   div.innerHTML='<p class="font-semibold">'+esc(info.contentTitle)+'</p>'+
    '<p><span class="credit-label">Source:</span> '+esc(info.source)+'</p>'+
    (info.originalPageUrl?'<p><a href="'+esc(info.originalPageUrl)+'" target="_blank" rel="noopener noreferrer" class="source-link">View Original Source â†—</a></p>':'')+
    (info.verified?'<span class="inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-bold" style="background:var(--seafoam);color:var(--ocean)">'+esc(info.verified)+'</span>':'');
   body.append(div);
  });
 }
 if(!pc&&!infoIds.length){body.innerHTML='<p class="prose-muted">Source information unavailable.</p>'}
 $('sources-modal').classList.remove('hidden');document.body.style.overflow='hidden';$('sources-modal-close').focus();
}
function closeSourcesModal(){$('sources-modal').classList.add('hidden');document.body.style.overflow='';if(sourcesModalTrigger?.isConnected)sourcesModalTrigger.focus()}
function esc(s){const d=document.createElement('div');d.textContent=s;return d.innerHTML}

/* ===== Credits Section Rendering ===== */
let creditsTab='photos',creditsFilter='all',creditsQuery='',creditsExpanded=false;
function renderCreditsSection(){
 const photoList=$('credits-photo-list');
 const infoList=$('credits-info-list');
 photoList.classList.toggle('hidden',creditsTab!=='photos');
 infoList.classList.toggle('hidden',creditsTab!=='info');
 $('tab-photos').classList.toggle('active',creditsTab==='photos');$('tab-photos').setAttribute('aria-pressed',String(creditsTab==='photos'));
 $('tab-info').classList.toggle('active',creditsTab==='info');$('tab-info').setAttribute('aria-pressed',String(creditsTab==='info'));

 if(creditsTab==='photos'){
  const filtered=photoCredits.filter(c=>{
   if(creditsFilter!=='all'&&creditsFilter!=='photos') return false;
   if(creditsQuery&&!c.searchText.includes(creditsQuery)) return false;
   return true;
  });
  photoList.replaceChildren();
  $('credits-no-results').classList.toggle('hidden',filtered.length>0);
  const canToggle=!creditsQuery&&(creditsFilter==='all'||creditsFilter==='photos')&&filtered.length>8;
  const compact=canToggle&&!creditsExpanded;
  $('credits-show-more').classList.toggle('hidden',!canToggle);
  $('credits-show-more').textContent=creditsExpanded?'Show fewer photo credits':'Show all '+filtered.length+' photo credits';
  (compact?filtered.slice(0,8):filtered).forEach((c,i)=>{
   const card=document.createElement('div');card.className='credit-card flex gap-4 items-start';
   const num=document.createElement('span');num.className='credit-number';num.textContent=String(i+1).padStart(2,'0');
   const body=document.createElement('div');body.className='flex-1 min-w-0 space-y-1';
   body.innerHTML='<p class="font-bold" style="color:var(--navy)">'+esc(c.contentTitle)+'</p>'+
    '<p><span class="credit-label">Photographer:</span> <span class="credit-value">'+esc(c.photographer)+'</span></p>'+
    '<p><span class="credit-label">Published by:</span> <span class="credit-value">'+esc(c.publisher)+'</span></p>'+
    (c.originalImageUrl?'<p><span class="credit-label">Source Image:</span> <a href="'+esc(c.originalImageUrl)+'" target="_blank" rel="noopener noreferrer" class="source-link text-sm">View on Pexels â†—</a></p>':'')+
    '<p><span class="credit-label">License / Usage:</span> <span class="credit-value">'+esc(c.license)+'</span></p>'+
    '<p><span class="credit-label">Website Usage:</span> <span class="credit-value">'+esc(c.usedOn)+'</span></p>'+
    (c.notes?'<p class="text-xs prose-muted italic">'+esc(c.notes)+'</p>':'');
   card.append(num,body);photoList.append(card);
  });
 } else {
  $('credits-show-more').classList.add('hidden');
  const filtered=infoSources.filter(c=>{
   if(creditsFilter!=='all'){
    if(creditsFilter==='destination'&&c.filterCat!=='tourism'&&c.filterCat!=='other') return false;
    else if(creditsFilter==='government'&&c.filterCat!=='government') return false;
    else if(creditsFilter==='tourism'&&c.filterCat!=='tourism') return false;
    else if(creditsFilter==='maps'&&c.filterCat!=='maps') return false;
    else if(creditsFilter==='other'&&c.filterCat!=='other') return false;
    else if(creditsFilter==='photos') return false;
   }
   if(creditsQuery&&!c.searchText.includes(creditsQuery)) return false;
   return true;
  });
  infoList.replaceChildren();
  $('credits-no-results').classList.toggle('hidden',filtered.length>0);
  filtered.forEach((c,i)=>{
   const card=document.createElement('div');card.className='credit-card flex gap-4 items-start';
   const num=document.createElement('span');num.className='credit-number';num.textContent=String(i+1).padStart(2,'0');
   const body=document.createElement('div');body.className='flex-1 min-w-0 space-y-1';
   body.innerHTML='<p class="font-bold" style="color:var(--navy)">'+esc(c.contentTitle)+'</p>'+
    '<p><span class="credit-label">Information Source:</span> <span class="credit-value">'+esc(c.source)+'</span></p>'+
    (c.sourceTitle?'<p><span class="credit-label">Article / Page:</span> <span class="credit-value">'+esc(c.sourceTitle)+'</span></p>':'')+
    (c.originalPageUrl?'<p><span class="credit-label">Original Source:</span> <a href="'+esc(c.originalPageUrl)+'" target="_blank" rel="noopener noreferrer" class="source-link text-sm">'+esc(c.originalPageUrl)+' â†—</a></p>':'<p><span class="credit-label">Original Source:</span> <span class="credit-value">Source information unavailable</span></p>')+
    '<p><span class="credit-label">Publication Date:</span> <span class="credit-value">'+esc(c.publicationDate)+'</span></p>'+
    '<p><span class="credit-label">Accessed:</span> <span class="credit-value">'+(c.accessDate||'Source information unavailable')+'</span></p>'+
    '<p><span class="credit-label">Used For:</span> <span class="credit-value">'+esc(c.usedFor)+'</span></p>'+
    (c.notes?'<p class="text-xs prose-muted italic">'+esc(c.notes)+'</p>':'')+
    (c.verified?'<span class="inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-bold" style="background:var(--seafoam);color:var(--ocean)">'+esc(c.verified)+'</span>':'');
   card.append(num,body);infoList.append(card);
  });
 }
}

/* ===== Gallery ===== */
function renderGallery(){filteredGallery=galleryFilter==='all'?galleryItems:galleryItems.filter(g=>g.cat===galleryFilter);$('gallery-grid').replaceChildren();const rows=[[],[],[],[]];filteredGallery.forEach((g,i)=>rows[i%4].push({g,i}));rows.forEach((row,rowIndex)=>{const viewport=document.createElement('div');viewport.className='marquee-viewport';const track=document.createElement('div');track.className='marquee-track'+(rowIndex%2?' reverse':'');const repeated=[...row,...row];repeated.forEach(({g,i})=>{const item=document.createElement('div');item.className='marquee-item';const btn=document.createElement('button');btn.type='button';btn.className='block w-full rounded-xl overflow-hidden focus-visible:outline';btn.setAttribute('aria-label','View '+g.caption);const img=document.createElement('img');img.src=g.src;img.alt=g.alt;img.loading='lazy';img.className='w-full';btn.append(img);btn.addEventListener('click',()=>{lightboxTrigger=btn;lightboxIdx=i;showLightbox()});const caption=document.createElement('p');caption.className='text-sm font-semibold mt-2';caption.textContent=g.caption;const credit=document.createElement('p');credit.className='credit mt-1';credit.textContent='Image source: Pexels';item.append(btn,caption,credit);track.append(item)});viewport.append(track);$('gallery-grid').append(viewport)})}
function showLightbox(){const g=filteredGallery[lightboxIdx];if(!g)return;$('lightbox-img').src=g.src;$('lightbox-img').alt=g.alt;$('lightbox-caption').textContent=g.caption+' · '+g.cat.charAt(0).toUpperCase()+g.cat.slice(1);$('lightbox').classList.remove('hidden');document.body.style.overflow='hidden';$('lightbox-close').focus()}
function closeLightbox(){if($('lightbox').classList.contains('hidden'))return;$('lightbox').classList.add('hidden');document.body.style.overflow='';if(lightboxTrigger?.isConnected)lightboxTrigger.focus()}
function moveLightbox(step){lightboxIdx=(lightboxIdx+step+filteredGallery.length)%filteredGallery.length;showLightbox()}

/* ===== QR ===== */
function lookupQR(){const code=$('qr-input').value.trim().toUpperCase(),d=destinations.find(item=>item.id===code);$('qr-error').classList.toggle('hidden',!!d);if(!d){$('qr-result').classList.add('hidden');return}selectDestination(d);$('qr-result-img').src=d.img;$('qr-result-img').alt=d.alt;$('qr-result-cat').textContent=catLabels[d.cat];$('qr-result-name').textContent=d.name;$('qr-result-desc').textContent=d.desc;$('qr-result-highlights').textContent=d.highlights?'Highlights: '+d.highlights:'';$('qr-result-location').textContent='Location: '+locationOf(d);$('qr-map-link').href=searchURL(d);$('qr-map-link').setAttribute('aria-label','Search Google Maps for '+d.name+' in a new tab; exact pin not verified');$('qr-result').classList.remove('hidden');$('qr-result').scrollIntoView({behavior:'smooth',block:'nearest'})}

function closeMenu(){$('mobile-menu').classList.remove('open');$('menu-open').setAttribute('aria-expanded','false')}

/* ===== Init ===== */
document.addEventListener('DOMContentLoaded',()=>{
renderFeatured();renderDestinations();renderGallery();renderCreditsSection();if(window.lucide)lucide.createIcons();
['CORAL01','MUEL01','TUKU01','ESCA01','AMBA01','BACL01'].forEach(id=>{const d=destinations.find(x=>x.id===id),b=document.createElement('button');b.type='button';b.textContent=d.name;b.className='qr-sample-btn px-4 py-2 text-sm';b.addEventListener('click',()=>{$('qr-input').value=id;lookupQR()});$('qr-samples').append(b)});
if(window.L){map=L.map('plan-map',{scrollWheelZoom:false}).setView([13.50,120.96],11);map.attributionControl.setPrefix(false);L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors'}).addTo(map)}
if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}}));document.querySelectorAll('.fade-in').forEach(el=>observer.observe(el))}else document.querySelectorAll('.fade-in').forEach(el=>el.classList.add('visible'));
const navLinks=[...document.querySelectorAll('.desktop-nav a[href^="#"]')];const sections=navLinks.map(link=>$(link.hash.slice(1))).filter(Boolean);
const updateNavigation=()=>{let active='home';for(const section of sections){if(section.getBoundingClientRect().top<=140)active=section.id}navLinks.forEach(link=>{const on=link.hash==='#'+active;link.classList.toggle('active-link',on);if(on)link.setAttribute('aria-current','page');else link.removeAttribute('aria-current')});$('back-to-top').classList.toggle('visible',window.scrollY>650)};
window.addEventListener('scroll',updateNavigation,{passive:true});updateNavigation();

});

/* ===== Live Location ===== */
$('live-location-button').addEventListener('click',()=>{
const btn=$('live-location-button');if(!navigator.geolocation){$('live-status').textContent='Live location is unavailable. Please open the destination in Google Maps for directions.';return}
btn.disabled=true;$('live-status').textContent='Requesting your one-time locationâ€¦';
navigator.geolocation.getCurrentPosition(position=>{visitorPosition={lat:position.coords.latitude,lng:position.coords.longitude};if(map){if(visitorMarker)map.removeLayer(visitorMarker);visitorMarker=L.marker([visitorPosition.lat,visitorPosition.lng]).addTo(map).bindPopup('Your one-time location');map.setView([visitorPosition.lat,visitorPosition.lng],12)}updateDirections();$('live-status').textContent='Your one-time location is shown on the map when available. Use the directions link for your selected destination.';btn.disabled=false},()=>{$('live-status').textContent='Live location is unavailable. Please open the destination in Google Maps for directions.';btn.disabled=false},{enableHighAccuracy:false,timeout:10000,maximumAge:0})
});

/* ===== Event Listeners ===== */
$('filter-tabs').addEventListener('click',e=>{const b=e.target.closest('[data-cat]');if(!b)return;currentFilter=b.dataset.cat;setTabs('filter-tabs','cat',currentFilter);renderDestinations()});
$('dest-search').addEventListener('input',renderDestinations);
document.addEventListener('click',e=>{const guide=e.target.closest('#dest-grid [data-destination-id]');if(guide){e.preventDefault();const d=destinations.find(item=>item.id===guide.dataset.destinationId);if(d){guide.setAttribute('aria-pressed','true');openModal(d.id,guide)}return}const source=e.target.closest('#dest-grid [data-source-id]');if(source){e.preventDefault();const d=destinations.find(item=>item.id===source.dataset.sourceId);if(d)openSourcesModal(d)}});document.addEventListener('keydown',e=>{if(e.key!=='Enter'&&e.key!==' ')return;const control=e.target.closest('#dest-grid [data-destination-id],#dest-grid [data-source-id]');if(!control)return;e.preventDefault();control.click()});
document.querySelectorAll('[data-filter-feature]').forEach(b=>b.addEventListener('click',()=>{currentFilter=b.dataset.filterFeature;setTabs('filter-tabs','cat',currentFilter);renderDestinations();$('explore').scrollIntoView({behavior:'smooth'})}));
$('gallery-tabs').addEventListener('click',e=>{const b=e.target.closest('[data-gcat]');if(!b)return;galleryFilter=b.dataset.gcat;setTabs('gallery-tabs','gcat',galleryFilter);renderGallery()});
$('modal-x').addEventListener('click',closeModal);$('modal-close').addEventListener('click',closeModal);$('modal-inquire').addEventListener('click',closeModal);$('dest-modal').addEventListener('click',e=>{if(e.target===e.currentTarget)closeModal()});
$('sources-modal-close').addEventListener('click',closeSourcesModal);$('sources-modal').addEventListener('click',e=>{if(e.target===e.currentTarget)closeSourcesModal()});
$('lightbox-close').addEventListener('click',closeLightbox);$('lightbox-prev').addEventListener('click',()=>moveLightbox(-1));$('lightbox-next').addEventListener('click',()=>moveLightbox(1));$('lightbox').addEventListener('click',e=>{if(e.target===e.currentTarget)closeLightbox()});

document.addEventListener('keydown',e=>{
 if(e.key==='Escape'){
  if(!$('sources-modal').classList.contains('hidden'))closeSourcesModal();
  else if(!$('lightbox').classList.contains('hidden'))closeLightbox();
  else if(!$('dest-modal').classList.contains('hidden'))closeModal();
  else closeMenu()
 }
 if(!$('lightbox').classList.contains('hidden')&&e.key==='ArrowLeft')moveLightbox(-1);
 if(!$('lightbox').classList.contains('hidden')&&e.key==='ArrowRight')moveLightbox(1);
 const dialog=!$('sources-modal').classList.contains('hidden')?$('sources-modal'):!$('dest-modal').classList.contains('hidden')?$('dest-modal'):!$('lightbox').classList.contains('hidden')?$('lightbox'):null;
 if(dialog&&e.key==='Tab'){const elements=[...dialog.querySelectorAll('button,a[href]')].filter(el=>el.getClientRects().length);if(!elements.length)return;const first=elements[0],last=elements.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}
});

$('menu-open').addEventListener('click',()=>{$('mobile-menu').classList.add('open');$('menu-open').setAttribute('aria-expanded','true');$('menu-close').focus()});$('menu-close').addEventListener('click',()=>{closeMenu();$('menu-open').focus()});$('mobile-menu').querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));

$('qr-form').addEventListener('submit',e=>{e.preventDefault();lookupQR()});$('qr-back').addEventListener('click',()=>{$('qr-result').classList.add('hidden');$('qr-input').focus()});
$('qr-copy').addEventListener('click',async()=>{try{await navigator.clipboard.writeText('MinSUcanNGo Galera QR Guide: '+$('qr-input').value.trim());$('qr-copy-status').textContent='Guide code copied.'}catch(e){$('qr-copy-status').textContent='Could not copy automatically. Select the code above to copy it.'}});

/* Credits tabs & filters */
$('tab-photos').addEventListener('click',()=>{creditsTab='photos';renderCreditsSection()});
$('tab-info').addEventListener('click',()=>{creditsTab='info';renderCreditsSection()});
$('credits-show-more').addEventListener('click',()=>{creditsExpanded=!creditsExpanded;renderCreditsSection()});
$('credits-search').addEventListener('input',e=>{creditsQuery=e.target.value.trim().toLowerCase();renderCreditsSection()});
$('credits-filters').addEventListener('click',e=>{const b=e.target.closest('[data-cfilter]');if(!b)return;creditsFilter=b.dataset.cfilter;document.querySelectorAll('#credits-filters [data-cfilter]').forEach(btn=>{btn.classList.toggle('active',btn.dataset.cfilter===creditsFilter);btn.setAttribute('aria-pressed',String(btn.dataset.cfilter===creditsFilter))});renderCreditsSection()});

/* Standalone contact form: validate, then open the visitor's email app. */
$('contact-form').addEventListener('submit', e=>{
 e.preventDefault();
 $('cf-success').classList.add('hidden');$('cf-fail').classList.add('hidden');
 const ids=['name','email','mobile','subject','message'];const record={};let valid=true;
 ids.forEach(key=>{const el=$('cf-'+key);record[key]=el.value.trim();const error=el.parentElement.querySelector('.cf-error');const invalid=el.required&&(!record[key]||(key==='email'&&!el.checkValidity()));if(error)error.classList.toggle('hidden',!invalid);el.setAttribute('aria-invalid',String(invalid));if(invalid)valid=false});
 if(!valid)return;
 const body=`Name: ${record.name}\nEmail: ${record.email}\nMobile: ${record.mobile||'Not provided'}\n\n${record.message}`;
 const link='mailto:pgtourismoffice@gmail.com?subject='+encodeURIComponent(record.subject)+'&body='+encodeURIComponent(body);
 $('cf-success').textContent='Your email app will open with this inquiry. Review it and press Send there.';
 $('cf-success').classList.remove('hidden');window.location.href=link;
});


