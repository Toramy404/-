# 数据维护

## 唯一维护入口

`data/*.json` 是应用整理后的可编辑数据源，来自 v0.4.0 已使用的离线快照。它不是各站原始抓取存档。`data/collections.json` 固定集合顺序，`sources.json` 保留来源与采集信息，`meta.json` 保留资料版本与字段标签；`corrections.json`、`issues.json` 保存历史修正和未决分歧。

以前保存在仓库外的研究式资料库和网页抓取存档保留在维护者本机，不作为克隆后运行的必要依赖。来源中 `snapshot_path`、`included_file` 记录历史采集路径，不表示这些归档已经上传。本仓库通过上游链接与固定 commit 保留出处。

修改 JSON 后运行：

```sh
python scripts/build_data.py
python scripts/build_data.py --check
npm test
```

生成器重建 `effect_families/effect_members/effect_tags` 并输出 `dist/data.js`，不抓取网络、不更改图片。生成结果应与仓库内数据包逐字节一致；历史安装包保留各自发布时的快照。不要手工修改 data.js 的数值。

## 每个数值变更需要的证据

在对应 Issue/PR 记录条目ID、原值、新值、来源URL和具体表页/行、游戏版本、模式与生效条件、交叉核对结果。能找到两个独立来源时交叉核对；互相转载不能视为独立验证。只有一个来源或来源冲突时，保留待核验标记和并列值，不挑一个顺眼的数值覆盖。

纯排版/分组合并不改任何原记录。固定值与百分比、局外遗物与局内词条、普通与深夜/永夜、实体与阶段分别保留。只有名称或来源明确标出编号的系列可显示 +0/+1；无编号的多个数值不推测稀有度或档位。成员ID必须稳定，旧收藏不能因此消失。

分类由 `scripts/effect_catalog.py` 生成：按角色名册中的名称前缀或原始“仅限特定角色”类别识别角色专属，不归入负面效果；括号中的物品名不视为角色名。负面效果按原始减益类别或明确的独立惩罚识别，不能只看到“降低”就归类。纯分类修正只更新派生标签，原始效果、来源与资料版本保留。界面隐藏“不附带负面词条”“随机加入正面词条”两项提示，源字段照常保留，“附带负面词条”和实际效果中的代价继续展示。

新增/改动数据时一并更新 corrections 或 issues 以及 meta 中 dataVersion/date，在 PR 中查看 data.js 的生成差异。审核应关注原始字段和条件，不能只看数量与测试通过。

## 当前核验边界

- 873条效果、617个原始同名组、722个场景入口；每条原记录只属于一个场景入口。
- 520种地图配置的两夜主要Boss已跨表核对，追加战单列；配置数量不是概率。
- 角色满级共110项属性已比较；女爵10项旧值已纠正；守护者和复仇者共6字段仍有不同来源值。
- 294条效果尚未完成第二来源逐项语义核验，不能写成“全库已实测”。
- 水晶地图的发现/没有标记和实际激活计数分开；不提供未经验证的最短路线。

## 第三方内容

QuickRef对应固定来源提交为 `3e23450094c18125ae5665927ed240b18189a040`，许可证全文在 LICENSE 和 dist/DATA-LICENSE.txt。来源仓库：[NightreignQuickRef](https://github.com/xxiixi/NightreignQuickRef/tree/3e23450094c18125ae5665927ed240b18189a040)。其他社区来源的字段保留各自说明。来源链接可访问，不等于全部图片、文字和表格自动获得统一授权；参见 THIRD_PARTY_NOTICES。

## 武器图鉴预览数据

输入为 `docs/research/melee-12-source-observations.json`、`weapon-tools.json` 及配套说明，原始研究文件保持逐字节不变。`scripts/build_weapon_catalog.py` 是可复现的显式适配器；禁止把研究 JSON 直接改名导入。

| 集合 | 职责 |
| --- | --- |
| weapons | 稳定身份、中文名状态、英文名称、检索别名、类别、来源与观察引用 |
| weapon_variants | 42 件装备的独立来源页面示例；其余345件不生成伪面板；品质与面板绑定仍为 false |
| weapon_source_observations | 逐条保留研究文件的原始观察；不从展示字段反推原文 |
| weapon_effect_links | 25 个显式关联到传奇效果原 ID，不复制或改写原来的 25 条记录 |

先运行 `python scripts/build_weapon_catalog.py`，再运行 `python scripts/build_data.py`。两个脚本均支持 `--check`；总数据构建还会检查适配结果是否与研究观察一致。新增来源统一使用 `weapon-research:` 前缀写入 `sources.json`，避免与正式资料旧 ID 冲突。

数据状态统一为 `source_reported`。面板字段的 `known` / `unknown` / `not_applicable` 只区分来源是否给值及是否适用，不表示游戏实测通过。明确的 0、false、空数组按原样保留；未知为 null 并带原因。属性补正未列项保持未知，只有明确无补正才展示“无”。Spell Power、近战攻击、防御、致命一击与 FP 格式分别展示，不生成总攻击或跨条件排名。

打刀的 Unsheathe 示例与 BWIKI 随机描述并列。11 个候选中文名保留英文身份。资料日期 2026-10-17 不是游戏补丁；未核条件写入 issues，旧 294 条词条核验缺口保持原有口径。新别名只用于检索，不作为正式译名证据。


本次扩展输入为 `docs/research/weapon-catalog-index-20261017.json`（387件目录、逐条来源名/分类/分页URL）和 `weapon-legendary-expansion-20261017.json`（18件新传说面板的事实字段）。`scripts/expand_weapon_catalog.py` 由原适配器调用：沿用24件旧ID和全部原始观察，再补充身份及25个明确的传说效果映射。新目录ID在输入中固定，不随展示名动态重算；未绑定英文名的记录留空。来源前缀为 `weapon-index:` / `weapon-expansion:`。UI只隐藏无内容的区块，不把未知改成0；真实0和FP0保留。

游侠网目录用于名称/类别对照，存在骑士大剑与黄金律法大剑面板错位、卡利亚权杖重复译名等问题，因此未批量导入数值。18件新增传说面板逐页采集Mobalytics；可定位的第二来源攻击/补正字段逐项比较，差异写入 `comparison_note`，不拼接不同来源数值。目录不宣称包含后续DLC初始装备，345件面板仍待采集。

缩圈计时直接读取 `circle_timing`，以真实时间差计算经过时长，浏览器定时回调只负责更新显示。`circle:5` 的末次结束采用较早的约14:00提醒，同时保存14:30备选、`conflict`状态和两个来源；QuickRef固定提交内部两处显示互相矛盾，3DM转引测试支持约14:00。首缩270/450秒、二缩开始660秒未改。此计时没有游戏进度接口，也未获得真机或各模式实测结论。
