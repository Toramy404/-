# Android 构建

原生 Java WebView 宿主，没有第三方原生依赖或ABI库。包名 `local.duye.nightreign`，当前 versionName `0.4.1`、versionCode `401`，minSdk 26、targetSdk/compileSdk 35。查询资源全部本地加载，不申请网络和存储权限。

## 环境

Python 3.10+，JDK 17+，Android SDK Platform 35，Build Tools 35.0.1。通过 Android SDK Manager 安装对应版本。设置 `JAVA_HOME`（或 `NIGHTREIGN_JDK`）和 `ANDROID_HOME`（或 `ANDROID_SDK_ROOT`）；有特殊布局时可设置 `NIGHTREIGN_BUILD_TOOLS` 和 `NIGHTREIGN_ANDROID_JAR`。

维护者旧工作区内已下载的工具仍可作为未设置SDK变量时的兼容入口；克隆项目不依赖该位置，不会下载或读取任何人的私钥。

```sh
python scripts/build_android.py --unsigned
```

该命令完成 Java/DEX、资源、对齐、ZIP和全部离线资源检查，无需发布签名，结果写入 android/build 的独立构建目录。它不是可安装的正式包。GitHub CI使用此模式验证Android编译。

## 正式升级包

保留本机 `android/signing/duye-release.jks` 和 `password.txt`，别名 `duye`。更新版本号与 versionCode，先完成网页和数据检查，再运行：

```sh
python scripts/build_android.py --signed --previous "release/渡夜手册-v0.4.0.apk"
```

此命令以 v0.4.0 为签名与升级基线生成 v0.4.1。脚本检查新旧签名相同、新versionCode更高、无新增权限、数据字节与dist一致，默认输出对应版本的新APK。输出文件已存在时停止；如需单独审查候选，可通过 `--output` 指定未存在的路径。禁止覆盖已发布安装包。

报告写入 reports/，构建副本写入 android/build/，两者不提交。脚本只在副本处理中文资源路径、网页专用按钮、安装版说明、原生导出和服务工作线程，不改 dist 原文件。

## 运行与验收

本地资源通过 https://appassets.androidplatform.net/assets/ 映射读取；外部来源链接交给系统浏览器。记录导出使用 ACTION_CREATE_DOCUMENT，由用户选择保存位置。返回键调用网页父级导航，首页返回退出。

桌面图标使用用户提供图片和自适应布局；图片保留原始像素。源码中的第三方素材见根目录 THIRD_PARTY_NOTICES。

编译通过不等于手机通过。覆盖升级、记录保留、断网冷启动、逐级返回、退出、文件导出需实际手机验收，步骤见 docs/DEVELOPMENT.md。v0.4.1 是本轮手机试用版，真机验收结果待补。
