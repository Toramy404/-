"""Presentation-only grouping. Never edits source effect records or infers numeric tiers."""
import re,unicodedata,hashlib,collections
TAGS={'damage':'增伤','defense':'减伤 / 防御','heal':'回血','fp':'专注 / 回蓝','stamina':'精力','ailment':'异常状态','ultimate':'技艺 / 绝招','character':'角色专属','negative':'负面效果','attributes':'基础能力','exploration':'探索 / 卢恩'}
def normalized_name(name):
 return re.sub(r'\s+',' ',unicodedata.normalize('NFKC',name)).strip()
def split_name(name):
 n=normalized_name(name);m=re.search(r'\s*\+\s*(\d+)\s*$',n)
 return (n[:m.start()].strip(),int(m[1])) if m else (n,None)
def classify(r,character_names=()):
 n=normalized_name(r['name']);cat=r.get('category') or '';d=r.get('description') or ''
 tags=[]
 prefix=re.match(r'^[【\[]([^】\]]+)[】\]]',n)
 character='角色' in cat or bool(prefix and prefix[1] in character_names)
 # A character trade-off or an enemy debuff is not a generic negative modifier.
 # Use the source debuff category, plus unambiguous standalone penalties (e.g. talismans).
 penalty=re.fullmatch(r'降低(?:生命力|集中力|耐力|力气|灵巧|智力|信仰|感应|(?:物理|魔力|火|雷|圣|属性)?减伤率|血量上限|专注值上限|精力上限)|减少(?:血量|专注值|精力)上限|持续(?:减少|降低|流失)血量',split_name(n)[0])
 negative=not character and (cat.startswith('减益') or bool(penalty))
 if negative:tags.append('negative')
 if not negative and (cat in ['攻击力','强化'] or re.search(r'强化.*(攻击|魔法|祷告)|提升.*攻击|攻击力|伤害.*提升|提升.*伤害',n)):tags.append('damage')
 if not negative and re.search(r'减伤|防御|强韧|抵抗力',n):tags.append('defense')
 if re.search(r'恢复.{0,12}(血量|生命|HP)|(血量|生命|HP).{0,8}(恢复|再生)|吸血',n,re.I):tags.append('heal')
 if re.search(r'专注|FP|集中力',n,re.I):tags.append('fp')
 if re.search(r'精力|耐力',n):tags.append('stamina')
 if re.search(r'异常|中毒|毒|腐败|出血|冻伤|催眠|发狂|咒死',n):tags.append('ailment')
 if re.search(r'技艺|绝招|量表',n):tags.append('ultimate')
 if character:tags.append('character')
 if cat in ['能力','能力值'] or re.fullmatch(r'生命力|集中力|耐力|力气|灵巧|智力|信仰|感应',split_name(n)[0]):tags.append('attributes')
 if re.search(r'卢恩|道具|出击|宝箱|商人|地图|封印监牢',n) or cat.startswith('出击'):tags.append('exploration')
 return tags
def build_catalog(effects,character_names=()):
 families=collections.OrderedDict();members={}
 for r in effects:
  base,tier=split_name(r['name']);fid='effect-'+hashlib.sha256(base.encode('utf-8')).hexdigest()[:16]
  f=families.setdefault(fid,{'id':fid,'name':base,'member_ids':[],'scope_ids':[],'tag_ids':[]})
  assert f['name']==base,'Family hash collision'
  f['member_ids'].append(r['id'])
  if r['scope'] not in f['scope_ids']:f['scope_ids'].append(r['scope'])
  tags=classify(r,character_names)
  for tag in tags:
   if tag not in f['tag_ids']:f['tag_ids'].append(tag)
  # Tier is nullable. A slash-separated source description does NOT create fabricated tiers.
  members[r['id']]={'family_id':fid,'tier':tier,'tags':tags}
 assert len(members)==len(effects)==sum(len(f['member_ids']) for f in families.values())
 return list(families.values()),members,TAGS

