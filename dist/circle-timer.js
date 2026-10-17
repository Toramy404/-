/* Manual wall-clock timer: suspension/reload must not lose elapsed time. */
(function(global){
'use strict';
function clock(rows){
 var steps=rows.filter(r=>Number.isFinite(r.seconds)).slice().sort((a,b)=>a.seconds-b.seconds),end=steps[steps.length-1].seconds;
 function clean(raw){raw=raw&&typeof raw==='object'?raw:{};return {day:raw.day===2?2:1,elapsed:Math.max(0,Math.min(end,Number(raw.elapsed)||0)),startedAt:Number.isFinite(raw.startedAt)&&raw.startedAt>0?raw.startedAt:null}}
 function elapsed(raw,now){var s=clean(raw);return Math.min(end,s.elapsed+(s.startedAt===null?0:Math.max(0,(now-s.startedAt)/1000)))}
 function snapshot(raw,now){var s=clean(raw),t=elapsed(s,now),next=steps.find(r=>r.seconds>t),index=next?steps.indexOf(next):steps.length,phase=['','自由探索','第一次收缩中','圈内探索','第二次收缩中','夜战时段'][index];return {day:s.day,elapsed:t,next:next||null,remaining:next?Math.ceil(next.seconds-t):0,phase:phase,running:s.startedAt!==null&&t<end,done:t>=end,index:index}}
 function reduce(raw,action,value,now){var s=clean(raw),t=elapsed(s,now),running=s.startedAt!==null&&t<end;
  if(action==='toggle'){s.elapsed=t>=end?0:t;s.startedAt=running?null:now}
  else if(action==='reset'){s.elapsed=0;s.startedAt=null}
  else if(action==='day'){var day=Number(value)===2?2:1;if(day!==s.day){s.day=day;s.elapsed=0;s.startedAt=null}}
  else if(action==='checkpoint'){var n=Number(value);if(!steps.slice(0,-1).some(r=>r.seconds===n))return s;s.elapsed=n;s.startedAt=null}
  else if(action==='adjust'||action==='set'){var n=Number(value);if(!Number.isFinite(n))return s;s.elapsed=Math.max(0,Math.min(end,action==='adjust'?t+n:n));s.startedAt=running&&s.elapsed<end?now:null}
  return s;
 }
 function parse(text){var m=String(text).trim().match(/^(\d{1,2}):([0-5]\d)$/);if(!m)return null;var n=Number(m[1])*60+Number(m[2]);return n<=end?n:null}
 return {steps:steps,end:end,clean:clean,elapsed:elapsed,snapshot:snapshot,reduce:reduce,parse:parse};
}
function format(seconds){var n=Math.max(0,Math.ceil(seconds));return String(Math.floor(n/60)).padStart(2,'0')+':'+String(n%60).padStart(2,'0')}
function create(D,H){
 var model=clock(D.circle_timing),s=model.clean(H.load('nr-circle-timer-v1',null)),esc=H.esc,btn=H.btn,interval=null;
 function get(){return model.snapshot(s,Date.now())}
 function target(p){return p.next?'距离'+p.next.name.replace('第一次','首次').replace('第二次','第二次')+(p.index===4?'（预计）':''):'本夜缩圈时间已到'}
 function startLabel(p){return p.running?'暂停':p.done?'重新开始':!p.elapsed?'开始计时':model.steps.slice(1,-1).some(r=>r.seconds===p.elapsed)?'从 '+format(p.elapsed)+' 开始':'继续计时'}
 function origin(p){var selected=!p.running&&model.steps.slice(0,-1).some(r=>r.seconds===p.elapsed)?p.elapsed:'current';return '<label class="timer-origin-row"><span>计时起点</span><select id="timer-origin" aria-label="计时起点"><option value="current"'+(selected==='current'?' selected':'')+'>保留当前进度</option>'+model.steps.slice(0,-1).map((r,i)=>'<option value="'+r.seconds+'"'+(selected===r.seconds?' selected':'')+'>'+esc(i?r.name:'本夜开始')+' · '+format(r.seconds)+'</option>').join('')+'</select></label>'}
 function page(){var p=get();return H.head('缩圈倒计时','普通远征 · 入夜后手动开始').replace('class="page-head"','class="page-head timer-heading"')+
  '<div class="timer-layout"><section class="panel timer-main"><div class="timer-top"><div class="view-switch">'+btn('第一夜','timer-day','1',p.day===1?'active':'')+btn('第二夜','timer-day','2',p.day===2?'active':'')+'</div><span id="timer-run-state" class="badge">'+(p.running?'计时中':p.done?'已结束':p.elapsed?'已暂停':'待开始')+'</span></div>'+
  origin(p)+'<div id="timer-dial" class="timer-dial"><span id="timer-target">'+esc(target(p))+'</span><strong id="timer-remaining" role="timer" aria-live="off">'+format(p.remaining)+'</strong><span id="timer-phase">'+esc(p.phase)+'</span></div><p class="timer-elapsed">本夜已过 <strong id="timer-elapsed">'+format(Math.floor(p.elapsed))+'</strong></p><div class="timer-actions">'+btn(startLabel(p),'timer-toggle',null,'primary')+btn('重置本夜','timer-reset',null,'ghost')+'</div></section>'+
  '<section class="panel timer-plan"><h2>本夜时间轴</h2><ol>'+model.steps.slice(1).map((r,i)=>'<li data-timer-step="'+(i+1)+'"><time>'+esc(r.time_display)+'</time><span>'+esc(r.name)+(i===3?'（预计）':'')+'</span></li>').join('')+'</ol><details class="timer-calibration"><summary>校准时间</summary><div class="timer-adjust">'+btn('已过 −30秒','timer-adjust','-30','ghost')+btn('已过 +30秒','timer-adjust','30','ghost')+'</div><label for="timer-manual">本夜已过时间（分:秒）</label><div class="timer-manual-row"><input id="timer-manual" type="text" inputmode="text" maxlength="5" placeholder="例如 05:20" autocomplete="off">'+btn('校准','timer-set',null,'ghost')+'</div></details></section></div>'+
  '<details class="weapon-reference"><summary>计时方式与来源</summary><p>两夜分别启动；夜战结束后，切换到下一夜再开始。</p><p>按手动开始的时间计算，切换栏目、切出应用和刷新后继续计时；暂停期间不累计。计时无法读取游戏进度，起点不一致时可选择计时起点，再点开始；需要精确到秒时展开校准。选择起点会暂停并对齐到该节点，保留当前进度不会改动计时。</p><p>首缩 4:30 开始、7:30 结束；第二次 11:00 开始。末次结束的来源存在 14:00 / 14:30 差异，本工具以约 14:00 提醒，不把参考计时当作实测结果。深夜、单人及异常场景尚未逐项验证。</p>'+H.sourceHTML(D.circle_timing.flatMap(r=>r.source_refs).filter((r,i,a)=>a.findIndex(x=>x.source_id===r.source_id)===i))+'</details>';
 }
 function tick(){var p=get();var texts={'timer-target':target(p),'timer-remaining':format(p.remaining),'timer-phase':p.phase,'timer-elapsed':format(Math.floor(p.elapsed)),'timer-run-state':p.running?'计时中':p.done?'已结束':p.elapsed?'已暂停':'待开始'};
  Object.entries(texts).forEach(([id,text])=>{var el=document.getElementById(id);if(el&&el.textContent!==text)el.textContent=text});
  var dial=document.getElementById('timer-dial');if(dial)dial.classList.toggle('soon',p.remaining<=60&&!p.done);
  document.querySelectorAll('[data-timer-step]').forEach(el=>{el.classList.toggle('current',Number(el.dataset.timerStep)===p.index);el.classList.toggle('passed',Number(el.dataset.timerStep)<p.index)});
  var toggle=document.querySelector('[data-action="timer-toggle"]');if(toggle)toggle.textContent=startLabel(p);
  document.querySelectorAll('[data-timer-badge]').forEach(el=>{el.textContent=(p.running?'计时 '+format(p.remaining):'缩圈计时');el.classList.toggle('active',p.running)});
 }
 function action(a,value){if(!a.startsWith('timer-'))return false;var command=a.slice(6);
  if(command==='checkpoint'&&value==='current')return true;
  if(command==='set'){value=model.parse(document.getElementById('timer-manual').value);if(value===null){H.toast('请输入 00:00–'+format(model.end)+'，例如 05:20');return true}}
  s=model.reduce(s,command,value,Date.now());H.persist('nr-circle-timer-v1',s);H.render();tick();return true;
 }
 function startTick(){if(interval!==null)return;tick();interval=setInterval(tick,500);document.addEventListener('visibilitychange',tick);document.addEventListener('change',function(e){if(e.target.id==='timer-origin')action('timer-checkpoint',e.target.value)})}
 return {page:page,action:action,tick:tick,startTick:startTick};
}
global.NR_TIMER={clock:clock,format:format,create:create};
})(window);
