# Sys-Operator 开发指南

## 概述

Sys-Operator 是 Galaxy Ops 框架中的系统级操作符，用于定义和管理完整的系统环境。它通过组合多个 Mod-Operator 来构建复杂的软件系统，提供系统级的生命周期管理、配置协调和部署自动化能力。

### 核心特性

- **模块组合**: 将多个独立的 Mod-Operator 组合成完整的系统
- **统一管理**: 提供系统级别的统一配置和管理接口
- **多环境支持**: 支持不同目标环境（开发、测试、生产）的系统定义
- **工作流协调**: 协调系统中各个模块的操作流程
- **版本控制**: 系统级别的版本管理和发布机制
- **依赖解析**: 自动解析和管理模块间的依赖关系

### 在 Galaxy Ops 生态系统中的位置

```
Mod-Operator (单个组件) → Sys-Operator (完整系统) → Ops-Project (客户环境)
```

Sys-Operator 作为连接单个组件管理和客户环境部署的桥梁，通过 `gsys` 工具创建和管理，最终通过 `gflow` 执行系统级别的运维操作。

## 文件结构

### 完整的 Sys-Operator 目录结构

```
system_name/
├── _gal/                              # 项目配置目录
│   ├── adm.gxl                       # 系统管理配置
│   ├── work.gxl                      # 工作流环境配置
│   └── project.toml                  # 项目元数据配置
├── sys/                              # 系统定义目录
│   ├── sys_model.yml                 # 系统模型定义
│   ├── mod_list.yml                  # 模块列表定义
│   ├── vars.yml                      # 系统变量定义
│   ├── mods/                         # 模块本地化副本
│   │   ├── module1_name/
│   │   │   └── arm-mac14-host/       # 特定平台配置
│   │   │       ├── spec/             # 规范文件
│   │   │       ├── local/            # 本地化配置
│   │   │       ├── values/           # 值文件
│   │   │       ├── vars.yml          # 模块变量
│   │   │       ├── setting.yml       # 本地化设置
│   │   │       └── workflows/        # 模块工作流
│   │   └── module2_name/
│   │       └── x86-ubt22-k8s/        # 不同平台配置
│   │           └── [相同结构]
│   └── workflows/                    # 系统工作流定义
│       └── operators.gxl             # 系统操作符工作流
├── sys-prj.yml                       # 系统项目配置
├── version.txt                       # 系统版本信息
├── .gitignore                        # Git 忽略文件
└── test_res/                         # 测试资源目录
```

### 目录说明

#### `_gal/` - 项目配置目录
存储 Galaxy 项目的配置文件，包括版本管理、工作流定义和项目元数据。

#### `sys/` - 系统定义目录
包含系统的核心定义文件和模块的本地化副本，是 Sys-Operator 的核心目录。

#### `mods/` - 模块本地化副本
存储系统中包含的各个模块的本地化配置和文件，这些是从模块源地址复制或下载而来的。

#### `workflows/` - 系统工作流目录
包含系统级别的操作流程定义，使用 GXL 语言编写。

## 核心配置文件

### 1. `sys/sys_model.yml` - 系统模型定义

定义系统的基本信息和目标环境。

```yaml
# 基础系统定义
name: example_system                    # 系统名称
model: arm-mac14-host                  # 目标平台模型
vender: Galaxy-Ops                     # 厂商信息（可选）


**字段说明**：
- `name`: 系统名称，必须唯一
- `model`: 目标平台模型，格式为 `arch-os-spc`
- `vender`: 厂商或组织信息

### 2. `sys/mod_list.yml` - 模块列表定义

定义系统包含的模块列表及其配置信息。

```yaml
# 基础模块列表
- name: redis_mock                     # 模块名称
  addr:
    path: ./example/modules/redis_mock  # 模块地址（本地路径）
  model: arm-mac14-host                # 目标平台模型
  enable: true                         # 是否启用

- name: mysql_mock
  addr:
    path: ./example/modules/mysql_mock
  model: arm-mac14-host
  enable: true

# 高级模块列表（包含远程仓库和设置）
- name: nginx_stable
  addr:
    repo: https://github.com/galaxy-operators/nginx    # Git 仓库
    branch: main                                        # 分支
    tag: v1.25.3                                       # 标签（可选）
  model: x86-ubt22-host
  enable: true
  setting:
    src:  ${GXL_PRJ_ROOT}/sys/setting/
    dst:


                             # 默认禁用


```

**字段说明**：
- `name`: 模块名称，与 Mod-Operator 中的名称一致
- `addr`: 模块地址
  - `path`: 本地路径（相对或绝对路径）
  - `repo`: Git 仓库 URL
  - `branch`: Git 分支名称
  - `tag`: Git 标签
  - `channel`: 仓库通道
- `model`: 目标平台模型
- `enable`: 是否启用该模块
- `condition`: 启用条件（可选）
- `setting`: 模块特定设置（可选）
- `vars`: 模块变量覆盖（可选）

### 3. `sys/vars.yml` - 系统变量定义

定义系统级别的环境变量和配置参数。

```yaml
# 基础变量定义
vars:
- name: SYSTEM_NAME                    # 变量名
  desp: "系统名称"                      # 描述（可选）
  value: example_system               # 默认值

- name: ENVIRONMENT
  desp: "部署环境"
  value: development

- name: DOMAIN_NAME
  desp: "系统域名"
  value: example.com

- name: ADMIN_EMAIL
  desp: "管理员邮箱"
  value: admin@example.com

# 带环境变量替换的变量定义
vars:
- name: DATA_CENTER
  desp: "数据中心位置"
  value: "${DATACENTER:us-west-1}"   # 默认值 us-west-1

- name: CLUSTER_NAME
  desp: "集群名称"
  value: "${CLUSTER_NAME:default-cluster}"

- name: NAMESPACE
  desp: "K8s 命名空间"
  value: "${NAMESPACE:galaxy-ops}"

# 类型化的变量定义
vars:
- name: REPLICAS
  type: integer                       # 数据类型
  min: 1                             # 最小值
  max: 10                            # 最大值
  value: 3                           # 默认值

- name: ENABLE_SSL
  type: boolean                      # 布尔类型
  value: true

- name: LOG_LEVEL
  type: enum                         # 枚举类型
  values: [debug, info, warn, error]  # 可选值
  value: info

- name: MEMORY_LIMIT
  type: string
  pattern: "^[0-9]+[MG]i?$"          # 正则模式
  value: "512Mi"

# 分组和分类的变量定义
vars:
# 网络配置
- name: INGRESS_PORT
  group: network
  desp: "入口端口"
  value: 80

- name: SECURE_PORT
  group: network
  desp: "安全端口"
  value: 443

# 数据库配置
- name: DB_HOST
  group: database
  desp: "数据库主机"
  value: postgresql

- name: DB_PORT
  group: database
  desp: "数据库端口"
  value: 5432

# 监控配置
- name: MONITORING_ENABLED
  group: monitoring
  desp: "是否启用监控"
  value: true
```

### 4. `_gal/adm.gxl` - 系统管理配置

定义系统的版本管理和发布配置。

```gxl
// 引入版本管理模块
extern mod ver,git,ver_adm {
    git = "https://github.com/galaxy-operators/cfm-gxl.git",
    channel = "${GXL_CHANNEL:main}"
}

// 环境定义
mod envs {
    env default {
        PKG_NAME = "your_system";        // 系统包名
        VERSION = "1.0.0";              // 系统版本
        MAINTAINER = "devops@example.com";
    }

    env production {
        PKG_NAME = "production-system";
        VERSION = "1.0.0";
        MAINTAINER = "prod-team@example.com";
    }
}

// 主模块继承版本管理功能
mod main : ver_adm {
    // 版本信息任务
    #[task(name="version")]
    flow version {
        gx.echo("System version: ${VERSION}");
        gx.echo("Package name: ${PKG_NAME}");
        gx.echo("Maintainer: ${MAINTAINER}");
    }

    // 发布任务（可选）
    #[task(name="publish")]
    flow publish {
        gx.echo("Publishing system to registry...");
        // 发布逻辑
    }
}
```

### 5. `_gal/work.gxl` - 工作流环境配置

定义系统的工作流环境和执行配置。

```gxl
// 引入操作符和版本管理模块
extern mod operators { path = "./sys/workflows"; }
extern mod ver,git {
    git = "https://github.com/galaxy-operators/cfm-gxl.git",
    channel = "${GXL_CHANNEL:main}"
}

