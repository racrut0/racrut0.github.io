const tabs = [...document.querySelectorAll('[data-preview]')];
const panels = [...document.querySelectorAll('.preview-panel')];

function selectPreview(tab, moveFocus = false) {
  tabs.forEach(item => {
    const selected = item === tab;
    item.setAttribute('aria-selected', String(selected));
    item.tabIndex = selected ? 0 : -1;
  });
  panels.forEach(panel => { panel.hidden = panel.id !== tab.getAttribute('aria-controls'); });
  if (moveFocus) tab.focus();
}

tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectPreview(tab));
  tab.addEventListener('keydown', event => {
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = tabs.length - 1;
    if (next !== undefined) {
      event.preventDefault();
      selectPreview(tabs[next], true);
    }
  });
});

const projectDialog = document.querySelector('#project-dialog');
let dialogTrigger;
document.querySelectorAll('[data-case-open]').forEach(button => {
  button.addEventListener('click', () => {
    dialogTrigger = button;
    projectDialog.showModal();
    projectDialog.scrollTop = 0;
    document.body.classList.add('dialog-open');
    projectDialog.querySelector('.dialog-close').focus();
  });
});
projectDialog.querySelector('.dialog-close').addEventListener('click', () => projectDialog.close());
projectDialog.addEventListener('click', event => {
  if (event.target !== projectDialog) return;
  const rect = projectDialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) projectDialog.close();
});
projectDialog.addEventListener('close', () => {
  document.body.classList.remove('dialog-open');
  dialogTrigger?.focus({preventScroll:true});
});
