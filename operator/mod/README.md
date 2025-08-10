# Mod-Operator 开发指南

## 概述

Mod-Operator 是 Galaxy Ops 框架的核心组件，用于定义和管理可复用的运维模块。每个 Mod-Operator 代表一个独立的软件组件或服务，包含完整的生命周期管理能力，包括安装、配置、启动、停止、监控等操作。

### 核心特性

- **多平台支持**: 支持不同的 CPU 架构、操作系统和运行环境组合
- **模块化设计**: 每个模块都是独立的，可单独开发和版本管理
- **工作流驱动**: 使用 GXL 语言定义复杂的运维操作流程
- **模板本地化**: 支持配置模板渲染和环境适配
- **依赖管理**: 处理模块间的依赖关系
- **构件管理**: 统一的软件包下载、缓存和分发机制

### 在 Galaxy Ops 生态系统中的位置

```
gmod (创建模块) → gsys (组合系统) → gops (工程管理) → gflow (执行工作流)
```

Mod-Operator 是整个运维体系的基础构建块，由 `gmod` 工具创建和管理，最终通过 `gflow` 执行具体的运维操作。

## 文档索引

本指南被拆分为以下文档以便于维护：

- **[配置说明](./CONFIGURATION.md)** - 核心配置文件详细说明
- **[开发指南](./DEVELOPMENT.md)** - 开发工作流和最佳实践
- **[故障排除](./TROUBLESHOOTING.md)** - 调试和故障排除
- **[API 参考](./REFERENCE.md)** - API 和枚举参考

## 快速开始

### 创建新模块

```bash
# 创建基础模块
gmod new postgresql

# 创建带目标的模块
gmod new postgresql --targets arm-mac14-host,x86-ubt22-k8s

# 从模板创建
gmod new postgresql --template database
```

### 基本文件结构

```
module_name/
├── mod/                              # 模块定义目录
│   ├── arm-mac14-host/              # ARM + macOS14 + Host 环境
│   │   ├── _gal/                    # 项目配置目录
│   │   ├── local/                   # 本地化生成的配置
│   │   ├── spec/                    # 规范文件目录
│   │   ├── values/                  # 值文件目录
│   │   ├── vars.yml                 # 变量定义
│   │   ├── setting.yml              # 本地化设置
│   │   └── workflows/               # 工作流定义
│   └── x86-ubt22-k8s/              # x86 + Ubuntu22 + K8s 环境
│       └── [相同的子目录结构]
├── mod-prj.yml                      # 模块项目配置
├── version.txt                      # 版本文件
├── .gitignore                       # Git 忽略文件
└── test_res/                        # 测试资源目录
```

### 支持的目标平台

| 组合 | CPU架构 | 操作系统 | 运行环境 | 适用场景 |
|------|---------|----------|----------|----------|
| `arm-mac14-host` | ARM | macOS 14+ | Host 宿主机 | Apple Silicon Mac 本地开发 |
| `x86-ubt22-host` | x86_64 | Ubuntu 22.04 | Host 宿主机 | Linux 服务器本地部署 |
| `x86-ubt22-k8s` | x86_64 | Ubuntu 22.04 | Kubernetes | K8s 集群容器化部署 |

## 开发工作流

### 1. 定义模块规范
- 编辑 `spec/artifact.yml` - 构件定义
- 编辑 `spec/depends.yml` - 依赖定义

### 2. 配置变量
- 编辑 `vars.yml` - 变量定义
- 编辑 `values/_value.yml` - 默认值

### 3. 编写工作流
- 编辑 `workflows/operators.gxl` - 使用 GXL 定义工作流

### 4. 测试和验证
- 使用 `gflow` 测试工作流
- 使用 `gmod validate` 验证配置

### 5. 本地化模块
- 使用 `gmod localize` 生成特定环境配置

## 关键概念

### ModelSTD 标准型号

Mod-Operator 使用 `ModelSTD` 标准型号来定义目标平台，格式为 `arch-os-spc`：

- **CPU 架构**: X86 (x86_64), ARM
- **操作系统**: MAC14 (macOS 14+), UBT22 (Ubuntu 22.04), WIN10 (Windows 10+), COS7 (CentOS 7)
- **运行空间**: Host (宿主机环境), K8S (Kubernetes 环境)

### 构件管理

构件定义了模块所需的软件包和下载资源，包括：

- 名称 (name)
- 版本 (version)
- 原始地址 (origin_addr)
- 缓存地址 (cache_addr)
- 缓存启用 (cache_enable)
- 本地文件名 (local)

### 依赖管理

模块可以依赖其他模块或资源，支持：

- 本地路径依赖
- Git 仓库依赖
- 条件依赖（根据变量启用/禁用）
- 版本约束

### 工作流引擎

使用 GXL (Galaxy eXecution Language) 定义运维操作：

- 支持任务定义和执行
- 变量模板渲染
- 条件分支和循环
- 外部命令执行
- 错误处理和重试机制

## 相关工具

- **gmod**: 模块创建和管理工具
- **gops**: 工程管理工具
- **gflow**: 工作流执行工具
- **gsys**: 系统组合工具

## 更多信息

查看详细文档：

- 📖 [配置说明](./CONFIGURATION.md) - 完整的配置文件参考
- 📖 [开发指南](./DEVELOPMENT.md) - 开发最佳实践
- 📖 [故障排除](./TROUBLESHOOTING.md) - 调试和问题解决
- 📖 [示例参考](./EXAMPLES.md) - 完整的模块示例
- 📖 [API 参考](./REFERENCE.md) - API 和枚举定义

---

*Mod-Operator 是 Galaxy Ops 框架的核心构建块，通过标准化的文件结构、配置管理和工作流定义，实现了软件组件的模块化运维管理。*
