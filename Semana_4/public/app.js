// ── State ──────────────────────────────────────────────────────────────
let sourceImage   = null;
let outputDataURL = null;
let currentFile   = null;
let lightboxCurrent = null;

// ── Elements ──────────────────────────────────────────────────────────
const fileInput         = document.getElementById('fileInput');
const dropZone          = document.getElementById('dropZone');
const inputPreview      = document.getElementById('inputPreview');
const sourceImg         = document.getElementById('sourceImg');
const imgW              = document.getElementById('imgW');
const imgH              = document.getElementById('imgH');
const imgSize           = document.getElementById('imgSize');
const outputCanvas      = document.getElementById('outputCanvas');
const outputPlaceholder = document.getElementById('outputPlaceholder');
const workCanvas        = document.getElementById('workCanvas');
const processingOverlay = document.getElementById('processingOverlay');
const progressFill      = document.getElementById('progressFill');
const procText          = document.getElementById('procText');

const pixelSizeSlider   = document.getElementById('pixelSize');
const pixelSizeVal      = document.getElementById('pixelSizeVal');
const colorDepthSlider  = document.getElementById('colorDepth');
const colorDepthVal     = document.getElementById('colorDepthVal');
const paletteSelect     = document.getElementById('palette');
const ditherToggle      = document.getElementById('ditherToggle');

const convertBtn        = document.getElementById('convertBtn');
const resetBtn          = document.getElementById('resetBtn');
const downloadBtn       = document.getElementById('downloadBtn');
const saveToGalleryBtn  = document.getElementById('saveToGalleryBtn');

const inDot    = document.getElementById('inDot');
const outDot   = document.getElementById('outDot');
const modeStat = document.getElementById('modeStat');
const fileStat = document.getElementById('fileStat');
const memStat  = document.getElementById('memStat');

const galleryGrid       = document.getElementById('galleryGrid');
const galleryEmpty      = document.getElementById('galleryEmpty');
const galleryCount      = document.getElementById('galleryCount');
const refreshGalleryBtn = document.getElementById('refreshGalleryBtn');

const lightbox          = document.getElementById('lightbox');
const lightboxBackdrop  = document.getElementById('lightboxBackdrop');
const lightboxImg       = document.getElementById('lightboxImg');
const lightboxFilename  = document.getElementById('lightboxFilename');
const lightboxDownload  = document.getElementById('lightboxDownload');
const lightboxDelete    = document.getElementById('lightboxDelete');
const lightboxClose     = document.getElementById('lightboxClose');

// ── Palettes ──────────────────────────────────────────────────────────
const PALETTES = {
  gameboy: [[15,56,15],[48,98,48],[139,172,15],[155,188,15]],
  c64: [[0,0,0],[255,255,255],[136,0,0],[170,255,238],[204,68,204],[0,204,85],
    [0,0,170],[238,238,119],[221,136,85],[102,68,0],[255,119,119],[51,51,51],
    [119,119,119],[170,255,102],[0,136,255],[187,187,187]],
  nes: [[84,84,84],[0,30,116],[8,16,144],[48,0,136],[68,0,100],[92,0,48],[84,4,0],
    [60,24,0],[32,42,0],[8,58,0],[0,64,0],[0,60,0],[0,50,60],[0,0,0],
    [152,150,152],[8,76,196],[48,50,236],[92,30,228],[136,20,176],[160,20,100],
    [152,34,32],[120,60,0],[84,90,0],[40,114,0],[8,124,0],[0,118,40],
    [0,102,120],[0,0,0],[236,238,236],[76,154,236],[120,124,236],[176,98,236],
    [228,84,236],[236,88,180],[236,106,100],[212,136,32],[160,170,0],[116,196,0],
    [76,208,32],[56,204,108],[56,180,204],[60,60,60],[236,238,236],[168,204,236],
    [188,188,236],[212,178,236],[236,174,236],[236,174,212],[236,180,176],
    [228,196,144],[204,210,120],[180,222,120],[168,226,144],[152,226,180],
    [160,214,228],[160,162,160]],
  mono:     [[0,0,0],[255,255,255]],
  amber:    [[0,0,0],[20,10,0],[80,35,0],[150,75,0],[220,120,0],[255,170,0],[255,210,80],[255,240,180]],
  phosphor: [[0,0,0],[0,15,5],[0,40,15],[0,80,30],[0,150,60],[0,220,90],[80,255,140],[180,255,200]],
  cga:      [[0,0,0],[0,170,170],[170,0,170],[170,170,170],[0,0,0],[85,255,255],[255,85,255],[255,255,255]]
};

