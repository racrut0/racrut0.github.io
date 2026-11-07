(() => {
  'use strict';
  let person = 'friend';
  let currentQuestion = 'Можешь помочь с задачей?';
  let requestVersion = 0;
  let customAnswers = new Map();
  const $ = id => document.getElementById(id);
  const samples = {
    'Можешь помочь с задачей?': {friend:'да, пришли условие — посмотрю',colleague:'Да, пришлите описание задачи и желаемый срок.'},
    'Пойдём сегодня гулять?': {friend:'давай, через полчаса?',colleague:'Спасибо за приглашение. Сегодня не получится, давайте выберем другой день.'},
    'Как у тебя дела?': {friend:'всё хорошо, немного занят проектом. ты как?',colleague:'Всё хорошо, спасибо. Продолжаю работу над проектом.'}
  };
  function view(name) {
    document.querySelectorAll('.view').forEach(node => node.classList.toggle('active',node.id === 'view-'+name));
    document.querySelectorAll('[data-view]').forEach(button => {
      if(button.dataset.view===name) button.setAttribute('aria-current','page'); else button.removeAttribute('aria-current');
    });
    $('viewTitle').textContent={chat:'Диалог',people:'Собеседники',rules:'Правила речи'}[name];
  }
  function response(question) {
    return customAnswers.get(person+':'+question) || samples[question]?.[person] || 'В демонстрации доступны готовые примеры. Выбери один из вопросов под диалогом.';
  }
  function showAnswer(question, animate=false) {
    animate = animate && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    currentQuestion=question;
    $('question').textContent=question;
    $('editAnswer').classList.add('hidden');
    $('answer').classList.remove('hidden');
    $('saveAnswer').classList.add('hidden');
    $('editButton').classList.remove('hidden');
    $('likeAnswer').classList.remove('hidden');
    $('feedbackStatus').textContent='';
    const answer=response(question);
    const version=++requestVersion;
    $('sendButton').disabled=animate;
    $('editButton').disabled=animate;
    $('likeAnswer').disabled=animate;
    $('answer').setAttribute('aria-busy',String(animate));
    $('status').textContent=animate?'Двойник отвечает…':'Готов к диалогу';
    if(!animate){$('answer').textContent=answer;return}
    $('answer').textContent='…';
    let count=0;
    const timer=setInterval(() => {
      if(version!==requestVersion){clearInterval(timer);return}
      count=Math.min(answer.length,count+3);
      $('answer').textContent=answer.slice(0,count);
      if(count===answer.length){clearInterval(timer);$('sendButton').disabled=false;$('editButton').disabled=false;$('likeAnswer').disabled=false;$('answer').setAttribute('aria-busy','false');$('status').textContent='Готов к диалогу'}
    },35);
  }
  function setPerson(value) {
    person=value;
    $('personSwitch').replaceChildren(document.createTextNode(value==='friend'?'Друг ':'Коллега '));
    const chevron=document.createElement('span');chevron.setAttribute('aria-hidden','true');chevron.textContent='⌄';$('personSwitch').append(chevron);
    document.querySelectorAll('[data-person]').forEach(button => button.setAttribute('aria-pressed',String(button.dataset.person===person)));
    $('personPreview').textContent=samples['Можешь помочь с задачей?'][person];
    showAnswer(currentQuestion);
  }
  document.querySelectorAll('[data-view]').forEach(button => button.addEventListener('click',()=>view(button.dataset.view)));
  document.querySelectorAll('[data-person]').forEach(button => button.addEventListener('click',()=>setPerson(button.dataset.person)));
  document.querySelectorAll('[data-prompt]').forEach(button => button.addEventListener('click',()=>{$('chatText').value=button.dataset.prompt;showAnswer(button.dataset.prompt,true)}));
  $('personSwitch').addEventListener('click',()=>view('people'));
  $('usePerson').addEventListener('click',()=>view('chat'));
  $('chatForm').addEventListener('submit',event=>{event.preventDefault();const question=$('chatText').value.trim();if(question)showAnswer(question,true)});
  $('chatText').addEventListener('keydown',event=>{if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();$('chatForm').requestSubmit()}});
  $('likeAnswer').addEventListener('click',()=>{$('feedbackStatus').textContent='Оценка принята в демонстрации.'});
  $('editButton').addEventListener('click',()=>{$('editAnswer').value=$('answer').textContent;$('answer').classList.add('hidden');$('editAnswer').classList.remove('hidden');$('saveAnswer').classList.remove('hidden');$('editButton').classList.add('hidden');$('likeAnswer').classList.add('hidden');$('editAnswer').focus()});
  $('saveAnswer').addEventListener('click',()=>{const answer=$('editAnswer').value.trim();if(!answer)return;customAnswers.set(person+':'+currentQuestion,answer);showAnswer(currentQuestion);$('feedbackStatus').textContent='Исправление сохранено в демонстрации.'});
  $('rulesForm').addEventListener('submit',event=>{event.preventDefault();$('rulesStatus').textContent='Правила сохранены в этой демонстрации.'});
})();
