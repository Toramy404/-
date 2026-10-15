const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const root=require('node:path').resolve(__dirname,'..')+'/',context={window:{}};vm.createContext(context);vm.runInContext(fs.readFileSync(root+'dist/data.js','utf8'),context);const D=context.window.NR_DATA,C=require('../dist/catalog.js');
const checks=[];function check(name,test){assert.ok(test,name);checks.push(name)}
const groups=C.groups(D),ids=groups.flatMap(g=>g.rows.map(r=>r.id));
check('873 source rows exactly once',ids.length===873&&new Set(ids).size===873);
check('all groups have one context only',groups.every(g=>g.rows.every(r=>C.scopeContexts[r.scope]===g.context)));
check('rows are original references',groups.every(g=>g.rows.every(r=>D.effects.find(x=>x.id===r.id)===r)));
const out=C.selectFamilies(D,{context:'out'}),inside=C.selectFamilies(D,{context:'inside'});
check('attack first outside',out[0].name==='提升物理攻击力');
check('defense second outside',out[1].name==='提升物理减伤率');
check('inside never contains relic',inside.every(g=>g.rows.every(r=>['in_run','deep_in_run'].includes(r.scope))));
const phys=out[0],series=phys.rows.map(r=>({id:r.id,tier:C.displayTier(D,r),text:r.description,negative:r.negative_modifier_requirement}));
check('physical tiers 0 through 4',series.map(x=>x.tier).sort().join(',')==='0,1,2,3,4');
check('physical values retained',series.map(x=>x.text).join('|')==='物理攻击力 +4%|物理攻击力 +5%|物理攻击力 +6%|物理攻击力+10.5%|物理攻击力+12%');
check('deep costs retained',phys.rows.filter(r=>r.scope==='deep_relic').every(r=>r.negative_modifier_requirement==='附带负面词条'));
const physInside=inside.find(g=>g.name==='提升物理攻击力');check('unnumbered in-run values have no invented tier',physInside.rows.every(r=>C.displayTier(D,r)===null));
check('display +0 can be searched',C.selectFamilies(D,{query:'物理攻击力+0',context:'out'})[0].bestId==='relic:7001400');
const all=C.selectFamilies(D,{query:'提升物理攻击力'});check('global physical results separate contexts',all.length>=2&&all.some(g=>g.context==='out')&&all.some(g=>g.context==='inside'));
const vigor=C.selectFamilies(D,{query:'生命力+3',context:'out'})[0];check('specific tier query unchanged',vigor.bestId==='relic:7000002');
for(const context of Object.keys(C.contexts)){for(const g of C.selectFamilies(D,{context,tag:'damage'}))check('damage tag stays on matched row '+g.id,g.rows.every(r=>D.effect_members[r.id].tags.includes('damage')))}
const css=fs.readFileSync(root+'dist/style.css','utf8');check('css braces closed',(css.match(/\{/g)||[]).length===(css.match(/\}/g)||[]).length);
check('removed requested description',!fs.readFileSync(root+'dist/app.js','utf8').includes('按同一地图配置的真实两夜'));
const report={checks:checks.length,records:ids.length,families:D.effect_families.length,displayGroups:groups.length,contexts:Object.fromEntries(Object.keys(C.contexts).map(c=>[c,{groups:groups.filter(g=>g.context===c).length,rows:groups.filter(g=>g.context===c).reduce((n,g)=>n+g.rows.length,0)}])),physical:series,passed:true};console.log({checks:checks.length,records:ids.length,displayGroups:groups.length,passed:true});