// 环境定义
mod envs {
    // 默认环境
    env default : _common {
        FORCE_FLAG = "";                // 强制标志
        LOG_LEVEL = "";                 // 日志级别
        SYS_BIN = "gsys";              // 系统管理器
        MOD_BIN = "gmod";              // 模块管理器
        SYS = "sys";                    // 系统标识
        MODULE_ENV = "default";         // 模块环境

        // 读取系统模型定义
        gx.read_file(
            file : "sys/sys_model.yml",
            name : "DEFINE"
        );
    }

    // 强制执行环境
    env force {
        FORCE_FLAG = "-f 3";
        LOG_LEVEL = "--log debug";
    }

    // 生产环境
    env production {
        FORCE_FLAG = "-f 2";
        LOG_LEVEL = "--log info";
        MODULE_ENV = "production";
    }

    // 开发环境
    env development {
        FORCE_FLAG = "";
        LOG_LEVEL = "--log debug";
        MODULE_ENV = "development";
    }

    // 通用配置
    env _common {
        BUILD_PATH = "${GXL_PRJ_ROOT}/build";    // 构建路径
        DEPLOY_PATH = "${GXL_PRJ_ROOT}/deploy";   // 部署路径
    }
}

// 主模块继承操作符功能
mod main : operators {
    BUILD_PATH = "${GXL_PRJ_ROOT}/build";

    // 自动加载入口
    #[auto_load(entry)]
    flow ver.use | @_into_main {
        ENV_SYS_MODEL = ${DEFINE.MODEL};          // 设置系统模型
        ENV_PKG_NAME = ${DEFINE.NAME};             // 设置包名
    }

    // 主配置任务
    #[task(name="main conf")]
    flow conf {
        gx.echo("=== 开始系统配置 ===");

        // 更新系统配置
        gx.cmd ("${ENV_SYS_BIN} update ${ENV_LOG_LEVEL} ${ENV_FORCE_FLAG}");

        // 本地化系统配置
        gx.cmd ("${ENV_SYS_BIN} localize ${ENV_LOG_LEVEL}");

        gx.echo("=== 系统配置完成 ===");
    }

    // 系统验证任务
    #[task(name="validate")]
    flow validate {
        gx.echo("=== 开始系统验证 ===");

        // 验证系统模型
        gx.assert(gx.file_exists("sys/sys_model.yml"));

        // 验证模块列表
        gx.assert(gx.file_exists("sys/mod_list.yml"));

        // 验证所有启用的模块
        for ${MODULE} in ${DEFINE.MODULES} {
            if ${MODULE.ENABLE} {
                gx.echo("验证模块: ${MODULE.NAME}");
                // 模块验证逻辑
            }
        }

        gx.echo("=== 系统验证完成 ===");
    }

    // 系统信息任务
    #[task(name="info")]
    flow info {
        gx.echo("=== 系统信息 ===");
        gx.echo("系统名称: ${DEFINE.NAME}");
        gx.echo("目标模型: ${DEFINE.MODEL}");
        gx.echo("厂商: ${DEFINE.VENDER}");
        gx.echo("包含模块数量: ${DEFINE.MODULES_LEN}");
        gx.echo("=== 信息显示完成 ===");
    }
}
```

### 6. `sys/workflows/operators.gxl` - 系统操作符工作流

定义系统级别的操作流程。

```gxl
// 引入系统操作模块
extern mod sys_ops {
    git = "https://github.com/galaxy-operators/ops-gxl.git",
    channel = "${GXL_CHANNEL:main}"
}

// 系统操作符模块
mod operators : sys_ops {
    // 自动加载入口
    #[auto_load(entry)]
    flow __into {
        // 加载系统配置
        gx.read_file(
            file : "sys/sys_model.yml",
            name : "SYSTEM_DEFINE"
        );

        gx.read_file(
            file : "sys/mod_list.yml",
            name : "MODULE_LIST"
        );

        gx.read_file(
            file : "sys/vars.yml",
            name : "SYSTEM_VARS"
        );
    }

    // 系统初始化任务
    #[task(name="gsys@init")]
    flow init {
        gx.echo("=== 开始系统初始化 ===");
        gx.echo("系统名称: ${SYSTEM_DEFINE.NAME}");
        gx.echo("目标平台: ${SYSTEM_DEFINE.MODEL}");

        // 检查系统环境
        gx.echo("1. 检查系统环境...");
        gx.check_environment();

        // 初始化系统目录
        gx.echo("2. 初始化系统目录...");
        gx.cmd("mkdir -p sys/mods");
        gx.cmd("mkdir -p sys/workflows");

        // 初始化各个模块
        gx.echo("3. 初始化系统模块...");
        for ${MODULE} in ${MODULE_LIST} {
            if ${MODULE.ENABLE} {
                gx.echo("初始化模块: ${MODULE.NAME}");
                gx.init_module(${MODULE});
            }
        }

        gx.echo("=== 系统初始化完成 ===");
    }

    // 系统更新任务
    #[task(name="gsys@update")]
    flow update {
        gx.echo("=== 开始系统更新 ===");

        // 更新系统定义
        gx.echo("1. 更新系统定义...");
        gx.update_system_definition();

        // 更新模块列表
        gx.echo("2. 更新模块列表...");
        for ${MODULE} in ${MODULE_LIST} {
            if ${MODULE.ENABLE} {
                gx.echo("更新模块: ${MODULE.NAME}");
                gx.update_module(${MODULE});
            }
        }

        // 验证系统完整性
        gx.echo("3. 验证系统完整性...");
        gx.validate_system_integrity();

        gx.echo("=== 系统更新完成 ===");
    }

    // 系统本地化任务
    #[task(name="gsys@localize")]
    flow localize {
        gx.echo("=== 开始系统本地化 ===");

        // 本地化系统配置
        gx.echo("1. 本地化系统配置...");
        gx.localize_system_config();

        // 本地化各个模块
        gx.echo("2. 本地化系统模块...");
        for ${MODULE} in ${MODULE_LIST} {
            if ${MODULE.ENABLE} {
                gx.echo("本地化模块: ${MODULE.NAME}");
                gx.localize_module(${MODULE});
            }
        }

        // 生成本地化报告
        gx.echo("3. 生成本地化报告...");
        gx.generate_localization_report();

        gx.echo("=== 系统本地化完成 ===");
    }

    // 系统安装任务
    #[task(name="gsys@install")]
    flow install {
        gx.echo("=== 开始系统安装 ===");

        // 预安装检查
        gx.echo("1. 执行预安装检查...");
        gx.pre_install_check();

        // 安装系统依赖
        gx.echo("2. 安装系统依赖...");
        gx.install_system_dependencies();

        // 安装各个模块
        gx.echo("3. 安装系统模块...");
        for ${MODULE} in ${MODULE_LIST} {
            if ${MODULE.ENABLE} {
                gx.echo("安装模块: ${MODULE.NAME}");
                gx.install_module(${MODULE});
            }
        }

        // 系统配置
        gx.echo("4. 配置系统...");
        gx.configure_system();

        // 验证安装
        gx.echo("5. 验证安装结果...");
        gx.validate_installation();

        gx.echo("=== 系统安装完成 ===");
    }

    // 系统启动任务
    #[task(name="gsys@start")]
    flow start {
        gx.echo("=== 开始系统启动 ===");

        // 启动系统服务
        gx.echo("1. 启动系统服务...");
        gx.start_system_services();

        // 按依赖顺序启动模块
        gx.echo("2. 启动系统模块...");
        for ${MODULE} in ${MODULE_LIST} {
            if ${MODULE.ENABLE} {
                gx.echo("启动模块: ${MODULE.NAME}");
                gx.start_module(${MODULE});
            }
        }

        // 健康检查
        gx.echo("3. 执行健康检查...");
        gx.health_check();

        gx.echo("=== 系统启动完成 ===");
    }

    // 系统停止任务
    #[task(name="gsys@stop")]
    flow stop {
        gx.echo("=== 开始系统停止 ===");

        // 按反向依赖顺序停止模块
        gx.echo("1. 停止系统模块...");
        for ${MODULE} in ${REVERSE_MODULE_LIST} {
            if ${MODULE.ENABLE} {
                gx.echo("停止模块: ${MODULE.NAME}");
                gx.stop_module(${MODULE});
            }
        }

        // 停止系统服务
        gx.echo("2. 停止系统服务...");
        gx.stop_system_services();

        gx.echo("=== 系统停止完成 ===");
    }

