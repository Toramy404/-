# 渡夜手册项目约定

- `dist/` 是网页维护源码，不能整体清空当作构建缓存。游戏数据维护入口为 `data/`，用 scripts/build_data.py 生成 dist/data.js。
- 纯界面修改不改数值；词条合并只做展示关联，保留ID、场景、单位、负面条件、原始档位和来源。不猜测稀有度。
- 词条原记录→档位组→栏目→首页逐级返回，Android首页退出。保留旧收藏和设置兼容。
- 不提交 android/signing、密码、私钥、SDK/JDK、构建缓存或个人记录。APK放Release附件，发布文件不覆盖。
- 每个需求在短期分支完成，PR应说明问题、结果、验证和未测部分；自动检查通过后再合并。不要扩大改动范围或重写无关界面。
- 检查：npm run check；npm test；python scripts/build_data.py --check。Android改动再运行无签名构建；正式升级保留包名和签名，提升versionCode。
- 真机验收与浏览器/编译验收分别报告。资料版本、来源冲突与待核验状态不得被“测试通过”掩盖。
- 后续流程维护只更新README、docs/DEVELOPMENT.md、docs/DATA.md和CHANGELOG对应部分，不另建重复状态首页。
