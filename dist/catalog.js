/* Search and family selectors operate on references, not copied numeric values. */
(function(global){
'use strict';
function normalize(s){
 return String(s==null?'':s).normalize('NFKC').toLowerCase()
 .replace(/铁眼|弓哥/g,'铁之眼').replace(/生命值/g,'血量').replace(/\bhp\b/g,'血量')
 .replace(/\bfp\b|蓝量/g,'专注值').replace(/体力/g,'精力').replace(/大招/g,'绝招')
 .replace(/红瓶/g,'圣杯瓶').replace(/蓝瓶/g,'蓝露滴圣杯瓶').replace(/\s+/g,' ').trim();
}
function compact(s){return normalize(s).replace(/\s+/g,'')}
function aliases(r){return Array.isArray(r.aliases)?r.aliases.join(' '):r.aliases||''}
var cache=new WeakMap();
function fields(r){
 if(cache.has(r))return cache.get(r);
 var f={name:compact(r.name),english:compact(r.name_en),alias:compact(aliases(r)+' '+(r.talisman_name||'')),body:compact([r.description,r.scope_zh,r.category,r.role_summary,r.trigger_summary,r.reward_summary,r.effect_name].filter(Boolean).join(' '))};
 cache.set(r,f);return f;
}
function matchTerm(hay,t){
 if(t==='回血'||t==='回血量')return /回血|吸血|恢复.{0,16}血量|血量.{0,12}(恢复|再生)|hp.{0,12}restor/.test(hay);
 if(t==='回蓝')return /回蓝|恢复.{0,16}专注值|专注值.{0,12}(恢复|再生)|fp.{0,12}restor/.test(hay);
 if(t==='增伤')return /攻击力|强化.{0,10}(攻击|魔法|祷告)|提升.{0,12}(攻击|伤害)|伤害.{0,8}(提升|增加)/.test(hay);
 if(t==='减伤')return /减伤|伤害.{0,8}(降低|减少)|降低.{0,8}伤害/.test(hay);
 return hay.includes(t);
}
function score(r,q){
 if(!String(q||'').trim())return 1;
 var f=fields(r),terms=normalize(q).split(/\s+/).filter(Boolean),joined=compact(q);
 if(!terms.every(function(t){return [f.name,f.english,f.alias,f.body].some(function(h){return matchTerm(h,compact(t))})}))return 0;
 if(f.name===joined)return 1200;
 if(f.alias===joined||f.english===joined)return 1100;
 if(f.name.startsWith(joined))return 1000;
 if(f.name.includes(joined))return 900;
 if(terms.every(function(t){return matchTerm(f.name,compact(t))}))return 800;
 if(terms.every(function(t){return matchTerm(f.alias,compact(t))||matchTerm(f.english,compact(t))}))return 700;
 return 300+terms.filter(function(t){return matchTerm(f.name,compact(t))}).length*80;
}
var contexts={out:'局外遗物',inside:'局内词条',talisman:'护符',special:'特殊效果'};
var scopeContexts={relic:'out',deep_relic:'out',in_run:'inside',deep_in_run:'inside',talisman:'talisman',special_buff:'special'};
var groupCache=new WeakMap();
function groups(D){
 if(groupCache.has(D))return groupCache.get(D);
 var records=new Map(D.effects.map(function(r){return[r.id,r]})),all=[];
 D.effect_families.forEach(function(f,index){
  Object.keys(contexts).forEach(function(context){
   var rows=f.member_ids.map(function(id){return records.get(id)}).filter(function(r){return scopeContexts[r.scope]===context});
   if(rows.length)all.push({id:f.id+'@'+context,name:f.name,family:f,context:context,rows:rows,index:index});
  });
 });groupCache.set(D,all);return all;
}
function displayTier(D,r){
 var original=D.effect_members[r.id].tier;if(original!==null)return original;
 // Only a named numbered series within the same use-context has a display +0.
 // Never infer numbered tiers from slash-separated numeric descriptions.
 if(!['relic','deep_relic'].includes(r.scope))return null;
 var group=groups(D).find(function(g){return g.family.id===D.effect_members[r.id].family_id&&g.context==='out'});
 return group&&group.rows.some(function(x){return D.effect_members[x.id].tier!==null})?0:null;
}
// Sort a copy only. Never reorder or recalculate the source records.
function orderedRows(D,rows){
 var ordered=rows.slice().sort(function(a,b){
  var x=displayTier(D,a),y=displayTier(D,b);
  return(y===null?-1:y)-(x===null?-1:x);
 });
 // Unnumbered values are comparable only with the same source, unit and condition.
 // Sort within those slots; unrelated conditions keep their original positions.
 var buckets=new Map();
 ordered.forEach(function(r,index){
  if(displayTier(D,r)!==null)return;
  var description=String(r.description||'').replace(/\s+/g,''),numbers=description.match(/[+-]?\d+(?:\.\d+)?/g);
  if(!numbers||numbers.length!==1)return;
  var key=JSON.stringify([r.scope,description.replace(numbers[0],'#'),r.negative_modifier_requirement||'']);
  if(!buckets.has(key))buckets.set(key,[]);
  buckets.get(key).push({index:index,row:r,value:Number(numbers[0])});
 });
 buckets.forEach(function(entries){
  var sorted=entries.slice().sort(function(a,b){return b.value-a.value});
  entries.forEach(function(entry,index){ordered[entry.index]=sorted[index].row});
 });
 return ordered;
}
var commonNames=['提升物理攻击力','提升物理减伤率','提升魔力属性攻击力','提升火属性攻击力','提升雷属性攻击力','提升圣属性攻击力','提升魔力属性减伤率','提升火属性减伤率','提升雷属性减伤率','提升圣属性减伤率','提升血量上限','缩短技艺的冷却时间','自然累积绝招量表'];
function priority(D,g){
 var i=commonNames.indexOf(g.name);if(i>=0)return i;
 var tags=g.rows.flatMap(function(r){return D.effect_members[r.id].tags});
 return tags.includes('damage')?30:tags.includes('defense')?40:tags.includes('heal')?50:tags.includes('fp')?60:tags.includes('ultimate')?65:tags.includes('attributes')?80:100;
}
function effectScore(D,r,q){
 if(/\+\s*0$/.test(normalize(q))&&displayTier(D,r)===0)return score(Object.assign({},r,{name:r.name+'+0'}),q);
 return score(r,q);
}
function selectFamilies(D,filters){
 filters=filters||{};
 return groups(D).filter(function(g){return !filters.context||filters.context==='all'||g.context===filters.context}).map(function(g){
  var matched=g.rows.filter(function(r){
   return (!filters.scope||filters.scope==='all'||r.scope===filters.scope)&&
    (!filters.tag||filters.tag==='all'||D.effect_members[r.id].tags.includes(filters.tag))&&
    (!filters.stack||filters.stack==='all'||(filters.stack==='yes'?r.stacking==='可叠加':filters.stack==='no'?r.stacking==='不可叠加':r.verification_status==='conflict'))&&effectScore(D,r,filters.query)>0;
  });
  if(!matched.length)return null;
  var ranked=matched.map(function(r){return{record:r,score:effectScore(D,r,filters.query)}}).sort(function(a,b){return b.score-a.score});
  return Object.assign({},g,{rows:matched,score:ranked[0].score,bestId:ranked[0].record.id,priority:priority(D,g)});
 }).filter(Boolean).sort(function(a,b){return b.score-a.score||a.priority-b.priority||a.index-b.index});
}
var api={normalize:normalize,compact:compact,score:score,selectFamilies:selectFamilies,groups:groups,contexts:contexts,scopeContexts:scopeContexts,displayTier:displayTier,orderedRows:orderedRows};
if(typeof module!=='undefined'&&module.exports)module.exports=api;
global.NR_CATALOG=api;
})(typeof window!=='undefined'?window:globalThis);

