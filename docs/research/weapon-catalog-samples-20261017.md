# 渡夜手册：武器图鉴首批资料包

创建人：dot  
整理日期：2026-10-17（北京时间）  
用途：先确定武器详情字段、来源和首批资料质量，供后续 APP 开发使用。当前是研究稿，不是已接入 APP 的生产数据库。

## 怎么读

先看《武器图鉴整理稿》中的字段方案，再看24件代表装备的资料卡。JSON保留来源观察，方便后续由程序转换；不能直接改名为 weapons.json 导入。近战与工具样本保留各自采集字段，统一生产结构在字段方案中定义，尚未执行迁移。

资料卡中的数值表达“该来源页面报告的面板”。它们不代表已经在当前游戏版本、指定角色和全部稀有度下实测通过。普通武器、传说武器、远程、施法工具和盾牌的字段用途不同，不能只按攻击力排序。

## 本轮边界与复用方式

- 所有关键记录保留 Nightreign 来源；没有用《艾尔登法环》本体数据填补空白。
- 未确认的版本、品质变体、掉落规则和角色条件保留待核验；不把未知值填成0。
- 网页文字只做必要、简短的事实整理与自行概括；没有打包网站图片、页面全文或完整数据库。公开可读不等于可批量再分发。
- 已有传说武器效果继续引用原ID与来源。既有社区数据状态仍为来源报告，不升级为实测。
- 当前仅交付资料，未修改应用界面、数据文件、GitHub分支或发布版本。

## 版本记录的例子