    // 系统状态检查任务
    #[task(name="gsys@status")]
    flow status {
        gx.echo("=== 系统状态检查 ===");

        // 检查系统服务状态
        gx.echo("1. 检查系统服务状态...");
        gx.check_system_services_status();

        // 检查模块状态
        gx.echo("2. 检查系统模块状态...");
        for ${MODULE} in ${MODULE_LIST} {
            if ${MODULE.ENABLE} {
                gx.echo("检查模块: ${MODULE.NAME}");
                gx.check_module_status(${MODULE});
            }
        }

        // 生成状态报告
        gx.echo("3. 生成状态报告...");
        gx.generate_status_report();

        gx.echo("=== 系统状态检查完成 ===");
    }
}
```

### 7. `sys-prj.yml` - 系统项目配置

定义系统项目的配置信息。

```yaml
# 基础系统项目配置
test_envs:
  dep_root: ""                              # 依赖根目录
  deps: []                                  # 测试依赖列表

# 高级系统项目配置
name: "Production Web System"               # 系统项目名称
version: "1.0.0"                           # 项目版本
description: "Production web application system with monitoring"

# 测试环境配置
test_envs:
  dep_root: "./test_deps"                   # 依赖根目录
  deps:
    - addr:
        repo: https://github.com/galaxy-operators/bitnami-common.git
      local: ./test_res/bit-common          # 本地路径
      rename: bit-common                    # 重命名
      enable: true                          # 是否启用

    - addr:
        path: ./test_deps/test-data         # 本地路径依赖
      local: test-data
      enable: true

# 构建配置
build:
  # 构建目标
  targets:
    - arm-mac14-host
    - x86-ubt22-host
    - x86-ubt22-k8s

  # 构建选项
  options:
    parallel: true                          # 并行构建
    cache_enabled: true                     # 启用缓存
    cache_dir: "./build/cache"             # 缓存目录

  # 构建输出
  output:
    format: "tar.gz"                       # 输出格式
    destination: "./build/dist"            # 输出目录

# 发布配置
publish:
  repo: "https://github.com/galaxy-operators/systems"  # 发布仓库
  branch: "main"                           # 发布分支
  tag_format: "v${version}"                # 标签格式

  # 发布环境
  environments:
    staging:
      repo: "https://github.com/galaxy-operators/systems-staging"
      branch: "staging"
    production:
      repo: "https://github.com/galaxy-operators/systems-production"
      branch: "main"
      auto_tag: true                        # 自动打标签

# 质量检查
quality:
  # 代码检查
  lint:
    enabled: true
    rules:
      - no-hardcoded-secrets
      - consistent-naming
      - security-checks

  # 测试配置
  test:
    enabled: true
    types:
      - unit
      - integration
      - e2e
    coverage_threshold: 80                 # 覆盖率阈值

# 安全配置
security:
  # 敏感信息扫描
  secret_scanning:
    enabled: true
    patterns:
      - "API_KEY"
      - "PASSWORD"
      - "TOKEN"
      - "SECRET"

  # 许可证检查
  license_check:
    enabled: true
    allowed:
      - "MIT"
      - "Apache-2.0"
      - "BSD-3-Clause"
    forbidden:
      - "GPL-3.0"
      - "AGPL-3.0"

# 监控配置
monitoring:
  # 构建监控
  build:
    enabled: true
    metrics:
      - build_duration
      - build_success_rate
      - artifact_size

  # 运行时监控
  runtime:
    enabled: true
    endpoints:
      - health
      - metrics
      - logging
```

## 开发工作流

### 1. 创建新系统

使用 `gsys` 工具创建新的系统：

```bash
# 创建基础系统
gsys new web_system

# 创建指定模型的系统
gsys new web_system --model x86-ubt22-k8s

# 从模板创建系统
gsys new web_system --template microservice

# 创建带厂商信息的系统
gsys new enterprise_system --vendor "Enterprise Corp" --model arm-mac14-host
```

### 2. 定义系统规范

编辑系统核心配置文件：

```bash
# 编辑系统模型定义
vim sys/sys_model.yml

# 编辑模块列表
vim sys/mod_list.yml

# 编辑系统变量
vim sys/vars.yml

# 编辑项目配置
vim sys-prj.yml
```

### 3. 添加模块到系统

在 `mod_list.yml` 中添加新模块：

```yaml
# 添加本地模块
- name: custom_module
  addr:
    path: ./local_modules/custom_module
  model: arm-mac14-host
  enable: true

# 添加远程模块
- name: redis_official
  addr:
    repo: https://github.com/galaxy-operators/redis
    tag: v7.2.4
  model: x86-ubt22-k8s
  enable: true
```

### 4. 配置系统工作流

编辑系统工作流文件：

```bash
# 编辑系统操作符工作流
vim sys/workflows/operators.gxl

# 编辑项目工作流配置
vim _gal/work.gxl

# 编辑系统管理配置
vim _gal/adm.gxl
```

### 5. 测试系统

使用 `gflow` 测试系统功能：

```bash
# 初始化系统
gflow run gsys@init --path ./system_name

# 验证系统配置
gflow run gsys@validate --path ./system_name

# 本地化系统
gflow run gsys@localize --path ./system_name

# 安装系统
gflow run gsys@install --path ./system_name

# 启动系统
gflow run gsys@start --path ./system_name
```

### 6. 验证系统状态

检查系统运行状态：

```bash
# 检查系统状态
gflow run gsys@status --path ./system_name

# 查看系统信息
gflow run info --path ./system_name
```

### 7. 发布系统

将系统推送到系统仓库：

```bash
# 发布到开发环境
gsys publish system_name --env development

# 发布到生产环境
gsys publish system_name --env production

# 自动打标签发布
gsys publish system_name --auto-tag
```

## 最佳实践

### 1. 系统设计原则

#### 模块化设计
将复杂系统分解为功能明确的模块，每个模块负责特定功能。

```yaml
# 好的例子：功能明确的模块划分
- name: web_frontend          # 前端服务
  model: x86-ubt22-k8s
  enable: true

- name: api_gateway           # API 网关
  model: x86-ubt22-k8s
  enable: true

- name: user_service          # 用户服务
  model: x86-ubt22-k8s
  enable: true

- name: order_service         # 订单服务
  model: x86-ubt22-k8s
  enable: true

- name: database              # 数据库
  model: x86-ubt22-host
  enable: true

# 不好的例子：功能混乱的系统
- name: monolithic_app        # 单体应用
  model: x86-ubt22-host
  enable: true
```

#### 环境一致性
确保在不同环境（开发、测试、生产）中使用一致的系统定义。

```yaml
# 使用条件变量实现环境差异
- name: monitoring_stack
  model: x86-ubt22-k8s
  enable: "${ENVIRONMENT:development}" == "production"
  vars:
    - name: RETENTION_DAYS
      value: "${RETENTION_DAYS:30}"
    - name: STORAGE_SIZE
      value: "${STORAGE_SIZE:100Gi}"
```

#### 依赖管理
明确管理模块间的依赖关系，避免循环依赖。

```yaml
# 明确的启动顺序依赖
- name: database              # 基础服务
  model: x86-ubt22-host
  enable: true
  priority: 100               # 启动优先级

- name: cache_service         # 缓存服务
  model: x86-ubt22-k8s
  enable: true
  priority: 90
  depends_on: ["database"]

- name: user_service          # 业务服务
  model: x86-ubt22-k8s
  enable: true
  priority: 80
  depends_on: ["database", "cache_service"]

- name: web_frontend          # 前端服务
  model: x86-ubt22-k8s
  enable: true
  priority: 70
  depends_on: ["user_service", "api_gateway"]
```

### 2. 配置管理最佳实践

#### 变量命名规范
使用清晰、一致的变量命名约定。

```yaml
# 好的命名规范
vars:
# 系统级配置
- name: SYSTEM_NAME
  value: "production-web-system"

- name: ENVIRONMENT
  value: "production"

- name: VERSION
  value: "1.0.0"

# 网络配置
- name: INGRESS_PORT
  value: 80

- name: SECURE_PORT
  value: 443

- name: DOMAIN_NAME
  value: "example.com"

# 数据库配置
- name: DATABASE_HOST
  value: "postgres-primary"

- name: DATABASE_PORT
  value: 5432

- name: DATABASE_NAME
  value: "production_db"

# 监控配置
- name: MONITORING_ENABLED
  value: true

- name: ALERT_EMAIL
  value: "alerts@example.com"

# 不好的命名
- name: sys_name
  value: "prod-web"

- name: db_host
  value: "postgres"

- name: port
  value: 5432
