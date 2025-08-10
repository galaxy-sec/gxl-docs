# Mod-Operator 配置文件详解

本文档详细介绍 Mod-Operator 的各个配置文件及其使用方法。

## 配置文件概览

Mod-Operator 使用多种配置文件来定义模块的行为和属性：

| 文件 | 位置 | 作用 | 格式 |
|------|------|------|------|
| `spec/artifact.yml` | `mod/{platform}/spec/` | 定义软件包和资源 | YAML |
| `spec/depends.yml` | `mod/{platform}/spec/` | 定义依赖关系 | YAML |
| `vars.yml` | `mod/{platform}/` | 定义环境变量 | YAML |
| `setting.yml` | `mod/{platform}/` | 配置本地化行为 | YAML |
| `workflows/operators.gxl` | `mod/{platform}/workflows/` | 工作流定义 | GXL |
| `mod-prj.yml` | 根目录 | 项目配置 | YAML |

## spec/artifact.yml - 构件定义

`artifact.yml` 是 Mod-Operator 中最重要的配置文件之一，它定义了模块所需的软件包、资源及其下载配置。

### 基本格式

```yaml
# 单个构件定义
- name: postgresql
  version: 0.1.0
  origin_addr:
    url: https://mirrors.aliyun.com/postgresql/latest/postgresql-17.4.tar.gz
  cache_enable: false
  local: postgresql-17.4.tar.gz
```

### 字段说明

| 字段 | 类型 | 必需 | 说明 |
|------|------|------|------|
| `name` | String | 是 | 构件名称 |
| `version` | String | 是 | 构件版本 |
| `origin_addr` | Object | 是 | 原始下载地址 |
| `cache_addr` | Object | 否 | 缓存地址（可选） |
| `cache_enable` | Boolean | 否 | 是否启用缓存（默认 false） |
| `local` | String | 是 | 本地存储文件名 |

### 地址类型支持

#### HTTP 地址
```yaml
- name: nginx
  version: 1.25.3
  origin_addr:
    url: https://nginx.org/download/nginx-1.25.3.tar.gz
  local: nginx-1.25.3.tar.gz
```

#### Git 仓库
```yaml
- name: galaxy-flow
  version: 0.1.0
  origin_addr:
    repo: https://github.com/galaxy-sec/galaxy-flow.git
    branch: main
  local: galaxy-flow
```

#### 本地路径
```yaml
- name: custom-library
  version: 1.0.0
  origin_addr:
    path: /path/to/local/library.tar.gz
  local: custom-library.tar.gz
```

### 多构件定义

```yaml
- name: postgresql
  version: 17.4
  origin_addr:
    url: https://mirrors.aliyun.com/postgresql/latest/postgresql-17.4.tar.gz
  cache_enable: false
  local: postgresql-17.4.tar.gz

- name: pcre
  version: 8.45
  origin_addr:
    url: https://sourceforge.net/projects/pcre/files/pcre/8.45/pcre-8.45.tar.gz
  local: pcre-8.45.tar.gz

- name: openssl
  version: 3.0.0
  origin_addr:
    repo: https://github.com/openssl/openssl.git
    tag: openssl-3.0.0
  local: openssl-3.0.0
```

### 缓存配置

```yaml
- name: large-package
  version: 2.0.0
  origin_addr:
    url: https://example.com/large-package.tar.gz
  cache_addr:
    url: https://cache.example.com/large-package.tar.gz
  cache_enable: true
  local: large-package.tar.gz
```

## spec/depends.yml - 依赖定义

`depends.yml` 定义模块依赖的其他模块或资源，支持多种依赖类型和条件依赖。

### 基本格式

```yaml
dep_root: ./depends

deps:
- addr:
    path: ./data
  local: data_resources
  enable: true
```

### 字段说明

| 字段 | 类型 | 必需 | 说明 |
|------|------|------|------|
| `dep_root` | String | 是 | 依赖根目录 |
| `deps` | Array | 是 | 依赖列表 |
| `addr` | Object | 是 | 依赖地址配置 |
| `local` | String | 是 | 本地化名称 |
| `enable` | Boolean | 是 | 是否启用 |

### 依赖地址类型

