"""Presentation-only grouping. Never edits source effect records or infers numeric tiers."""
import re,unicodedata,hashlib,collections
TAGS={'damage':'增伤','defense':'减伤 / 防御','heal':'回血','fp':'专注 / 回蓝','stamina':'精力','ailment':'异常状态','ultimate':'技艺 / 绝招','character':'角色专属','negative':'负面效果','attributes':'基础能力','exploration':'探索 / 卢恩'}
def normalized_name(name):
 return re.sub(r'\s+',' ',unicodedata.normalize('NFKC',name)).strip()
def split_name(name):
 n=normalized_name(name);m=re.search(r'\s*\+\s*(\d+)\s*$',n)
 return (n[:m.start()].strip(),int(m[1])) if m else (n,None)
def classify(r):
 n=normalized_name(r['name']);cat=r.get('category') or '';d=r.get('description') or ''
 tags=[]
 negative=cat.startswith('减益') or bool(re.search(r'降低|减少血量上限|减少专注值上限|减少精力上限|持续减少血量|持续降低血量|持续流失血量',n))
 if negative:tags.append('negative')
 if not negative and (cat in ['攻击力','强化'] or re.search(r'强化.*(攻击|魔法|祷告)|提升.*攻击|攻击力|伤害.*提升|提升.*伤害',n)):tags.append('damage')
 if not negative and re.search(r'减伤|防御|强韧|抵抗力',n):tags.append('defense')
 if re.search(r'恢复.{0,12}(血量|生命|HP)|(血量|生命|HP).{0,8}(恢复|再生)|吸血',n,re.I):tags.append('heal')
 if re.search(r'专注|FP|集中力',n,re.I):tags.append('fp')
 if re.search(r'精力|耐力',n):tags.append('stamina')
 if re.search(r'异常|中毒|毒|腐败|出血|冻伤|催眠|发狂|咒死',n):tags.append('ailment')
 if re.search(r'技艺|绝招|量表',n):tags.append('ultimate')
 if '角色' in cat or re.search(r'【[^】]+】|\[[^\]]+\]',n):tags.append('character')
 if cat in ['能力','能力值'] or re.fullmatch(r'生命力|集中力|耐力|力气|灵巧|智力|信仰|感应',split_name(n)[0]):tags.append('attributes')
 if re.search(r'卢恩|道具|出击|宝箱|商人|地图|封印监牢',n) or cat.startswith('出击'):tags.append('exploration')
 return tags
def build_catalog(effects):
 families=collections.OrderedDict();members={}
 for r in effects:
  base,tier=split_name(r['name']);fid='effect-'+hashlib.sha256(base.encode('utf-8')).hexdigest()[:16]
  f=families.setdefault(fid,{'id':fid,'name':base,'member_ids':[],'scope_ids':[],'tag_ids':[]})
  assert f['name']==base,'Family hash collision'
  f['member_ids'].append(r['id'])
  if r['scope'] not in f['scope_ids']:f['scope_ids'].append(r['scope'])
  tags=classify(r)
  for tag in tags:
   if tag not in f['tag_ids']:f['tag_ids'].append(tag)
  # Tier is nullable. A slash-separated source description does NOT create fabricated tiers.
  members[r['id']]={'family_id':fid,'tier':tier,'tags':tags}
 assert len(members)==len(effects)==sum(len(f['member_ids']) for f in families.values())
 return list(families.values()),members,TAGS

