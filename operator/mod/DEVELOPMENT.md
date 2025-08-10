# Mod-Operator 开发指南

本文档详细介绍 Mod-Operator 的开发工作流程、最佳实践和技巧，帮助开发者高效地创建高质量的运维模块。

## 开发工作流

### 1. 创建新模块

使用 `gmod` 工具快速创建新模块的骨架结构。

#### 基础模块创建

```bash
# 创建基础模块
//fix: use gmod cmd and args

```



#### 生成的模块结构

```bash
postgresql/
├── mod/
│   ├── arm-mac14-host/
│   │   ├── spec/
│   │   │   ├── artifact.yml
│   │   │   └── depends.yml
│   │   ├── vars.yml
│   │   ├── setting.yml
│   │   ├── values/
│   │   │   ├── _value.yml
│   │   │   └── _used.yml
│   │   ├── workflows/
│   │   │   └── operators.gxl
│   │   └── _gal/
│   │       ├── work.gxl
│   │       └── project.toml
│   └── x86-ubt22-k8s/
│       └── [相同结构]
├── mod-prj.yml
├── version.txt
├── .gitignore
└── README.md
```

### 2. 模块开发步骤

#### 步骤 1：定义构件和依赖

编辑 `spec/artifact.yml` 和 `spec/depends.yml`：

```bash
# 编辑构件配置
vim mod/arm-mac14-host/spec/artifact.yml

# 编辑依赖配置
vim mod/arm-mac14-host/spec/depends.yml
```

**artifact.yml 示例：**

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
```

**depends.yml 示例：**

```yaml
dep_root: ./depends

deps:
- addr:
    path: ./common_libs
  local: common_libs
  enable: true

- addr:
    repo: https://github.com/openssl/openssl.git
    tag: "3.0.0"
  local: openssl
  enable: true
```

#### 步骤 2：配置变量和默认值

编辑变量配置文件：

```bash
# 定义环境变量
vim mod/arm-mac14-host/vars.yml

```

**vars.yml 示例：**

```yaml
vars:
- name: DATABASE_PORT
  desp: "数据库端口号"
  type: integer
  min: 1024
  max: 65535
  value: 5432

- name: MAX_CONNECTIONS
  type: integer
  min: 1
  max: 1000
  value: 100

- name: DATA_DIR
  value: "/var/lib/postgresql"

- name: ENABLE_SSL
  type: boolean
  value: false
```




#### 步骤 3：编写工作流

编辑 `workflows/operators.gxl` 定义运维操作：

```bash
# 编写操作工作流
vim mod/arm-mac14-host/workflows/operators.gxl
```

#### 步骤 4：配置本地化设置[按需]

编辑 `setting.yml` 配置模板渲染：

```bash
# 配置本地化设置
vim mod/arm-mac14-host/setting.yml
```

```yaml
localize:
  templatize_path:
    excludes:
    - README.md
    - LICENSE
    - "*.log"

  templatize_cust:
    label_beg: '{{'
    label_end: '}}'
```

#### 步骤 5：验证和测试

```bash

# 生成本地化配置
gmod localize

# 测试工作流
gflow install --dry-run
```

### 3. 开发工具使用

#### gmod - 模块管理工具

```bash
# 创建模块
gmod new module_name


# 生成本地化配置
gmod localize

```

#### gflow - 工作流执行工具

```bash
# 执行工作流
gflow install
gflow start
gflow stop
gflow restart

# 调试模式
gflow install -d 1  # 详细输出
gflow install -d 2  # 更详细输出
gflow install -d 3  # 最详细输出

# 试运行模式
gflow install --dry-run

```



## 最佳实践

### 1. 模块设计原则

#### 单一职责原则

**✅ 好的做法：**
```yaml
# 专注单一组件
name: postgresql
description: "PostgreSQL 数据库管理模块"
```

**❌ 不好的做法：**
```yaml
# 职责混乱
name: database_stack
description: "数据库、缓存、消息队列管理模块"
```

#### 接口一致性

**✅ 好的做法：**
```yaml
# 统一的任务命名
#[task(name="gops@install")]
flow install { ... }

#[task(name="gops@start")]
flow start { ... }

#[task(name="gops@stop")]
flow stop { ... }

#[task(name="gops@restart")]
flow restart { ... }
```

**❌ 不好的做法：**
```yaml
# 不一致的命名
#[task(name="install")]
flow install { ... }

#[task(name="startup")]
flow start { ... }

#[task(name="halt")]
flow stop { ... }
```

#### 配置外部化

**✅ 好的做法：**
```yaml
# 所有配置参数提取到变量
vars:
- name: DATABASE_PORT
  value: 5432

- name: MAX_CONNECTIONS
  value: 100

- name: DATA_DIR
  value: "/var/lib/postgresql"
