'use strict';

const filterButtons=[...document.querySelectorAll('[data-filter]')];
const workItems=[...document.querySelectorAll('[data-work-kind]')];
filterButtons.forEach(button=>button.addEventListener('click',()=>{
  const kind=button.dataset.filter;
  document.querySelector('.work-grid')?.classList.toggle('is-filtered',kind!=='all');
  filterButtons.forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
  workItems.forEach(item=>{item.hidden=kind!=='all'&&item.dataset.workKind!==kind});
  const status=document.querySelector('#filter-status');
  if(status)status.textContent=kind==='all'?'Показаны все 4 проекта.':`Показано проектов: ${workItems.filter(item=>!item.hidden).length}.`;
}));

document.querySelectorAll('[data-gallery]').forEach(gallery=>{
  const slides=[...gallery.querySelectorAll(':scope > [data-slide]')];
  const previous=gallery.querySelector('[data-gallery-prev]');
  const next=gallery.querySelector('[data-gallery-next]');
  const count=gallery.querySelector('[data-gallery-count]');
  const compact=gallery.hasAttribute('data-gallery-mobile')?window.matchMedia('(max-width:650px)'):null;
  let index=0;
  function show(nextIndex){
    index=(nextIndex+slides.length)%slides.length;
    slides.forEach((slide,i)=>{slide.hidden=(!compact||compact.matches)&&i!==index});
    count.textContent=`${index+1} из ${slides.length}`;
  }
  previous.addEventListener('click',()=>show(index-1));
  next.addEventListener('click',()=>show(index+1));
  gallery.addEventListener('keydown',event=>{
    if(compact&&!compact.matches)return;
    if(event.key==='ArrowLeft'){event.preventDefault();show(index-1)}
    if(event.key==='ArrowRight'){event.preventDefault();show(index+1)}
    if(event.key==='Home'){event.preventDefault();show(0)}
    if(event.key==='End'){event.preventDefault();show(slides.length-1)}
  });
  if(compact)compact.addEventListener('change',()=>show(index));
  gallery.classList.add('is-ready');show(0);
});

document.querySelectorAll('[data-switcher]').forEach(group=>{
  const links=[...group.querySelectorAll(':scope > .folder-nav [data-switch-link]')];
  const panels=[...group.querySelectorAll(':scope > [data-switch-panel]')];
  function fromHash(){try{return decodeURIComponent(location.hash.slice(1))}catch{return ''}}
  function show(id,changeAddress=false){
    const panel=panels.find(item=>item.id===id)||panels[0];
    panels.forEach(item=>{item.hidden=item!==panel;item.classList.toggle('is-active',item===panel)});
    links.forEach(link=>{if(link.dataset.switchLink===panel.id)link.setAttribute('aria-current','page');else link.removeAttribute('aria-current')});
    if(changeAddress)history.replaceState(null,'',`#${panel.id}`);
  }
  links.forEach(link=>link.addEventListener('click',event=>{
    if(event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
    event.preventDefault();show(link.dataset.switchLink,true);
  }));
  const initial=fromHash();show(initial);
  if(panels.some(item=>item.id===initial))requestAnimationFrame(()=>group.querySelector('.folder-nav').scrollIntoView({block:'start'}));
  window.addEventListener('hashchange',()=>{const id=fromHash();if(panels.some(item=>item.id===id))show(id)});
});

document.querySelectorAll('[data-device-example]').forEach(example=>{
  const buttons=[...example.querySelectorAll('[data-device]')];
  const panels=[...example.querySelectorAll('[data-device-panel]')];
  function show(device){
    buttons.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.device===device)));
    panels.forEach(panel=>{panel.hidden=panel.dataset.devicePanel!==device});
  }
  buttons.forEach(button=>button.addEventListener('click',()=>show(button.dataset.device)));
  show('desktop');
});
