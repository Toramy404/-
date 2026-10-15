// Exercise saved-record compatibility and hierarchical back without a browser.
const path=require('node:path'); const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
const records={},emptyNode={addEventListener(){},querySelectorAll(){return[]},classList:{toggle(){},add(){},remove(){}},dataset:{},open:false,scrollTop:0,close(){this.open=false}};
const modal={...emptyNode,dataset:{}},box={...emptyNode,value:''};
const ctx={window:{scrollTo(){},addEventListener(){},scrollY:0},document:{getElementById(id){return id==='detail'?modal:box},querySelectorAll(){return[]},addEventListener(){},body:emptyNode},localStorage:{getItem(k){return records[k]||null},setItem(k,v){records[k]=v}},setTimeout(){},clearTimeout(){},CSS:{escape:s=>s},history:{replaceState(){}},location:{hash:'#home'}};
vm.createContext(ctx);vm.runInContext(fs.readFileSync(path.join(__dirname,'../dist/data.js'),'utf8'),ctx);vm.runInContext(fs.readFileSync(path.join(__dirname,'../dist/catalog.js'),'utf8'),ctx);
let app=fs.readFileSync(path.join(__dirname,'../dist/app.js'),'utf8');app=app.slice(0,app.indexOf('applyDisplay();shell();initializeReadingMemory();'))+`
render=function(){};toast=function(){};currentScroll=function(){return 0};setReadingScroll=function(){};rememberView=function(){};
goParent=function(v){state.view=v};familyDetail=function(id){modal.dataset.record='effect_groups|'+id};
window.test={state:state,groups:effectGroups,resolve:resolveRecords,saved:familySaved,action:handleAction};})();`;
vm.runInContext(app,ctx);const T=ctx.window.test,D=ctx.window.NR_DATA,physical=T.groups.find(g=>g.name==='提升物理攻击力'&&g.context==='out'),inside=T.groups.find(g=>g.name===physical.name&&g.context==='inside');
let passed=0;function check(name,ok){assert.ok(ok,name);passed++}function action(a,v){T.action({target:{closest(){return{dataset:{action:a,value:v}}}}})}
T.state.favorites=['effect_families|'+physical.family.id,'nightlords|gladius'];
check('legacy favorite expands both contexts',T.resolve(T.state.favorites,true).filter(a=>a[0]==='effect_groups').length===2);
action('family-favorite',physical.id);check('removing outside keeps inside',!T.saved(physical)&&T.saved(inside));check('unrelated favorite kept',T.state.favorites.includes('nightlords|gladius'));
T.state.favorites=['effects|'+physical.rows[0].id];check('legacy row resolves correct context',T.resolve(T.state.favorites,true)[0][1].id===physical.id);
T.state.recent=['effect_groups|'+physical.id];T.state.marks={test:1};const favorites=JSON.stringify(T.state.favorites),marks=JSON.stringify(T.state.marks);action('clear-recent');check('clear history only',T.state.recent.length===0&&JSON.stringify(T.state.favorites)===favorites&&JSON.stringify(T.state.marks)===marks);action('undo-recent');check('undo restores recent',T.state.recent.length===1);
modal.open=true;modal.dataset.record='effects|'+physical.rows[0].id;T.state.view='favorites';check('raw detail back to group',ctx.window.NR_APP_BACK()==='parent'&&modal.dataset.record==='effect_groups|'+physical.id);
check('group back to effects section',ctx.window.NR_APP_BACK()==='parent'&&T.state.view==='effects'&&!modal.open);
ctx.window.NR_APP_BACK();check('main section back home',T.state.view==='home');check('home returns exit signal',ctx.window.NR_APP_BACK()==='exit');
T.state.view='about';ctx.window.NR_APP_BACK();check('about parent is settings',T.state.view==='settings');ctx.window.NR_APP_BACK();check('settings parent home',T.state.view==='home');
T.state.view='items';ctx.window.NR_APP_BACK();check('secondary data parent more',T.state.view==='more');
let exitCalls=0;ctx.window.NightreignNative={exitApp(){exitCalls++}};T.state.view='effects';action('back');check('native header returns parent before exit',T.state.view==='home'&&exitCalls===0);action('back');check('native header on home requests exit',exitCalls===1);delete ctx.window.NightreignNative;action('back');check('browser header does not request native exit',exitCalls===1);
console.log({passed,allPassed:true});
