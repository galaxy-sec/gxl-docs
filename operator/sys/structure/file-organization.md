# 文件组织方式

## 概述

本文档详细说明 Sys-Operator 中的文件组织方式，包括配置文件的结构、模块文件的存储、工作流文件的编排等，帮助你理解如何有效地组织和管理系统文件。

## 配置文件组织

### 1. 系统级配置文件

系统级配置文件存储在 `sys/` 目录下，定义整个系统的基础架构和配置。

#### `sys_model.yml` - 系统模型定义

**文件作用**: 定义系统的基本信息和目标运行环境

**配置结构**:
```yaml
# 基础系统定义
name: system_name                    # 系统名称（必需）
model: arm-mac14-host               # 目标平台模型（必需）
vender: "Galaxy-Ops"                # 厂商信息（可选）

# 扩展元数据
metadata:
  description: "系统描述"            # 系统描述
  version: "1.0.0"                  # 系统版本
  tags: [production, web]            # 系统标签
  authors: ["dev-team@example.com"] # 作者信息
  maintainers: ["ops-team@example.com"] # 维护者信息
  documentation: "docs/README.md"   # 文档路径
  homepage: "https://github.com/..." # 项目主页
  repository: "https://github.com/..." # 代码仓库
```

**命名规范**:
- 文件名必须为 `sys_model.yml`
- 系统名称必须唯一且有意义
- 模型名称遵循 `arch-os-spc` 格式
- 版本号遵循语义化版本规范

#### `mod_list.yml` - 模块列表定义

**文件作用**: 定义系统包含的所有模块及其配置

**配置结构**:
```yaml
# 基础模块列表
- name: module_name                     # 模块名称（必需）
  addr:                                  # 模块地址（必需）
    repo: "https://github.com/user/repo" # Git 仓库（可选）
    tag: "v1.0.0"                        # 标签（可选）
    branch: "main"                       # 分支（可选）
    path: "./local/path"                 # 本地路径（可选）
  model: arm-mac14-host                 # 目标平台模型（必需）
  enable: true                           # 是否启用（可选，默认为 true）

# 高级模块配置
- name: advanced_module
  addr:
    repo: "https://github.com/user/module"
    tag: "v2.0.0"
  model: x86-ubt22-k8s
  enable: true
  priority: 100                         # 启动优先级（可选）
  depends_on: ["base_module"]           # 依赖关系（可选）
  condition: "${ENV:development}" == "production" # 启用条件（可选）
  setting:                              # 模块特定设置（可选）
    src: "${GXL_PRJ_ROOT}/sys/setting/module"
    dst: "${GXL_PRJ_ROOT}/sys/mods/module/local/"
  vars:                                 # 模块变量覆盖（可选）
    - name: VAR_NAME
      value: "custom_value"
```

**配置验证**:
- 模块名称不能重复
- 模块地址必须有效
- 模型必须存在
- 依赖关系不能形成循环

#### `vars.yml` - 系统变量定义

**文件作用**: 定义系统级别的环境变量和配置参数

**配置结构**:
```yaml
# 基础变量
vars:
- name: VARIABLE_NAME             # 变量名（必需）
  value: "default_value"          # 默认值（必需）
  desp: "变量描述"               # 描述（可选）

# 类型化变量
- name: INT_VAR
  type: integer                  # 数据类型（可选）
  min: 1                         # 最小值（可选）
  max: 100                       # 最大值（可选）
  value: 10

- name: BOOL_VAR
  type: boolean
  value: true

- name: ENUM_VAR
  type: enum                     # 枚举类型
  values: [opt1, opt2, opt3]     # 可选值（必需）
  value: opt1

- name: REGEX_VAR
  type: string
  pattern: "^[a-zA-Z]+$"         # 正则模式（必需）
  value: "valid_string"

# 分组变量
vars:
# 网络配置
- name: HTTP_PORT
  group: network
  value: 80

- name: HTTPS_PORT
  group: network
  value: 443

# 数据库配置
- name: DB_HOST
  group: database
  value: "localhost"

- name: DB_PORT
  group: database
  type: integer
  min: 1
  max: 65535
  value: 5432

# 环境变量替换
- name: CONFIG_PATH
  value: "${CONFIG_PATH:/etc/app/config}"

- name: DEBUG_MODE
  value: "${DEBUG_MODE:false}"

# 条件变量
- name: FEATURE_FLAG
  value: "${FEATURE_FLAG:default}"
```

