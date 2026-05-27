---
title: Conventional Commits 与语义化版本控制
description: 标准化 Git Commit 信息格式，规范版本号递增规则，让提交记录可读、可自动化生成 CHANGELOG。
publishDate: '2026-04-29'
tags:
  - git
  - 版本控制
  - conventional commits
  - semantic versioning
  - 软件工程
heroImage:
  src: './image.png'
  alt: Conventional Commits 与语义化版本控制
  color: '#c3c9d8'
language: Chinese
comment: true
ai: assisted
---

## Conventional Commits

Conventional Commits 是一种标准化 Git Commit 信息格式，让提交记录可读、可自动化生成版本号、自动生成更新日志（CHANGELOG），也是 GitHub Action、语义化版本、团队协作的通用规范。

相关文档 [https://www.conventionalcommits.org/en/v1.0.0/](https://www.conventionalcommits.org/en/v1.0.0/#specification)

### 标准格式

```markdown
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

译文：

```markdown
<类型>[可选 范围]: <描述>

[可选 正文]

[可选 脚注]
```

### type 表格

| 提交类型   | 核心含义                                                                                        |
| :--------- | :---------------------------------------------------------------------------------------------- |
| `fix`      | 修复代码库中的bug，解决现有问题                                                                 |
| `feat`     | 为代码库新增功能或特性                                                                          |
| `build`    | 修改项目构建系统、依赖或构建工具配置                                                            |
| `chore`    | 处理非业务性杂项，不涉及功能或逻辑变更                                                          |
| `ci`       | 调整持续集成（[CI/CD](https://www.redhat.com/zh-cn/topics/devops/what-is-ci-cd)）流程及相关配置 |
| `docs`     | 修改项目文档、注释及使用说明                                                                    |
| `style`    | 调整代码格式与样式，不改变代码逻辑                                                              |
| `refactor` | 重构代码结构，不新增功能也不修复bug                                                             |
| `perf`     | 优化代码性能，提升运行效率、减少资源占用                                                        |
| `test`     | 新增、修改或删除代码测试用例                                                                    |

### 脚注内容

可以添加诸如 ：

- `BREAKING CHANGE: <description>` 强调破坏性变更
- 关联 Issue / 工单 `Closes #123` `Fixes #456`
- 添加作者签名 `Signed-off-by:` 用户名 <邮箱>
- [git trailer](https://git-scm.com/docs/git-interpret-trailers) 标准格式内容 例如 `Reviewed-by:` `Co-authored-by:` `Refs:`

需要注意的是[脚注令牌](https://www.conventionalcommits.org/zh-hans/v1.0.0/#:~:text=trailer%20convention%20%E5%90%AF%E5%8F%91%EF%BC%89%E3%80%82-,%E8%84%9A%E6%B3%A8%E7%9A%84%E4%BB%A4%E7%89%8C,-%E5%BF%85%E9%A1%BB%E4%BD%BF%E7%94%A8%20%2D)使用`-`连接，不能使用空格

### 补充规则

1. 提交类型可追加**范围**提供上下文，格式：`类型(范围): 描述`，例：`feat(parser): 新增数组解析能力`
2. 包含了 ! 表明有破坏性改变，例如 `feat(api)!: send an email to the customer when a product is shipped`
3. 除规范内类型外，可自定义类型

## Semantic Versioning

语义化版本控制是一种确定软件版本号的规则，基于固定主.次.修订版本号规则、依据公共 API 兼容变更类型逐级升级版本号，用以传递版本间代码与兼容信息的版本约定规范。

### 简要概述

版本格式：主版本号.次版本号.修订号（X.Y.Z），版本号递增规则如下：

1. 主版本号：当你做了不兼容的 API 修改，
2. 次版本号：当你做了向下兼容的功能性新增，
3. 修订号：当你做了向下兼容的问题修正。

先行版本号及版本编译信息可以加到“主版本号.次版本号.修订号”的后面，作为延伸。

### 详细内容

[语义化版本控制规范semver](https://semver.org/lang/zh-CN/#%E8%AF%AD%E4%B9%89%E5%8C%96%E7%89%88%E6%9C%AC%E6%8E%A7%E5%88%B6%E8%A7%84%E8%8C%83semver)

可以简要概述为：bug 升 Z、加功能升 Y、不兼容升 X，大版本升级后面全归零，后缀先行版比正式版低一档。具体来说

#### 如何递增版本号

初始开发阶段使用0.x.y的形式，此时API不稳定，随时可能变动。1.0.0产品正式定型，API 稳定，按照以下规则进行升级：

1. 修订号 Z：只做向下兼容 Bug 修复时 +1，不改功能
2. 加向下兼容新功能、废弃旧 API 时 +1；也可内部大优化时升级，Y 升级后 Z 归零
3. API 出现不兼容改动时 +1；X 升级后 Y、Z 全部归零

#### pre-release 与 build metadata

先行版采用 X.Y.Z-先行版本标识符 格式，用 `-` 连接。标识符由字母数字和 - 组成、无空格、数字不补 0；优先级低于正式版（例如：1.0.0-alpha < 1.0.0）

编译信息在版本号-先行版本标识符之后，采用 `+` 连接；版本优先级对比时直接忽略。例如 1.0.0-alpha+001、1.0.0+20130313144700、1.0.0-beta+exp.sha.5114f85。