// ── Logging ──────────────────────────────────────────────────────────
function log(msg, type = 'info') {
  const panel = document.getElementById('logPanel');
  const now = new Date();
  const t = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}`;
  const line = document.createElement('div');
  line.className = 'log-line';
  line.innerHTML = `<span class="log-time">${t}</span><span class="log-tag ${type}">[${type.toUpperCase()}]</span><span class="log-msg">${msg}</span>`;
  panel.appendChild(line);
  panel.scrollTop = panel.scrollHeight;
}

function setStatus(mode) { modeStat.textContent = mode; }

function updateMem() {
  memStat.textContent = performance.memory
    ? Math.round(performance.memory.usedJSHeapSize / 1048576) + 'MB'
    : 'N/A';
}
setInterval(updateMem, 2000);
updateMem();

pixelSizeSlider.addEventListener('input',  () => { pixelSizeVal.textContent  = pixelSizeSlider.value; });
colorDepthSlider.addEventListener('input', () => { colorDepthVal.textContent = colorDepthSlider.value; });

// ── File loading ──────────────────────────────────────────────────────
function loadFile(file) {
  if (!file || !file.type.startsWith('image/')) { log('invalid file type - images only', 'err'); return; }
  currentFile = file;
  const reader = new FileReader();
  reader.onload = e => {
    const img = new Image();
    img.onload = () => {
      sourceImage = img;
      sourceImg.src = e.target.result;
      imgW.textContent = img.naturalWidth;
      imgH.textContent = img.naturalHeight;
      imgSize.textContent = formatBytes(file.size);
      fileStat.textContent = file.name.length > 18 ? file.name.slice(0,16) + '...' : file.name;
      dropZone.classList.add('hidden');
      inputPreview.classList.remove('hidden');
      
      inDot.classList.add('active');
      outDot.classList.remove('active');
      outputCanvas.classList.add('hidden');
      outputPlaceholder.classList.remove('hidden');
      outputDataURL = null;
      downloadBtn.disabled = true;
      saveToGalleryBtn.disabled = true;
      resetBtn.disabled = false;
      convertBtn.disabled = false;
      setStatus('LOADED');
      log(`file loaded: ${file.name} (${img.naturalWidth}x${img.naturalHeight})`);
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

function formatBytes(b) {
  if (b < 1024) return b + 'B';
  if (b < 1048576) return (b/1024).toFixed(1) + 'KB';
  return (b/1048576).toFixed(1) + 'MB';
}

fileInput.addEventListener('change', e => { if (e.target.files[0]) loadFile(e.target.files[0]); });
dropZone.addEventListener('dragover',  e => { e.preventDefault(); dropZone.classList.add('dragover'); });
dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
dropZone.addEventListener('drop', e => {
  e.preventDefault(); dropZone.classList.remove('dragover');
  if (e.dataTransfer.files[0]) loadFile(e.dataTransfer.files[0]);
});

resetBtn.addEventListener('click', () => {
  sourceImage = null; outputDataURL = null; currentFile = null;
  fileInput.value = '';
  sourceImg.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
  const octx = outputCanvas.getContext('2d');
  if (octx) octx.clearRect(0, 0, outputCanvas.width, outputCanvas.height);
  dropZone.classList.remove('hidden');
  inputPreview.classList.add('hidden');
  outputCanvas.classList.add('hidden');
  outputPlaceholder.classList.remove('hidden');
  inDot.classList.remove('active');
  outDot.classList.remove('active');
  convertBtn.disabled = true; resetBtn.disabled = true;
  downloadBtn.disabled = true; saveToGalleryBtn.disabled = true;
  fileStat.textContent = 'none';
  setStatus('IDLE');
  log('workspace cleared');
});

downloadBtn.addEventListener('click', () => {
  if (!outputDataURL) return;
  const a = document.createElement('a');
  a.href = outputDataURL; a.download = 'pixl_output.png'; a.click();
  log('output saved as pixl_output.png');
});

// ── Save to gallery ──────────────────────────────────────────────────
function dataURLtoBlob(dataURL) {
  const parts = dataURL.split(',');
  const mime  = parts[0].match(/:(.*?);/)[1];
  const bstr  = atob(parts[1]);
  const u8arr = new Uint8Array(bstr.length);
  for (let i = 0; i < bstr.length; i++) u8arr[i] = bstr.charCodeAt(i);
  return new Blob([u8arr], { type: mime });
}

saveToGalleryBtn.addEventListener('click', async () => {
  if (!outputDataURL) return;
  saveToGalleryBtn.disabled = true;
  saveToGalleryBtn.textContent = 'SAVING...';
  log('uploading to gallery/...');
  try {
    const blob = dataURLtoBlob(outputDataURL);
    const baseName = currentFile ? currentFile.name.replace(/\.[^.]+$/, '') : 'pixl';
    const form = new FormData();
    form.append('image', blob, `${baseName}.png`);
    form.append('name', baseName);
    const resp = await fetch('/api/gallery', { method: 'POST', body: form });
    if (!resp.ok) throw new Error(`server error ${resp.status}`);
    const data = await resp.json();
    log(`saved to gallery/${data.filename}`);
    await loadGallery();
  } catch (err) {
    log('gallery save failed: ' + err.message, 'err');
  } finally {
    saveToGalleryBtn.disabled = false;
    saveToGalleryBtn.textContent = '+ GALLERY';
  }
});

// ── Colour utils ──────────────────────────────────────────────────────
function colorDist(r1,g1,b1,r2,g2,b2){const dr=r1-r2,dg=g1-g2,db=b1-b2;return dr*dr+dg*dg+db*db;}
function nearestPaletteColor(r,g,b,palette){
  let best=0,bestD=Infinity;
  for(let i=0;i<palette.length;i++){const d=colorDist(r,g,b,palette[i][0],palette[i][1],palette[i][2]);if(d<bestD){bestD=d;best=i;}}
  return palette[best];
}
function quantize(pixels,numColors){
  const colorMap=new Map();
  for(let i=0;i<pixels.length;i+=4){const key=(pixels[i]>>2)<<16|(pixels[i+1]>>2)<<8|(pixels[i+2]>>2);colorMap.set(key,(colorMap.get(key)||0)+1);}
  const colors=[...colorMap.keys()].map(k=>[((k>>16)&63)<<2,((k>>8)&63)<<2,(k&63)<<2]);
  if(colors.length<=numColors)return colors;
  let palette=[colors[0]];
  for(let n=1;n<numColors;n++){let maxD=0,farthest=colors[0];for(const c of colors){let minD=Infinity;for(const p of palette){const d=colorDist(c[0],c[1],c[2],p[0],p[1],p[2]);if(d<minD)minD=d;}if(minD>maxD){maxD=minD;farthest=c;}}palette.push(farthest);}
  return palette;
}
function ditherFS(imgData,w,h,palette){
  const buf=new Float32Array(w*h*3);
  for(let i=0;i<w*h;i++){buf[i*3]=imgData[i*4];buf[i*3+1]=imgData[i*4+1];buf[i*3+2]=imgData[i*4+2];}
  for(let y=0;y<h;y++){for(let x=0;x<w;x++){
    const idx=(y*w+x)*3;
    const or=Math.max(0,Math.min(255,buf[idx])),og=Math.max(0,Math.min(255,buf[idx+1])),ob=Math.max(0,Math.min(255,buf[idx+2]));
    const[nr,ng,nb]=nearestPaletteColor(or,og,ob,palette);
    imgData[(y*w+x)*4]=nr;imgData[(y*w+x)*4+1]=ng;imgData[(y*w+x)*4+2]=nb;
    const er=or-nr,eg=og-ng,eb=ob-nb;
    const push=(tx,ty,f)=>{if(tx<0||tx>=w||ty<0||ty>=h)return;const ti=(ty*w+tx)*3;buf[ti]+=er*f;buf[ti+1]+=eg*f;buf[ti+2]+=eb*f;};
    push(x+1,y,7/16);push(x-1,y+1,3/16);push(x,y+1,5/16);push(x+1,y+1,1/16);
  }}
}
function sleep(ms){return new Promise(r=>setTimeout(r,ms));}

// ── Conversion ────────────────────────────────────────────────────────
convertBtn.addEventListener('click', async () => {
  if (!sourceImage) return;
  const pxSize=parseInt(pixelSizeSlider.value),numColors=parseInt(colorDepthSlider.value),palName=paletteSelect.value,dither=ditherToggle.checked;
  convertBtn.disabled=true; downloadBtn.disabled=true; saveToGalleryBtn.disabled=true;
  setStatus('PROCESSING'); outDot.classList.remove('active');
  processingOverlay.classList.add('active'); progressFill.style.width='0%'; procText.textContent='INITIALIZING...';
  log(`converting // pixel=${pxSize}px | palette=${palName} | colors=${numColors} | dither=${dither}`);
  await sleep(50);
  try {
    procText.textContent='SAMPLING...'; progressFill.style.width='15%'; await sleep(30);
    const sw=sourceImage.naturalWidth,sh=sourceImage.naturalHeight,rw=Math.ceil(sw/pxSize),rh=Math.ceil(sh/pxSize);
    workCanvas.width=rw; workCanvas.height=rh;
    const wctx=workCanvas.getContext('2d');
    wctx.imageSmoothingEnabled=true; wctx.imageSmoothingQuality='high';
    wctx.drawImage(sourceImage,0,0,rw,rh);
    procText.textContent='QUANTIZING...'; progressFill.style.width='35%'; await sleep(30);
    const imgData=wctx.getImageData(0,0,rw,rh),pixels=imgData.data;
    let palette;
    if(palName!=='none'&&PALETTES[palName]){palette=PALETTES[palName];log(`palette: ${palName.toUpperCase()} (${palette.length} colors)`);}
    else{palette=quantize(pixels,numColors);log(`palette: quantized to ${palette.length} colors`);}
    procText.textContent='DITHERING...'; progressFill.style.width='60%'; await sleep(30);
    if(dither){ditherFS(pixels,rw,rh,palette);}
    else{for(let i=0;i<pixels.length;i+=4){const[nr,ng,nb]=nearestPaletteColor(pixels[i],pixels[i+1],pixels[i+2],palette);pixels[i]=nr;pixels[i+1]=ng;pixels[i+2]=nb;}}
    wctx.putImageData(imgData,0,0);
    procText.textContent='UPSCALING...'; progressFill.style.width='80%'; await sleep(30);
    outputCanvas.width=sw; outputCanvas.height=sh;
    const octx=outputCanvas.getContext('2d'); octx.imageSmoothingEnabled=false;
    octx.drawImage(workCanvas,0,0,sw,sh);
    progressFill.style.width='100%'; procText.textContent='COMPLETE'; await sleep(200);
    outputDataURL=outputCanvas.toDataURL('image/png');
    outputCanvas.classList.remove('hidden'); outputPlaceholder.classList.add('hidden');
    outDot.classList.add('active'); downloadBtn.disabled=false; saveToGalleryBtn.disabled=false;
    setStatus('DONE'); log(`done // output: ${sw}x${sh}px -- ${rw*rh} pixel blocks`);
  } catch(err) {
    log('conversion failed: '+err.message,'err'); setStatus('ERROR'); outDot.classList.add('warn');
  } finally {
    processingOverlay.classList.remove('active'); convertBtn.disabled=false;
  }
});

