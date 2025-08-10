# gops - Galaxy Operations System 系统操作管理工具

## 概述

`gops` 是 Galaxy Operations System 的核心管理工具，用于管理系统配置、导入模块、更新引用等操作。它提供了完整的系统操作功能，帮助开发者高效地管理 Galaxy 系统的各种配置和操作。

## 安装

```bash
# 从源代码安装
cargo install --path .

# 或者使用二进制分发
https://github.com/galaxy-sec/galaxy-ops/releases/latest/
```

## 基本用法

### 显示版本信息

```bash
gops
# 输出示例：gops: 1.0.0
```

### 显示帮助信息

```bash
gops --help
gops <command> --help
```

## 命令详解

### gops new

创建新的系统配置

**语法：**
```bash
gops new [OPTIONS]
```

**选项：**
- `-n, --name <NAME>` - 系统配置名称（必填）
  - 系统配置的唯一标识名称
  - 支持字母数字、连字符和下划线
  - 必须为非空字符串

**功能：**
- 创建指定名称的新系统配置
- 初始化系统配置目录结构
- 生成所有必需的配置文件
- 设置默认的系统配置参数

**示例：**
```bash
# 创建名为 "my-config" 的新系统配置
gops new --name my-config

# 创建带详细调试的系统配置
gops new --name debug-config --debug 2
```

**输出：**
```
创建目录：my-config/
生成配置文件：my-config/ops_config.yml
生成模板文件：my-config/templates/
生成示例文件：my-config/examples/
生成脚本文件：my-config/scripts/
```

### gops import

导入外部模块到当前系统

**语法：**
```bash
gops import [OPTIONS]
```

**选项：**
- `-d, --debug <LEVEL>` - 调试级别（0-4）
  - 0：关闭调试输出
  - 1：基础调试信息
  - 2：详细调试信息
  - 3：跟踪调试信息
  - 4：完整调试信息
- `--log <LOG>` - 日志配置（格式：模块=级别,模块=级别）
- `-f, --force <LEVEL>` - 强制更新级别
  - 0：不强制更新
  - 1：强制更新引用
  - 2：强制更新依赖
  - 3：强制更新所有内容
- `-p, --path <PATH>` - 模块导入路径（必填）
  - 可以是相对路径或绝对路径
  - 指定要导入的模块所在位置

**功能：**
- 从指定路径导入模块配置
- 将模块集成到当前系统
- 自动处理模块依赖关系
- 支持强制导入模式

**示例：**
```bash
# 从指定路径导入模块
gops import --path /path/to/module

# 跳过确认导入
gops import --path /path/to/module --force 1

# 详细调试导入过程
gops import --path /path/to/module --debug 3 --log import=debug

# 强制更新所有内容
gops import --path /path/to/module --force 3
```

### gops update

更新系统模块和引用

**语法：**
```bash
gops update [OPTIONS]
```

**选项：**
- `-d, --debug <LEVEL>` - 调试级别（0-4）
- `--log <LOG>` - 日志配置
- `-f, --force <LEVEL>` - 强制更新级别
  - 0：不强制更新
  - 1：强制更新引用
  - 2：强制更新依赖
  - 3：强制更新所有内容

**功能：**
- 更新系统模块的引用关系
- 更新模块的依赖配置
- 下载远程资源引用
- 支持多种强制更新模式

**示例：**
```bash
# 正常更新系统
gops update

# 强制更新引用
gops update --force 1

# 详细调试更新过程
gops update --debug 3 --log all=debug
```

### gops localize

本地化模块配置

**语法：**
```bash
gops localize [OPTIONS]
```

**选项：**
- `-d, --debug <LEVEL>` - 调试级别（0-4）
- `--log <LOG>` - 日志配置
- `--value <PATH>` - 本地化值文件路径
  - 指定用于本地化的值文件路径
  - 通常是 YAML 格式的配置文件
- `--default` - 使用默认模块配置
  - 启用默认模块模式
  - 不使用用户自定义的 value.yml 文件

**功能：**
- 根据环境特定的值本地化模块配置
- 适配不同环境的配置需求
- 支持多环境配置管理
- 可选择使用自定义或默认值

**示例：**
```bash
# 使用默认配置本地化
gops localize --default

# 使用自定义值文件本地化
gops localize --value prod-values.yml

# 使用自定义值文件并启用调试
gops localize --value dev-values.yml --debug 2
```

> **注意：** 目前 `gops localize` 命令实现为 `todo!()`，功能尚未完成。

### gops setting

系统设置管理

**语法：**
```bash
gops setting [OPTIONS]
```

**选项：**
- `-d, --debug <LEVEL>` - 调试级别（0-4）
- `--log <LOG>` - 日志配置
  - 格式：模块=级别,模块=级别
  - 例如：--log setting=debug,system=info

**功能：**
- 管理系统级别的配置设置
- 查看和修改系统配置参数
- 提供系统状态信息
- 支持调试和日志配置

**示例：**
```bash
# 查看系统设置
gops setting

# 启用调试输出查看设置
gops setting --debug 2

# 配置日志级别查看设置
gops setting --log setting=debug,system=info
```

## 环境变量

- `TEST_MODE` - 测试模式设置
- `MOCK_SUCCESS` - 模拟成功状态
- `TEST_MODE` 和 `MOCK_SUCCESS` 用于测试环境，确保测试的安全性和隔离性

## 配置文件

### 系统配置结构

