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
  setting:                              # 模块特定设置（可选）
    src: "${GXL_PRJ_ROOT}/sys/setting/module"
    dst: "${GXL_PRJ_ROOT}/sys/mods/module/local/"

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
```rust
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
```rust
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

```

**`setting.yml` - 本地化设置**:
```yaml
TODO
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
TODO
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




```




## 总结

Sys-Operator 的文件组织方式遵循了模块化、标准化、可维护性的原则。通过合理的文件结构和配置组织，可以有效管理系统配置，提高开发效率，降低维护成本。理解并遵循这些文件组织方式对于有效使用 Sys-Operator 至关重要。

---

*更多详情请参考 [目录结构](./directory.md) 和 [命名规范](./naming-conventions.md)。*