### 2. 项目级配置文件

项目级配置文件存储在 `_gal/` 目录下，定义项目级别的管理配置。

#### `_gal/adm.gxl` - 系统管理配置

**文件作用**: 定义系统的版本管理和发布配置

**配置结构**:
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
        DESCRIPTION = "System description";
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

#### `_gal/work.gxl` - 工作流环境配置

**文件作用**: 定义系统的工作流环境和执行配置

**配置结构**:
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
}
```

### 3. 模块文件组织

模块文件存储在 `sys/mods/` 目录下，每个模块有自己的本地化副本。

#### 模块目录结构

```
sys/mods/
├── module_name/
│   └── platform_model/
│       ├── spec/                    # 规范文件
│       │   ├── module_spec.yml      # 模块规范
│       │   └── interfaces.yml       # 接口定义
│       ├── local/                   # 本地化配置
│       │   ├── config.yml           # 本地配置
│       │   ├── templates/            # 模板文件
│       │   └── scripts/             # 脚本文件
│       ├── values/                  # 值文件
│       │   ├── production.yml       # 生产环境值
│       │   ├── staging.yml          # 测试环境值
│       │   └── development.yml      # 开发环境值
│       ├── vars.yml                 # 模块变量
│       ├── setting.yml              # 本地化设置
│       └── workflows/               # 模块工作流
│           ├── install.gxl          # 安装工作流
│           ├── configure.gxl        # 配置工作流
│           └── start.gxl             # 启动工作流
```

#### 模块配置文件

**`vars.yml` - 模块变量**:
```yaml
# 模块特定变量
vars:
- name: MODULE_VERSION
  value: "1.0.0"
  description: "模块版本"

- name: MODULE_TYPE
  value: "service"
  description: "模块类型"

- name: MODULE_PORT
  type: integer
  min: 1
  max: 65535
  value: 8080
  description: "服务端口"

# 继承系统变量
vars:
- name: GLOBAL_CONFIG_PATH
  value: "${GLOBAL_CONFIG_PATH}"
  description: "全局配置路径"
```

**`setting.yml` - 本地化设置**:
```yaml
# 本地化设置
setting:
  # 源配置路径
  src:
    - "${GXL_PRJ_ROOT}/sys/setting/module/*"
    - "${GXL_PRJ_ROOT}/common/settings/*"
  
  # 目标路径
  dst: "${GXL_PRJ_ROOT}/sys/mods/module/local/"
  
  # 文件映射
  mapping:
    "config.template": "config.yml"
    "env.template": "env.yml"
  
  # 过滤器
  filters:
    - "*.yml"          # 只处理 YAML 文件
    - exclude: "*.tmp" # 排除临时文件
```

#### 模块工作流文件

**`workflows/install.gxl` - 安装工作流**:
```gxl
// 模块安装工作流
mod install {
    // 安装任务
    #[task(name="module_install")]
    flow install {
        gx.echo("=== 开始模块安装 ===");
        gx.echo("模块名称: ${MODULE.NAME}");
        gx.echo("模块版本: ${MODULE.VERSION}");

        // 预检查
        gx.echo("1. 执行预检查...");
        gx.pre_check();

        // 依赖安装
        gx.echo("2. 安装依赖...");
        gx.install_dependencies();

        // 配置文件
        gx.echo("3. 配置文件...");
        gx.configure();

        // 验证安装
        gx.echo("4. 验证安装...");
        gx.validate();

        gx.echo("=== 模块安装完成 ===");
    }
}
```

### 4. 工作流文件组织

系统工作流文件存储在 `sys/workflows/` 目录下。

#### `operators.gxl` - 系统操作符工作流

**文件作用**: 定义系统级别的操作流程

**配置结构**:
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
}
```