// ══════════════════════════════════════════════════════
//  GALLERY
// ══════════════════════════════════════════════════════

async function loadGallery() {
  refreshGalleryBtn.textContent = '...';
  try {
    const res   = await fetch('/api/gallery');
    if (!res.ok) throw new Error(`Server error ${res.status}`);
    const items = await res.json();
    [...galleryGrid.querySelectorAll('.gallery-card')].forEach(c => c.remove());
    if (items.length === 0) {
      galleryEmpty.classList.remove('hidden');
      galleryCount.textContent   = '0 images';
    } else {
      galleryEmpty.classList.add('hidden');
      galleryCount.textContent   = `${items.length} image${items.length !== 1 ? 's' : ''}`;
      items.forEach(item => galleryGrid.appendChild(makeCard(item)));
    }
  } catch (err) {
    log('gallery load failed: ' + err.message, 'err');
  } finally {
    refreshGalleryBtn.textContent = '\u21BA REFRESH';
  }
}

function makeCard(item) {
  const card = document.createElement('div');
  card.className = 'gallery-card';
  card.dataset.filename = item.filename;

  const img = document.createElement('img');
  img.src = item.url + '?t=' + item.created;
  img.alt = item.filename;
  img.loading = 'lazy';

  const overlay = document.createElement('div');
  overlay.className = 'card-overlay';

  const meta = document.createElement('div');
  meta.className = 'card-meta';
  meta.textContent = item.filename.replace(/_\d+\.png$/, '.png');

  const del = document.createElement('button');
  del.className = 'card-delete';
  del.textContent = '\u2715';
  del.title = 'Delete';
  del.addEventListener('click', async e => { e.stopPropagation(); await deleteImage(item.filename); });

  card.appendChild(img);
  card.appendChild(overlay);
  card.appendChild(meta);
  card.appendChild(del);
  card.addEventListener('click', () => openLightbox(item));
  return card;
}

