// Extraído de app.js IIFE: like/comment/share, modal, decorateCard and observation

(function(){
  const feed = document.getElementById('feed');
  const modal = document.getElementById('mediaModal');
  const modalMedia = document.getElementById('modalMedia');
  const closeModalBtn = document.getElementById('closeModal');

  if(!feed) return;

  const cssVar = (name)=> getComputedStyle(document.documentElement).getPropertyValue(name).trim() || null;
  const gold = cssVar('--gold') || '#b88924';
  const navy = cssVar('--navy') || '#0b3b71';

  // ensure cards are positioned for absolute menus
  const cardStyle = document.createElement('style');
  cardStyle.textContent = '.card{position:relative} .card-menu{position:absolute;right:12px;top:44px;background:var(--card);border-radius:10px;box-shadow:0 8px 24px rgba(2,6,23,0.12);padding:6px;z-index:50;border:1px solid rgba(2,6,23,0.06)} .card-menu .menu-item{display:block;padding:8px 12px;border:0;background:transparent;width:100%;text-align:left;color:var(--navy);cursor:pointer;border-radius:8px} .card-menu .menu-item:hover{background:rgba(11,59,113,0.04)} .edit-area{display:flex;flex-direction:column;gap:8px} .edit-area textarea{min-height:90px;padding:10px;border-radius:8px;border:1px solid rgba(11,59,113,0.06)} .edit-controls{display:flex;gap:8px;justify-content:flex-end} .edit-controls button{padding:8px 10px;border-radius:8px;border:0;cursor:pointer}';
  document.head.appendChild(cardStyle);

  function decorateCard(card){
    if(!card || !card.classList.contains('card')) return;
    const actions = card.querySelector('.actions');
    if(!actions) return;

    if(!actions.querySelector('[aria-label="Compartir"]')){
      const shareBtn = document.createElement('button');
      shareBtn.setAttribute('aria-label','Compartir');
      shareBtn.className = 'share-btn';
      shareBtn.innerHTML = `<i data-feather="share-2"></i> Compartir`;
      actions.appendChild(shareBtn);
      if(window.feather) window.feather.replace();
    }

    if(!card.querySelector('.comments')){
      const comments = document.createElement('div');
      comments.className = 'comments';
      comments.style.padding = '8px 12px';
      comments.style.display = 'flex';
      comments.style.flexDirection = 'column';
      comments.style.gap = '8px';
      card.appendChild(comments);
    }

    if(!card.dataset.likes) card.dataset.likes = '0';
  }

  function showCommentBox(card){
    if(card.querySelector('.comment-box')) return;
    const box = document.createElement('div');
    box.className = 'comment-box';
    box.style.display = 'flex';
    box.style.gap = '8px';
    box.style.padding = '8px 12px';
    box.style.alignItems = 'center';

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Escribe un comentario...';
    input.style.flex = '1';
    input.style.padding = '10px';
    input.style.borderRadius = '10px';
    input.style.border = '1px solid rgba(11,59,113,0.06)';

    const send = document.createElement('button');
    send.textContent = 'Publicar';
    send.style.padding = '8px 12px';
    send.style.borderRadius = '10px';
    send.style.background = `linear-gradient(90deg, ${navy}, ${gold})`;
    send.style.color = '#fff';
    send.style.border = '0';
    send.style.cursor = 'pointer';

    box.appendChild(input);
    box.appendChild(send);

    const commentsContainer = card.querySelector('.comments');
    card.appendChild(box);
    input.focus();

    send.addEventListener('click', ()=> {
      const text = input.value.trim();
      if(!text) return;
      appendComment(commentsContainer, text);
      persistComment(card.dataset.id, text);
      input.value = '';
      input.focus();
    });

    input.addEventListener('keydown', (e)=>{
      if(e.key === 'Enter') { send.click(); }
      if(e.key === 'Escape') { box.remove(); }
    });
  }

  function appendComment(container, text){
    const c = document.createElement('div');
    c.className = 'comment';
    c.style.display = 'flex';
    c.style.gap = '8px';
    c.style.alignItems = 'flex-start';

    const avatar = document.createElement('div');
    avatar.textContent = 'RC';
    avatar.style.width = '34px';
    avatar.style.height = '34px';
    avatar.style.borderRadius = '8px';
    avatar.style.background = `linear-gradient(90deg, ${navy}, ${gold})`;
    avatar.style.color = '#fff';
    avatar.style.display = 'grid';
    avatar.style.placeItems = 'center';
    avatar.style.fontWeight = '700';
    avatar.style.flex = '0 0 34px';

    const body = document.createElement('div');
    body.style.background = 'rgba(11,59,113,0.03)';
    body.style.padding = '8px 10px';
    body.style.borderRadius = '10px';
    body.style.fontSize = '14px';
    body.textContent = text;

    c.appendChild(avatar);
    c.appendChild(body);
    container.appendChild(c);
    container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function toggleLike(btn, card){
    const liked = btn.dataset.liked === 'true';
    const newState = !liked;
    btn.dataset.liked = String(newState);
    btn.style.color = newState ? gold : '';

    const current = parseInt(card.dataset.likes || '0', 10);
    const next = newState ? current + 1 : Math.max(0, current - 1);
    card.dataset.likes = String(next);

    let counter = btn.querySelector('.like-count');
    if(!counter){
      counter = document.createElement('span');
      counter.className = 'like-count';
      counter.style.marginLeft = '6px';
      counter.style.fontWeight = '700';
      btn.appendChild(counter);
    }
    counter.textContent = next > 0 ? next : '';

    persistLike(card.dataset.id, next);
  }

  async function sharePost(card){
    const textEl = card.querySelector('.text');
    const text = textEl ? textEl.textContent.trim() : 'Publicación en Red Cristiana';
    const shareData = { title: 'Red Cristiana', text, url: window.location.href };

    if(navigator.share){
      try {
        await navigator.share(shareData);
        showToast('Compartido');
        return;
      } catch(e){}
    }
    try {
      await navigator.clipboard.writeText(`${text}\n${window.location.href}`);
      showToast('Enlace copiado al portapapeles');
    } catch(e){
      showToast('No se pudo compartir');
    }
  }

  function showToast(msg){
    const t = document.createElement('div');
    t.textContent = msg;
    t.style.position = 'fixed';
    t.style.bottom = '92px';
    t.style.left = '50%';
    t.style.transform = 'translateX(-50%)';
    t.style.background = 'rgba(2,6,23,0.9)';
    t.style.color = '#fff';
    t.style.padding = '10px 14px';
    t.style.borderRadius = '999px';
    t.style.zIndex = '9999';
    t.style.boxShadow = '0 8px 20px rgba(2,6,23,0.2)';
    document.body.appendChild(t);
    setTimeout(()=> t.style.opacity = '0.0', 1800);
    setTimeout(()=> t.remove(), 2300);
  }

  // Modal controls for media viewing
  function openMediaModal(src, type){
    if(!modal) return;
    modal.setAttribute('aria-hidden','false');
    modalMedia.innerHTML = '';
    if((type && type.startsWith('video')) || src.endsWith('.mp4') || src.startsWith('data:video')){
      const v = document.createElement('video');
      v.src = src; v.controls = true; v.autoplay = true; v.style.maxWidth = '100%'; v.style.height = 'auto';
      modalMedia.appendChild(v);
    } else {
      const img = document.createElement('img');
      img.src = src; img.style.maxWidth = '100%'; img.style.height = 'auto';
      modalMedia.appendChild(img);
    }
  }
  function closeModalFn(){ if(!modal) return; modal.setAttribute('aria-hidden','true'); modalMedia.innerHTML = ''; }

  closeModalBtn && closeModalBtn.addEventListener('click', closeModalFn);
  modal && modal.addEventListener('click', (e)=> { if(e.target === modal) closeModalFn(); });
  document.addEventListener('keydown', (e)=> { if(e.key === 'Escape') closeModalFn(); });

  // Persistence helpers: sync likes/comments back to localStorage posts
  const STORAGE_KEY = 'rcm_posts_v1';
  function getStoredPosts(){
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch(e){ return []; }
  }
  function saveStoredPosts(posts){ try { localStorage.setItem(STORAGE_KEY, JSON.stringify(posts)); } catch(e){} }

  function persistLike(postId, likes){
    const posts = getStoredPosts();
    const p = posts.find(x=>String(x.id) === String(postId));
    if(p){ p.likes = likes; saveStoredPosts(posts); }
  }
  function persistComment(postId, commentText){
    const posts = getStoredPosts();
    const p = posts.find(x=>String(x.id) === String(postId));
    if(p){
      p.comments = p.comments || [];
      p.comments.push({id: Date.now().toString(), text: commentText, user: {name: 'Tú'}});
      saveStoredPosts(posts);
    }
  }

  // New: persist edit and delete
  function persistEdit(postId, newText){
    const posts = getStoredPosts();
    const p = posts.find(x=>String(x.id) === String(postId));
    if(p){
      p.text = newText;
      saveStoredPosts(posts);
      showToast('Publicación editada');
    }
  }
  function persistDelete(postId){
    let posts = getStoredPosts();
    posts = posts.filter(x => String(x.id) !== String(postId));
    saveStoredPosts(posts);
    showToast('Publicación eliminada');
  }

  // New: show options menu (Edit / Delete)
  function openCardMenu(button, card){
    closeAllMenus();
    const menu = document.createElement('div');
    menu.className = 'card-menu';
    menu.innerHTML = `<button class="menu-item" data-action="edit">Editar</button><button class="menu-item" data-action="delete">Eliminar</button>`;
    card.appendChild(menu);

    menu.addEventListener('click', (ev)=>{
      const item = ev.target.closest('.menu-item');
      if(!item) return;
      const action = item.dataset.action;
      if(action === 'edit') startEdit(card);
      if(action === 'delete') confirmDelete(card);
      menu.remove();
    });

    // close on outside click
    setTimeout(()=> { // allow current click to finish
      document.addEventListener('click', outsideHandler);
    }, 0);

    function outsideHandler(e){
      if(!menu.contains(e.target) && !button.contains(e.target)){
        menu.remove();
        document.removeEventListener('click', outsideHandler);
      }
    }
  }

  function closeAllMenus(){
    Array.from(document.querySelectorAll('.card-menu')).forEach(m=>m.remove());
  }

  // New: start editing a post's text inline
  function startEdit(card){
    const content = card.querySelector('.content');
    if(!content) return;
    const textDiv = content.querySelector('.text');
    const existing = textDiv ? textDiv.textContent : '';
    // prevent multiple editors
    if(content.querySelector('.edit-area')) return;

    if(textDiv) textDiv.style.display = 'none';

    const editArea = document.createElement('div');
    editArea.className = 'edit-area';
    editArea.innerHTML = `<textarea aria-label="Editar publicación">${existing}</textarea><div class="edit-controls"><button class="cancel-btn">Cancelar</button><button class="save-btn" style="background:linear-gradient(90deg, ${navy}, ${gold});color:#fff;border:0;border-radius:8px;padding:8px 12px">Guardar</button></div>`;
    content.insertBefore(editArea, content.firstChild);

    const textarea = editArea.querySelector('textarea');
    const saveBtn = editArea.querySelector('.save-btn');
    const cancelBtn = editArea.querySelector('.cancel-btn');
    textarea.focus();

    cancelBtn.addEventListener('click', ()=> {
      editArea.remove();
      if(textDiv) textDiv.style.display = '';
    });
    saveBtn.addEventListener('click', ()=> {
      const val = textarea.value.trim();
      // update DOM
      if(textDiv){
        if(val) textDiv.textContent = val;
        else textDiv.remove();
      } else if(val){
        const newText = document.createElement('div');
        newText.className = 'text';
        newText.textContent = val;
        content.insertBefore(newText, content.firstChild);
      }
      // persist
      persistEdit(card.dataset.id, val);
      editArea.remove();
    });
  }

  // New: delete post with confirmation
  function confirmDelete(card){
    if(!confirm('¿Eliminar esta publicación?')) return;
    const postId = card.dataset.id;
    card.remove();
    persistDelete(postId);
  }

  // Delegated handlers
  feed.addEventListener('click', (e)=>{
    const likeBtn = e.target.closest('[aria-label="Me gusta"]');
    if(likeBtn){
      const card = likeBtn.closest('.card');
      if(card) toggleLike(likeBtn, card);
      return;
    }
    const commentBtn = e.target.closest('[aria-label="Comentar"]');
    if(commentBtn){
      const card = commentBtn.closest('.card');
      if(card) showCommentBox(card);
      return;
    }
    const shareBtn = e.target.closest('[aria-label="Compartir"]');
    if(shareBtn){
      const card = shareBtn.closest('.card');
      if(card) sharePost(card);
      return;
    }
    const moreBtn = e.target.closest('[aria-label="Más opciones"]');
    if(moreBtn){
      const card = moreBtn.closest('.card');
      if(card) openCardMenu(moreBtn, card);
      return;
    }
    const mediaEl = e.target.closest('.media');
    if(mediaEl){
      const src = mediaEl.getAttribute('src') || mediaEl.currentSrc || mediaEl.src;
      const type = mediaEl.tagName.toLowerCase() === 'video' ? 'video' : 'image';
      openMediaModal(src, type);
    }
  });

  // Observe new cards to decorate
  const mo = new MutationObserver((mutations)=>{
    for(const m of mutations){
      for(const node of m.addedNodes){
        if(node.nodeType === 1){
          if(node.classList && node.classList.contains('card')) decorateCard(node);
          node.querySelectorAll && node.querySelectorAll('.card').forEach(decorateCard);
        }
      }
    }
  });
  mo.observe(feed, { childList: true, subtree: false });

  // initial decorate existing cards and restore comments/likes UI from storage
  Array.from(feed.querySelectorAll('.card')).forEach(card=>{
    decorateCard(card);
    const posts = getStoredPosts();
    const p = posts.find(x=>String(x.id) === String(card.dataset.id));
    if(p){
      card.dataset.likes = String(p.likes || 0);
      const likeBtn = card.querySelector('[aria-label="Me gusta"]');
      if(likeBtn){
        let counter = likeBtn.querySelector('.like-count');
        if(!counter){ counter = document.createElement('span'); counter.className='like-count'; counter.style.marginLeft='6px'; counter.style.fontWeight='700'; likeBtn.appendChild(counter); }
        counter.textContent = p.likes > 0 ? p.likes : '';
        const commentsContainer = card.querySelector('.comments');
        (p.comments || []).forEach(c => appendComment(commentsContainer, c.text));
      }
    }
  });

  window.RCMActions = { decorateCard, appendComment, toggleLike, sharePost, openMediaModal, closeModalFn, startEdit, confirmDelete };

})();