#### 本地路径依赖
```yaml
deps:
- addr:
    path: ./common_libs          # 相对路径
  local: common_libs
  enable: true

- addr:
    path: /usr/local/lib        # 绝对路径
  local: system_libs
  enable: false
```

#### Git 仓库依赖
```yaml
deps:
- addr:
    repo: https://github.com/user/module.git
    tag: "1.0.0"                # 版本标签
  local: external_module
  enable: true
```

#### 条件依赖
```yaml
deps:
- addr:
    path: ./optional_libs
  local: optional_libs
  enable: "${ENABLE_FEATURES:false}"  # 条件启用

- addr:
    repo: https://github.com/debug/debug-tools.git
    branch: main
  local: debug_tools
  enable: "${BUILD_MODE:debug}" == "debug"
```

#### HTTP URL 依赖
```yaml
deps:
- addr:
    url: https://example.com/dependencies.zip
  local: external_deps
  enable: true
```


## vars.yml - 变量定义

`vars.yml` 定义模块使用的环境变量和配置参数，支持类型安全和验证规则。

### 基本格式

```yaml
vars:
- name: DATABASE_PORT
  desp: "数据库端口号"
  value: 5432

- name: MAX_CONNECTIONS
  value: 100
```

### 字段说明

| 字段 | 类型 | 必需 | 说明 |
|------|------|------|------|
| `name` | String | 是 | 变量名 |
| `desp` | String | 否 | 描述（可选） |
| `value` | String | 是 | 默认值 |
| `type` | String | 否 | 类型（string, integer, boolean, enum） |
| `min` | Number | 否 | 最小值（数字类型） |
| `max` | Number | 否 | 最大值（数字类型） |
| `values` | Array | 否 | 枚举值（枚举类型） |

### 变量类型

#### 字符串变量
```yaml
vars:
- name: MODULE_NAME
  desp: "模块名称"
  value: postgresql

- name: DATA_DIR
  value: "/var/lib/postgresql"
```

#### 整数变量
```yaml
vars:
- name: DATABASE_PORT
  type: integer
  min: 1024
  max: 65535
  value: 5432

- name: MAX_CONNECTIONS
  type: integer
  min: 1
  max: 1000
  value: 100
```

#### 布尔变量
```yaml
vars:
- name: ENABLE_SSL
  type: boolean
  value: false

- name: ENABLE_DEBUG
  type: boolean
  value: true
```


### 变量引用和模板

```yaml
# 支持变量间引用
vars:
- name: INSTALL_PREFIX
  value: "/usr/local"

- name: MODULE_PATH
  value: "${INSTALL_PREFIX}/{{MODULE_NAME}}"

- name: CONFIG_FILE
  value: "${MODULE_PATH}/config.conf"
```

### 环境变量支持

```yaml
# 支持通过环境变量覆盖默认值
vars:
- name: DATABASE_PORT
  value: "${POSTGRES_PORT:5432}"    # 默认 5432，可被 POSTGRES_PORT 环境变量覆盖

- name: INSTALL_PREFIX
  value: "${PREFIX:/usr/local}"     # 默认 /usr/local，可被 PREFIX 环境变量覆盖

- name: DEBUG_MODE
  type: boolean
  value: "${DEBUG:false}"           # 默认 false，可被 DEBUG 环境变量覆盖
```

## setting.yml - 本地化设置

`setting.yml` 配置模板渲染和本地化行为，定义哪些文件需要模板化以及模板标记格式。

### 基本格式

```yaml
localize:
  templatize_path:
    excludes:
    - README.md
    - LICENSE
    - "*.log"

  templatize_cust:
    label_beg: '[['
    label_end: ']]'
```

### 字段说明

| 字段 | 类型 | 必需 | 说明 |
|------|------|------|------|
| `templatize_path` | Object | 否 | 模板路径配置 |
| `templatize_cust` | Object | 否 | 自定义模板标记 |
| `excludes` | Array | 否 | 排除的文件列表 |
| `includes` | Array | 否 | 包含的文件列表（优先级高于 excludes） |
| `label_beg` | String | 否 | 模板开始标记 |
| `label_end` | String | 否 | 模板结束标记 |

### 文件选择策略

#### 排除特定文件
```yaml
localize:
  templatize_path:
    excludes:
    - README.md
    - CHANGELOG.md
    - "*.log"
    - "*.tmp"
```

