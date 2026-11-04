const days=[
  {title:'Чай без спешки',text:'Завари любимый чай или приготовь другой тёплый напиток. На несколько минут отложи телефон и просто побудь в тишине.'},
  {title:'Привет из ниоткуда',text:'Напиши человеку, которому давно хотел написать. Подойдёт короткое сообщение: «Увидел кое-что и вспомнил о тебе».'},
  {title:'Прогулка без маршрута',text:'Выйди ненадолго прогуляться и выбери привычную дорогу чуть по-другому. Попробуй заметить три детали, мимо которых раньше проходил.'},
  {title:'Музыка для настроения',text:'Включи песню, с которой связано хорошее воспоминание. Можно послушать её целиком, не занимаясь параллельно другими делами.'},
  {title:'Немного свободного места',text:'Освободи небольшой уголок на рабочем столе. Не нужно наводить идеальный порядок — достаточно места для одной приятной вещи.'},
  {title:'Одна хорошая вещь',text:'Запиши одну небольшую вещь, за которую благодарен сегодняшнему дню. Это может быть разговор, вкусный завтрак или вовремя приехавший автобус.'},
  {title:'Фото обычного дня',text:'Сфотографируй что-то простое: свет на стене, вид из окна или красивую тень. Снимок можно оставить только для себя.'},
  {title:'Любимый вкус',text:'Вспомни простое блюдо, которое любил раньше. Приготовь его или запиши идею на выходные.'},
  {title:'Письмо себе',text:'Напиши себе пару предложений о том, чем сейчас живёшь. Можно сохранить заметку и перечитать её через год.'},
  {title:'Маленькое спасибо',text:'Поблагодари кого-нибудь за конкретную мелочь, которая сделала твой день удобнее или приятнее.'},
  {title:'Полка воспоминаний',text:'Найди вещь с хорошей историей. Вспомни, как она у тебя появилась, и реши, где ей будет приятно стоять.'},
  {title:'Вечерний свет',text:'Попробуй провести часть вечера с мягким светом настольной лампы. Выбери спокойное занятие, которое давно откладывал.'},
  {title:'Три зимних желания',text:'Придумай три небольшие вещи, которые хочешь успеть этой зимой. Пусть хотя бы одна из них будет совсем простой.'},
  {title:'Своя маленькая традиция',text:'Придумай короткий ритуал для декабря: любимая кружка по утрам, зимний плейлист или воскресный завтрак без спешки.'},
  {title:'Поделиться находкой',text:'Отправь другу хорошую песню, интересный рассказ или забавную фотографию. Добавь пару слов от себя.'},
  {title:'Набросок от руки',text:'Возьми лист бумаги и нарисуй что-нибудь рядом. Красиво не обязательно: пять минут и один предмет — уже достаточно.'},
  {title:'История на вечер',text:'Выбери небольшой рассказ, эссе или главу книги. Почитай немного для удовольствия, без цели закончить всё сегодня.'},
  {title:'Зимний маршрут',text:'Подумай, куда хочется выбраться в ближайшие выходные. Найди адрес, посмотри дорогу и сохрани идею.'},
  {title:'Комплимент по делу',text:'Скажи кому-нибудь, что именно тебе в нём нравится. Лучше назвать конкретный поступок или качество.'},
  {title:'Время для хобби',text:'Выдели немного времени на то, что делаешь для собственного удовольствия. Даже десять минут считаются.'},
  {title:'Плейлист декабря',text:'Собери небольшой плейлист из пяти песен для зимних прогулок или спокойного вечера.'},
  {title:'Хороший момент года',text:'Найди в фотографиях один хороший момент уходящего года. Вспомни не только событие, но и то, что ты тогда чувствовал.'},
  {title:'Подарок вниманием',text:'Придумай, кому можно подарить немного времени: позвонить, помочь с небольшой задачей или встретиться за чаем.'},
  {title:'Сохранить хорошее',text:'Выбери одну идею из календаря, которую хочется забрать с собой в новый год. Запиши её или расскажи близкому человеку.'}
];
const storageKey='andrey-portfolio-advent-v1';
let state={opened:[],done:[]};
try{const value=JSON.parse(localStorage.getItem(storageKey)||'null');if(value&&typeof value==='object'){for(const key of ['opened','done'])state[key]=Array.isArray(value[key])?[...new Set(value[key].filter(n=>Number.isInteger(n)&&n>=1&&n<=24))]:[];state.opened=[...new Set([...state.opened,...state.done])];}}catch{}
const grid=document.querySelector('#calendar-grid');
const allDays=document.querySelector('#all-days');
const previewDay=document.querySelector('#preview-day');
const dateControl=document.querySelector('#date-control');
const dialog=document.querySelector('#day-dialog');
const doneButton=document.querySelector('#done-button');
let selectedDay=null;
let activeTrigger=null;
for(let i=1;i<=24;i++){const option=document.createElement('option');option.value=String(i);option.textContent=`${i} декабря`;previewDay.append(option);}previewDay.value='9';
function save(){try{localStorage.setItem(storageKey,JSON.stringify(state));}catch{document.querySelector('#save-status').textContent='Прогресс доступен, пока открыта эта страница.';}}
function render(){
  dateControl.hidden=allDays.checked;
  document.querySelector('#calendar-explainer').textContent=allDays.checked?'Можно открыть любое окошко. Отключи «Все дни доступны», чтобы посмотреть открытие по датам.':`Просмотр на ${previewDay.value} декабря: следующие дни пока закрыты. Это демонстрация, дату можно менять.`;
  grid.replaceChildren();
  days.forEach((day,index)=>{const number=index+1;const opened=state.opened.includes(number);const done=state.done.includes(number);const available=allDays.checked||number<=Number(previewDay.value);const button=document.createElement('button');button.type='button';button.className='day'+(opened?' opened':'')+(done?' done':'');button.dataset.day=String(number);button.disabled=!available;button.setAttribute('aria-label',`${number} декабря${opened?': '+day.title:''}${done?', выполнено':!available?', пока закрыто':', открыть окошко'}`);const count=document.createElement('span');count.className='number';count.textContent=String(number).padStart(2,'0');const symbol=document.createElement('span');symbol.className='day-symbol';symbol.textContent=opened?day.title:'декабря';if(!opened)symbol.setAttribute('aria-hidden','true');const status=document.createElement('span');status.className='state';status.textContent=!available?'Откроется позже':done?'Выполнено':opened?'Открыть ещё раз':'Заглянуть внутрь';button.append(count,symbol,status);button.addEventListener('click',()=>openDay(number));grid.append(button);});
  document.querySelector('#progress').textContent=`Открыто ${state.opened.length} из 24 окошек${state.done.length?' · выполнено '+state.done.length:''}`;
}
function updateDone(){const done=state.done.includes(selectedDay);doneButton.setAttribute('aria-pressed',String(done));doneButton.textContent=done?'Выполнено · отменить отметку':'Отметить выполненным';}
function openDay(number){selectedDay=number;activeTrigger=number;if(!state.opened.includes(number)){state.opened.push(number);save();render();}const day=days[number-1];document.querySelector('#day-number').textContent=`${number} декабря`;document.querySelector('#day-title').textContent=day.title;document.querySelector('#day-description').textContent=day.text;document.querySelector('#day-art').textContent=String(number).padStart(2,'0');updateDone();dialog.showModal();document.body.classList.add('modal-open');document.querySelector('#close-day').focus();}
function closeDay(){dialog.close();}
document.querySelector('#close-day').addEventListener('click',closeDay);
doneButton.addEventListener('click',()=>{if(selectedDay===null)return;if(state.done.includes(selectedDay))state.done=state.done.filter(number=>number!==selectedDay);else state.done.push(selectedDay);save();render();updateDone();});
dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const rect=dialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)closeDay();});
dialog.addEventListener('close',()=>{document.body.classList.remove('modal-open');document.querySelector(`[data-day="${activeTrigger}"]`)?.focus();});
allDays.addEventListener('change',render);previewDay.addEventListener('change',render);
document.querySelector('#reset-progress').addEventListener('click',()=>{state={opened:[],done:[]};save();render();document.querySelector('#save-status').textContent='Прогресс сброшен. Можно начать заново.';});
render();

const requestedDay = Number(new URLSearchParams(location.search).get('day'));
if (Number.isInteger(requestedDay) && requestedDay >= 1 && requestedDay <= 24) openDay(requestedDay);
