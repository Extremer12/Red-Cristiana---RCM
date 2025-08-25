// Extraído de app.js IIFE: like/comment/share, modal, decorateCard and observation

// Actions: likes/comments/shares with Firebase integration and content ownership
import { auth, db } from './firebase.js';
import { doc, updateDoc, arrayUnion, arrayRemove, getDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

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

    // Initialize likes display from Firestore data
    const likesCount = (card.dataset.likes && parseInt(card.dataset.likes)) || 0;
    const likeBtn = card.querySelector('[aria-label="Me gusta"]');
    if(likeBtn && likesCount > 0){
      updateLikeButton(likeBtn, likesCount, false);
    }
  }

  function showCommentBox(card){
    const user = auth.currentUser;
    if(!user){
      showToast('Debes iniciar sesión para comentar');
      return;
    }
    
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

    send.addEventListener('click', async ()=> {
      const text = input.value.trim();
      if(!text) return;
      
      send.disabled = true;
      send.textContent = 'Enviando...';
      
      try {
        await addComment(card.dataset.id, text, user);
        appendComment(commentsContainer, text, user.displayName, user.photoURL);
        input.value = '';
        input.focus();
      } catch (error) {
        console.error('Error adding comment:', error);
        showToast('Error al enviar comentario');
      } finally {
        send.disabled = false;
        send.textContent = 'Publicar';
      }
    });

    input.addEventListener('keydown', (e)=>{
      if(e.key === 'Enter') { send.click(); }
      if(e.key === 'Escape') { box.remove(); }
    });
  }

  function appendComment(container, text, userName = 'Usuario', userPhoto = null){
    const c = document.createElement('div');
    c.className = 'comment';
    c.style.display = 'flex';
    c.style.gap = '8px';
    c.style.alignItems = 'flex-start';

    const avatar = document.createElement('div');
    if(userPhoto){
      avatar.style.backgroundImage = `url(${userPhoto})`;
      avatar.style.backgroundSize = 'cover';
      avatar.style.backgroundPosition = 'center';
    } else {
      avatar.textContent = userName.charAt(0).toUpperCase();
      avatar.style.background = `linear-gradient(90deg, ${navy}, ${gold})`;
      avatar.style.color = '#fff';
      avatar.style.display = 'grid';
      avatar.style.placeItems = 'center';
      avatar.style.fontWeight = '700';
    }
    avatar.style.width = '34px';
    avatar.style.height = '34px';
    avatar.style.borderRadius = '8px';
    avatar.style.flex = '0 0 34px';

    const body = document.createElement('div');
    body.style.background = 'rgba(11,59,113,0.03)';
    body.style.padding = '8px 10px';
    body.style.borderRadius = '10px';
    body.style.fontSize = '14px';
    
    const nameSpan = document.createElement('div');
    nameSpan.style.fontWeight = '600';
    nameSpan.style.fontSize = '12px';
    nameSpan.style.color = navy;
    nameSpan.style.marginBottom = '2px';
    nameSpan.textContent = userName;
    
    const textSpan = document.createElement('div');
    textSpan.textContent = text;
    
    body.appendChild(nameSpan);
    body.appendChild(textSpan);

    c.appendChild(avatar);
    c.appendChild(body);
    container.appendChild(c);
    container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function updateLikeButton(btn, count, isLiked){
    btn.style.color = isLiked ? gold : '';
    btn.dataset.liked = String(isLiked);
    
    let counter = btn.querySelector('.like-count');
    if(!counter){
      counter = document.createElement('span');
      counter.className = 'like-count';
      counter.style.marginLeft = '6px';
      counter.style.fontWeight = '700';
      btn.appendChild(counter);
    }
    counter.textContent = count > 0 ? count : '';
  }

  async function toggleLike(btn, card){
    const user = auth.currentUser;
    if(!user){
      showToast('Debes iniciar sesión para dar me gusta');
      return;
    }

    const postId = card.dataset.id;
    const isLiked = btn.dataset.liked === 'true';
    const newState = !isLiked;
    
    // Optimistic UI update
    const currentCount = parseInt(card.dataset.likes || '0', 10);
    const newCount = newState ? currentCount + 1 : Math.max(0, currentCount - 1);
    card.dataset.likes = String(newCount);
    updateLikeButton(btn, newCount, newState);
    
    try {
      await updatePostLikes(postId, user.uid, newState);
    } catch (error) {
      console.error('Error updating like:', error);
      // Revert UI on error
      card.dataset.likes = String(currentCount);
      updateLikeButton(btn, currentCount, isLiked);
      showToast('Error al actualizar me gusta');
    }
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

  // Firebase Functions
  async function addComment(postId, text, user) {
    const postRef = doc(db, 'posts', postId);
    const comment = {
      id: Date.now().toString(),
      text,
      authorId: user.uid,
      authorName: user.displayName,
      authorPhoto: user.photoURL,
      createdAt: new Date()
    };
    
    await updateDoc(postRef, {
      comments: arrayUnion(comment)
    });
  }

  async function updatePostLikes(postId, userId, isLiked) {
    const postRef = doc(db, 'posts', postId);
    
    if (isLiked) {
      await updateDoc(postRef, {
        likes: arrayUnion(userId)
      });
    } else {
      await updateDoc(postRef, {
        likes: arrayRemove(userId)
      });
    }
  }

  // Content Ownership Functions
  async function canEditPost(postId) {
    const user = auth.currentUser;
    if (!user) return false;
    
    try {
      const postRef = doc(db, 'posts', postId);
      const postSnap = await getDoc(postRef);
      
      if (!postSnap.exists()) return false;
      return postSnap.data().authorId === user.uid;
    } catch (error) {
      console.error('Error checking post ownership:', error);
      return false;
    }
  }

  async function openCardMenu(button, card){
    const user = auth.currentUser;
    if (!user) {
      showToast('Debes iniciar sesión');
      return;
    }
    
    const canEdit = await canEditPost(card.dataset.id);
    if (!canEdit) {
      showToast('Solo puedes editar tus propias publicaciones');
      return;
    }
    
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

  async function startEdit(card){
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
    
    saveBtn.addEventListener('click', async ()=> {
      const val = textarea.value.trim();
      saveBtn.disabled = true;
      saveBtn.textContent = 'Guardando...';
      
      try {
        await updatePostText(card.dataset.id, val);
        
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
        
        editArea.remove();
        showToast('Publicación editada');
      } catch (error) {
        console.error('Error updating post:', error);
        showToast('Error al editar publicación');
        saveBtn.disabled = false;
        saveBtn.textContent = 'Guardar';
      }
    });
  }

  async function confirmDelete(card){
    if(!confirm('¿Eliminar esta publicación?')) return;
    
    try {
      await deletePostFromFirestore(card.dataset.id);
      card.remove();
      showToast('Publicación eliminada');
    } catch (error) {
      console.error('Error deleting post:', error);
      showToast('Error al eliminar publicación');
    }
  }

  async function updatePostText(postId, newText) {
    const postRef = doc(db, 'posts', postId);
    await updateDoc(postRef, {
      text: newText,
      updatedAt: new Date()
    });
  }

  async function deletePostFromFirestore(postId) {
    const postRef = doc(db, 'posts', postId);
    await deleteDoc(postRef);
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

  // initial decorate existing cards
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