```
my-config/
├── ops_config.yml              # 系统主配置文件
├── templates/                  # 模板目录
├── examples/                  # 示例文件
├── scripts/                   # 脚本文件
├── modules/                   # 模块目录
├── config/                    # 配置文件
│   ├── default.yml           # 默认配置
│   ├── local.yml             # 本地配置
│   └── env/                  # 环境特定配置
│       ├── dev.yml
│       ├── staging.yml
│       └── prod.yml
└── settings/                  # 系统设置
    ├── system.yml
    ├── security.yml
    └── performance.yml
```

### ops_config.yml 示例

```yaml
# 系统配置文件
system_name: my-ops-system
version: "1.0.0"
description: "My Galaxy Operations System"

# 模块配置
modules:
  - name: core
    type: system
    version: "1.0.0"
  - name: database
    type: external
    path: "/path/to/database-module"
    version: "2.1.0"

# 依赖配置
dependencies:
  - galaxy/core: ">=1.0.0"
  - galaxy/utils: "~2.0.0"
  - galaxy/security: "^1.5.0"

# 导入配置
imports:
  - name: user-service
    path: "/path/to/user-service"
    version: "1.2.0"

# 输出配置
outputs:
  - name: artifacts
    path: "build/artifacts"
    format: tar.gz

# 系统设置
settings:
  debug_level: 1
  log_level: info
  auto_update: true
```

## 最佳实践

### 配置命名

- 使用小写字母、数字、连字符和下划线
- 避免特殊字符和空格
- 使用有意义的名称，如：`production-config`
- 区分环境和用途：`dev-api-config`

### 模块管理

```bash
# 导入新模块
gops import --path /path/to/new-module --force 1

# 更新现有模块
gops update --force 2

# 验证配置
gops setting --debug 2
```

### 配置管理

```bash
# 开发环境配置
gops localize --value dev-config.yml --debug 2

# 测试环境配置
gops localize --value test-config.yml

# 生产环境配置
gops localize --value prod-config.yml --default
```

### 调试技巧

```bash
# 启用完整调试输出
gops import --path /test --debug 4 --log all=debug

# 检查系统设置
gops setting --debug 3 --log setting=debug

# 使用详细日志进行故障排除
gops update --debug 2 --log cmd=debug,net=trace
```

## 故障排除

### 常见问题

**Q: 创建配置失败**
```
错误：无法创建目录 "my-config"
原因：目录已存在或权限不足
解决：删除现有目录或检查权限
```

**Q: 导入模块失败**
```
错误：无法导入模块
原因：路径不存在或权限不足
解决：检查路径是否正确，确保有读取权限
gops import --path /test/path --debug 3 --log import=debug
```

**Q: 更新模块时网络错误**
```
错误：无法下载依赖
解决：检查网络连接和 git 配置
gops update --debug 3 --log net=debug
```

**Q: 本地化功能未实现**
```
错误：localize 功能尚未完成
原因：当前版本实现为 todo!()
解决：等待后续版本支持，或使用其他配置管理方式
```

### 调试模式

使用调试模式获取详细的执行信息：

```bash
# 最高级别调试
gops import --path /test --debug 4 --log all=debug

# 关键模块调试
gops new --name test --debug 3 --log cmd=debug

# 设置调试
gops setting --debug 2 --log setting=debug
```

### 系统诊断

```bash
# 检查配置文件
ls -la my-config/

# 验证系统配置
cat my-config/ops_config.yml

# 检查模块目录
ls -la my-config/modules/

# 查看系统设置
gops setting --debug 1
```

## 测试

项目包含完整的测试套件：

```bash
# 运行所有测试
cargo test

# 运行特定测试
cargo test test_gxops_run_success

# 运行测试并显示输出
cargo test -- --nocapture

# 测试环境隔离
TEST_MODE=true cargo test
```

## 示例工作流

### 开发新系统

```bash
# 1. 创建新系统配置
gops new --name my-ops-system

# 2. 导入外部模块
gops import --path /path/to/user-service --force 1

# 3. 导入数据库模块
gops import --path /path/to/database-module --force 2

# 4. 更新系统模块
gops update

# 5. 查看系统设置
gops setting --debug 1

# 6. 本地化配置（功能待实现）
gops localize --value dev-config.yml
```

### 部署到生产环境

```bash
# 1. 创建生产系统配置
gops new --name production-system

# 2. 导入生产模块
gops import --path /path/to/production-modules --force 3

# 3. 更新到最新版本
gops update --force 3

# 4. 查看生产设置
gops setting --log production=debug

# 5. 使用生产配置本地化
gops localize --value prod-config.yml --default
```

## 版本历史

### 当前版本：1.0.0
- 初始版本
- 支持系统配置创建
- 支持模块导入功能
- 支持系统模块更新
- 支持系统设置管理
- 本地化功能标记为待实现（todo!()）
- 完整的错误处理和日志记录

## 功能开发状态

| 功能 | 状态 | 说明 |
|------|------|------|
| new | ✅ 完成 | 创建新的系统配置 |
| import | ✅ 完成 | 导入外部模块到当前系统 |
| update | ✅ 完成 | 更新系统模块和引用 |
| localize | ⏳ 待开发 | 本地化模块配置（当前为 todo!()） |
| setting | ✅ 完成 | 系统设置管理 |

## 贡献指南

欢迎贡献代码和建议：

1. Fork 项目
2. 创建特性分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 许可证

本项目采用 MIT 许可证 - 详见 LICENSE 文件
