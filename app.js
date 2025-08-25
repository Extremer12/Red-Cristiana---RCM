// App: posts persistence, rendering and composer (no actions IIFE here)

feather.replace();

// Elements
const feedEl = document.getElementById('feed');
const postText = document.getElementById('postText');
const publishBtn = document.getElementById('publishBtn');
const photoInput = document.getElementById('photoInput');
const videoInput = document.getElementById('videoInput');
const storyInput = document.getElementById('storyInput');
const storiesWrap = document.getElementById('storiesWrap');
const previewArea = document.getElementById('previewArea');

const STORAGE_KEY = 'rcm_posts_v1';

// Demo users
const demoUsers = [
  {name:"María", avatar:"https://i.pravatar.cc/100?img=12"},
  {name:"Leo", avatar:"https://i.pravatar.cc/100?img=15"},
  {name:"Vale", avatar:"https://i.pravatar.cc/100?img=25"},
  {name:"Ana", avatar:"https://i.pravatar.cc/100?img=30"},
];

// Persistence
function getPosts(){
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch(e){ return null; }
}
function savePosts(posts){
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(posts)); } catch(e){}
}

// Utilities
function toDataURL(file){
  return new Promise(res=>{
    const r = new FileReader();
    r.onload = e => res(e.target.result);
    r.readAsDataURL(file);
  });
}
function escapeHtml(s){ return s.replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

// Rendering
function createCardHTML(post){
  const images = post.images || [];
  const videos = post.videos || [];
  let media = '';
  images.forEach(src => media += `<img src="${src}" class="media" alt="">`);
  videos.forEach(src => media += `<video src="${src}" class="media" controls></video>`);

  return `
    <article class="card" data-id="${post.id}" data-likes="${post.likes||0}">
      <div class="head">
        <div class="user">
          <div class="ph" style="background-image:url('${post.user.avatar}')"></div>
          <div class="meta">
            <div class="name">${post.user.name}</div>
            <div class="time">Ahora mismo</div>
          </div>
        </div>
        <button title="Más opciones" aria-label="Más opciones" style="background:transparent;border:0;color:var(--muted)"><i data-feather="more-vertical"></i></button>
      </div>
      <div class="content">
        ${post.text ? `<div class="text">${escapeHtml(post.text)}</div>` : ''}
        ${media}
      </div>
      <div class="actions">
        <button aria-label="Me gusta"><i data-feather="heart"></i> Me gusta</button>
        <button aria-label="Comentar"><i data-feather="message-circle"></i> Comentar</button>
      </div>
      <!-- comments container populated by actions.js -->
    </article>
  `;
}

function renderPost(post, prepend = true){
  const wrapper = document.createElement('div');
  wrapper.innerHTML = createCardHTML(post);
  const card = wrapper.firstElementChild;
  if(prepend) feedEl.prepend(card); else feedEl.append(card);
  feather.replace(); // render icons inside card
  // decorate card (if actions.js loaded)
  if(window.RCMActions && typeof window.RCMActions.decorateCard === 'function'){
    window.RCMActions.decorateCard(card);
  }
}

// Load posts (with seed fallback)
(async function loadPosts(){
  let posts = getPosts();
  if(!posts || !posts.length){
    // seed one sample post and demo stories
    const sample = {
      id: Date.now().toString(),
      user: demoUsers[0],
      text: 'Bienvenid@s a RCM — demo minimalista con publicador de texto y multimedia.',
      images: ['https://images.pexels.com/photos/6280921/pexels-photo-6280921.jpeg'],
      videos: [],
      likes: 0,
      comments: []
    };
    posts = [sample];
    savePosts(posts);
  }
  // render posts
  posts.forEach(p => renderPost(p, false));
  // seed stories
  demoUsers.forEach(u=>{
    const s = document.createElement('div'); s.className='story';
    s.innerHTML = `<div class="ring"><div class="ph" style="background-image:url('${u.avatar}')"></div></div><div style="font-size:13px;color:var(--muted)">${u.name}</div>`;
    storiesWrap.appendChild(s);
  });
})();

// Composer state
function updatePublishState(){
  const hasText = postText.value.trim().length>0;
  const hasMedia = (photoInput.files && photoInput.files.length>0) || (videoInput.files && videoInput.files.length>0);
  publishBtn.disabled = !(hasText || hasMedia);
}
postText.addEventListener('input', updatePublishState);
photoInput.addEventListener('change', updatePublishState);
videoInput.addEventListener('change', updatePublishState);

// Preview handlers
photoInput.addEventListener('change', async ()=>{
  previewArea.innerHTML = '';
  if(photoInput.files && photoInput.files.length){
    const url = await toDataURL(photoInput.files[0]);
    const box = document.createElement('div'); box.className='preview-item';
    box.innerHTML = `<img src="${url}" alt=""> <button class="preview-remove" title="Eliminar">×</button>`;
    box.querySelector('.preview-remove').addEventListener('click', ()=> {
      photoInput.value = '';
      box.remove();
      updatePublishState();
    });
    previewArea.appendChild(box);
  }
});
videoInput.addEventListener('change', async ()=>{
  if(videoInput.files && videoInput.files.length){
    const url = await toDataURL(videoInput.files[0]);
    const box = document.createElement('div'); box.className='preview-item';
    box.innerHTML = `<video src="${url}" muted playsinline></video> <button class="preview-remove" title="Eliminar">×</button>`;
    box.querySelector('.preview-remove').addEventListener('click', ()=> {
      videoInput.value = '';
      box.remove();
      updatePublishState();
    });
    previewArea.appendChild(box);
  }
});

// Stories upload
storyInput.addEventListener('change', async ()=>{
  const files = [...(storyInput.files || [])];
  for(const f of files){
    const url = await toDataURL(f);
    addStory({name:'Tú', url});
  }
  storyInput.value = '';
});
function addStory({name,url}){
  const div = document.createElement('div'); div.className='story';
  div.innerHTML = `<div class="ring"><div class="ph" style="background-image:url('${url}')"></div></div><div style="font-size:13px;color:var(--muted)">${name}</div>`;
  storiesWrap.appendChild(div);
}

// Publish new post (persist)
publishBtn.addEventListener('click', async ()=>{
  const text = postText.value.trim();
  const images = await Promise.all([...(photoInput.files || [])].map(f=>toDataURL(f)));
  const videos = await Promise.all([...(videoInput.files || [])].map(f=>toDataURL(f)));
  const post = {
    id: Date.now().toString(),
    user: {name:'Tú', avatar:'https://i.pravatar.cc/100?u=you'},
    text,
    images,
    videos,
    likes: 0,
    comments: []
  };
  // save
  const posts = getPosts() || [];
  posts.unshift(post);
  savePosts(posts);
  // render
  renderPost(post, true);

  // reset composer
  postText.value = '';
  photoInput.value = '';
  videoInput.value = '';
  previewArea.innerHTML = '';
  updatePublishState();
  window.scrollTo({top:0,behavior:'smooth'});
});

// bottom nav interactions (visual)
document.querySelectorAll('.nav-btn').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    document.querySelectorAll('.nav-btn').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');

    if(btn.dataset.action === 'create') {
      if(typeof postText !== 'undefined' && postText) postText.focus();
      return;
    }

    if(btn.dataset.action === 'profile') {
      // navegar a la página de perfil
      window.location.href = 'perfil.html';
      return;
    }

    // otros actions (home, search) pueden manejarse aquí
  });
});

// make label open story picker (if label exists)
document.querySelectorAll('label.ring[for="storyInput"], .ring[for="storyInput"]').forEach(el=>{
  el.addEventListener('click', ()=> storyInput.click());
});

// NOTE: Removed duplicated IIFE that handled likes/comments/share.
// That logic lives now in actions.js to avoid conflicts.