async function deleteImage(filename) {
  if (!confirm('Delete ' + filename + '?')) return;
  try {
    const res = await fetch('/api/gallery/' + encodeURIComponent(filename), { method: 'DELETE' });
    if (!res.ok) throw new Error('server error');
    log('deleted gallery/' + filename);
    await loadGallery();
    if (lightboxCurrent && lightboxCurrent.filename === filename) closeLightbox();
  } catch (err) {
    log('delete failed: ' + err.message, 'err');
  }
}

refreshGalleryBtn.addEventListener('click', loadGallery);

// ── Lightbox ──────────────────────────────────────────────────────────
function openLightbox(item) {
  lightboxCurrent = item;
  lightboxImg.src = item.url + '?t=' + Date.now();
  lightboxFilename.textContent = item.filename;
  lightboxDownload.href = item.url;
  lightboxDownload.download = item.filename;
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('open');
  lightboxCurrent = null;
  lightboxImg.src = '';
  document.body.style.overflow = '';
}

lightboxClose.addEventListener('click', closeLightbox);
lightboxBackdrop.addEventListener('click', closeLightbox);
lightboxDelete.addEventListener('click', () => { if (lightboxCurrent) deleteImage(lightboxCurrent.filename); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && lightbox.classList.contains('open')) closeLightbox(); });

// ── Boot ──────────────────────────────────────────────────────────────
(async () => {
  await sleep(100); log('PIXL system initialised');
  await sleep(80);  log('canvas renderer: ready');
  await sleep(60);  log('palette engine: loaded (8 palettes)');
  await sleep(60);  log('dither module: Floyd-Steinberg active');
  await sleep(60);  log('gallery: connecting to server...');
  await sleep(80);  await loadGallery();
  log('gallery: ready');
  await sleep(40);  log('awaiting image input...', 'warn');
})();
