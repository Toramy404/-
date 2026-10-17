"""Extend identities and explicit source panels without rewriting original samples."""
import json,re

def expand(root,data):
    read=lambda p:json.loads((root/p).read_text('utf-8'))
    index=read('docs/research/weapon-catalog-index-20261017.json')
    extra=read('docs/research/weapon-legendary-expansion-20261017.json')
    data['sources'].extend(index['sources'])
    by_id={w['id']:w for w in data['weapons']}
    field=lambda v,reason=None,state=None:dict(value=v,state=state or ('known' if v is not None else 'unknown'),reason=reason if v is None else None)
    for row in index['items']:
        refs=[dict(source_id=o['source_id'],locator=o['locator']+' · '+o['source_name'],url=o['url']) for o in row['identity_observations']]
        if row['id'] in by_id:
            w=by_id[row['id']]
            w['aliases']=sorted(set(w['aliases']+row['aliases']))
            w['source_refs'].extend(refs)
        else:
            w=dict(id=row['id'],name=row['name'],name_en=row['name_en'] or '',name_zh_status='source_index',aliases=row['aliases'],category=row['category'],category_en=row['category_en'],group=row['group'],description='',verification_status='source_reported',variant_ids=[],observation_ids=[],research_sample_id=None,known_gaps=['本条已收录名称与类别；面板、品质、战技和英文对应尚未完成采集。'],source_refs=refs)
            data['weapons'].append(w);by_id[w['id']]=w
        w['catalog_coverage']='panel' if w['variant_ids'] else 'identity'
        if row['effect_id'] and not any(l['weapon_id']==w['id'] for l in data['weapon_effect_links']):
            data['weapon_effect_links'].append(dict(id=w['id']+':legendary-effect',weapon_id=w['id'],effect_id=row['effect_id'],collection='legendary_weapon_effects',verification_status='source_reported'))
    for raw in extra['items']:
        w=by_id[raw['weapon_id']];sid='weapon-expansion:mobalytics-'+raw['slug'];oid=w['id']+':observation:1';vid=w['id']+':source-example'
        data['sources'].append(dict(id=sid,title='Mobalytics · '+raw['name_en'],url=raw['source_url'],accessed=raw['accessed'],version=None,note='逐页采集来源面板，未绑定游戏补丁、角色及强化条件。'))
        data['weapon_source_observations'].append(dict(id=oid,weapon_id=w['id'],source_id=sid,verification_status='source_reported',raw=raw))
        data['weapon_variants'].append(dict(id=vid,weapon_id=w['id'],observation_id=oid,source_id=sid,verification_status='source_reported',rarity_label=raw['rarity'],level_required=raw['level_required'],rarity_stats_binding_confirmed=False,attack={k:field(v) for k,v in raw['attack'].items()},critical=field(raw['critical']),guard=field(raw['guard']),scaling=dict(state='grades_displayed',grades=raw['scaling'],unlisted_attribute_grades=None),attack_types=raw['attack_types'],spell_power=field(None,'该武器不适用触媒法术威力。','not_applicable'),status=dict(state=raw['state'],effects=raw['status']),skill=field(raw['skill']),spells=field(None,'该武器不适用触媒法术栏。','not_applicable'),conditions=dict(patch=None,character=None,character_level=None,upgrade=None,buffs=None),null_reasons=dict(conditions='补丁、强化、角色及品质与数值绑定未完成核验。')))
        w.update(variant_ids=[vid],observation_ids=[oid],catalog_coverage='panel',known_gaps=['面板来自网页示例；补丁、强化、角色及品质与数值绑定尚未确认。'])
        w['source_refs'].insert(0,dict(source_id=sid,locator='Attack & Guard Stats / Scaling and More / Ashes of War'))
        if raw['cross_check']:
            c=raw['cross_check'];changes=[]
            labels={'物理':'physical','魔法':'magic','火':'fire','雷':'lightning','神圣':'holy','致命一击':'critical','力气':'strength','力量':'strength','灵巧':'dexterity','智力':'intelligence','信仰':'faith','感应':'arcane','失血':'blood_loss'}
            expected={**raw['attack'],**raw['scaling'],'critical':raw['critical'],**{e['type']:e['buildup'] for e in raw['status']}}
            for label,value in re.findall(r'(物理|魔法|火|雷|神圣|致命一击|力气|力量|灵巧|智力|信仰|感应|失血)：([0-9]+|[SABCDE])',' | '.join(c['raw_cells'])):
                key=labels[label];parsed=int(value) if value.isdigit() else value
                if key in expected and parsed!=expected[key]:changes.append(label+'：游侠网 '+value+'，Mobalytics '+str(expected[key]))
            w['comparison_note']='游侠网对照有差异：'+'；'.join(changes)+'。本页保留 Mobalytics 的独立面板，未混合取值。' if changes else '与游侠网可按名称定位的攻击、补正字段逐项比较一致；未列字段不计入比较，仍非游戏实测。'
        elif raw['slug']=='golden-order-greatsword':
            w['comparison_note']='游侠网汇总把物理44、圣102列在“骑士大剑”下，名称与面板错位；未将那一行作为本武器的独立核验。'
    assert len(data['weapons'])==len(index['items'])
    assert len({l['effect_id'] for l in data['weapon_effect_links']})==25
    return data