[官方2026-09-18公告](https://nightreign.eldenring.jp/article/260918_1.html)列出PS4/PS5的App 1.03.4与Regulation 1.03.5。它只能证明该平台公告中的版本，不能证明第三方武器页面适用于此数值版本。资料的访问日期、来源标注日期、游戏App版本、Regulation版本必须分别记录。

## 下一步更新建议

先把这一批资料中的名称、类型和来源链作为图鉴原型，数值以“来源报告，条件未完全核验”展示；未确认字段不参与排序或计算。逐步补齐每把武器的品质、强化状态、技能随机性与实测条件后，再开放同条件比较。上线前仍需确认资料使用边界、兼容旧收藏、验证筛选返回状态及Android断网冷启动。


---

# 资料核对记录

创建人：dot
核对日期：2026-10-17

24种装备、20类别；两份JSON语法通过，样本无重复，来源引用均可解析；7处既有传说效果关联保留完整legendary:XX。抽查蚁刺细剑、暗月大剑、手持弩炮、观星杖和卡利亚权杖的关键数值，与对应网页转录一致；六项庇佑与QuickRef记录一致。打刀物理66、出血30、力量E/灵巧S在两个站点字段一致，来源链未证明独立，不升级为实测。

这些是资料结构、引用及转录检查，不是游戏实测。24件均尚未完成当前补丁、品质/强化及角色条件绑定；11个工具类中文候选名仍待Nightreign中文实机核对。未运行应用代码测试、Android构建或设备验收，因为本轮没有实现功能或修改代码。


---

# 渡夜手册：12条近战武器研究样本

检索日期：2026-10-17。用途：字段、来源与缺口审阅；不可直接视为生产数据。

## 结论

- 选取12种近战类别，5项网页标为Common、1项Rare、6项Legendary。
- 每条面板均来自逐武器Mobalytics Nightreign详情页，数值放在JSON的source_observations，不命名为base_stats。
- 当前来源未锁定游戏补丁。网页的品质标签不证明其全部面板数值已绑定该品质/强化条件。
- 中文传奇名及6项庇佑以QuickRef为社区观察；其公式口径、提交版本及游戏内复核仍缺。
- 打刀是明确的语义风险样本：Mobalytics列Unsheathe，BWIKI写战技随机。不能生成固定技能。

## 索引与逐条缺口

| 中文 / English | 类别 | 来源品质 / 需求等级 | 战技记录的含义 | 主要缺口 |
|---|---|---|---|---|
| [战斧 / Battle Axe](https://mobalytics.gg/elden-ring-nightreign/wiki/weapons/battle-axe) | 斧 | common / 1 | 页面列 Wild Strikes；固定性未确认 | 数值条件、完整技能池；独有庇佑未建档 |
| [失乡骑士戟 / Banished Knight's Halberd](https://mobalytics.gg/elden-ring-nightreign/wiki/weapons/banished-knights-halberd) | 戟 | common / 1 | 页面列 Charge Forth；固定性未确认 | 数值条件、完整技能池；独有庇佑未建档 |
| [山贼弯刀 / Bandit's Curved Sword](https://mobalytics.gg/elden-ring-nightreign/wiki/weapons/bandits-curved-sword) | 曲剑 | common / 1 | 未列固有战技；页面说明随机 | 数值条件、完整技能池；独有庇佑未建档 |
| [蚁刺细剑 / Antspur Rapier](https://mobalytics.gg/elden-ring-nightreign/wiki/weapons/antspur-rapier) | 刺剑 | rare / 7 | 页面列 Impaling Thrust；固定性未确认 | 数值条件、完整技能池；独有庇佑未建档 |
| [打刀 / Uchigatana](https://mobalytics.gg/elden-ring-nightreign/wiki/weapons/uchigatana) | 刀 | common / 1 | 页面列 Unsheathe；另一来源写随机 | 数值条件、完整技能池；独有庇佑未建档 |
| [钩爪 / Hookclaws](https://mobalytics.gg/elden-ring-nightreign/wiki/weapons/hookclaws) | 爪 | common / 1 | 页面列 Quickstep；固定性未确认 | 数值条件、完整技能池；独有庇佑未建档 |
| [葛孚雷的王斧 / Axe Of Godfrey](https://mobalytics.gg/elden-ring-nightreign/wiki/weapons/axe-of-godfrey) | 特大武器 | legendary / 10 | 页面列 Regal Roar；固定性未确认 | 面板条件、庇佑版本/叠加与实测 |
| [暗月大剑 / Dark Moon Greatsword](https://mobalytics.gg/elden-ring-nightreign/wiki/weapons/dark-moon-greatsword) | 大剑 | legendary / 10 | 页面列 Moonlight Greatsword；固定性未确认 | 面板条件、庇佑版本/叠加与实测 |
| [玛莉卡的石槌 / Marika's Hammer](https://mobalytics.gg/elden-ring-nightreign/wiki/weapons/marikas-hammer) | 槌 | legendary / 10 | 页面列 Gold Breaker；固定性未确认 | 面板条件、庇佑版本/叠加与实测 |
| [弃子的繁星 / Bastard's Stars](https://mobalytics.gg/elden-ring-nightreign/wiki/weapons/bastards-stars) | 连枷 | legendary / 10 | 页面列 Nebula；固定性未确认 | 面板条件、庇佑版本/叠加与实测 |
| [古兰桑克斯的雷电 / Bolt Of Gransax](https://mobalytics.gg/elden-ring-nightreign/wiki/weapons/bolt-of-gransax) | 矛 | legendary / 10 | 页面列 Ancient Lightning Spear；固定性未确认 | 面板条件、庇佑版本/叠加与实测 |
| [接肢飞龙 / Grafted Dragon](https://mobalytics.gg/elden-ring-nightreign/wiki/weapons/grafted-dragon) | 拳头 | legendary / 10 | 页面列 Bear Witness；固定性未确认 | 面板条件、庇佑版本/叠加与实测 |

## 12条详细卡片

以下数值均为source_observation，即来源页面的显示记录。攻击按“物理 / 魔力 / 火 / 雷 / 圣”顺序列出；数字0是来源明确显示0。每张卡都缺少补丁、强化、角色及其等级、持握方式和随机属性条件，不能作为所有品质通用的基础值。补正仅列来源显示项目，未列属性不补造。

### 01. 战斧 · Battle Axe

- 类别：斧（Axe）；页面品质：普通 Common；需求等级：1。
- 攻击显示：77 / 0 / 0 / 0 / 0。
- 补正显示：力量B、灵巧C。物理攻击类型：普通。
- 固有异常显示：来源称无固有异常。随机异常词条另待核验。
- 页面战技：Wild Strikes；FP原页显示：2 > 10 > 15。中文技能名待核，固定掉落规则为null。
- 独有庇佑：尚未建立统一记录，保留null；不据此排除随机被动。
- 来源：[Nightreign详情页](https://mobalytics.gg/elden-ring-nightreign/wiki/weapons/battle-axe)；[中文名核对](https://agame01.com/article/54864165/)。
- 未知条件：补丁、强化、角色、持握与随机词条均未核；面板与页面品质的绑定关系未证实。 完整战技池与掉落条件待核。

### 02. 失乡骑士戟 · Banished Knight's Halberd

- 类别：戟（Halberd）；页面品质：普通 Common；需求等级：1。
- 攻击显示：86 / 0 / 0 / 0 / 0。
- 补正显示：力量B、灵巧C。物理攻击类型：普通 / 突刺。
- 固有异常显示：来源称无固有异常。随机异常词条另待核验。
- 页面战技：Charge Forth；FP原页显示：16。中文技能名待核，固定掉落规则为null。
- 独有庇佑：尚未建立统一记录，保留null；不据此排除随机被动。
- 来源：[Nightreign详情页](https://mobalytics.gg/elden-ring-nightreign/wiki/weapons/banished-knights-halberd)；[中文名核对](https://agame01.com/article/54864165/)。
- 未知条件：补丁、强化、角色、持握与随机词条均未核；面板与页面品质的绑定关系未证实。 完整战技池与掉落条件待核。

### 03. 山贼弯刀 · Bandit's Curved Sword

- 类别：曲剑（Curved Sword）；页面品质：普通 Common；需求等级：1。
- 攻击显示：73 / 0 / 0 / 0 / 0。
- 补正显示：力量D、灵巧A。物理攻击类型：斩击。
- 固有异常显示：来源称无固有异常。随机异常词条另待核验。
- 页面战技：未列固有战技；技能名与FP均为null。来源称可从曲剑适用技能中随机，伤害属性及异常亦可随机；完整池未给出。
- 独有庇佑：尚未建立统一记录，保留null；不据此排除随机被动。
- 来源：[Nightreign详情页](https://mobalytics.gg/elden-ring-nightreign/wiki/weapons/bandits-curved-sword)；[中文名核对](https://agame01.com/article/54864165/)。
- 未知条件：补丁、强化、角色、持握与随机词条均未核；面板与页面品质的绑定关系未证实。 完整战技池与掉落条件待核。

### 04. 蚁刺细剑 · Antspur Rapier

- 类别：刺剑（Thrusting Sword）；页面品质：稀有 Rare；需求等级：7。
- 攻击显示：88 / 0 / 0 / 0 / 0。
- 补正显示：力量E、灵巧S。物理攻击类型：普通 / 突刺。
- 固有异常显示：猩红腐败累积56。随机异常词条另待核验。
- 页面战技：Impaling Thrust；FP原页显示：9。中文技能名待核，固定掉落规则为null。
- 独有庇佑：尚未建立统一记录，保留null；不据此排除随机被动。
- 来源：[Nightreign详情页](https://mobalytics.gg/elden-ring-nightreign/wiki/weapons/antspur-rapier)；[中文名核对](https://agame01.com/article/54864165/)。
- 未知条件：补丁、强化、角色、持握与随机词条均未核；面板与页面品质的绑定关系未证实。 完整战技池与掉落条件待核。

### 05. 打刀 · Uchigatana

- 类别：刀（Katana）；页面品质：普通 Common；需求等级：1。
- 攻击显示：66 / 0 / 0 / 0 / 0。
- 补正显示：力量E、灵巧S。物理攻击类型：斩击 / 突刺。
- 固有异常显示：出血累积30。随机异常词条另待核验。
- 页面战技：Unsheathe；FP原页显示：0 > 10 > 15。中文技能名待核，固定掉落规则为null。
- 独有庇佑：尚未建立统一记录，保留null；不据此排除随机被动。
- 差异记录：BWIKI把战技写为随机，Mobalytics列Unsheathe；本样本不将后者确定为固定技能。
- 来源：[Nightreign详情页](https://mobalytics.gg/elden-ring-nightreign/wiki/weapons/uchigatana)；[中文名核对](https://wiki.biligame.com/nightreign/%E6%89%93%E5%88%80)。
- 未知条件：补丁、强化、角色、持握与随机词条均未核；面板与页面品质的绑定关系未证实。 完整战技池与掉落条件待核。

### 06. 钩爪 · Hookclaws

- 类别：爪（Claw）；页面品质：普通 Common；需求等级：1。
- 攻击显示：56 / 0 / 0 / 0 / 0。
- 补正显示：力量D、灵巧A。物理攻击类型：斩击 / 突刺。
- 固有异常显示：出血累积30。随机异常词条另待核验。
- 页面战技：Quickstep；FP原页显示：3。中文技能名待核，固定掉落规则为null。
- 独有庇佑：尚未建立统一记录，保留null；不据此排除随机被动。
- 来源：[Nightreign详情页](https://mobalytics.gg/elden-ring-nightreign/wiki/weapons/hookclaws)；[中文名核对](https://agame01.com/article/54864165/)。
- 未知条件：补丁、强化、角色、持握与随机词条均未核；面板与页面品质的绑定关系未证实。 完整战技池与掉落条件待核。

### 07. 葛孚雷的王斧 · Axe Of Godfrey

- 类别：特大武器（Colossal Weapon）；页面品质：传说 Legendary；需求等级：10。
- 攻击显示：181 / 0 / 0 / 0 / 0。
- 补正显示：力量S。物理攻击类型：普通。
- 固有异常显示：来源称无固有异常。随机异常词条另待核验。
- 页面战技：Regal Roar；FP原页显示：25。中文技能名待核，固定掉落规则为null。
- 庇佑观察：初始之王的庇佑。触发记录：蓄力攻击；攻击力增幅20%，维持15秒。
- 既有应用关联编号：legendary:23。仅作身份关联，新抓main不代表旧快照已更新。
- 来源：[Nightreign详情页](https://mobalytics.gg/elden-ring-nightreign/wiki/weapons/axe-of-godfrey)；[中文名及庇佑](https://github.com/xxiixi/NightreignQuickRef/blob/main/src/data/zh-CN/weapon_effect.json)。
- 未知条件：补丁、强化、角色、持握与随机词条均未核；面板与页面品质的绑定关系未证实。 庇佑叠加、作用范围及伤害公式口径待实测。

### 08. 暗月大剑 · Dark Moon Greatsword

- 类别：大剑（Greatsword）；页面品质：传说 Legendary；需求等级：10。
- 攻击显示：53 / 79 / 0 / 0 / 0。
- 补正显示：力量B、灵巧C、智力C。物理攻击类型：普通 / 突刺。
- 固有异常显示：冻伤累积52。随机异常词条另待核验。
- 页面战技：Moonlight Greatsword；FP原页显示：32。中文技能名待核，固定掉落规则为null。
- 庇佑观察：暗月的庇佑。触发记录：攻击命中；目标魔力受伤增幅15%，维持20秒。
- 既有应用关联编号：legendary:02。仅作身份关联，新抓main不代表旧快照已更新。
- 来源：[Nightreign详情页](https://mobalytics.gg/elden-ring-nightreign/wiki/weapons/dark-moon-greatsword)；[中文名及庇佑](https://github.com/xxiixi/NightreignQuickRef/blob/main/src/data/zh-CN/weapon_effect.json)。
- 未知条件：补丁、强化、角色、持握与随机词条均未核；面板与页面品质的绑定关系未证实。 庇佑叠加、作用范围及伤害公式口径待实测。

### 09. 玛莉卡的石槌 · Marika's Hammer

- 类别：槌（Hammer）；页面品质：传说 Legendary；需求等级：10。
- 攻击显示：74 / 0 / 0 / 0 / 49。
- 补正显示：力量B、灵巧D、信仰D。物理攻击类型：打击。
- 固有异常显示：来源称无固有异常。随机异常词条另待核验。
- 页面战技：Gold Breaker；FP原页显示：26。中文技能名待核，固定掉落规则为null。
- 庇佑观察：女王的庇佑。触发记录：蓄力攻击；附加地面冲击；源表列56圣、5削韧。
- 既有应用关联编号：legendary:15。仅作身份关联，新抓main不代表旧快照已更新。
- 来源：[Nightreign详情页](https://mobalytics.gg/elden-ring-nightreign/wiki/weapons/marikas-hammer)；[中文名及庇佑](https://github.com/xxiixi/NightreignQuickRef/blob/main/src/data/zh-CN/weapon_effect.json)。
- 未知条件：补丁、强化、角色、持握与随机词条均未核；面板与页面品质的绑定关系未证实。 庇佑叠加、作用范围及伤害公式口径待实测。

### 10. 弃子的繁星 · Bastard's Stars

- 类别：连枷（Flail）；页面品质：传说 Legendary；需求等级：10。
- 攻击显示：58 / 68 / 0 / 0 / 0。
- 补正显示：力量C、灵巧B、智力D。物理攻击类型：打击。
- 固有异常显示：来源称无固有异常。随机异常词条另待核验。
- 页面战技：Nebula；FP原页显示：25。中文技能名待核，固定掉落规则为null。
- 庇佑观察：黑暗的庇佑。触发记录：攻击时概率触发；连爆3次；每爆列39普通伤害、3削韧。
- 既有应用关联编号：legendary:17。仅作身份关联，新抓main不代表旧快照已更新。
- 来源：[Nightreign详情页](https://mobalytics.gg/elden-ring-nightreign/wiki/weapons/bastards-stars)；[中文名及庇佑](https://github.com/xxiixi/NightreignQuickRef/blob/main/src/data/zh-CN/weapon_effect.json)。
- 未知条件：补丁、强化、角色、持握与随机词条均未核；面板与页面品质的绑定关系未证实。 庇佑叠加、作用范围及伤害公式口径待实测。

### 11. 古兰桑克斯的雷电 · Bolt Of Gransax

- 类别：矛（Spear）；页面品质：传说 Legendary；需求等级：10。
- 攻击显示：74 / 0 / 0 / 49 / 0。
- 补正显示：力量C、灵巧B。物理攻击类型：突刺。
- 固有异常显示：来源称无固有异常。随机异常词条另待核验。
- 页面战技：Ancient Lightning Spear；FP原页显示：24。中文技能名待核，固定掉落规则为null。
- 庇佑观察：大古龙的庇佑。触发记录：完成蓄力战技；获得40.2雷攻击力，维持30秒。
- 既有应用关联编号：legendary:19。仅作身份关联，新抓main不代表旧快照已更新。
- 来源：[Nightreign详情页](https://mobalytics.gg/elden-ring-nightreign/wiki/weapons/bolt-of-gransax)；[中文名及庇佑](https://github.com/xxiixi/NightreignQuickRef/blob/main/src/data/zh-CN/weapon_effect.json)。
- 未知条件：补丁、强化、角色、持握与随机词条均未核；面板与页面品质的绑定关系未证实。 庇佑叠加、作用范围及伤害公式口径待实测。

### 12. 接肢飞龙 · Grafted Dragon

- 类别：拳头（Fist）；页面品质：传说 Legendary；需求等级：10。
- 攻击显示：63 / 0 / 42 / 0 / 0。
- 补正显示：力量B、灵巧C、信仰C。物理攻击类型：打击。
- 固有异常显示：来源称无固有异常。随机异常词条另待核验。
- 页面战技：Bear Witness；FP原页显示：20。中文技能名待核，固定掉落规则为null。
- 庇佑观察：飞龙的庇佑。触发记录：处决；引发火焰爆炸；燃烧段60%、爆炸段300%。
- 既有应用关联编号：legendary:22。仅作身份关联，新抓main不代表旧快照已更新。
- 来源：[Nightreign详情页](https://mobalytics.gg/elden-ring-nightreign/wiki/weapons/grafted-dragon)；[中文名及庇佑](https://github.com/xxiixi/NightreignQuickRef/blob/main/src/data/zh-CN/weapon_effect.json)。
- 未知条件：补丁、强化、角色、持握与随机词条均未核；面板与页面品质的绑定关系未证实。 庇佑叠加、作用范围及伤害公式口径待实测。

## 来源与可信度

- Mobalytics：12条均已逐页读到Nightreign标题、稀有度文字、等级、攻击/补正和战技区。详情链接已在上表逐条给出；本轮没有从武器总览批量复制数据。
- QuickRef：https://github.com/xxiixi/NightreignQuickRef/blob/main/src/data/zh-CN/weapon_effect.json。仅用于6项传说武器的中文名、类别及庇佑；未取得提交哈希或游戏版本。
- 普通武器中文名补充核对：[Nightreign中文图鉴转载](https://agame01.com/article/54864165/)，仅取战斧、失乡骑士戟、山贼弯刀、蚁刺细剑、钩爪的名称/类别，并将繁体转为简体；未用其数字。
- [BWIKI打刀](https://wiki.biligame.com/nightreign/%E6%89%93%E5%88%80)：页面标注2026-01-30更新，旧版本号oldid=1983。明确写战技随机；其更新日期不代表游戏版本。

## 字段约定

- source_observations：保持来源独立；不按来源优先级悄悄覆盖冲突。
- attack_rating_display：页面显示攻击值，分物理/魔力/火/雷/圣。不是最终伤害或跨角色可比的最终面板。
- innate_status_display：页面称固有的异常及显示累积值；空数组仅表示该页明确称无固有异常，不否定随机异常词条。
- skill_display：英文列名及FP显示文字；中文技能名尚未独立核验，保留null。组合FP文本未强行拆成阶段。
- canonical_stats / fixed_skill / full_skill_pool / canonical_unique_blessing / drop_locations：均为null，尚无足够证据建立统一游戏真值。
- numeric_conditions：补丁、强化、角色、姿势、随机属性缺失时写null。网页Common/Rare/Legendary写入上下文，并另设stats_tied_to_label_confirmed=false。

## 下一步核验顺序

1. 用当前补丁同名实物逐条确认品质、强化与面板截图，记录角色与等级。
2. 把随机战技与专属战技分开核验；打刀、山贼弯刀优先做反例。
3. 固定QuickRef提交哈希；庇佑倍率参考量、刷新/叠加/作用范围再建立独立测试字段。
4. 补官方简中名称与别名映射；暂不改变12条英文身份键。

机器可读文件：melee-12-source-observations.json。

既有应用关联编号由本项目提供；QuickRef当前main与应用历史快照是不同来源状态，不能仅凭编号相同视作内容同步。


---

# 渡夜手册：非近战、触媒与盾牌字段来源样本

研究日期：2026-10-17。12条研究样本，供字段与来源评审；不可直接作为生产数据或当前版本定值。未使用《艾尔登法环》本体资料补齐。

## 统一条件与读法

- 所有数字都是外部页面展示样本（source_observation），不是已验证基础属性。来源未标明游戏版本、角色、角色等级、升级/增益或模式条件。
- 每卡的品质与等级只是该页面展示条件；同名武器其它掉落实例未必相同。页面列出的战技暂不认定为固定战技。
- 攻击面板和防御面板分别列出物理、魔力、火、雷、圣；致命攻击与防御强度单列。远程防御栏的0只保留来源显示，实际适用性待核验。
- 触媒的Spell Power是独立字段，不等同于武器攻击面板或某个法术的实际伤害。FP多段数字按来源显示保存，不猜测各段含义。
- “无固有异常”只描述页面原始样本，不排除遗物或随机掉落增加异常；“未报告”不代表0。
- 中文名加“†”的是候选译名，未用Nightreign中文实机确认；英文名用于稳定识别。
- 所有样本统一待核验：当前版本、品质变化、升级/增益条件、角色及模式；非触媒再核对战技固定性，触媒再核对Spell Power口径。

## 12张资料卡

### 01 铁之眼的弓† / Ironeye's Bow

- 类别：弓（Bow）；攻击类型：突刺。
- 页面样本条件：普通（common）；要求等级 1。
- 用途与特点：远距射击；可作远程救援工具。页面以灵巧补正为主。
- 攻击面板：物理 45、魔力 0、火 0、雷 0、圣 0；致命攻击 100。
- 防御面板：物理 0、魔力 0、火 0、雷 0、圣 0；防御强度 0。
- 补正：力气 E、灵巧 S。施法威力不适用。
- 异常：来源明确无固有异常。
- 战技/法术：Mighty Shot；FP显示 0 > 6 > 6；是否固定待核。
- 数值与身份来源：[Ironeye's Bow · Nightreign详情页](https://mobalytics.gg/elden-ring-nightreign/wiki/weapons/ironeyes-bow)；对应简介、Attack & Guard Stats、Scaling and More、Ashes of War and Spells。

### 02 黑弓† / Black Bow

- 类别：弓（Bow）；攻击类型：突刺。
- 页面样本条件：稀有/紫（rare，中文品质名待核）；要求等级 7。
- 用途与特点：移动射击；连续出箭。体型属弓，说明强调轻弓式灵活操作。
- 攻击面板：物理 73、魔力 0、火 0、雷 0、圣 0；致命攻击 100。
- 防御面板：物理 0、魔力 0、火 0、雷 0、圣 0；防御强度 0。
- 补正：力气 E、灵巧 S。施法威力不适用。
- 异常：来源明确无固有异常。
- 战技/法术：Barrage；FP显示 0 > 2 > 2；是否固定待核。
- 数值与身份来源：[Black Bow · Nightreign详情页](https://mobalytics.gg/elden-ring-nightreign/wiki/weapons/black-bow)；对应简介、Attack & Guard Stats、Scaling and More、Ashes of War and Spells。

### 03 滑轮弩† / Pulley Crossbow

- 类别：弩（Crossbow）；攻击类型：突刺。
- 页面样本条件：稀有/紫（rare，中文品质名待核）；要求等级 7。
- 用途与特点：远距连射；备用远程武器。一次操作连发弩箭；页面明确无属性补正。
- 攻击面板：物理 106、魔力 0、火 0、雷 0、圣 0；致命攻击 100。
- 防御面板：物理 0、魔力 0、火 0、雷 0、圣 0；防御强度 0。
- 补正：来源明确无属性补正。施法威力不适用。
- 异常：来源明确无固有异常。
- 战技/法术：Kick；FP显示 0；是否固定待核。
- 数值与身份来源：[Pulley Crossbow · Nightreign详情页](https://mobalytics.gg/elden-ring-nightreign/wiki/weapons/pulley-crossbow)；对应简介、Attack & Guard Stats、Scaling and More、Ashes of War and Spells。

### 04 手持弩炮† / Hand Ballista

- 类别：弩炮（Ballista）；攻击类型：突刺。
- 页面样本条件：优良/蓝（uncommon，中文品质名待核）；要求等级 3。
- 用途与特点：发射大弩箭。页面明确无属性补正。
- 攻击面板：物理 431、魔力 0、火 0、雷 0、圣 0；致命攻击 100。
- 防御面板：物理 0、魔力 0、火 0、雷 0、圣 0；防御强度 0。
- 补正：来源明确无属性补正。施法威力不适用。
- 异常：来源明确无固有异常。
- 战技/法术：Kick；FP显示 0；是否固定待核。
- 数值与身份来源：[Hand Ballista · Nightreign详情页](https://mobalytics.gg/elden-ring-nightreign/wiki/weapons/hand-ballista)；对应简介、Attack & Guard Stats、Scaling and More、Ashes of War and Spells。

### 05 壶大炮† / Jar Cannon

- 类别：弩炮（Ballista）；攻击类型：突刺。
- 页面样本条件：稀有/紫（rare，中文品质名待核）；要求等级 7。
- 用途与特点：重型远距射击。装填较慢；页面明确无属性补正。
- 攻击面板：物理 584、魔力 0、火 0、雷 0、圣 0；致命攻击 100。
- 防御面板：物理 0、魔力 0、火 0、雷 0、圣 0；防御强度 0。
- 补正：来源明确无属性补正。施法威力不适用。
- 异常：来源明确无固有异常。
- 战技/法术：Kick；FP显示 0；是否固定待核。
- 数值与身份来源：[Jar Cannon · Nightreign详情页](https://mobalytics.gg/elden-ring-nightreign/wiki/weapons/jar-cannon)；对应简介、Attack & Guard Stats、Scaling and More、Ashes of War and Spells。

### 06 观星杖† / Astrologer's Staff

- 类别：法杖（Glintstone Staff）；攻击类型：打击。
- 页面样本条件：普通（common）；要求等级 1。
- 用途与特点：施放魔法。法术组合随机；近战面板与Spell Power分开保存。
- 攻击面板：物理 25、魔力 0、火 0、雷 0、圣 0；致命攻击 100。
- 防御面板：物理 100、魔力 15、火 15、雷 15、圣 15；防御强度 15。
- 补正：智力 S。施法威力（Spell Power）：133，计算条件未知。
- 异常：未报告固有异常，数值未知。
- 战技/法术：无固有战技；附两项随机法术，名称未知。
- 数值与身份来源：[Astrologer's Staff · Nightreign详情页](https://mobalytics.gg/elden-ring-nightreign/wiki/catalysts/astrologers-staff)；对应简介、Attack & Guard Stats、Scaling and More、Ashes of War and Spells。

### 07 卡利亚权杖 / Carian Regal Scepter

- 类别：法杖（Glintstone Staff）；攻击类型：打击。
- 页面样本条件：传说（金）；要求等级 10。
- 用途与特点：施放魔法。传奇触媒；可关联已有传奇条目。
- 攻击面板：物理 23、魔力 0、火 0、雷 0、圣 0；致命攻击 100。
- 防御面板：物理 100、魔力 15、火 15、雷 15、圣 15；防御强度 15。
- 补正：智力 S。施法威力（Spell Power）：205，计算条件未知。
- 异常：未报告固有异常，数值未知。
- 战技/法术：无固有战技；附两项随机法术，名称未知。
- 数值与身份来源：[Carian Regal Scepter · Nightreign详情页](https://mobalytics.gg/elden-ring-nightreign/wiki/catalysts/carian-regal-scepter)；对应简介、Attack & Guard Stats、Scaling and More、Ashes of War and Spells。
- 关联：现库 legendary:24（主任务提供，本样本未改库）。[QuickRef](https://github.com/xxiixi/NightreignQuickRef/blob/main/src/data/zh-CN/weapon_effect.json)侧证中文名与法杖类别。

### 08 爪痕圣印记† / Clawmark Seal

- 类别：圣印记（Sacred Seal）；攻击类型：打击。
- 页面样本条件：优良/蓝（uncommon，中文品质名待核）；要求等级 3。
- 用途与特点：施放祷告；具体输出或辅助用途看所附祷告。页面补正为信仰S。
- 攻击面板：物理 31、魔力 0、火 0、雷 0、圣 0；致命攻击 100。
- 防御面板：物理 100、魔力 15、火 15、雷 15、圣 15；防御强度 15。
- 补正：信仰 S。施法威力（Spell Power）：197，计算条件未知。
- 异常：未报告固有异常，数值未知。
- 战技/法术：无固有战技；附两项随机法术，名称未知。
- 数值与身份来源：[Clawmark Seal · Nightreign详情页](https://mobalytics.gg/elden-ring-nightreign/wiki/catalysts/clawmark-seal)；对应简介、Attack & Guard Stats、Scaling and More、Ashes of War and Spells。

### 09 龙飨印记† / Dragon Communion Seal

- 类别：圣印记（Sacred Seal）；攻击类型：打击。
- 页面样本条件：稀有/紫（rare，中文品质名待核）；要求等级 7。
- 用途与特点：施放祷告。页面补正为信仰S；不据名称推断额外加成。
- 攻击面板：物理 25、魔力 0、火 0、雷 0、圣 0；致命攻击 100。
- 防御面板：物理 100、魔力 15、火 15、雷 15、圣 15；防御强度 15。
- 补正：信仰 S。施法威力（Spell Power）：220，计算条件未知。
- 异常：未报告固有异常，数值未知。
- 战技/法术：无固有战技；附两项随机法术，名称未知。
- 数值与身份来源：[Dragon Communion Seal · Nightreign详情页](https://mobalytics.gg/elden-ring-nightreign/wiki/catalysts/dragon-communion-seal)；对应简介、Attack & Guard Stats、Scaling and More、Ashes of War and Spells。

### 10 小圆盾† / Buckler

- 类别：小盾（Small Shield）；攻击类型：打击。
- 页面样本条件：普通（common）；要求等级 1。
- 用途与特点：防御；抓准时机弹反。页面列专属弹反名称；固定性仍待核验。
- 攻击面板：物理 49、魔力 0、火 0、雷 0、圣 0；致命攻击 100。
- 防御面板：物理 100、魔力 41、火 41、雷 21、圣 41；防御强度 42。
- 补正：力气 B、灵巧 C。施法威力不适用。
- 异常：来源明确无固有异常。
- 战技/法术：Buckler Parry；FP显示 0；是否固定待核。
- 数值与身份来源：[Buckler · Nightreign详情页](https://mobalytics.gg/elden-ring-nightreign/wiki/shields/buckler)；对应简介、Attack & Guard Stats、Scaling and More、Ashes of War and Spells。

### 11 黄铜盾† / Brass Shield

- 类别：中盾（Medium Shield）；攻击类型：打击。
- 页面样本条件：普通（common）；要求等级 1。
- 用途与特点：防御。页面明确战技及攻击属性、异常可能随掉落变化。
- 攻击面板：物理 88、魔力 0、火 0、雷 0、圣 0；致命攻击 100。
- 防御面板：物理 100、魔力 46、火 49、雷 32、圣 45；防御强度 75。
- 补正：力气 A、灵巧 D。施法威力不适用。
- 异常：来源明确无固有异常。
- 战技/法术：可附可用中盾战技，页面未指定；FP未知。
- 数值与身份来源：[Brass Shield · Nightreign详情页](https://mobalytics.gg/elden-ring-nightreign/wiki/shields/brass-shield)；对应简介、Attack & Guard Stats、Scaling and More、Ashes of War and Spells。

### 12 蚂蚁头盾† / Ant's Skull Plate

- 类别：大盾（Greatshield）；攻击类型：打击。
- 页面样本条件：普通（common）；要求等级 1。
- 用途与特点：防御；盾击附带中毒积累。适合测试盾牌同时具备防御、攻击和异常三个字段组。
- 攻击面板：物理 113、魔力 0、火 0、雷 0、圣 0；致命攻击 100。
- 防御面板：物理 100、魔力 64、火 48、雷 64、圣 64；防御强度 78。
- 补正：力气 A、灵巧 D。施法威力不适用。
- 异常：页面列固有中毒积累 84。
- 战技/法术：Shield Bash；FP显示 10；是否固定待核。
- 数值与身份来源：[Ant's Skull Plate · Nightreign详情页](https://mobalytics.gg/elden-ring-nightreign/wiki/shields/ants-skull-plate)；对应简介、Attack & Guard Stats、Scaling and More、Ashes of War and Spells。

## 交叉核验与限制

- [官方Starter Guide HTML](https://en.bandainamcoent.eu/elden-ring/news/elden-ring-nightreign-the-official-starter-guide)（2025-06-17）已实读Armaments和Easier Revival章节：前者说明装备生成可随机，后者说明弓弩可远距救援。这是历史机制说明，不能认证当前版本面板。
- [官方PDF](https://media-center.bandainamcoent.eu/games/elden-ring-nightreign/ERN_FuturePress_StarterGuide.pdf)的搜索索引摘录写有蓝3、紫7、金10门槛；全文因58.7MB超工具限制未能打开，未核页码。这里仅列为待复核线索，各卡等级仍直接来自各自Mobalytics详情页。
- [QuickRef传奇武器数据](https://github.com/xxiixi/NightreignQuickRef/blob/main/src/data/zh-CN/weapon_effect.json)只用于卡利亚权杖中文名与类别，不复制其长效果或把未说明条件的角色面板数字拼入样本。
- [BWIKI武器总览](https://wiki.biligame.com/nightreign/%E6%AD%A6%E5%99%A8%E6%80%BB%E8%A7%88)搜索索引能核对类别目录；射击、触媒、盾牌分区仍无具体条目，直接页面两次超时，因此不能逐件侧证。
- 12条面板数字仍是单一Mobalytics来源观察；没有完成独立第二来源的逐数值复核。11个中文候选名待核验。

配套JSON：weapon-tools.json。JSON另保留逐组来源、null原因、条件与待核验项。


---

# 渡夜手册首批武器图鉴字段与验收方案

创建人：dot  
日期：2026-10-17  
范围：先整理20–30个武器本体及可追溯资料，评审后再改界面。本文件只提出方案，未修改仓库、数据包或收藏。

## 结论

首批按“武器本体 → 条件变体 → 来源观察”分层，战技随机性单独记录。现有25条传说武器记录是固有效果资料，不是完整武器属性表；保留它们的原集合、ID、描述、来源和收藏键，通过关联表接入新图鉴。缺项可收录为待补，不把来源收录、跨表一致或代码测试通过写成现版实测。

## 已核对的仓库边界

本次读取主分支，核对时提交为 `0cc472f34cfb03f1d2c10566ff626a61138a5b3d`。

- `data/collections.json` 目前登记27个集合，含 `legendary_weapon_effects`，没有通用 `weapons` 集合。生成器只读取清单中的文件，不自动扫描目录。
- `data/legendary_weapon_effects.json` 共25条，全部为 `source_reported`。现有字段是 `id/name/weapon_type/effect_name/description/poise_damage_text/source_refs/verification_status`。
- 这25条均指向 `quickref`，定位到 `src/data/zh-CN/weapon_effect.json/<武器名>`。来源固定提交为 `3e23450094c18125ae5665927ed240b18189a040`；登记的“自报1.03.4 / Jan 16 2026”是来源自报，不是本次重新实测或最新版本承诺。
- `dist/app.js` 收藏格式是 `集合名|记录ID`，存在键如 `legendary_weapon_effects|legendary:01`。找不到原集合或ID时，解析收藏会丢掉该条展示。
- `dist/catalog.js` 通用搜索读取顶层 `name/name_en/aliases/description/effect_name` 等字段。它不读取本方案的嵌套变体、证据或技能池；类别、品质、版本筛选也不能仅靠加JSON自动获得。
- `effect_families/effect_members/effect_tags` 只为 `effects` 派生。不要把武器塞进这个体系；同名武器不等于同一个词条档位组。
- 当前资料版本是 `2026.10.14-r2`。后续真正接入资料时再按 `docs/DATA.md` 更新 `meta.dataVersion/date` 及修正或问题记录，不把资料稿日期当作游戏版本。

## 四个概念的边界

| 概念 | 表示什么 | 不能表示什么 |
| --- | --- | --- |
| `identity` | 一把武器的稳定本体：内部ID、规范名、英文名、别名、武器类型、来源中的对象ID | 某张截图上的最终面板、当前角色、一次随机掉落结果 |
| `variant` | 有明确证据区分的品质、强化档、附加属性或固定配置等条件组合；指回同一武器本体 | 每多一个来源就生成一个变体；看到数值不同便猜一个品质 |
| `source_observation` | 某来源在某日期、版本与条件下，对具体字段报告了什么；保留原文和数值 | 全武器、全版本的最终真值；采集日期也不是游戏版本 |
| `skill_random` | 指定变体与获得条件下，战技是否会随机分配；独立于随机被动词条、掉落随机和固有效果 | “未写战技”＝随机；“有一个战技示例”＝战技固定；传说庇佑＝战技 |

同一武器、同一条件下两个来源数值不同：保留两个 observation 并标冲突，不强行拆为变体。同名但类型或来源对象ID不同：先列身份待核，不自动合并。角色或持握方式改变面板时，通常记录 observation 的测量条件，不复制一个新的武器本体。

这一分层也有机制依据：2025-06-17发布的[官方入门指南 Armaments 一节](https://en.bandainamcoent.eu/elden-ring/news/elden-ring-nightreign-the-official-starter-guide)说明，出征装备可带随机强化、战技、属性、异常和被动，同时部分装备有固定性质。因此，资料页列出的单个战技或面板不能直接视为全配置固定值。这份初期指南不单独证明现版深夜模式、某把武器或全部品质的规则。

## 最小可执行字段

以下是拟议字段，尚未进入仓库。新ID在首批评审时一次分配，之后不可因名称、排序、翻译或数值修正改变。

### 武器本体 identity

| 字段 | 要求 |
| --- | --- |
| `id` | 项目新武器命名空间，例如 `weapon:` 前缀；不得借用或重编 `legendary:XX`。具体ID由样本表统一分配 |
| `name`, `name_en`, `aliases` | 中文规范名必填；英文和别名按证据填写。保留来源原名；未查明英文名不自译为已核事实 |
| `weapon_type` | 保留来源原分类及标准化映射；不把“槌/大槌”“弓/大弓”自动合并 |
| `external_ids` | 可选的来源对象ID，包含 `source_id/id`；只能登记实际读到的值 |
| `availability` | 本体/DLC及模式范围，按字段状态填写；不因同名武器出现在《艾尔登法环》本体就认定渡夜存在 |
| `source_refs` | 至少一条实际可定位的武器身份依据；沿用 `source_id + locator` 形式 |
| `description` | 可选的简短检索摘要，不承载跨条件唯一数值，不替代原文证据 |

将来运行时推荐让这些字段保持顶层，以便接入现有搜索；身份名称正确不代表属性数值已核。

### 条件变体 variant

必填：`id`、`weapon_id`、`scope`、`claims`、`source_observation_ids`。

- `scope` 至少包含：`game_app_version`、`regulation_version`、`platform`、`mode`、`quality`、`upgrade_level`、`affinity`。每项都使用下节的值状态；不强制为未知条件编一个值。
- `quality` 是来源明确给出的品质；`upgrade_level` 是武器强化档；`minimum_character_level` 是使用门槛；`character_level` 是观察时角色等级。四者分别记录，不能相互推导或共用“等级”一列。初期指南中的品质使用门槛若收录，只作为带日期和模式范围的来源观察，不能硬编码为全版本规则。
- `claims` 按字段保存规范化主张、证据和核验状态。首批优先：攻击力分项、能力加成、战技名称与随机性、固有效果关联、获得方式。没有证据的列留待补。
- 攻击力明确区分基础值、能力加成、面板合计及实测伤害；每个数值保留单位、伤害属性、原始表达式、是否近似。不把面板攻击直接称为对敌伤害，不自动合计或反推缺失分项。
- 需求属性、防御、异常积累、重量等只有在渡夜来源确实给出且口径明确时收录；不得整套搬用本体武器表。
- 单次截图只支持“此实例观察到该配置”；若配置是否可重复、是否属于固定变体仍不明确，先保留 observation，不发布一个假定稳定的 variant。

### 来源观察 source_observation

每条必填：`id`、`weapon_id`、`variant_id`（未归属时可为空并说明）、`field_path`、`value_raw`、规范化值状态、`source_refs`、`retrieved_at_utc`、`context`、`verification_status`。

- `source_refs` 指向来源登记表：作者/站点、URL、页面或表页/行/单元格/时间戳、固定commit或修订号、许可与引用边界。全文或截图实际未保存时，不虚填本地证据路径。
- `context` 分别记录 App版本、Regulation版本、平台、游戏模式、品质、强化档、角色ID、角色等级、实际能力值、单/双持、双武器、遗物/被动/临时buff及目标条件。无关条件可标不适用；来源未交代则未知。
- 一条观察可以有多个字段，但必须能逐字段说明支持范围；首批采用一字段一行最易审核。
- 记录 `source_lineage` 或 `independence_note`：转载或同一底层数据链不能计作两个独立来源。
- 可加 `observed_at`（游戏观察发生日）与 `checked_at/checked_by/method`（本次核对）。三种时间不可混用。

### 战技随机性 skill_random

使用带状态的布尔值：已知随机为 `true`；有证据固定为 `false`；不知道为 `null + unknown`。只有明确不属于战技概念或无此机制，才标 `not_applicable`；“无战技”如为具体技能名，仍按来源记录，不能一律当作不适用。

同时记录 `skill_name/skill_id`、`skill_pool`、`pool_completeness`（完整/仅观察到部分/未知）、`acquisition_conditions` 和 `source_observation_ids`。技能ID仅用已实际存在或本批正式分配的ID。候选池不附未经验证的概率，不把可出现池当作等概率抽取。

若A页列一个技能、B页称战技随机，两项可能分别描述默认/示例配置与抽取规则；先核对语义和条件，不能直接判A正确或将A的技能写成固定。没有明确固定证据时，`skill_random` 不填 `false`。

## 空值和核验状态

每个可缺失字段使用 `{ value, value_state, reason }`，有来源时再加 `source_observation_ids`。`value_state` 与 `verification_status` 是两条独立维度。

| value_state | value | 含义与显示 |
| --- | --- | --- |
| `known` | 实际值，可为 `0`、`false` 或明确的空集合 | 来源有明确陈述；仍可能仅为单一来源或存在冲突 |
| `unknown` | `null` | 适用性或数值尚未查明，显示“未知/待补”；不能算作零、否或不存在 |
| `not_applicable` | `null` | 已确认该字段在此对象/条件下不适用；必须写理由及依据，显示“不适用” |

不接受裸 `null`、空字符串或 `-` 作为新规范化字段的完整语义。原资料中的 `-` 必须在 `value_raw` 原样保留；未查明含义前，规范化为 `unknown`。已有 `poise_damage_text: "0"` 与 `"-"` 不能合并处理。`[]` 也只有明确“没有任何成员”才是已知空集合。

### 已核验必须说明核了什么

- `source_reported`：已读并准确转录某来源，未完成独立验证。现有25条传说效果保持此状态。
- `needs_verification`：缺版本/条件/对象映射等关键证据，或仅有待查线索。
- `cross_checked`：所列字段在相同或已证明可比条件下完成跨来源比较，保留逐字段比较结论、来源链与方法。不得自动升级为游戏实测。
- `conflict`：同一字段在可比条件下仍不一致。并列原值和出处，单一展示值留空或明确标为暂用，不能悄悄覆盖。
- `corrected_from_source_comparison`：记录被依据对照修正；必须留下旧值、新值、理由及证据，不表示其他字段都正确。

首批沿用这些已有状态值。实测用独立 `verification_method: in_game_test` 与实验记录表达，避免直接增加一个现界面不识别的“verified”状态。只有相应字段在明确版本、平台、角色和测试条件下确实验证，才可显示“已核验：字段名 + 范围”。“身份已核”“数值跨表一致”“游戏实测”分别表述；整条武器不可用一个绿色徽章掩盖缺项。

未来接界面时必须明确显示 `source_reported`；现有 `badge()` 对它返回空串，不能沿用为空就让人误以为全部已核。资料被复制到新图鉴也不继承更高可信度。

## 现有传说效果关联与收藏兼容

拟新增关系表 `weapon_effect_links`：`weapon_id`、`variant_id`（只限特定变体时填写）、`effect_collection`、`effect_id`、`relation_type`、`source_refs`、`verification_status`。`relation_type` 可用 `inherent_effect`；本表只关联，不复制重算效果数值。`effect_collection` 此处固定为已有 `legendary_weapon_effects`。

下面是现有25条的确切映射目标。左列名称只用于人工核对身份；正式关系表以新分配的武器ID连接右列，不能运行时仅按中文名称猜配。

| 武器名 | 已存在的 effect_id |
| --- | --- |
| 夜与火之剑 | `legendary:01` |
| 暗月大剑 | `legendary:02` |
| 神躯化剑 | `legendary:03` |
| 玛雷家行刑剑 | `legendary:04` |
| 黄金律法大剑 | `legendary:05` |
| 亵渎圣剑 | `legendary:06` |
| 遗迹大剑 | `legendary:07` |
| 剑骸大剑 | `legendary:08` |
| 碎星大剑 | `legendary:09` |
| 玛利喀斯的黑剑 | `legendary:10` |
| 龙王岩剑 | `legendary:11` |
| 蒙葛特咒剑 | `legendary:12` |
| 玛莲尼亚义手刃 | `legendary:13` |
| 展翼大角 | `legendary:14` |
| 玛莉卡的石槌 | `legendary:15` |
| 吞世权杖 | `legendary:16` |
| 弃子的繁星 | `legendary:17` |
| 葛瑞克的王斧 | `legendary:18` |
| 古兰桑克斯的雷电 | `legendary:19` |
| 蒙格温圣矛 | `legendary:20` |
| 巨人红发鞭 | `legendary:21` |
| 接肢飞龙 | `legendary:22` |
| 葛孚雷的王斧 | `legendary:23` |
| 卡利亚权杖 | `legendary:24` |
| 狮子大弓 | `legendary:25` |

特别注意：`legendary:06` 与 `legendary:16` 都叫“亵渎的庇佑”，仍是两个原记录；不得按效果名去重。关联到本表只证明已有固有效果记录，不能据此补齐品质、基础攻击或战技随机性。

兼容底线：保留原25条及全部原收藏键，旧收藏仍打开原记录；新图鉴收藏使用新的集合名与武器ID。首版不迁移、不清洗用户现有收藏和最近查看。新旧入口如需视觉合并，后续单独实现显示去重，保留原键解析及原记录详情入口。

## 第一版资料放在哪里

1. 现在先交付独立资料稿与20–30武器样本包，注明“待接入”，不写运行时文件，不登记新集合，不动界面。
2. 用户确认字段和样本后，若要在仓库评审，建议暂存于 `data/drafts/weapons.v0.1.json`，仍不加入 `collections.json`。它是待审整理数据，不当原始网页归档。流程说明补到现有 `docs/DATA.md`，不新建重复状态首页。
3. 通过资料验收并获准接入后，再拆为正式的 `data/weapons.json`、`data/weapon_variants.json`、`data/weapon_source_observations.json`、`data/weapon_effect_links.json`；来源继续放 `data/sources.json`。这些是拟议新文件名，不是仓库现有集合。
4. 正式加入集合清单后，由 `scripts/build_data.py` 生成 `dist/data.js`；不手改生成包。界面接入、APK构建及发布分别授权、分别验收。

## 首批样本验收

- 计数按20–30个不同 `identity`，不以变体、观察行或传说效果重复凑数。样本明确说明覆盖类型及选择理由；至少包含普通武器与现有传说效果关联案例。
- 每个武器有真实的渡夜存在依据、名称/类型定位、至少一个可访问来源；每个非空数值和随机性判断都能回到具体定位。只拿到目录名称的条目可列候选，但不计为属性已补齐。
- 必测数据情形：固定战技、随机性未知、若有证据则随机战技、同名多品质或强化档、角色/持握相关数值、冲突、未知、不适用、明确零值。找不到真实案例就标覆盖缺口，不制造案例或数值。
- 来源清单列明实际读到的范围、更新时间/游戏版本及权限边界。来源入口可打开不等于正文已核读，不把多个转引页面当独立核验。
- 所有关联引用都能解析到现有ID；25条原传说效果逐字段对比不变；无名称、稀有度、档位或技能池推测。
- 一览表写清：已完成身份数、具备基础属性证据数、战技/随机性已明确数、跨源完成字段数、冲突数、缺口。不能只报“30条完成”。

## 上线闸门

| 闸门 | 通过条件 | 未通过时 |
| --- | --- | --- |
| 资料评审 | 样本与字段获确认；主张可追溯；关键身份无歧义；冲突和缺项透明；分发许可边界清楚 | 保持独立资料稿或未登记的草稿，不出默认已核数据 |
| 数据接入 | 唯一ID、引用完整、空值/单位/条件校验、旧25条和收藏键兼容测试；元数据及issues/corrections同步 | 不并入正式数据包 |
| 界面验收 | 名称/别名搜索、类型及条件展示、来源定位、未知/不适用/冲突区分；新旧收藏和逐级返回可用；手机宽度与离线测试 | 不宣称图鉴可用或体验验收完成 |
| 自动检查 | `npm run check`、`npm test`、`python scripts/build_data.py --check` 全部通过；新增数据语义测试实际覆盖本方案 | 修复失败项；测试通过也不升级资料核验状态 |
| Android及发布 | 涉及Android时无签名构建；正式包保持包名/签名、提升versionCode；真机覆盖升级及旧收藏保留记录；发布另行确认 | 浏览器、编译、真机未测分别报告；不替用户发布 |

上线允许明确标记的未知或来源收录字段存在；不允许未标明的关键条件、身份冲突或未经许可的内容被包装成完整准确资料。尤其是攻击比较或排序，条件缺失时不得给出“更强”结论。

## 核对依据

以下链接固定到本次核对提交，避免后续主分支变化影响复核。

- [项目约定](https://github.com/Toramy404/duye-handbook/blob/0cc472f34cfb03f1d2c10566ff626a61138a5b3d/AGENTS.md)
- [集合清单](https://github.com/Toramy404/duye-handbook/blob/0cc472f34cfb03f1d2c10566ff626a61138a5b3d/data/collections.json)
- [25条传说武器原记录](https://github.com/Toramy404/duye-handbook/blob/0cc472f34cfb03f1d2c10566ff626a61138a5b3d/data/legendary_weapon_effects.json)
- [资料维护与核验约定](https://github.com/Toramy404/duye-handbook/blob/0cc472f34cfb03f1d2c10566ff626a61138a5b3d/docs/DATA.md)
- [现有搜索与词条分组](https://github.com/Toramy404/duye-handbook/blob/0cc472f34cfb03f1d2c10566ff626a61138a5b3d/dist/catalog.js)
- [现有收藏与核验标识实现](https://github.com/Toramy404/duye-handbook/blob/0cc472f34cfb03f1d2c10566ff626a61138a5b3d/dist/app.js#L22-L39)
- [数据生成器](https://github.com/Toramy404/duye-handbook/blob/0cc472f34cfb03f1d2c10566ff626a61138a5b3d/scripts/build_data.py)
- [来源登记](https://github.com/Toramy404/duye-handbook/blob/0cc472f34cfb03f1d2c10566ff626a61138a5b3d/data/sources.json)与[资料版本](https://github.com/Toramy404/duye-handbook/blob/0cc472f34cfb03f1d2c10566ff626a61138a5b3d/data/meta.json)