### 5. 项目配置文件

`sys-prj.yml` - 系统项目配置

**文件作用**: 定义系统项目的完整配置

**配置结构**:
```yaml
# 基础项目配置
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

## 文件验证与组织

### 1. 配置文件验证

**YAML 文件验证**:
```bash
# 验证 sys_model.yml
yq eval . sys/sys_model.yml > /dev/null

# 验证 mod_list.yml
yq eval . sys/mod_list.yml > /dev/null

# 验证 vars.yml
yq eval . sys/vars.yml > /dev/null

# 验证 sys-prj.yml
yq eval . sys-prj.yml > /dev/null
```

**GXL 文件验证**:
```bash
# 验证语法
gxl-validate sys/workflows/operators.gxl
gxl-validate _gal/adm.gxl
gxl-validate _gal/work.gxl
```

### 2. 文件组织检查

**目录结构检查**:
```bash
# 检查必需文件
check_required_files() {
    local dir=$1
    local required_files=(
        "sys/sys_model.yml"
        "sys/mod_list.yml"
        "sys/vars.yml"
        "sys/workflows/operators.gxl"
    )
    
    for file in "${required_files[@]}"; do
        if [[ ! -f "$dir/$file" ]]; then
            echo "错误: 缺少必需文件 $file"
            return 1
        fi
    done
    return 0
}
```

**重复文件检查**:
```bash
# 检查重复配置
check_duplicate_config() {
    local dir=$1
    local temp_file=$(mktemp)
    
    # 提取所有配置项
    find "$dir" -name "*.yml" -exec yq eval '.' {} \; > "$temp_file"
    
    # 检查重复项
    sort "$temp_file" | uniq -d > "${temp_file}.duplicates"
    
    if [[ -s "${temp_file}.duplicates" ]]; then
        echo "警告: 发现重复配置项"
        cat "${temp_file}.duplicates"
    fi
    
    rm -f "$temp_file" "${temp_file}.duplicates"
}
```

## 最佳实践

### 1. 文件组织原则

#### 分离关注点
- **配置文件**: 纯配置信息，不包含业务逻辑
- **工作流文件**: 包含操作逻辑，引用配置文件
- **模块文件**: 平台特定的配置和文件

#### 减少重复
- 使用变量和引用机制
- 避免硬编码相同配置
- 使用模板和继承

#### 保持一致性
- 遵循命名规范
- 使用统一的格式和风格
- 保持目录结构的清晰

### 2. 维护策略

#### 版本控制
- 使用 .gitignore 管理临时文件
- 使用语义化版本管理
- 分支管理策略

#### 文档更新
- 配置变更时更新文档
- 维护文件变更日志
- 定期审核文件结构

#### 自动化
- 使用脚本验证文件结构
- 自动生成配置文件模板
- 定期备份重要配置

## 故障排除

### 1. 配置错误

**常见问题**:
- YAML 语法错误
- GXL 语法错误
- 文件路径错误
- 模型不存在

**解决方案**:
- 使用验证工具检查语法
- 检查文件路径引用
- 确认模型定义存在

### 2. 文件组织问题

**常见问题**:
- 目录结构混乱
- 文件重复定义
- 平台配置冲突
- 版本控制问题

**解决方案**:
- 重新组织目录结构
- 消除重复定义
- 平台配置隔离
- 完善版本控制

### 3. 权限和访问

**常见问题**:
- 文件权限不足
- 网络访问限制
- 路径解析错误

**解决方案**:
- 设置适当的文件权限
- 确保网络访问正常
- 使用绝对路径或相对路径

## 总结

Sys-Operator 的文件组织方式遵循了模块化、标准化、可维护性的原则。通过合理的文件结构和配置组织，可以有效管理系统配置，提高开发效率，降低维护成本。理解并遵循这些文件组织方式对于有效使用 Sys-Operator 至关重要。

---

*更多详情请参考 [目录结构](./directory.md) 和 [命名规范](./naming-conventions.md)。*