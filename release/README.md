# 安装包

此目录的 APK/ZIP 是本机产物，默认不进入 Git。公开分发安装包应使用 GitHub Releases，保留对应源码标签与更新说明。

## 当前正式版本：v0.4.1

本机原包：`渡夜手册-v0.4.1.apk`；[公开附件](https://github.com/Toramy404/duye-handbook/releases/tag/v0.4.1)：`duye-handbook-v0.4.1.apk`（内容一致），包名 `local.duye.nightreign`，versionCode `401`，最低 Android 8.0。沿用 v0.4.0 签名，直接覆盖安装以保留收藏、水晶标记和设置。

更新内容见根目录 CHANGELOG。校验值随安装包的 `.sha256` 文件提供，构建核验记录在 `reports/android-v0.4.1/signed/`。图标居中、离线冷启动、覆盖后个人记录和返回退出仍需手机试用确认。GitHub Release 已于 2026-10-16 正式发布并设为 Latest；APK 重新下载后的 SHA-256 为 `3c6394c721b8a3fc8d5f8dabf2e5486a8c9113f50836f4be4f2fd3dd22bffcf9`，大小 4,041,595 字节。源码标签固定在 `bc40b0680c5acd152be95099de08a9a0bc308c25`。后续版本使用独立标签、文件名和校验值，不覆盖本包。

## 历史安装包：v0.4.0

维护者本机保留 `渡夜手册-v0.4.0.apk`：

- 包名：local.duye.nightreign；versionCode：400；最低 Android 8.0。
- 大小：4,041,595 字节。
- SHA-256：`d38f2085141666d8b85d6d629ecf449664c8812579a50cd14c7541d67ec6a564`。
- 签名与 v0.3.0 一致；不要卸载旧版后再装，以保留数据。
- 编译、签名、资源读回通过；Android 真机运行尚未验收。

以上为旧 APK 的历史校验记录，不套用于新版安装包。