```

**❌ 不好的做法：**
```yaml
# 硬编码配置
flow install {
    gx.cmd("postgres -p 5432 -d /var/lib/postgresql");
}
```

### 2. 工作流设计

#### 幂等性设计

**✅ 好的做法：**
```gxl
flow install {
    // 检查是否已安装
    if gx.defined("/usr/local/bin/postgres") {
        gx.echo("PostgreSQL 已安装，跳过安装步骤");
        return;
    }

    // 执行安装
    gx.cmd("./install.sh");

    // 验证安装
    gx.assert(gx.path_exists("/usr/local/bin/postgres"));
}
```

**❌ 不好的做法：**
```gxl
flow install {
    // 没有检查，可能重复安装
    gx.cmd("./install.sh");
}
```





### 3. 变量管理

#### 命名规范

**✅ 好的命名：**
```yaml
vars:
- name: DATABASE_PORT
  value: 5432

- name: MAX_CONNECTIONS
  value: 100

- name: DATA_DIRECTORY
  value: "/var/lib/postgresql"
```

**❌ 不好的命名：**
```yaml
vars:
- name: port
  value: 5432

- name: max_conn
  value: 100

- name: data_dir
  value: "/var/lib/postgresql"
```

#### 类型安全

**✅ 好的做法：**
```yaml
vars:
- name: DATABASE_PORT
  type: integer
  min: 1024
  max: 65535
  value: 5432

- name: ENABLE_SSL
  type: boolean
  value: false

- name: LOG_LEVEL
  type: enum
  values: [debug, info, warn, error]
  value: info
```

**❌ 不好的做法：**
```yaml
vars:
- name: DATABASE_PORT
  value: "5432"  # 字符串而不是数字

- name: ENABLE_SSL
  value: "false"  # 字符串而不是布尔值
```

#### 环境变量支持

**✅ 好的做法：**
```yaml
vars:
- name: DATABASE_PORT
  value: "${POSTGRES_PORT:5432}"  # 默认值 5432

- name: INSTALL_PREFIX
  value: "${PREFIX:/usr/local}"  # 默认 /usr/local

- name: DEBUG_MODE
  type: boolean
  value: "${DEBUG:false}"  # 默认 false
```

### 4. 依赖管理

#### 版本约束

**✅ 好的做法：**
```yaml
deps:
- addr:
    repo: https://github.com/openssl/openssl.git
    tag: "3.0.0"  # 语义化版本
  enable: true

- addr:
    repo: https://github.com/pcre/pcre.git
    tag: "8.45"
  enable: true
```

**❌ 不好的做法：**
```yaml
deps:
- addr:
    repo: https://github.com/openssl/openssl.git
    tag: "latest"  # 不稳定的版本
  enable: true
```

#### 条件依赖

**✅ 好的做法：**
```yaml
deps:
- addr:
    path: ./optional_libs
  local: optional_libs
  enable: "${USE_FEATURES:true}"

- addr:
    repo: https://github.com/debug/tools.git
    branch: main
  local: debug_tools
  enable: "${BUILD_MODE:debug}" == "debug"
```

**❌ 不好的做法：**
```yaml
deps:
- addr:
    path: ./optional_libs
  local: optional_libs
  enable: true  # 应该根据条件启用
```

#### 本地依赖优先

**✅ 好的做法：**
```yaml
deps:
# 本地依赖优先
- addr:
    path: ./local_libs
  local: common_libs
  enable: true

# 外部依赖作为后备
- addr:
    repo: https://github.com/external/lib.git
    tag: "1.0.0"
  local: common_libs
  enable: false  # 默认禁用
```

### 5. 文档和维护




#### 版本管理

**✅ 好的做法：**
```yaml
# mod-prj.yml
name: postgresql
version: "17.4.0"
description: "PostgreSQL 数据库管理模块"

# version.txt
17.4.0
```

**❌ 不好的做法：**
```yaml
# 没有版本管理
name: postgresql
version: "latest"
description: "PostgreSQL 数据库管理模块"
```


## 调试和故障排除

### 常见问题诊断








## 总结

遵循本开发指南，可以创建出高质量、可维护、可扩展的 Mod-Operator 模块。关键要点：

1. **标准化开发流程**：遵循一致的模块创建和开发流程
2. **最佳实践设计**：采用单一职责、幂等性、错误处理等设计原则
3. **有效的调试策略**：使用详细的日志、断言和分步调试
4. **性能优化**：利用并行执行和缓存机制
5. **高级功能**：掌握条件工作流、模板系统

通过合理应用这些技巧和最佳实践，可以显著提升模块开发效率和质量，为复杂的系统运维提供坚实的基础。

## 相关资源

- 📖 [配置说明](./CONFIGURATION.md) - 完整的配置文件参考
- 📖 [故障排除](./TROUBLESHOOTING.md) - 调试和问题解决
- 📖 [示例参考](./EXAMPLES.md) - 完整的模块示例
- 📖 [API 参考](./REFERENCE.md) - API 和枚举定义
- 🛠️ [gmod 工具文档](../gmod/) - 模块管理工具使用指南
- 🛠️ [gflow 工具文档](../gflow/) - 工作流执行工具使用指南