#### 仅包含特定类型文件
```yaml
localize:
  templatize_path:
    includes:
    - "*.conf"
    - "*.yml"
    - "*.yaml"
    - "templates/*"
```

#### 混合使用
```yaml
localize:
  templatize_path:
    includes:
    - "*.conf"
    - "*.template"
    excludes:
    - "examples/*"
    - "test/*"
```

### 模板标记配置

#### 默认标记（Jinja2 风格）
```yaml
localize:
  templatize_cust:
    label_beg: '{{'
    label_end: '}}'
```

#### 自定义标记
```yaml
localize:
  templatize_cust:
    label_beg: '[['
    label_end: ']]'
```

#### 多种标记支持
```yaml
localize:
  templatize_cust:
    label_beg: '${'
    label_end: '}'
```

### 本地化规则

```yaml
# 为不同环境配置不同的本地化规则
localize:
  # 生产环境配置
  templatize_path:
    excludes:
    - "*.dev"
    - "*.test"

  templatize_cust:
    label_beg: '{{'
    label_end: '}}'

# 开发环境配置
localize:
  templatize_path:
    includes:
    - "*.dev"
    - "config.dev/*"

  templatize_cust:
    label_beg: '[['
    label_end: ']]'
```

## values/_value.yml - 默认值定义

`_value.yml` 存储模块的默认配置值，为模块提供合理的默认行为。







## values/_used.yml - 使用的值定义

`_used.yml` 记录实际使用的配置值及其来源，便于配置审计和问题排查。

### 基本格式

```yaml
SPEED_LIMIT:
  origin: mod-default
  value: 1000
  source_file: "values/_value.yml"

MODULE_NAME:
  origin: mod-default
  value: postgresql

PORT:
  origin: user-override
  value: 5433
  source_file: "user-config.yml"

MAX_CONNECTIONS:
  origin: env-override
  value: 200
  environment_var: "MAX_CONNECTIONS"
```

### 值来源类型

| 来源类型 | 说明 | 示例 |
|----------|------|------|
| `mod-default` | 模块默认值 | 来自 `values/_value.yml` |
| `user-override` | 用户覆盖值 | 来自用户配置文件 |
| `env-override` | 环境变量覆盖 | 来自环境变量 |
| `cmd-line` | 命令行参数 | 来自命令行选项 |
| `template-render` | 模板渲染结果 | 运行时计算值 |


## 工作流配置

### workflows/operators.gxl - 工作流定义

`operators.gxl` 使用 GXL 语言定义模块的运维操作流程，包括安装、配置、启动、停止等任务。

#### 基本结构

```gxl
// 引入外部模块
extern mod mod_ops {
    git = "https://github.com/galaxy-operators/ops-gxl.git",
    channel = "${GXL_CHANNEL_OPS:main}"
}

// 定义操作符模块
mod operators : empty_operators {
    // 自动加载入口
    #[auto_load(entry)]
    flow __into {
        // 加载配置文件
        gx.read_file(
            file : "./values/_used.json",
            name : "SETTING"
        );
    }

    // 任务定义...
}
```

```

#### 常见任务示例

##### 安装任务
```gxl
#[task(name="gops@install")]
flow install {
    };
}
```

##### 启动任务
```gxl
#[task(name="gops@start")]
flow start {
}
```

##### 停止任务
```gxl
#[task(name="gops@stop")]
flow stop {
}
```


## mod-prj.yml - 项目配置

`mod-prj.yml` 定义模块的项目级别配置，包括模块信息、构建目标和发布配置。

### 基本格式

```yaml
# 模块项目配置
name: postgresql
version: 0.1.0
description: "PostgreSQL 数据库管理模块"
maintainer: "PostgreSQL Team <team@example.com>"
license: "Apache-2.0"

# 测试环境配置
test_envs:
  dep_root: "./test-deps"
  deps: []





## 总结

通过合理配置这些配置文件，可以实现：

1. **标准化管理**：统一的配置结构和命名规范
2. **灵活适配**：多平台和环境支持
3. **版本控制**：完整的版本管理和依赖追踪
4. **自动化**：工作流驱动的运维操作
5. **可维护性**：清晰的配置分层和验证机制

遵循本配置指南，可以开发出高质量、可维护、可扩展的 Mod-Operator 模块。