```

#### 环境变量支持
支持通过环境变量覆盖配置。

```yaml
vars:
# 支持环境变量覆盖的配置
- name: DATABASE_HOST
  value: "${DATABASE_HOST:localhost}"         # 默认值 localhost

- name: DATABASE_PORT
  value: "${DATABASE_PORT:5432}"              # 默认值 5432

- name: ENABLE_SSL
  value: "${ENABLE_SSL:false}"               # 默认值 false

- name: LOG_LEVEL
  value: "${LOG_LEVEL:info}"                 # 默认值 info

- name: MAX_CONNECTIONS
  value: "${MAX_CONNECTIONS:100}"             # 默认值 100

# 条件性配置
- name: DEBUG_MODE
  value: "${DEBUG_MODE:false}"

- name: PROFILE_API_ENABLED
  value: "${PROFILE_API_ENABLED:${DEBUG_MODE:false}}"
```

#### 配置验证
为关键配置添加验证规则。

```yaml
vars:
# 带验证的配置
- name: INGRESS_PORT
  type: integer
  min: 1
  max: 65535
  value: 80

- name: DATABASE_PORT
  type: integer
  min: 1
  max: 65535
  value: 5432

- name: ENABLE_SSL
  type: boolean
  value: true

- name: LOG_LEVEL
  type: enum
  values: [debug, info, warn, error]
  value: info

- name: MEMORY_LIMIT
  type: string
  pattern: "^[0-9]+[MG]i?$"
  value: "512Mi"

- name: DOMAIN_NAME
  type: string
  pattern: "^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$"
  value: "example.com"
```

### 3. 工作流设计最佳实践

#### 错误处理
在工作流中包含完善的错误处理和回滚机制。

```gxl
flow install {
    try {
        // 预安装检查
        gx.echo("执行预安装检查...");
        gx.pre_install_check();

        // 安装系统依赖
        gx.echo("安装系统依赖...");
        gx.install_system_dependencies();

        // 安装各个模块
        gx.echo("安装系统模块...");
        for ${MODULE} in ${MODULE_LIST} {
            if ${MODULE.ENABLE} {
                try {
                    gx.echo("安装模块: ${MODULE.NAME}");
                    gx.install_module(${MODULE});
                } catch (error) {
                    gx.echo("模块 ${MODULE.NAME} 安装失败: ${error}");
                    gx.echo("开始回滚...");
                    gx.rollback_module(${MODULE});
                    throw error;
                }
            }
        }

        // 系统配置
        gx.echo("配置系统...");
        gx.configure_system();

        // 验证安装
        gx.echo("验证安装结果...");
        gx.validate_installation();

        gx.echo("系统安装完成");
    } catch (error) {
        gx.echo("系统安装失败: ${error}");
        gx.echo("执行系统回滚...");
        gx.rollback_system();
        throw error;
    }
}
```

#### 幂等性设计
确保工作流可以安全地重复执行。

```gxl
flow start {
    gx.echo("开始系统启动...");

    // 检查系统状态
    let system_status = gx.get_system_status();
    if system_status == "running" {
        gx.echo("系统已在运行，跳过启动步骤");
        return;
    }

    // 启动系统服务
    if !gx.service_exists("system-core") {
        gx.echo("启动系统核心服务...");
        gx.start_service("system-core");
    }

    // 按依赖顺序启动模块
    for ${MODULE} in ${ORDERED_MODULE_LIST} {
        if ${MODULE.ENABLE} {
            let module_status = gx.get_module_status(${MODULE.NAME});
            if module_status != "running" {
                gx.echo("启动模块: ${MODULE.NAME}");
                gx.start_module(${MODULE.NAME});
            } else {
                gx.echo("模块 ${MODULE.NAME} 已在运行，跳过");
            }
        }
    }

    // 最终健康检查
    gx.echo("执行系统健康检查...");
    gx.health_check();

    gx.echo("系统启动完成");
}
```

#### 进度反馈
提供清晰的执行进度和状态反馈。

```gxl
flow install {
    gx.echo("=== 开始系统安装 ===");
    gx.echo("系统名称: ${SYSTEM_DEFINE.NAME}");
    gx.echo("目标平台: ${SYSTEM_DEFINE.MODEL}");
    gx.echo("包含模块数量: ${MODULE_COUNT}");

    // 阶段1: 环境检查
    gx.echo("阶段 1/5: 环境检查...");
    gx.echo("  - 检查系统兼容性...");
    gx.check_system_compatibility();
    gx.echo("  ✓ 系统兼容性检查通过");

    gx.echo("  - 检查磁盘空间...");
    gx.check_disk_space();
    gx.echo("  ✓ 磁盘空间检查通过");

    gx.echo("  - 检查网络连接...");
    gx.check_network_connectivity();
    gx.echo("  ✓ 网络连接检查通过");

    // 阶段2: 依赖安装
    gx.echo("阶段 2/5: 依赖安装...");
    gx.echo("  - 安装系统依赖包...");
    gx.install_system_packages();
    gx.echo("  ✓ 系统依赖包安装完成");

    gx.echo("  - 配置系统环境...");
    gx.configure_system_environment();
    gx.echo("  ✓ 系统环境配置完成");

    // 阶段3: 模块安装
    gx.echo("阶段 3/5: 模块安装...");
    let installed_count = 0;
    for ${MODULE} in ${MODULE_LIST} {
        if ${MODULE.ENABLE} {
            gx.echo("  - 安装模块 ${MODULE.NAME}...");
            gx.install_module(${MODULE});
            installed_count++;
            gx.echo("  ✓ 模块 ${MODULE.NAME} 安装完成 (${installed_count}/${MODULE_COUNT})");
        }
    }

    // 阶段4: 系统配置
    gx.echo("阶段 4/5: 系统配置...");
    gx.echo("  - 生成系统配置文件...");
    gx.generate_system_configs();
    gx.echo("  ✓ 系统配置文件生成完成");

    gx.echo("  - 应用安全策略...");
    gx.apply_security_policies();
    gx.echo("  ✓ 安全策略应用完成");

    // 阶段5: 验证测试
    gx.echo("阶段 5/5: 验证测试...");
    gx.echo("  - 执行安装验证...");
    gx.validate_installation();
    gx.echo("  ✓ 安装验证通过");

    gx.echo("  - 执行健康检查...");
    gx.health_check();
    gx.echo("  ✓ 健康检查通过");

    gx.echo("=== 系统安装完成 ===");
    gx.echo("总计安装模块: ${installed_count}");
    gx.echo("安装用时: ${DURATION}");
}
```

### 4. 安全最佳实践

#### 最小权限原则
为系统和服务配置最小必要权限。

```yaml
# 安全配置示例
vars:
# 运行时用户
- name: RUNTIME_USER
  value: "galaxyops"

- name: RUNTIME_GROUP
  value: "galaxyops"

# 文件权限
- name: CONFIG_FILE_PERMISSIONS
  value: "640"

- name: EXECUTABLE_PERMISSIONS
  value: "750"

- name: DATA_DIR_PERMISSIONS
  value: "750"

# 网络安全
- name: BIND_ADDRESS
  value: "127.0.0.1"          # 默认绑定本地地址

- name: ALLOWED_HOSTS
  value: "localhost,127.0.0.1"

# 认证配置
- name: ENABLE_AUTHENTICATION
  value: true

- name: AUTH_METHOD
  value: "token"

- name: TOKEN_EXPIRY_HOURS
  value: 24

# TLS 配置
- name: ENABLE_TLS
  value: true

- name: TLS_CERT_FILE
  value: "/etc/ssl/certs/system.crt"

- name: TLS_KEY_FILE
  value: "/etc/ssl/private/system.key"
