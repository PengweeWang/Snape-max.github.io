---
title: FastAPI项目开发与部署
publishDate: 2025-02-16
description: 'FastAPI 项目开发与部署笔记，包含模块化设计、路由定义和Docker部署'
tags:
  - python
  - fastapi
language: '中文'
ai: ai
---

---

# **FastAPI 项目开发与部署笔记**

本笔记总结了如何使用 FastAPI 构建一个模块化、可扩展的 API 系统，并通过 Docker 和 Docker Compose 实现高效的开发和部署流程。

---

## **1. 项目结构设计**

为了构建一个清晰、易维护的项目，项目采用以下结构：

```
project/
├── main.py          # 主入口文件
├── routers/         # 路由模块
│   ├── __init__.py
│   ├── xiaohongshu/ # 小红书 API 文件夹
│   │   ├── __init__.py
│   │   └── image.py # 小红书图片解析 API
│   └── other_api/   # 其他功能 API 文件夹（未来扩展）
│       ├── __init__.py
│       └── example.py
├── utils/           # 工具模块
│   ├── __init__.py
│   └── parser.py    # 解析工具函数
└── models/          # 数据模型（如果需要）
    ├── __init__.py
    └── example.py
```

**特点**:

- 每个功能模块独立封装在 `routers` 文件夹下的子文件夹中。
- 动态加载路由，支持灵活扩展。

---

## **2. FastAPI 核心功能实现**

### **(1) 路由定义**

使用 `APIRouter` 定义模块化路由。例如：

```python
from fastapi import APIRouter

router = APIRouter(prefix="/image", tags=["Image Parsing"])

@router.get("/")
async def parse_image(url: str):
    result = HongshuParser(url)
    return result
```

### **(2) 自动化文档**

FastAPI 自动生成交互式文档页面：

- Swagger UI: `/docs`
- ReDoc: `/redoc`

可以通过以下方式定制文档页面：

- 修改标题：自定义 HTML 模板。
- 添加品牌化元素：如 Logo 和样式。

---

## **3. Docker 部署**

### **(1) Dockerfile**

`Dockerfile` 示例：

```dockerfile
# syntax=docker/dockerfile:1.4
FROM --platform=$BUILDPLATFORM python:3.11

WORKDIR /app
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

COPY requirements.txt /app
RUN --mount=type=cache,target=/root/.cache/pip \
    pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 4725/tcp
CMD ["gunicorn", "-w", "4", "-k", "uvicorn.workers.UvicornWorker", "--bind", "0.0.0.0:4725", "app:app"]
```

---

### **(2) Docker Compose**

通过 `docker-compose.yml` 简化多容器管理：

```yaml
version: '3.9'
services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - '4725:4725'
    volumes:
      - .:/app
    command: >
      gunicorn -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:4725 app:app
```

**优点**:

- 使用 `volumes` 挂载本地代码，实时同步代码更改。
- 支持多服务管理（如数据库、缓存等）。

---

## **4. 更新代码后的重新运行**

### **(1) 手动更新**

1. 停止并删除旧容器：
   ```bash
   docker stop <docker 容器 ID | docker 容器名>
   docker rm <docker 容器 ID | docker 容器名>
   ```
2. 重新构建镜像并运行：
   ```bash
   docker build -t <docker 容器名> .
   docker run -d -p 4725:4725 --name <docker 容器名> <docker 镜像名>
   ```

### **(2) 使用 Docker Compose**

1. 重新构建并启动：
   ```bash
   docker-compose up --build -d # -d 表示后台运行
   ```
2. 如果挂载了本地代码，只需保存代码更改即可自动生效。

---

## **5. 项目拓展**

### **(1) 添加新功能**

新增功能非常简单，只需在 `routers` 文件夹下创建新的子文件夹，并按照以下步骤操作：

1. 创建模块文件夹。
2. 定义路由。
3. 初始化模块。
4. 测试新功能。

### **(2) 集成外部工具**

通过依赖注入的方式集成外部工具或服务（如数据库、缓存等）。例如：

```python
def get_db():
    db = "Database Connection"
    return db

@app.get("/example-with-db")
async def example_with_db(db=Depends(get_db)):
    return {"db": db}
```

## **项目代码**

项目代码已上传至 [Qiumo api](https://github.com/Snape-max/api), 部署置 [Qiumo.fun](https://api.qiumo.fun/)
