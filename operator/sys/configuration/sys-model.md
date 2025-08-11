# 系统模型配置

## 概述

`sys_model.yml` 是 Sys-Operator 中最重要的配置文件之一，定义了系统的基础信息、目标运行环境和扩展元数据。所有系统都必须包含这个文件，它是系统定义的核心。

## 配置结构

### 基础系统定义

```yaml
# 必需字段
name: system_name                    # 系统名称（必需）
model: arm-mac14-host               # 目标平台模型（必需）
vender: "Galaxy-Ops"                # 厂商信息（可选）
```

### 扩展元数据

## 字段详解

### 1. `name` - 系统名称

**类型**: `string`
**必需**: `是`
**描述**: 系统的唯一标识名称

**规范**:
- 使用小写字母
- 单词间用下划线分隔
- 避免特殊字符和空格
- 长度建议不超过 64 个字符
- 避免使用保留关键字

**示例**:
```yaml
# 好的示例
name: production_web_system
name: microservice_platform
name: database_cluster

# 避免的示例
name: Production Web System  # 包含空格
name: prod_web_system$      # 包含特殊字符
name: sys_1                 # 无意义的编号
```

### 2. `model` - 目标平台模型

**类型**: `string`
**必需**: `是`
**描述**: 系统运行的目标平台和环境

**格式**: `arch-os-spc`

**组成部分**:
- **架构 (arch)**:
  - `arm`: ARM 架构（Apple M1/M2, Raspberry Pi 等）
  - `x86`: x86-64 架构（Intel/AMD）
  - `amd64`: AMD64 架构（兼容 x86-64）
  - `aarch64`: ARM64 架构

- **操作系统 (os)**:
  - `mac14`: macOS 14.x
  - `ubt22`: Ubuntu 22.04 LTS

- **环境 (spc)**:
  - `host`: 宿主机环境
  - `k8s`: Kubernetes 环境

**示例**:
```yaml
# Apple M1 芯片，macOS 14，Host 模式
model: arm-mac14-host

# Intel x86，Ubuntu 22.04，Kubernetes 模式
model: x86-ubt22-k8s

# Intel x86，Ubuntu 22.04，Docker 容器模式
model: x86-ubt22-docker

```

### 3. `vender` - 厂商信息

**类型**: `string`
**必需**: `否`
**描述**: 系统的厂商、组织或开发者信息

**用途**:
- 标识系统来源
- 版本管理和发布
- 技术支持联系
- 生态系统分类

**示例**:
```yaml
vender: "Galaxy-Ops"
vender: "Enterprise Corp"
vender: "Open Source Community"
vender: "Development Team"
```


















## 最佳实践

### 1. 命名最佳实践

#### 系统命名建议
- 使用描述性名称，清晰表达系统功能
- 包含环境标识（如 `production_`, `staging_`, `dev_`）
- 避免使用版本号（使用 `metadata.version` 管理）
- 保持命名一致性

**示例**:
```yaml
# 好的命名
name: production_web_system
name: staging_api_gateway
name: dev_database_cluster
name: monitoring_platform

# 避免的命名
name: web_system_prod      # 环境标识分离
name: sys_v2               # 版本号分离
name: app1                 # 无意义的编号
```

#### 版本管理建议
- 使用语义化版本
- 使用 `metadata.version` 而非文件名
- 考虑使用标签和分支管理版本


### 3. 模型选择建议

#### 平台兼容性
- 选择目标部署环境支持的平台模型
- 考虑跨平台兼容性需求
- 明确标记平台特定的配置

#### 环境区分
- 使用不同的模型区分开发和生产环境
- 考虑容器化 vs 宿主机部署的差异
- 支持混合环境部署需求

## 故障排除

### 1. 常见错误

#### 缺少必需字段
```yaml
# 错误示例
# 缺少 name 字段
model: x86-ubt22-host
vender: "Example Corp"

# 缺少 model 字段
name: example_system
vender: "Example Corp"
```

#### 模型格式错误
```yaml
# 错误示例
model: arm-mac-14-host    # 分隔符错误
model: x86-ubuntu-22-host # 操作系统名称错误
model: arm-mac14-docker  # 不支持的环境
```

#### 命名格式错误
```yaml
# 错误示例
name: Production System  # 包含空格
name: system$1           # 包含特殊字符
name: SYSTEM_NAME        # 包含大写字母
```

## 总结

`sys_model.yml` 是系统配置的核心文件，定义了系统的基础信息和运行环境。理解各个字段的含义和规范对于正确配置系统至关重要：

1. **name**: 系统的唯一标识，必须规范命名
2. **model**: 目标平台环境，格式必须正确
3. **vender**: 厂商信息，用于标识系统来源

遵循这些配置规范和最佳实践，可以：
- 提高配置的可读性和维护性
- 确保系统在不同环境中的正确部署
- 支持系统的版本管理和生命周期管理
- 便于团队协作和知识共享

建议在使用过程中：
- 定期验证配置文件的正确性
- 保持命名和格式的一致性