```

#### 敏感信息保护
避免在配置文件中硬编码敏感信息。

```gxl
# 从安全存储读取敏感信息
flow configure_security {
    gx.echo("配置安全设置...");

    // 从环境变量读取数据库密码
    let db_password = gx.get_env("DATABASE_PASSWORD");
    if !db_password {
        throw "DATABASE_PASSWORD environment variable is required";
    }

    // 从密钥管理服务读取 API 密钥
    let api_key = gx.get_secret("system/api_key");
    if !api_key {
        throw "Failed to retrieve API key from secret store";
    }

    // 生成配置文件，不包含敏感信息
    gx.echo("生成安全配置文件...");
    gx.generate_config_with_secrets({
        "database": {
            "host": "${DATABASE_HOST}",
            "port": ${DATABASE_PORT},
            "username": "${DATABASE_USER}",
            "password": db_password        // 从安全存储获取
        },
        "api": {
            "endpoint": "${API_ENDPOINT}",
            "key": api_key                 // 从密钥管理服务获取
        }
    });

    gx.echo("安全配置完成");
}
```

#### 审计日志
记录系统关键操作的审计日志。

```gxl
flow install {
    gx.echo("开始系统安装...");

    // 记录安装开始事件
    gx.log_audit({
        "event": "system_install_start",
        "timestamp": gx.now(),
        "user": gx.current_user(),
        "system_name": "${SYSTEM_DEFINE.NAME}",
        "target_model": "${SYSTEM_DEFINE.MODEL}"
    });

    try {
        // 执行安装步骤...
        gx.install_system_dependencies();
        gx.install_modules();
        gx.configure_system();

        // 记录安装成功事件
        gx.log_audit({
            "event": "system_install_success",
            "timestamp": gx.now(),
            "user": gx.current_user(),
            "system_name": "${SYSTEM_DEFINE.NAME}",
            "duration": gx.duration(),
            "installed_modules": ${INSTALLED_MODULES}
        });

        gx.echo("系统安装完成");
    } catch (error) {
        // 记录安装失败事件
        gx.log_audit({
            "event": "system_install_failure",
            "timestamp": gx.now(),
            "user": gx.current_user(),
            "system_name": "${SYSTEM_DEFINE.NAME}",
            "duration": gx.duration(),
            "error": error,
            "failed_step": "${CURRENT_STEP}"
        });

        gx.echo("系统安装失败: ${error}");
        throw error;
    }
}
```

## 调试和故障排除

### 1. 常见问题

#### 系统初始化失败
```bash
# 检查系统文件结构
ls -la system_name/sys/
ls -la system_name/_gal/

# 验证系统模型配置
gsys validate system_name --verbose

# 检查模型定义格式
cat system_name/sys/sys_model.yml | yq .

# 验证模块列表语法
cat system_name/sys/mod_list.yml | yq .
```

#### 模块依赖冲突
```bash
# 查看模块依赖关系
gsys deps system_name --graph

# 检查循环依赖
gsys deps system_name --check-cycles

# 验证模块兼容性
gsys validate system_name --check-module-compatibility

# 查看模块详细信息
gsys info system_name --modules
```

#### 本地化失败
```bash
# 检查模块源地址
gsys localize system_name --check-sources

# 验证本地化设置
gsys localize system_name --validate-config

# 手动测试模块本地化
gsys localize system_name --dry-run

# 查看本地化详细日志
gsys localize system_name --log-level debug
```

### 2. 调试技巧

#### 使用断言验证系统状态
```gxl
flow install {
    gx.echo("开始系统安装...");

    // 验证系统目录结构
    gx.assert(gx.path_exists("sys/sys_model.yml"), "系统模型文件不存在");
    gx.assert(gx.path_exists("sys/mod_list.yml"), "模块列表文件不存在");
    gx.assert(gx.path_exists("sys/vars.yml"), "系统变量文件不存在");

    // 验证模型定义
    let system_model = gx.read_yaml("sys/sys_model.yml");
    gx.assert(system_model.name != "", "系统名称不能为空");
    gx.assert(system_model.model != "", "目标模型不能为空");

    // 验证模块列表
    let module_list = gx.read_yaml("sys/mod_list.yml");
    gx.assert(module_list.length > 0, "模块列表不能为空");

    // 验证每个模块配置
    for ${MODULE} in module_list {
        gx.assert(${MODULE.NAME} != "", "模块名称不能为空");
        gx.assert(${MODULE.ADDR} != null, "模块地址不能为空");
        gx.assert(${MODULE.MODEL} != "", "目标模型不能为空");
    }

    gx.echo("系统配置验证通过");
}
```

#### 分步调试工作流
```gxl
flow debug_install {
    gx.echo("=== 调试模式安装 ===");

    // 步骤1：验证输入
    flow step_1_validate_input {
        gx.echo("步骤1: 验证输入配置...");
        gx.validate_system_config();
        gx.validate_module_configs();
        gx.echo("✓ 输入配置验证通过");
    }

    // 步骤2：检查环境
    flow step_2_check_environment {
        gx.echo("步骤2: 检查系统环境...");
        gx.check_os_compatibility();
        gx.check_disk_space();
        gx.check_network_connectivity();
        gx.check_required_tools();
        gx.echo("✓ 系统环境检查通过");
    }

    // 步骤3：准备目录
    flow step_3_prepare_directories {
        gx.echo("步骤3: 准备系统目录...");
        gx.prepare_system_directories();
        gx.prepare_module_directories();
        gx.echo("✓ 目录准备完成");
    }

    // 步骤4：下载依赖
    flow step_4_download_dependencies {
        gx.echo("步骤4: 下载系统依赖...");
        gx.download_system_dependencies();
        gx.echo("✓ 系统依赖下载完成");
    }

    // 步骤5：安装模块
    flow step_5_install_modules {
        gx.echo("步骤5: 安装系统模块...");
        for ${MODULE} in ${MODULE_LIST} {
            if ${MODULE.ENABLE} {
                gx.echo("  安装模块: ${MODULE.NAME}");
                gx.install_module(${MODULE});
            }
        }
        gx.echo("✓ 模块安装完成");
    }

    // 逐步执行
    step_1_validate_input();
    step_2_check_environment();
    step_3_prepare_directories();
    step_4_download_dependencies();
    step_5_install_modules();

    gx.echo("=== 调试安装完成 ===");
}
```

#### 详细日志记录
```gxl
flow install_with_logging {
    gx.log_info("开始系统安装流程");
    gx.log_debug("系统配置: ${SYSTEM_CONFIG}");

    let start_time = gx.now();

    try {
        // 环境检查
        gx.log_info("执行环境检查阶段");
        gx.check_environment();
        gx.log_debug("环境检查完成");

        // 依赖安装
        gx.log_info("执行依赖安装阶段");
        let deps_start = gx.now();
        gx.install_dependencies();
        let deps_duration = gx.now() - deps_start;
        gx.log_info("依赖安装完成，耗时: ${deps_duration}ms");

        // 模块安装
        gx.log_info("执行模块安装阶段");
        for ${MODULE} in ${MODULE_LIST} {
            if ${MODULE.ENABLE} {
                gx.log_info("安装模块: ${MODULE.NAME}");
                let module_start = gx.now();
                gx.install_module(${MODULE});
                let module_duration = gx.now() - module_start;
                gx.log_info("模块 ${MODULE.NAME} 安装完成，耗时: ${module_duration}ms");
            }
        }

        // 配置应用
        gx.log_info("执行配置应用阶段");
        gx.apply_configurations();
        gx.log_debug("配置应用完成");

        // 验证测试
        gx.log_info("执行验证测试阶段");
        gx.validate_installation();
        gx.log_info("验证测试通过");

        let total_duration = gx.now() - start_time;
        gx.log_info("系统安装完成，总耗时: ${total_duration}ms");

    } catch (error) {
        let error_duration = gx.now() - start_time;
        gx.log_error("系统安装失败，耗时: ${error_duration}ms");
        gx.log_error("错误详情: ${error}");
        throw error;
    }
}
```

### 3. 性能调优

#### 并行化模块操作
```gxl
flow install_parallel {
    gx.echo("开始并行系统安装...");

    // 识别无依赖关系的模块组
    let module_groups = gx.identify_parallel_groups(${MODULE_LIST});

    gx.echo("识别出 ${module_groups.length} 个并行组");

    // 按组并行安装
    for ${GROUP} in module_groups {
        gx.echo("并行安装组 ${GROUP.INDEX}，包含 ${GROUP.MODULES.length} 个模块");

        // 并行执行模块安装
        let parallel_tasks = [];
        for ${MODULE} in ${GROUP.MODULES} {
            let task = async {
                gx.echo("  启动安装模块: ${MODULE.NAME}");
                let result = gx.install_module(${MODULE});
                gx.echo("  ✓ 模块 ${MODULE.NAME} 安装完成");
                return result;
            };
            parallel_tasks.push(task);
        }

        // 等待所有任务完成
        let results = gx.wait_all(parallel_tasks);

        // 检查是否有失败的安装
        for ${RESULT} in results {
            if ${RESULT.STATUS} == "failed" {
                gx.log_error("模块安装失败: ${RESULT.MODULE}");
                throw "Module installation failed";
            }
        }

        gx.echo("✓ 组 ${GROUP.INDEX} 安装完成");
    }

    gx.echo("并行系统安装完成");
}
```

#### 缓存优化
```gxl
flow install_with_cache {
    gx.echo("开始带缓存的系统安装...");

    // 初始化缓存管理器
    let cache_manager = gx.cache_manager({
        "cache_dir": "./cache",
        "max_size": "10GB",
        "ttl": "7d"
    });

    // 检查缓存是否有效
    if cache_manager.is_valid("system_deps") {
        gx.echo("使用缓存的系统依赖");
        cache_manager.restore("system_deps");
    } else {
        gx.echo("下载系统依赖并缓存");
        gx.download_system_dependencies();
        cache_manager.store("system_deps", "./deps");
    }

    // 安装模块（利用模块级缓存）
    for ${MODULE} in ${MODULE_LIST} {
        if ${MODULE.ENABLE} {
            let cache_key = "module_${MODULE.NAME}_${MODULE.VERSION}";

            if cache_manager.is_valid(cache_key) {
                gx.echo("使用缓存的模块: ${MODULE.NAME}");
                cache_manager.restore(cache_key);
            } else {
                gx.echo("安装模块并缓存: ${MODULE.NAME}");
                gx.install_module(${MODULE});
                cache_manager.store(cache_key, ${MODULE.LOCAL_PATH});
            }
        }
    }

    // 清理过期缓存
    gx.echo("清理过期缓存...");
    cache_manager.cleanup();

    gx.echo("带缓存的系统安装完成");
}
```

#### 资源限制
```gxl
flow install_with_resource_limits {
    gx.echo("开始资源限制安装...");

    // 设置资源限制
    let resource_limits = {
        "max_memory": "4GB",
        "max_cpu": "80%",
        "max_disk_io": "100MB/s",
        "max_network_io": "50MB/s"
    };

    gx.set_resource_limits(resource_limits);

    try {
        // 监控资源使用
        gx.start_resource_monitoring();

        // 分批安装模块以避免资源过载
        let batch_size = 2;  // 每批安装的模块数量

        for ${BATCH} in ${MODULE_LIST.batch(batch_size)} {
            gx.echo("安装批次 ${BATCH.INDEX}/${MODULE_LIST.batch_count(batch_size)}");

            for ${MODULE} in ${BATCH.MODULES} {
                if ${MODULE.ENABLE} {
                    gx.echo("  安装模块: ${MODULE.NAME}");
                    gx.install_module(${MODULE});

                    // 检查资源使用
                    let resource_usage = gx.get_resource_usage();
                    gx.log_debug("资源使用: ${resource_usage}");

                    // 如果资源使用过高，等待资源释放
                    if resource_usage.memory > resource_limits.max_memory * 0.9 {
                        gx.echo("  内存使用过高，等待资源释放...");
                        gx.sleep(30);
                    }
                }
            }

            // 批次间等待
            gx.echo("批次完成，等待资源稳定...");
            gx.sleep(10);
        }

        gx.stop_resource_monitoring();
        gx.echo("资源限制安装完成");

    } catch (error) {
        gx.stop_resource_monitoring();
        gx.log_error("安装失败: ${error}");
        throw error;
    }
}
```

## 示例系统

### 1. 微服务系统示例

完整的微服务系统配置：

```yaml
# sys/sys_model.yml
name: microservice_platform
model: x86-ubt22-k8s
vender: TechCorp
metadata:
  description: "Microservice platform with API gateway and services"
  version: "2.0.0"
  tags: [microservice, k8s, production]

