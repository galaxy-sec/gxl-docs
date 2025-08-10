# gmod - Galaxy Module Management Tool

## 概述

`gmod` 是 Galaxy 模块管理工具，用于创建、更新和本地化 Galaxy 模块。它提供了完整的模块生命周期管理功能，帮助开发者快速构建和维护 Galaxy 项目。

## 安装

```bash
# 从源代码安装
cargo install --path .

# 或者使用二进制分发
curl -fsSL https://github.com/galaxy-sec/galaxy-ops/releases/latest/download/gmod.tar.gz | tar -xz
sudo mv gmod /usr/local/bin/
```

## 基本用法

### 显示版本信息

```bash
gmod
# 输出示例：gmod: 1.0.0
```

### 显示帮助信息

```bash
gmod --help
gmod <command> --help
```

## 命令详解

### gmod example

创建示例模块结构

**语法：**
```bash
gmod example
```

**功能：**
- 在当前目录创建完整的示例模块结构
- 包含所有必需的配置文件和模板
- 展示模块组织的最佳实践

**示例：**
```bash
gmod example
# 创建示例模块到当前目录
```

### gmod new

定义新的模块规范

**语法：**
```bash
gmod new [OPTIONS]
```

**选项：**
- `-n, --name <NAME>` - 模块名称（字母数字，可包含连字符和下划线）【必填】
- `-d, --debug <LEVEL>` - 调试级别（0-4）
  - 0：关闭调试输出
  - 1：基础调试信息
  - 2：详细调试信息
  - 3：跟踪调试信息
  - 4：完整调试信息
- `--log <LOG>` - 日志配置（格式：模块=级别,模块=级别）

**功能：**
- 创建指定名称的新模块
- 初始化模块目录结构
- 生成所有必需的配置文件

**示例：**
```bash
# 创建名为 "my-module" 的新模块
gmod new --name my-module

# 创建模块并启用调试输出
gmod new --name my-module --debug 2

# 创建模块并配置日志
gmod new --name my-module --log cmd=debug,parse=info
```

**输出：**
```
创建目录：my-module/
生成配置文件：my-module/mod.yml
生成配置文件：my-module/module.yaml
生成模板文件：my-module/templates/
生成示例文件：my-module/examples/
```

### gmod update

更新现有模块的依赖关系

**语法：**
```bash
gmod update [OPTIONS]
```

**选项：**
- `-d, --debug <LEVEL>` - 调试级别（0-4）
- `--log <LOG>` - 日志配置
- `-f, --force <LEVEL>` - 强制更新级别
  - 0：正常更新
  - 1：跳过确认
  - 2：覆盖现有文件
  - 3：强制 git pull

**功能：**
- 更新模块的依赖关系
- 下载远程引用的模块
- 支持强制更新模式

**示例：**
```bash
# 正常更新模块
gmod update

# 强制更新，跳过确认
gmod update --force 1

# 详细调试输出更新过程
gmod update --debug 3 --log all=debug
```

### gmod localize

本地化模块配置

**语法：**
```bash
gmod localize [OPTIONS]
```

**选项：**
- `-d, --debug <LEVEL>` - 调试级别（0-4）
- `--log <LOG>` - 日志配置
- `--value <PATH>` - 值文件路径（YAML/JSON）
- `--default` - 使用默认值，不使用用户提供的 value.yml

**功能：**
- 根据环境特定的值生成本地化配置
- 支持多环境配置管理
- 可选择使用自定义或默认值

**示例：**
```bash
# 使用默认值本地化
gmod localize --default

# 使用自定义值文件本地化
gmod localize --value prod-values.yml

# 使用自定义值文件并启用调试
gmod localize --value dev-values.yml --debug 2
```

## 环境变量

- `TEST_MODE` - 测试模式设置
- `MOCK_SUCCESS` - 模拟成功状态

## 配置文件

### 模块配置结构

```
my-module/
├── mod.yml                    # 模块主配置文件
├── module.yaml               # 模块元数据
├── templates/                # 模板目录
├── examples/                # 示例文件
└── config/                  # 配置文件
    ├── default.yml          # 默认配置
    ├── local.yml            # 本地配置
    └── env/                  # 环境特定配置
        ├── dev.yml
        ├── staging.yml
        └── prod.yml
```

### mod.yml 示例

```yaml
name: my-module
version: "1.0.0"
description: "My Galaxy Module"
author: "Your Name <your.email@example.com>"

dependencies:
  - galaxy/core: ">=1.0.0"
  - galaxy/utils: "~2.0.0"

sources:
  - type: git
    url: "https://github.com/username/my-module.git"
    ref: main

outputs:
  - name: main
    path: "build/output"
    format: tar.gz
```

## 最佳实践

### 模块命名

- 使用小写字母、数字、连字符和下划线
- 避免特殊字符和空格
- 使用有意义的名称，如：`user-service-api`

### 依赖管理

- 使用语义化版本控制
- 定期更新依赖：`gmod update --force 1`
- 在生产环境使用锁定版本

### 配置管理

- 使用环境特定的配置文件
- 在 CI/CD 流程中自动本地化
- 使用默认配置作为后备

### 调试技巧

```bash
# 启用完整调试输出
gmod update --debug 4 --log all=debug

# 检查模块依赖关系
gmod new --name debug-test --debug 2

# 使用详细日志进行故障排除
gmod localize --debug 3 --log cmd=debug,net=trace
```

## 故障排除

### 常见问题

**Q: 创建模块失败**
```
错误：无法创建目录 "my-module"
原因：目录已存在或权限不足
解决：删除现有目录或检查权限
```

**Q: 更新模块时网络错误**
```
错误：无法下载依赖
解决：检查网络连接和 git 配置
gmod update --debug 3 --log net=debug
```

**Q: 本地化失败**
```
错误：无法解析值文件
解决：检查 YAML/JSON 格式是否正确
gmod localize --value config.yml --debug 2
```

### 调试模式

使用调试模式获取详细的执行信息：

```bash
# 最高级别调试
gmod update --debug 4 --log all=debug

# 关键模块调试
gmod new --name test --debug 3 --log cmd=debug
```

## 测试

项目包含完整的测试套件：

```bash
# 运行所有测试
cargo test

# 运行特定测试
cargo test test_gxmod_cmd_app_creation

# 运行测试并显示输出
cargo test -- --nocapture
```

## 示例工作流

### 开发新模块

```bash
# 1. 创建新模块
gmod new --name user-service

# 2. 编辑模块配置
cd user-service
vim mod.yml

# 3. 开发功能
# ... 编码 ...

# 4. 更新依赖
cd ..
gmod update

# 5. 本地化配置
gmod localize --value dev-values.yml

# 6. 验证模块
gmod example
```

### 部署到生产环境

```bash
# 1. 创建生产模块
gmod new --name user-service-prod

# 2. 更新到最新版本
gmod update --force 3

# 3. 使用生产配置本地化
gmod localize --value prod-values.yml

# 4. 验证配置
ls -la user-service-prod/config/env/prod.yml
```

## 版本历史

### 当前版本：1.0.0
- 初始版本
- 支持模块创建、更新和本地化
- 完整的错误处理和日志记录

## 贡献指南

欢迎贡献代码和建议：

1. Fork 项目（https://github.com/galaxy-sec/galaxy-ops）
2. 创建特性分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 许可证

本项目采用 MIT 许可证 - 详见 LICENSE 文件