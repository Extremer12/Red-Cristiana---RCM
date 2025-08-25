// Perfil — lógica ordenada y simétrica: avatar, nombre, bio, galería previa, ver todas y publicaciones.
// Requiere actions.js (si existe) para decorar cards y abrir modal; si no, usa fallback.

(function(){
  const POSTS_KEY = 'rcm_posts_v1';
  const PROFILE_KEY = 'rcm_profile';

  // DOM
  const avatarInput = document.getElementById('avatarInput');
  const avatarImg = document.getElementById('avatarImg');
  const usernameInput = document.getElementById('username');
  const saveProfileBtn = document.getElementById('saveProfile');

  const usernameHelp = document.getElementById('usernameHelp');
  const bioInput = document.getElementById('profileBioInput');
  const bioDisplay = document.getElementById('profileBio');
  const bioCount = document.getElementById('bioCount');

  const galleryPreview = document.getElementById('galleryPreview');
  const galleryInfo = document.getElementById('galleryInfo');
  const viewAllBtn = document.getElementById('viewAllBtn');
  const openGalleryBtn = document.getElementById('openGalleryBtn');

  const galleryModal = document.getElementById('galleryModal');
  const galleryGrid = document.getElementById('galleryGrid');
  const closeGallery = document.getElementById('closeGallery');

  const postsList = document.getElementById('postsList');

  const mediaModal = document.getElementById('mediaModal');
  const modalMedia = document.getElementById('modalMedia');

  // helpers
  function readPosts(){ try { return JSON.parse(localStorage.getItem(POSTS_KEY)) || []; } catch(e){ return []; } }
  function writeProfile(p){ try { localStorage.setItem(PROFILE_KEY, JSON.stringify(p)); } catch(e){} }
  function readProfile(){ try { return JSON.parse(localStorage.getItem(PROFILE_KEY)) || null; } catch(e){ return null; } }
  function toDataURL(file){ return new Promise(res=>{ const r = new FileReader(); r.onload = e => res(e.target.result); r.readAsDataURL(file); }); }
  function escapeHtml(s){ return s ? s.replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])) : ''; }
  function showToast(msg){ const t=document.createElement('div'); t.textContent=msg; Object.assign(t.style,{position:'fixed',bottom:'92px',left:'50%',transform:'translateX(-50%)',background:'rgba(2,6,23,0.9)',color:'#fff',padding:'10px 14px',borderRadius:'999px',zIndex:9999}); document.body.appendChild(t); setTimeout(()=>t.style.opacity='0',1400); setTimeout(()=>t.remove(),1900); }

  // load profile
  function loadProfile(){
    const p = readProfile();
    if(p){
      usernameInput.value = p.name || 'Tú';
      avatarImg.src = p.avatar || avatarImg.src;
      bioInput.value = p.bio || '';
      bioDisplay.textContent = p.bio || 'Mi perfil — Aquí aparecen tus publicaciones y la galería';
      bioCount.textContent = (p.bio||'').length;
    } else {
      avatarImg.src = avatarImg.src || 'https://i.pravatar.cc/200?u=you';
      bioCount.textContent = 0;
    }
  }

  function saveProfile(){
    const data = { name: usernameInput.value.trim() || 'Tú', avatar: avatarImg.src, bio: bioInput.value.trim() || '' };
    writeProfile(data);
    bioDisplay.textContent = data.bio || 'Mi perfil — Aquí aparecen tus publicaciones y la galería';
    showToast('Perfil guardado');
    render(); // reflect name/avatar in posts if needed
  }

  avatarInput.addEventListener('change', async (e)=>{
    const f = (e.target.files || [])[0];
    if(!f) return;
    avatarImg.src = await toDataURL(f);
    saveProfile();
  });
  saveProfileBtn.addEventListener('click', saveProfile);
  bioInput.addEventListener('input', ()=> bioCount.textContent = bioInput.value.length);

  // validation rules:
  // - 3..30 chars
  // - only a-z A-Z 0-9 . _
  // - must start and end with alnum
  // - no consecutive . or _
  const usernameRegex = /^[a-zA-Z0-9](?:[a-zA-Z0-9._]{1,28}[a-zA-Z0-9])?$/;
  function hasConsecutiveDotsUnderscores(s){
    return /\.\.|__/.test(s);
  }
  function validateUsername(name){
    if(!name) return { ok:false, msg: 'El nombre no puede estar vacío.' };
    if(name.length < 3 || name.length > 30) return { ok:false, msg: 'Debe tener entre 3 y 30 caracteres.' };
    if(!usernameRegex.test(name)) return { ok:false, msg: 'Sólo letras, números, puntos y guiones bajos; empieza/termina con letra o número.' };
    if(hasConsecutiveDotsUnderscores(name)) return { ok:false, msg: 'No se permiten ".." ni "__".' };
    return { ok:true, msg: 'Nombre válido.' };
  }

  function updateUsernameUI(){
    const val = usernameInput.value.trim();
    const res = validateUsername(val);
    // remove previous error node
    const prevError = usernameHelp.querySelector('.username-error');
    if(prevError) prevError.remove();
    usernameInput.classList.remove('invalid','valid');

    if(val === (readProfile() && readProfile().name) ){
      // unchanged -> disable save
      saveProfileBtn.disabled = true;
      if(res.ok) usernameInput.classList.add('valid');
      return;
    }

    if(!res.ok){
      usernameInput.classList.add('invalid');
      saveProfileBtn.disabled = true;
      const err = document.createElement('div');
      err.className = 'username-error';
      err.textContent = res.msg;
      usernameHelp.appendChild(err);
    } else {
      usernameInput.classList.add('valid');
      saveProfileBtn.disabled = false;
    }
  }

  // wire username validation
  usernameInput.addEventListener('input', updateUsernameUI);
  usernameInput.addEventListener('blur', updateUsernameUI);

  // override saveProfile to revalidate before writing
  const originalSave = saveProfile;
  function saveProfileSafe(){
    const val = usernameInput.value.trim();
    const res = validateUsername(val);
    if(!res.ok){
      updateUsernameUI();
      return;
    }
    // proceed to save as before
    originalSave();
    saveProfileBtn.disabled = true;
  }

  // replace listener
  saveProfileBtn.removeEventListener && saveProfileBtn.removeEventListener('click', saveProfile);
  saveProfileBtn.addEventListener('click', saveProfileSafe);

  // gallery & posts rendering
  function collectMyItems(){
    const posts = readPosts();
    const mine = posts.filter(p => p.user && (p.user.name === 'Tú' || (p.user.avatar && p.user.avatar.includes('u=you'))));
    const items = [];
    mine.forEach(post => {
      (post.images||[]).forEach(s => items.push({ src:s, type:'image', postId:post.id }));
      (post.videos||[]).forEach(s => items.push({ src:s, type:'video', postId:post.id }));
    });
    return { posts: mine, items };
  }

  function renderGalleryPreview(){
    const { items } = collectMyItems();
    galleryPreview.innerHTML = '';
    const preview = items.slice(0,6);
    preview.forEach(it=>{
      const b = document.createElement('button');
      b.className = 'thumb-preview';
      b.innerHTML = it.type === 'image' ? `<img src="${it.src}" alt="">` : `<video src="${it.src}" muted playsinline></video>`;
      b.addEventListener('click', ()=> openMedia(it.src, it.type));
      galleryPreview.appendChild(b);
    });
    galleryInfo.textContent = `${items.length} elemento${items.length === 1 ? '' : 's'}`;
    viewAllBtn.style.display = items.length > preview.length ? '' : 'none';

    // prepare gallery modal content (all items)
    galleryGrid.innerHTML = '';
    items.forEach(it=>{
      const btn = document.createElement('button');
      btn.className = 'thumb';
      btn.innerHTML = it.type === 'image' ? `<img src="${it.src}" alt="">` : `<video src="${it.src}" muted playsinline></video>`;
      btn.addEventListener('click', ()=> { openMedia(it.src, it.type); galleryModal.setAttribute('aria-hidden','true'); });
      galleryGrid.appendChild(btn);
    });
  }

  function renderPosts(){
    const { posts } = collectMyItems();
    postsList.innerHTML = '';
    posts.forEach(p=>{
      const wrap = document.createElement('div');
      wrap.innerHTML = `
        <article class="card" data-id="${p.id}" data-likes="${p.likes||0}">
          <div class="head">
            <div class="user">
              <div class="ph" style="background-image:url('${p.user.avatar}')"></div>
              <div class="meta">
                <div class="name">${escapeHtml(p.user.name)}</div>
                <div class="time">Publicado</div>
              </div>
            </div>
            <button title="Más opciones" aria-label="Más opciones" style="background:transparent;border:0;color:var(--muted)"><i data-feather="more-vertical"></i></button>
          </div>
          <div class="content">
            ${p.text ? `<div class="text">${escapeHtml(p.text)}</div>` : ''}
            ${(p.images||[]).map(src=>`<img src="${src}" class="media" alt="">`).join('')}
            ${(p.videos||[]).map(src=>`<video src="${src}" class="media" controls></video>`).join('')}
          </div>
          <div class="actions">
            <button aria-label="Me gusta"><i data-feather="heart"></i> Me gusta</button>
            <button aria-label="Comentar"><i data-feather="message-circle"></i> Comentar</button>
          </div>
        </article>
      `;
      const node = wrap.firstElementChild;
      // let actions.js decorate if present
      if(window.RCMActions && typeof window.RCMActions.decorateCard === 'function') window.RCMActions.decorateCard(node);
      // media click
      node.addEventListener('click', (e)=>{
        const media = e.target.closest('.media');
        if(!media) return;
        const src = media.getAttribute('src') || media.currentSrc || media.src;
        const type = media.tagName.toLowerCase() === 'video' ? 'video' : 'image';
        if(window.RCMActions && typeof window.RCMActions.openMediaModal === 'function'){
          window.RCMActions.openMediaModal(src, type);
        } else {
          openMedia(src, type);
        }
      });
      postsList.appendChild(node);
    });
  }

  // open media (fallback)
  function openMedia(src, type){
    if(window.RCMActions && typeof window.RCMActions.openMediaModal === 'function'){
      window.RCMActions.openMediaModal(src, type);
      return;
    }
    if(!mediaModal) return;
    modalMedia.innerHTML = '';
    mediaModal.setAttribute('aria-hidden','false');
    if(type === 'video' || src.startsWith('data:video') || src.endsWith('.mp4')){
      const v = document.createElement('video'); v.src = src; v.controls = true; v.autoplay = true; v.style.maxWidth = '100%'; modalMedia.appendChild(v);
    } else {
      const img = document.createElement('img'); img.src = src; img.style.maxWidth = '100%'; modalMedia.appendChild(img);
    }
  }

  // modal controls
  openGalleryBtn && openGalleryBtn.addEventListener('click', ()=> galleryModal.setAttribute('aria-hidden','false'));
  viewAllBtn && viewAllBtn.addEventListener('click', ()=> galleryModal.setAttribute('aria-hidden','false'));
  closeGallery && closeGallery.addEventListener('click', ()=> galleryModal.setAttribute('aria-hidden','true'));
  galleryModal && galleryModal.addEventListener('click', (e)=> { if(e.target === galleryModal) galleryModal.setAttribute('aria-hidden','true'); });
  document.addEventListener('keydown', (e)=> { if(e.key === 'Escape') { if(galleryModal) galleryModal.setAttribute('aria-hidden','true'); if(mediaModal) mediaModal.setAttribute('aria-hidden','true'); } });

  // bottom nav behaviour (same as index)
  document.querySelectorAll('.nav-btn').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      document.querySelectorAll('.nav-btn').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      if(btn.dataset.action === 'home') window.location.href = 'index.html';
      if(btn.dataset.action === 'create') window.location.href = 'index.html';
    });
  });

  // initial
  loadProfile();
  updateUsernameUI();
  renderGalleryPreview();
  renderPosts();
  // ensure icons are rendered (feather available)
  if(window.feather) feather.replace();

})();