# sys/mod_list.yml
- name: nginx_ingress
  addr:
    repo: https://github.com/galaxy-operators/nginx
    tag: v1.25.3
  model: x86-ubt22-k8s
  enable: true
  vars:
    - name: INGRESS_CONTROLLER
      value: "nginx"
    - name: SSL_TERMINATION
      value: true

- name: api_gateway
  addr:
    repo: https://github.com/galaxy-operators/api-gateway
    tag: v2.1.0
  model: x86-ubt22-k8s
  enable: true
  vars:
    - name: RATE_LIMIT
      value: 1000
    - name: AUTH_ENABLED
      value: true
    - name: CIRCUIT_BREAKER
      value: true

- name: user_service
  addr:
    repo: https://github.com/galaxy-operators/user-service
    tag: v3.0.0
  model: x86-ubt22-k8s
  enable: true
  depends_on: ["postgres_database"]
  vars:
    - name: REPLICAS
      value: 3
    - name: DATABASE_HOST
      value: "postgres-service"
    - name: JWT_SECRET
      value: "${JWT_SECRET}"

- name: order_service
  addr:
    repo: https://github.com/galaxy-operators/order-service
    tag: v2.5.0
  model: x86-ubt22-k8s
  enable: true
  depends_on: ["postgres_database", "redis_cache"]
  vars:
    - name: REPLICAS
      value: 2
    - name: DATABASE_HOST
      value: "postgres-service"
    - name: CACHE_HOST
      value: "redis-service"

- name: postgres_database
  addr:
    repo: https://github.com/galaxy-operators/postgresql
    tag: v16.2.0
  model: x86-ubt22-host
  enable: true
  vars:
    - name: POSTGRES_VERSION
      value: "16"
    - name: DATABASE_NAME
      value: "microservices"
    - name: MAX_CONNECTIONS
      value: 200

- name: redis_cache
  addr:
    repo: https://github.com/galaxy-operators/redis
    tag: v7.2.4
  model: x86-ubt22-k8s
  enable: true
  vars:
    - name: REDIS_VERSION
      value: "7.2"
    - name: MAX_MEMORY
      value: "512MB"

- name: monitoring_stack
  addr:
    repo: https://github.com/galaxy-operators/monitoring
    tag: v1.8.0
  model: x86-ubt22-k8s
  enable: "${ENABLE_MONITORING:true}"
  vars:
    - name: GRAFANA_ENABLED
      value: true
    - name: PROMETHEUS_ENABLED
      value: true
    - name: ALERTMANAGER_ENABLED
      value: true

# sys/vars.yml
vars:
# 系统配置
- name: ENVIRONMENT
  value: "${ENVIRONMENT:production}"

- name: DOMAIN_NAME
  value: "${DOMAIN_NAME:example.com}"

- name: NAMESPACE
  value: "${NAMESPACE:microservices}"

# 安全配置
- name: JWT_SECRET
  value: "${JWT_SECRET}"

- name: ENABLE_SSL
  value: "${ENABLE_SSL:true}"

- name: SSL_CERT_PATH
  value: "/etc/ssl/certs/tls.crt"

- name: SSL_KEY_PATH
  value: "/etc/ssl/private/tls.key"

# 性能配置
- name: DEFAULT_REPLICAS
  value: "${DEFAULT_REPLICAS:2}"

- name: MAX_REPLICAS
  value: "${MAX_REPLICAS:5}"

- name: CPU_REQUEST
  value: "${CPU_REQUEST:100m}"

- name: MEMORY_REQUEST
  value: "${MEMORY_REQUEST:256Mi}"

# 监控配置
- name: ENABLE_MONITORING
  value: "${ENABLE_MONITORING:true}"

- name: MONITORING_RETENTION
  value: "${MONITORING_RETENTION:30d}"

- name: ALERT_EMAIL
  value: "${ALERT_EMAIL:alerts@example.com}"
```

### 2. 数据处理平台示例

大数据处理平台的系统配置：

```yaml
# sys/sys_model.yml
name: data_processing_platform
model: x86-ubt22-host
vender: DataCorp
metadata:
  description: "Big data processing platform with Hadoop ecosystem"
  version: "1.5.0"
  tags: [bigdata, hadoop, batch-processing]

# sys/mod_list.yml
- name: hadoop_common
  addr:
    repo: https://github.com/galaxy-operators/hadoop
    tag: v3.3.6
  model: x86-ubt22-host
  enable: true
  vars:
    - name: HADOOP_VERSION
      value: "3.3.6"
    - name: JAVA_HOME
      value: "${JAVA_HOME:/usr/lib/jvm/java-11-openjdk}"

- name: hdfs_namenode
  addr:
    repo: https://github.com/galaxy-operators/hadoop-hdfs
    tag: v3.3.6
  model: x86-ubt22-host
  enable: true
  depends_on: ["hadoop_common"]
  vars:
    - name: NAMENODE_PORT
      value: 9820
    - name: REPLICATION_FACTOR
      value: 3

