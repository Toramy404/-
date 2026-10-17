/* Weapon identities, source examples and existing legendary effects stay separate. */
(function(global){
'use strict';
var groups={all:'全部装备',melee:'近战',ranged:'远程',catalyst:'施法工具',shield:'盾牌'};
var rarities={common:'普通',uncommon:'优良',rare:'稀有',legendary:'传说'};
var names={physical:'物理',magic:'魔力',fire:'火',lightning:'雷',holy:'圣',critical:'致命一击',boost:'防御强度',strength:'力气',dexterity:'灵巧',intelligence:'智力',faith:'信仰',arcane:'感应',standard:'普通',strike:'打击',slash:'斩击',pierce:'突刺',scarlet_rot:'猩红腐败',blood_loss:'出血',frostbite:'冻伤',poison:'中毒'};
var paths={melee:'M19 4 9 14l-3-3L16 1h6v6l-3-3ZM4 13l7 7M7 17l-5 5M1 20l3 3',ranged:'M5 2c16 1 16 19 0 20L13 12 5 2M2 12h20m-4-4 4 4-4 4',catalyst:'m5 22 10-15M12 2l7-1 4 6-7 2-4-7ZM4 18l4 3',shield:'M12 2 3 5v8c1 5 5 8 9 10 4-2 8-5 9-10V5L12 2ZM12 6v12M7 10h10'};
function glyph(group){return '<svg viewBox="0 0 26 26" aria-hidden="true"><path d="'+paths[group]+'"/></svg>'}
function create(D,H){
 var esc=H.esc,btn=H.btn,variants=new Map(D.weapon_variants.map(v=>[v.id,v])),observations=new Map(D.weapon_source_observations.map(o=>[o.id,o]));
 var indexed=new Map(D.weapons.map(r=>[r.id,Object.assign({},r,{description:r.description+' '+r.category_en})]));
 function variant(r){return variants.get(r.variant_ids[0])}
 function score(r,q){return global.NR_CATALOG.score(indexed.get(r.id)||r,q)}
 function select(state){return D.weapons.filter(r=>(state.weaponGroup==='all'||r.group===state.weaponGroup)&&(state.weaponCategory==='all'||r.category_en===state.weaponCategory)&&(state.weaponRarity==='all'||variant(r).rarity_label===state.weaponRarity)&&score(r,state.query)>0).sort((a,b)=>score(b,state.query)-score(a,state.query))}
 function candidate(r){return r.name_zh_status.indexOf('provisional')>=0}
 function mini(v,r){
  if(r.group==='catalyst')return '<span>Spell Power <b>'+esc(v.spell_power.value)+'</b></span><span>近战物理 <b>'+esc(v.attack.physical.value)+'</b></span>';
  if(r.group==='shield')return '<span>物理防御 <b>'+esc(v.guard.value.physical)+'</b></span><span>防御强度 <b>'+esc(v.guard.value.boost)+'</b></span>';
  return Object.entries(v.attack).filter(x=>x[1].value!==0).map(x=>'<span>'+esc(names[x[0]])+' <b>'+esc(x[1].value)+'</b></span>').join('');
 }
 function card(r){
  var v=variant(r),link=D.weapon_effect_links.find(x=>x.weapon_id===r.id);
  return '<article class="weapon-card rarity-'+v.rarity_label+'">'+H.openButton('weapons',r.id,'<div class="weapon-card-top"><span class="weapon-symbol">'+glyph(r.group)+'</span><span class="weapon-card-label">'+esc(r.category)+'<small>'+esc(r.category_en)+'</small></span></div><h3>'+esc(r.name)+'</h3><p class="weapon-en">'+esc(r.name_en)+'</p><div class="weapon-badges"><span class="badge rarity">页面 '+esc(rarities[v.rarity_label])+'</span>'+(candidate(r)?'<span class="badge">译名待核</span>':'')+(link?'<span class="badge gold">庇佑可查</span>':'')+'</div><div class="weapon-mini">'+mini(v,r)+'</div><div class="weapon-card-foot"><span>来源示例 · 条件待核</span><span>详情 ↗</span></div>','weapon-open')+H.favButton('weapons',r)+'</article>';
 }
 function page(state){
  var rows=select(state),subset=D.weapons.filter(r=>state.weaponGroup==='all'||r.group===state.weaponGroup),cats=Array.from(new Map(subset.map(r=>[r.category_en,r.category])).entries());
  return '<div class="weapon-page">'+H.head('武器图鉴','找武器、看面板，查对应的传说效果。',btn('传说效果库 →','nav','legendary_weapon_effects','ghost'))+
   '<section class="weapon-intro"><div><span class="eyebrow">ARSENAL · PREVIEW</span><h2>你的随身兵器簿</h2><p>首批收录近战、远程、施法工具和盾牌。数值按来源示例展示，具体条件见详情。</p></div><div class="weapon-totals"><span><strong>'+D.weapons.length+'</strong>件装备</span><span><strong>'+new Set(D.weapons.map(r=>r.category_en)).size+'</strong>种类别</span></div></section>'+
   '<section class="panel weapon-controls"><div class="weapon-tabs" aria-label="装备大类">'+Object.entries(groups).map(([k,label])=>btn(label+' <small>'+D.weapons.filter(r=>k==='all'||r.group===k).length+'</small>','weapon-group',k,state.weaponGroup===k?'active':'')).join('')+'</div><div class="weapon-toolbar"><label class="weapon-query-label" for="local-query">搜索武器<input id="local-query" data-state="query" type="search" autocomplete="off" aria-label="搜索武器" placeholder="中文、English 或别名，如月光大剑" value="'+esc(state.query)+'"></label>'+H.select('weaponCategory',[['all','全部类别']].concat(cats),state.weaponCategory,'武器类别')+H.select('weaponRarity',[['all','全部页面品质']].concat(Object.entries(rarities)),state.weaponRarity,'来源页面品质')+'</div></section>'+
   '<div class="weapon-result-head"><p class="count">找到 <strong>'+rows.length+'</strong> 件装备</p>'+btn('清除筛选','reset-weapons',null,'text-button')+'</div>'+(rows.length?'<div class="weapon-grid">'+rows.map(card).join('')+'</div>':H.empty('没有匹配的武器','试试其他名称，或清除分类和品质筛选。'))+'<p class="weapon-endnote">首批 24 件样本，后续继续补充。页面品质仅记录来源标签，不代表面板已完成品质与强化条件校验。</p></div>';
 }
 function value(f){return f.state==='not_applicable'?'不适用':f.value===null?'待核':esc(f.value)}
 function stats(title,entries){return '<section class="weapon-detail-section"><h3>'+title+'</h3><dl class="weapon-stats">'+entries.map(([label,val])=>'<div><dt>'+esc(label)+'</dt><dd>'+val+'</dd></div>').join('')+'</dl></section>'}
 function detail(r){
  var v=variant(r),link=D.weapon_effect_links.find(x=>x.weapon_id===r.id),skill=v.skill.value,spell=v.spells.value;
  var extra=r.observation_ids.map(id=>observations.get(id)).filter(o=>o.raw.scope==='skill_assignment_and_chinese_name');
  var h='<div class="weapon-detail-lead"><span class="weapon-symbol">'+glyph(r.group)+'</span><div><strong>'+esc(r.category)+' · '+esc(r.category_en)+'</strong><p>'+esc(r.description)+'</p>'+(candidate(r)?'<p class="small">中文为候选译名，以英文名称确认装备。</p>':'')+'</div></div>'+
   '<div class="weapon-source-banner"><strong>来源报告 · 条件待核</strong><p>页面标签：'+esc(rarities[v.rarity_label])+'（'+esc(v.rarity_label)+'） · 页面需求等级：'+v.level_required+'</p><p>以下为网页示例面板；补丁、强化与角色条件未完整绑定。</p></div>';
  h+=stats('攻击力 · 来源显示',Object.entries(v.attack).map(([k,f])=>[names[k],value(f)]));
  h+=stats('属性补正',['strength','dexterity','intelligence','faith','arcane'].map(k=>[names[k],v.scaling.state==='explicit_none'?'无':v.scaling.grades[k]?esc(v.scaling.grades[k]):'待核']));
  h+='<p class="small muted">'+(v.scaling.state==='explicit_none'?'来源明确注明无属性补正。':'仅展示来源列出的补正；未列的属性保留待核。')+'</p>';
  h+=stats('其他面板',[['物理类型',v.attack_types.map(x=>esc(names[x]||x)).join(' / ')],['致命一击',value(v.critical)],['Spell Power',value(v.spell_power)]]);
  if(v.spell_power.value!==null)h+='<p class="small muted">Spell Power 为来源的法术威力字段，独立于近战攻击力；计算条件待核。</p>';
  if(v.guard.value)h+=stats('防御 · 来源显示',Object.entries(v.guard.value).map(([k,n])=>[names[k],esc(n)]));
  else h+='<section class="weapon-detail-section"><h3>防御</h3><p class="muted">'+esc(v.guard.reason)+'</p></section>';
  h+='<section class="weapon-detail-section"><h3>固有异常 · 来源记录</h3><p>'+(v.status.state==='explicit_no_innate'?'来源称无固有异常；随机词条另计。':v.status.effects===null?'待核：来源未给出固有异常条目。':v.status.effects.map(e=>esc(names[e.type]||e.type)+'积累 '+esc(e.buildup)).join(' · '))+'</p></section>';
  h+='<section class="weapon-detail-section"><h3>战技与法术</h3>'+(skill?'<p><strong>'+esc(skill.name_en)+'</strong></p><p>FP 原页显示：<span class="mono">'+esc(skill.fp_cost_display)+'</span></p><p class="small muted">页面列出的战技示例，固定掉落规则待核；FP 分段格式按原页保留。</p>':'<p>'+esc(v.skill.reason.replace(/^(not_applicable|random_unobserved|unknown)：/,''))+'</p>')+(spell?'<p>法术栏 '+spell.slots+' 个 · 来源说明随机配置；具体组合待核。</p>':'')+extra.map(o=>'<div class="notice warn"><strong>打刀的战技描述有差异</strong><p>Mobalytics 列出 Unsheathe；BWIKI 标注“'+esc(o.raw.skill_assignment_text)+'”。此处保留两者，不将示例认定为固定战技。</p></div>').join('')+'</section>';
  if(link){var effect=D.legendary_weapon_effects.find(x=>x.id===link.effect_id);h+='<section class="weapon-linked"><span class="eyebrow">LEGENDARY BLESSING</span><h3>'+esc(effect.effect_name||effect.name)+'</h3><p>'+esc(effect.description)+'</p>'+btn('查看传说效果与原始出处 →','weapon-effect',r.id,'text-button')+'</section>'}
  h+='<details class="weapon-conditions"><summary>适用条件与待核项目</summary><dl class="kv"><dt>游戏补丁</dt><dd>待核</dd><dt>角色 / 等级</dt><dd>待核</dd><dt>强化 / 增益</dt><dd>待核</dd><dt>品质与数值绑定</dt><dd>尚未确认</dd><dt>整理日期</dt><dd>2026-10-17（不是游戏版本）</dd></dl><ul>'+r.known_gaps.map(g=>'<li>'+esc(g)+'</li>').join('')+'</ul></details>'+H.sourceHTML(r.source_refs);
  return h;
 }
 return {page:page,card:card,detail:detail,select:select,score:score,variant:variant};
}
global.NR_WEAPONS={create:create};
})(window);
