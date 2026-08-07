---
name: frontmatter
description: 配置并校验 Astro 博客文章（src/content/blog/*/index.md 或 index.mdx）的 frontmatter：按字段规范补全必需/可选字段、自动识别图片并生成 heroImage，统一用 scripts/standardize_frontmatter.py 规范化写入。当用户提到补全、配置、校验或规范 blog 文章 frontmatter 时使用。
---

## 工作流

1. 用 `git status` 找出 blog 目录下未跟踪的新文章目录
2. 定位其中的 `index.md` 或 `index.mdx`
3. 若 `ai` 字段缺失，先询问用户："本文是人类撰写、AI 辅助还是 AI 撰写？"，再按回答传入 `--ai human|assisted|ai`
4. 运行脚本补全/规范化 frontmatter（见下）
5. 运行 `--check` 确认无违规

## 脚本用法

所有字段写入与校验统一走 `scripts/standardize_frontmatter.py`：

```
python scripts/standardize_frontmatter.py <文章目录或文件> [选项]
```

模式与常用选项：

- 默认：补全缺失的可选字段、规范化取值并重写 frontmatter
- `--check`：只校验不写入，有 ERROR 时退出码为 1
- `--dry-run`：预览将要做的修改，不写入
- `--init --title "..." --description "..."`：为没有 frontmatter 的新文章生成完整 frontmatter
- `--ai human|assisted|ai`：设置内容创作方式
- `--updated-date`：已修改的文章将 updatedDate 设为今天（也可传具体日期）
- `--publish-date 'YYYY-MM-DD'`：覆盖发布日
- `--tags a,b,c`、`--hero-image x.png`、`--language Chinese`、`--draft/--no-draft`、`--comment/--no-comment`：按需覆盖

脚本行为：

- 补全 `publishDate`（缺省为今天）与默认值：`tags: []`、`draft: false`、`language: English`、`comment: true`、`ai: human`
- `title`/`description` 无法自动生成，缺失时报错并提示
- 规范化 `tags`（英文全小写、连字符转空格、去重）、`language`（英文单词）、`ai` 取值
- 目录中有图片时自动生成 `heroImage`（优先 thumbnail/cover，用 Pillow 提取主色调）
- 把单行 `heroImage: { ... }` 转为多行缩进格式

## Frontmatter 规范

根据 [Astro Pure 主题文档](https://astro-pure.js.org/docs/setup/content#markdown-authoring)：

### 必需字段

| 字段          | 说明     | 格式/限制                                 |
| ------------- | -------- | ----------------------------------------- |
| `title`       | 文章标题 | 最多60字符                                |
| `description` | 文章描述 | 10-160字符                                |
| `publishDate` | 发布日期 | `'YYYY-MM-DD'` 或 `'YYYY-MM-DD HH:MM:SS'` |

### 可选字段

| 字段          | 说明         | 默认值      |
| ------------- | ------------ | ----------- |
| `tags`        | 标签数组     | `[]`        |
| `heroImage`   | 封面图对象   | 无          |
| `draft`       | 是否草稿     | `false`     |
| `language`    | 语言         | `'English'` |
| `comment`     | 是否开启评论 | `true`      |
| `updatedDate` | 更新日期     | 无          |
| `ai`          | 内容创作方式 | `'human'`   |

`ai` 字段取值：`'human'`（人类撰写）、`'assisted'`（AI 辅助）、`'ai'`（AI 撰写）。

### tags 字段规范

| 规则 | 说明 |
| ---- | ---- |
| 语言 | 可使用中文或英文，同一标签内不混用 |
| 英文格式 | 全小写，单词间不使用连字符，多个单词用空格分隔 |
| 示例 | ✅ `machine learning`、`deep learning`、`data science`、`人工智能` |
| 示例 | ❌ `Machine Learning`、`machine-learning`、`deep-learning` |

### heroImage 格式

```yaml
heroImage:
  src: './thumbnail.jpg'
  alt: '图片描述'
  color: '#B4C6DA'
```

或远程图片：

```yaml
heroImage:
  src: 'https://example.com/image.jpg'
  inferSize: true
```

## 注意事项

- 保持原有字段不变，只补全缺失字段；`--check` 通过后再结束
- `language` 必须使用英文单词（`Chinese`、`English`、`Japanese`），不要写"中文""英文"
- `heroImage` 使用多行缩进格式，不要写单行 `{ src: ..., color: ... }`
- 手动编辑时以正文第一个实际内容标题行作为锚点，禁止空字符串替换；脚本已内置此规则