- name: hdfs_datanode
  addr:
    repo: https://github.com/galaxy-operators/hadoop-hdfs
    tag: v3.3.6
  model: x86-ubt22-host
  enable: true
  depends_on: ["hdfs_namenode"]
  vars:
    - name: DATANODE_PORT
      value: 9866
    - name: DATA_DIR
      value: "/data/hdfs/data"

- name: yarn_resourcemanager
  addr:
    repo: https://github.com/galaxy-operators/hadoop-yarn
    tag: v3.3.6
  model: x86-ubt22-host
  enable: true
  depends_on: ["hadoop_common"]
  vars:
    - name: RESOURCEMANAGER_PORT
      value: 8032
    - name: MAX_CONTAINER_MEMORY
      value: "8192"

- name: yarn_nodemanager
  addr:
    repo: https://github.com/galaxy-operators/hadoop-yarn
    tag: v3.3.6
  model: x86-ubt22-host
  enable: true
  depends_on: ["yarn_resourcemanager"]
  vars:
    - name: NODEMANAGER_PORT
      value: 8042
    - name: AVAILABLE_MEMORY_MB
      value: "16384"

- name: hive_metastore
  addr:
    repo: https://github.com/galaxy-operators/hive
    tag: v3.1.3
  model: x86-ubt22-host
  enable: true
  depends_on: ["hdfs_namenode", "postgres_database"]
  vars:
    - name: METASTORE_PORT
      value: 9083
    - name: DATABASE_HOST
      value: "postgres-service"

- name: spark_master
  addr:
    repo: https://github.com/galaxy-operators/spark
    tag: v3.4.1
  model: x86-ubt22-host
  enable: true
  depends_on: ["hadoop_common", "yarn_resourcemanager"]
  vars:
    - name: SPARK_VERSION
      value: "3.4.1"
    - name: MASTER_PORT
      value: 7077
    - name: MASTER_WEB_PORT
      value: 8080

- name: spark_worker
  addr:
    repo: https://github.com/galaxy-operators/spark
    tag: v3.4.1
  model: x86-ubt22-host
  enable: true
  depends_on: ["spark_master"]
  vars:
    - name: WORKER_PORT
      value: 8888
    - name: WORKER_CORES
      value: 4
    - name: WORKER_MEMORY
      value: "8g"

- name: postgres_database
  addr:
    repo: https://github.com/galaxy-operators/postgresql
    tag: v15.5.0
  model: x86-ubt22-host
  enable: true
  vars:
    - name: POSTGRES_VERSION
      value: "15"
    - name: DATABASE_NAME
      value: "metastore"
    - name: MAX_CONNECTIONS
      value: 100

# sys/vars.yml
vars:
# Hadoop 配置
- name: HADOOP_CONF_DIR
  value: "${HADOOP_CONF_DIR:/etc/hadoop/conf}"

- name: HADOOP_LOG_DIR
  value: "${HADOOP_LOG_DIR:/var/log/hadoop}"

- name: HADOOP_PID_DIR
  value: "${HADOOP_PID_DIR:/var/run/hadoop}"

- name: HADOOP_USER
  value: "${HADOOP_USER:hadoop}"

# YARN 配置
- name: YARN_CONF_DIR
  value: "${YARN_CONF_DIR:/etc/hadoop/conf}"

- name: YARN_LOG_DIR
  value: "${YARN_LOG_DIR:/var/log/yarn}"

- name: YARN_NODEMANAGER_RESOURCE_MEMORY_MB
  value: "${YARN_NODEMANAGER_RESOURCE_MEMORY_MB:16384}"

- name: YARN_NODEMANAGER_RESOURCE_CPU_VCORES
  value: "${YARN_NODEMANAGER_RESOURCE_CPU_VCORES:8}"

# Spark 配置
- name: SPARK_CONF_DIR
  value: "${SPARK_CONF_DIR:/etc/spark/conf}"

- name: SPARK_LOG_DIR
  value: "${SPARK_LOG_DIR:/var/log/spark}"

- name: SPARK_WORKER_CORES
  value: "${SPARK_WORKER_CORES:4}"

- name: SPARK_WORKER_MEMORY
  value: "${SPARK_WORKER_MEMORY:8g}"

- name: SPARK_MASTER_HOST
  value: "${SPARK_MASTER_HOST:spark-master}"

# 数据存储配置
- name: HDFS_DATA_DIR
  value: "${HDFS_DATA_DIR:/data/hdfs/data}"

- name: HDFS_NAME_DIR
  value: "${HDFS_NAME_DIR:/data/hdfs/name}"

- name: HDFS_REPLICATION
  value: "${HDFS_REPLICATION:3}"

# 监控配置
- name: ENABLE_MONITORING
  value: "${ENABLE_MONITORING:true}"

- name: PROMETHEUS_PORT
  value: "${PROMETHEUS_PORT:9090}"

- name: GRAFANA_PORT
  value: "${GRAFANA_PORT:3000}"
```

### 3. 企业应用系统示例

企业级应用系统的系统配置：

```yaml
# sys/sys_model.yml
name: enterprise_application_system
model: x86-ubt22-k8s
vender: EnterpriseCorp
metadata:
  description: "Enterprise application system with high availability"
  version: "3.2.0"
  tags: [enterprise, high-availability, production]

# sys/mod_list.yml
- name: load_balancer
  addr:
    repo: https://github.com/galaxy-operators/haproxy
    tag: v2.8.0
  model: x86-ubt22-k8s
  enable: true
  vars:
    - name: LOAD_BALANCER_PORT
      value: 80
    - name: SSL_PORT
      value: 443
    - name: BACKEND_CHECK_INTERVAL
      value: 10

- name: web_frontend
  addr:
    repo: https://github.com/galaxy-operators/web-frontend
    tag: v2.1.0
  model: x86-ubt22-k8s
  enable: true
  depends_on: ["api_gateway"]
  vars:
    - name: REPLICAS
      value: 3
    - name: API_BASE_URL
      value: "https://api.example.com"

- name: api_gateway
  addr:
    repo: https://github.com/galaxy-operators/api-gateway
    tag: v3.0.0
  model: x86-ubt22-k8s
  enable: true
  depends_on: ["auth_service", "user_service"]
  vars:
    - name: RATE_LIMIT_PER_MINUTE
      value: 1000
    - name: CIRCUIT_BREAKER_THRESHOLD
      value: 50
    - name: CACHE_TTL_SECONDS
      value: 300

- name: auth_service
  addr:
    repo: https://github.com/galaxy-operators/auth-service
    tag: v4.1.0
  model: x86-ubt22-k8s
  enable: true
  depends_on: ["postgres_primary", "redis_auth"]
  vars:
    - name: REPLICAS
      value: 2
    - name: JWT_EXPIRATION_HOURS
      value: 24
    - name: PASSWORD_POLICY_MIN_LENGTH
      value: 12

- name: user_service
  addr:
    repo: https://github.com/galaxy-operators/user-service
    tag: v3.5.0
  model: x86-ubt22-k8s
  enable: true
  depends_on: ["postgres_primary", "redis_cache"]
  vars:
    - name: REPLICAS
      value: 3
    - name: CACHE_TTL_MINUTES
      value: 30
    - name: PROFILE_IMAGE_MAX_SIZE
      value: 5242880  # 5MB

- name: business_logic_service
  addr:
    repo: https://github.com/galaxy-operators/business-service
    tag: v2.8.0
  model: x86-ubt22-k8s
  enable: true
  depends_on: ["postgres_primary", "message_queue", "redis_cache"]
  vars:
    - name: REPLICAS
      value: 4
    - name: WORKER_THREADS
      value: 16
    - name: BATCH_SIZE
      value: 100

- name: reporting_service
  addr:
    repo: https://github.com/galaxy-operators/reporting-service
    tag: v1.6.0
  model: x86-ubt22-k8s
  enable: "${ENABLE_REPORTING:true}"
  depends_on: ["postgres_readonly", "data_warehouse"]
  vars:
    - name: REPLICAS
      value: 1
    - name: REPORT_SCHEDULE_CRON
      value: "0 2 * * *"  # 每天凌晨2点

- name: postgres_primary
  addr:
    repo: https://github.com/galaxy-operators/postgresql-ha
    tag: v15.5.0
  model: x86-ubt22-k8s
  enable: true
  vars:
    - name: POSTGRES_VERSION
      value: "15"
    - name: DATABASE_NAME
      value: "enterprise_app"
    - name: MAX_CONNECTIONS
      value: 500
    - name: WAL_KEEP_SEGMENTS
      value: 100

