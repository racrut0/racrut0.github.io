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

const preparationByTopic = {
  website: {
    title: 'Для сайта пригодятся',
    materials: [
      'Что нужно рассказать о проекте или услуге.',
      'Тексты, фотографии и примеры сайтов, которые нравятся.',
      'Какие страницы нужны и к какому сроку.'
    ]
  },
  updates: {
    title: 'Для доработки пригодятся',
    materials: [
      'Ссылка на сайт и список нужных изменений.',
      'Скриншот или пример того, как должно выглядеть.',
      'Информация о платформе сайта, если она известна.'
    ]
  },
  bot: {
    title: 'Для бота пригодятся',
    materials: [
      'Кому помогает бот и какую задачу решает.',
      'Пример диалога: что пишет человек и что отвечает бот.',
      'Нужные кнопки, команды и желаемый срок.'
    ]
  },
  catalog: {
    title: 'Для каталога пригодятся',
    materials: [
      'Список товаров, цены и характеристики.',
      'Фотографии, логотип и пример оформления.',
      'Примерный объём каталога и желаемый срок.'
    ]
  }
};
const contactTopicButtons = [...document.querySelectorAll('[data-contact-topic]')];
function selectContactTopic(topic) {
  const preparation = preparationByTopic[topic];
  if (!preparation) return;
  contactTopicButtons.forEach(button => {
    button.setAttribute('aria-pressed', String(button.dataset.contactTopic === topic));
  });
  document.querySelector('#preparation-title').textContent = preparation.title;
  const list = document.querySelector('#preparation-list');
  list.replaceChildren(...preparation.materials.map(text => {
    const item = document.createElement('li');
    item.textContent = text;
    return item;
  }));
}
contactTopicButtons.forEach(button => {
  button.addEventListener('click', () => selectContactTopic(button.dataset.contactTopic));
});
document.querySelectorAll('[data-topic-link]').forEach(link => {
  link.addEventListener('click', () => selectContactTopic(link.dataset.topicLink));
});