- name: postgres_readonly
  addr:
    repo: https://github.com/galaxy-operators/postgresql-ha
    tag: v15.5.0
  model: x86-ubt22-k8s
  enable: true
  depends_on: ["postgres_primary"]
  vars:
    - name: REPLICAS
      value: 2
    - name: MAX_CONNECTIONS
      value: 300
    - name: HOT_STANDBY
      value: true

- name: redis_auth
  addr:
    repo: https://github.com/galaxy-operators/redis-ha
    tag: v7.2.4
  model: x86-ubt22-k8s
  enable: true
  vars:
    - name: REPLICAS
      value: 3
    - name: MAX_MEMORY
      value: "512MB"
    - name: AUTH_ENABLED
      value: true

- name: redis_cache
  addr:
    repo: https://github.com/galaxy-operators/redis-ha
    tag: v7.2.4
  model: x86-ubt22-k8s
  enable: true
  vars:
    - name: REPLICAS
      value: 6
    - name: MAX_MEMORY
      value: "2GB"
    - name: CACHE_POLICY
      value: "allkeys-lru"

- name: message_queue
  addr:
    repo: https://github.com/galaxy-operators/rabbitmq-ha
    tag: v3.12.0
  model: x86-ubt22-k8s
  enable: true
  vars:
    - name: REPLICAS
      value: 3
    - name: QUEUE_TYPE
      value: "quorum"
    - name: MAX_MESSAGE_SIZE
      value: 52428800  # 50MB

- name: data_warehouse
  addr:
    repo: https://github.com/galaxy-operators/clickhouse
    tag: v23.8.0
  model: x86-ubt22-k8s
  enable: "${ENABLE_DATA_WAREHOUSE:false}"
  vars:
    - name: REPLICAS
      value: 3
    - name: SHARDS
      value: 2
    - name: REPLICAS_PER_SHARD
      value: 2

- name: monitoring_stack
  addr:
    repo: https://github.com/galaxy-operators/enterprise-monitoring
    tag: v2.5.0
  model: x86-ubt22-k8s
  enable: true
  vars:
    - name: RETENTION_DAYS
      value: 90
    - name: ALERT_SEVERITY_LEVELS
      value: ["critical", "warning", "info"]
    - name: NOTIFICATION_CHANNELS
      value: ["email", "slack", "pagerduty"]

# sys/vars.yml
vars:
# 应用配置
- name: ENVIRONMENT
  value: "${ENVIRONMENT:production}"

- name: APP_VERSION
  value: "${APP_VERSION:3.2.0}"

- name: DOMAIN_NAME
  value: "${DOMAIN_NAME:enterprise.example.com}"

- name: NAMESPACE
  value: "${NAMESPACE:enterprise-app}"

# 安全配置
- name: ENABLE_MTLS
  value: "${ENABLE_MTLS:true}"

- name: CERTIFICATE_ISSUER
  value: "${CERTIFICATE_ISSUER:letsencrypt-prod}"

- name: PASSWORD_ROTATION_DAYS
  value: "${PASSWORD_ROTATION_DAYS:90}"

- name: SESSION_TIMEOUT_MINUTES
  value: "${SESSION_TIMEOUT_MINUTES:30}"

# 数据库配置
- name: DATABASE_BACKUP_SCHEDULE
  value: "${DATABASE_BACKUP_SCHEDULE:0 1 * * *}"  # 每天凌晨1点

- name: DATABASE_RETENTION_DAYS
  value: "${DATABASE_RETENTION_DAYS:30}"

- name: CONNECTION_POOL_SIZE
  value: "${CONNECTION_POOL_SIZE:20}"

# 缓存配置
- name: CACHE_DEFAULT_TTL
  value: "${CACHE_DEFAULT_TTL:3600}"  # 1小时

- name: CACHE_MAX_SIZE
  value: "${CACHE_MAX_SIZE:10000}"

- name: CACHE_REFRESH_INTERVAL
  value: "${CACHE_REFRESH_INTERVAL:300}"  # 5分钟

# 消息队列配置
- name: MESSAGE_QUEUE_MAX_RETRIES
  value: "${MESSAGE_QUEUE_MAX_RETRIES:3}"

- name: MESSAGE_QUEUE_DELAY_SECONDS
  value: "${MESSAGE_QUEUE_DELAY_SECONDS:60}"

- name: MESSAGE_QUEUE_PREFETCH_COUNT
  value: "${MESSAGE_QUEUE_PREFETCH_COUNT:10}"

# 高可用配置
- name: HIGH_AVAILABILITY_ENABLED
  value: "${HIGH_AVAILABILITY_ENABLED:true}"

- name: HEALTH_CHECK_INTERVAL_SECONDS
  value: "${HEALTH_CHECK_INTERVAL_SECONDS:30}"

- name: FAILURE_DETECTION_SECONDS
  value: "${FAILURE_DETECTION_SECONDS:60}"

- name: AUTO_FAILOVER_ENABLED
  value: "${AUTO_FAILOVER_ENABLED:true}"

# 性能配置
- name: DEFAULT_REPLICAS
  value: "${DEFAULT_REPLICAS:2}"

- name: MAX_REPLICAS
  value: "${MAX_REPLICAS:10}"

- name: CPU_REQUEST
  value: "${CPU_REQUEST:500m}"

- name: MEMORY_REQUEST
  value: "${MEMORY_REQUEST:1Gi}"

- name: CPU_LIMIT
  value: "${CPU_LIMIT:2000m}"

- name: MEMORY_LIMIT
  value: "${MEMORY_LIMIT:4Gi}"

# 监控配置
- name: MONITORING_ENABLED
  value: "${MONITORING_ENABLED:true}"

- name: ALERT_EMAIL_RECIPIENTS
  value: "${ALERT_EMAIL_RECIPIENTS:devops-alerts@example.com}"

- name: SLACK_WEBHOOK_URL
  value: "${SLACK_WEBHOOK_URL}"

- name: PAGERDUTY_SERVICE_KEY
  value: "${PAGERDUTY_SERVICE_KEY}"

# 业务配置
- name: BUSINESS_HOURS_START
  value: "${BUSINESS_HOURS_START:09:00}"

- name: BUSINESS_HOURS_END
  value: "${BUSINESS_HOURS_END:18:00}"

- name: MAINTENANCE_WINDOW_START
  value: "${MAINTENANCE_WINDOW_START:02:00}"

- name: MAINTENANCE_WINDOW_END
  value: "${MAINTENANCE_WINDOW_END:04:00}"

- name: FEATURE_FLAGS
  value: "${FEATURE_FLAGS:new-dashboard,advanced-analytics}"
```

## 总结

Sys-Operator 是 Galaxy Ops 框架中用于管理完整系统的核心组件。通过组合多个 Mod-Operator，Sys-Operator 提供了系统级别的统一管理、协调和部署能力。

### 关键要点总结

#### 1. **系统架构设计**
- **模块组合**: 将多个独立的 Mod-Operator 组合成完整系统
- **统一管理**: 提供系统级别的配置和管理接口
- **环境适配**: 支持不同目标环境和部署场景

#### 2. **配置管理**
- **标准化结构**: 遵循统一的文件结构和命名规范
- **变量系统**: 支持环境变量覆盖、条件配置、类型验证
- **模块引用**: 灵活的模块地址和依赖管理

#### 3. **工作流设计**
- **系统生命周期**: 完整的系统初始化、更新、本地化、安装、启动、停止流程
- **错误处理**: 完善的错误处理、回滚和恢复机制
- **执行优化**: 支持并行执行、缓存优化、资源限制

#### 4. **最佳实践**
- **模块化设计**: 功能清晰、职责明确的模块划分
- **环境一致性**: 不同环境间的配置一致性保证
- **安全性**: 最小权限、敏感信息保护、审计日志
- **监控调试**: 详细的日志记录、断言验证、性能监控

#### 5. **扩展能力**
- **平台支持**: 支持多种目标平台组合
- **模块生态**: 丰富的模块仓库和社区支持
- **工具链**: 完整的开发、测试、部署工具链

### 使用建议

1. **从小规模开始**: 先从简单的系统开始，逐步扩展功能
2. **模块复用**: 充分利用现有的 Mod-Operator 模块
3. **环境隔离**: 严格区分开发、测试、生产环境
4. **监控告警**: 建立完善的监控和告警体系
5. **文档维护**: 保持系统配置和使用文档的同步更新

通过合理使用 Sys-Operator，可以显著提升复杂系统的管理效率，降低运维复杂度，确保系统的一致性和可靠性，为企业的数字化转型提供强有力的技术支撑。
