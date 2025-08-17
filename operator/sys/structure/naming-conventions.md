# 命名规范

## 概述

本文档详细说明 Sys-Operator 中的命名规范，包括文件名、变量名、模块名、系统名等的命名约定，帮助你保持命名的一致性和可读性。

## 命名原则

### 1. 可读性原则

**目标**: 命名应该清晰表达其用途，便于理解和维护。

**规则**:
- 使用有意义的名称，避免缩写和模糊的词汇
- 名称应该自解释，减少额外的注释需求
- 保持名称的简洁性，不过度冗长

**示例**:
```yaml
# 好的命名
name: "production_web_system"
name: "user_management_service"
name: "database_connection_pool"

# 不好的命名
name: "prod_sys"         # 缩写不清晰
name: "system_1"         # 无意义
name: "usermgmt_service" # 缩写不规范
```

### 2. 一致性原则

**目标**: 保持整个项目命名风格的一致性。

**规则**:
- 统一的命名风格（全小写、驼峰、下划线等）
- 相同概念使用相同的术语
- 遵循项目的现有命名约定

**示例**:
```yaml
# 一致的命名风格
vars:
  - name: database_host           # 下划线分隔
  - name: database_port
  - name: database_name

# 不一致的命名风格
vars:
  - name: databaseHost           # 混合风格
  - name: DB_PORT                # 大写缩写
  - name: databaseName           # 驼峰命名
```

### 3. 可扩展性原则

**目标**: 命名应该支持项目的扩展和演进。

**规则**:
- 避免硬编码的数字和版本
- 使用通用的术语，便于复用
- 支持多环境和多部署

**示例**:
```yaml
# 可扩展的命名
name: "web_application_system"    # 通用的名称
name: "microservice_platform"      # 可扩展的平台名称

# 不可扩展的命名
name: "system_v2_1_production   # 硬编码版本
name: "legacy_app_deprecated     # 硬编码状态
```

## 文件命名规范

### 1. 配置文件

**YAML 配置文件**:
```
sys_model.yml           # 系统模型定义（必需）
mod_list.yml            # 模块列表定义（必需）
vars.yml               # 系统变量定义（必需）
admin-config.gxl       # 系统管理配置（推荐）
work-config.gxl        # 工作流环境配置（推荐）
project-config.toml    # 项目配置（推荐）
```

**命名规则**:
- 使用小写字母
- 多个单词用下划线分隔
- 扩展名表示文件格式（.yml, .gxl, .toml）
- 文件名应该反映文件内容

**错误示例**:
```
SysModel.yaml          # 大写字母和错误扩展名
model_list.yml         # 缩写不清晰
config.yml             # 过于通用
system_configs.yml     # 复数形式不必要
```

### 2. 工作流文件

**GXL 工作流文件**:
```
operators.gxl          # 系统操作符工作流（必需）
system-workflows.gxl   # 系统工作流（可选）
module-workflows.gxl   # 模块工作流（可选）
custom-workflows.gxl   # 自定义工作流（可选）
```

**命名规则**:
- 工作流文件应该以 `-workflows.gxl` 结尾
- 自定义工作流应该有明确的前缀
- 系统级和模块级工作流应该区分

### 3. 模块文件

**模块目录名**:
```
sys/mods/
├── web_server/
├── database_server/
├── cache_manager/
├── message_queue/
├── load_balancer/
└── monitoring_agent/
```

**命名规则**:
- 使用小写字母
- 多个单词用下划线分隔
- 描述性名称，明确模块功能
- 避免缩写和简写

### 4. 平台目录名

**平台模型目录**:
```
arm-mac14-host
x86-ubt22-host
x86-ubt22-k8s
x86-centos8-host
arm-linux-k8s
```

**命名规则**:
- 格式：`arch-os-spc`
- 架构：`arm`, `x86`, `amd64`
- 操作系统：`mac14`, `ubt22`, `centos8`, `linux`
- 环境：`host`, `k8s`, `docker`

## 变量命名规范

### 1. 系统变量

**命名规则**:
- 使用全大写字母
- 单词间用下划线分隔
- 前缀标识变量类型
- 包含适当的命名空间

**示例**:
```yaml
# 系统配置
- name: SYSTEM_NAME
  value: "production_system"

- name: SYSTEM_VERSION
  value: "1.0.0"

- name: SYSTEM_ENVIRONMENT
  value: "production"

# 网络配置
- name: NETWORK_HOST
  value: "localhost"

- name: NETWORK_PORT
  value: 8080

- name: NETWORK_PROTOCOL
  value: "https"

# 数据库配置
- name: DATABASE_HOST
  value: "postgres-primary"

- name: DATABASE_PORT
  value: 5432

- name: DATABASE_NAME
  value: "production_db"

# 安全配置
- name: SECURITY_ENCRYPTION_KEY
  value: "generated_key_here"

- name: SECURITY_SSL_CERT_PATH
  value: "/etc/ssl/certs/server.crt"

# 性能配置
- name: PERFORMANCE_MAX_THREADS
  value: 100

- name: PERFORMANCE_MEMORY_LIMIT
  value: "4GB"
```

### 2. 模块变量

**命名规则**:
- 模块名作为前缀
- 跟随具体的配置项
- 使用统一的术语

**示例**:
```yaml
# web_server 模块变量
vars:
  - name: WEB_SERVER_PORT
    value: 80

  - name: WEB_SERVER_SSL_PORT
    value: 443

  - name: WEB_SERVER_WORKERS
    value: 4

  - name: WEB_SERVER_KEEP_ALIVE
    value: "75s"

# database_server 模块变量
vars:
  - name: DATABASE_SERVER_HOST
    value: "db-primary"

  - name: DATABASE_SERVER_PORT
    value: 5432

  - name: DATABASE_SERVER_MAX_CONNECTIONS
    value: 100

  - name: DATABASE_SERVER_TIMEOUT
    value: "30s"
```

### 3. 环境变量

**命名规则**:
- 支持环境变量替换
- 使用默认值语法
- 变量名与配置名对应

**示例**:
```yaml
# 环境变量替换
vars:
  - name: DATABASE_HOST
    value: "${DATABASE_HOST:localhost}"

  - name: DATABASE_PORT
    value: "${DATABASE_PORT:5432}"

  - name: ENABLE_DEBUG
    value: "${ENABLE_DEBUG:false}"

  - name: LOG_LEVEL
    value: "${LOG_LEVEL:info}"

  - name: CONFIG_PATH
    value: "${CONFIG_PATH:/etc/app/config}"

  - name: API_KEY
    value: "${API_KEY}"
```

### 4. 分组变量

**命名规则**:
- 使用 `group` 字段进行分类
- 组名与功能相关
- 组内变量命名保持一致

**示例**:
```yaml
# 按功能分组的变量
vars:
# 网络配置组
- name: HTTP_PORT
  group: network
  value: 80

- name: HTTPS_PORT
  group: network
  value: 443

- name: DOMAIN_NAME
  group: network
  value: "example.com"

# 数据库配置组
- name: DB_HOST
  group: database
  value: "postgres"

- name: DB_PORT
  group: database
  value: 5432

- name: DB_NAME
  group: database
  value: "app_db"

# 安全配置组
- name: ENABLE_SSL
  group: security
  value: true

- name: SSL_CERT_PATH
  group: security
  value: "/etc/ssl/certs/server.crt"

- name: SSL_KEY_PATH
  group: security
  value: "/etc/ssl/private/server.key"

# 监控配置组
- name: ENABLE_MONITORING
  group: monitoring
  value: true

- name: METRICS_PORT
  group: monitoring
  value: 9090

- name: LOG_LEVEL
  group: monitoring
  value: "info"
```

## 模块命名规范

### 1. 模块名

**命名规则**:
- 使用小写字母
- 单词间用下划线分隔
- 描述性名称
- 避免缩写

**示例**:
```yaml
# 好的模块名
- name: web_server
- name: database_server
- name: cache_manager
- name: message_queue
- name: load_balancer
- name: monitoring_agent
- name: file_storage
- name: authentication_service

# 不好的模块名
- name: web
- name: db
- name: cache
- name: mq
- name: lb
- name: monitor
- name: storage
- name: auth
```

### 2. 模块类型

**常用模块类型**:
```
server      # 服务器服务
client      # 客户端服务
proxy       # 代理服务
gateway     # 网关服务
cache       # 缓存服务
storage     # 存储服务
queue       # 消息队列
monitor     # 监控服务
security    # 安全服务
network     # 网络服务
```

**命名模式**:
- `{function}_{type}`: `web_server`, `database_server`
- `{type}_{service}`: `cache_redis`, `queue_rabbitmq`
- `{service}_{tool}`: `monitor_grafana`, `security_consul`

## 系统命名规范

### 1. 系统名

**命名规则**:
- 使用小写字母
- 单词间用下划线分隔
- 描述性名称
- 包含环境标识（可选）

**示例**:
```yaml
# 生产环境
name: production_web_system
name: staging_api_gateway
name: development_database_cluster

# 开发环境
name: dev_web_system
name: test_user_service
name: local_message_queue

# 通用环境
name: microservice_platform
name: data_processing_system
name: enterprise_application
```

### 2. 系统标识

**命名规则**:
- 系统名作为基础
- 添加环境前缀（可选）
- 添加版本标识（可选）

**标识格式**:
```
{environment}_{system_name}_{version}
```

**示例**:
```
prod_web_system_v1.0.0
staging_api_gateway_v2.1.0
dev_database_cluster_v0.9.0
```

## 工作流命名规范

### 1. 任务名

**命名规则**:
- 使用动词开头
- 描述具体操作
- 动词+名词结构

**常用动词**:
```
install     # 安装
start       # 启动
stop        # 停止
restart     # 重启
update      # 更新
configure   # 配置
deploy      # 部署
backup      # 备份
restore     # 恢复
validate    # 验证
check       # 检查
monitor     # 监控
```

**示例**:
```gxl
# 好的任务名
#[task(name="install_service")]
#[task(name="start_application")]
#[task(name="stop_database")]
#[task(name="update_config")]
#[task(name="deploy_system")]
#[task(name="validate_environment")]

# 不好的任务名
#[task(name="install")]        # 过于简单
#[task(name="do_start")]        # 冗余
#[task(name="run_installer")]   # 间接
```

### 2. 流程名

**命名规则**:
- 使用多个单词
- 描述完整流程
- 包含系统标识

**示例**:
```gxl
# 系统操作流程
flow system_installation
flow system_configuration
flow system_deployment
flow system_monitoring

# 模块操作流程
flow module_initialization
flow module_configuration
flow module_deployment
flow module_validation
```

## GXL 元素命名规范

### 1. 变量名

**命名规则**:
- 使用大写字母
- 单词间用下划线分隔
- 描述变量内容

**示例**:
```gxl
// 系统配置变量
let SYSTEM_NAME = "web_system"
let SYSTEM_MODEL = "arm-mac14-host"
let MODULE_COUNT = 5

// 环境变量
let ENVIRONMENT = "production"
let LOG_LEVEL = "info"
let FORCE_FLAG = ""

// 路径变量
let PROJECT_ROOT = "${GXL_PRJ_ROOT}"
let CONFIG_PATH = "${PROJECT_ROOT}/config"
let DEPLOY_PATH = "${PROJECT_ROOT}/deploy"
```

### 2. 函数名

**命名规则**:
- 使用动词+名词结构
- 动词用现在时
- 描述函数功能

**示例**:
```gxl
// 检查函数
function check_environment()
function check_dependencies()
function check_health()

// 安装函数
function install_system()
function install_module(module_name)
function install_dependencies()

// 配置函数
function configure_system()
function configure_module(module)
function apply_settings()

// 工具函数
function read_file(file_path)
function write_file(file_path, content)
function validate_config()
```

### 3. 标签名

**命名规则**:
- 使用小写字母
- 单词间用下划线分隔
- 标签语义明确

**示例**:
```gxl
// 系统标签
label system_initialized
label system_running
label system_stopped
label system_error

// 模块标签
label module_installed
label module_started
label module_stopped
label module_failed

// 流程标签
label installation_complete
label deployment_successful
label validation_passed
label configuration_applied
```

## 避免的命名模式

### 1. 不推荐的命名

**避免使用**:
- 单字符变量名（a, b, c）
- 缩写不明确的名称（cfg, tmp, var）
- 硬编码数字和版本
- 保留关键字和特殊字符
- 过于通用的名称

**示例**:
```yaml
# 不推荐的命名
- name: a                    # 单字符
- name: cfg                  # 缩写不明确
- name: v1                  # 硬编码版本
- name: temp_123             # 临时编号
- name: system               # 过于通用
- name: config               # 过于通用
- name: data                 # 过于通用
```

### 2. 特殊字符和保留字

**避免使用的字符**:
- 空格和特殊字符
- 连字符（-）
- 斜杠（/）
- 点号（.）开头或结尾
- 保留关键字

**示例**:
```yaml
# 错误的命名
- name: web server          # 包含空格
- name: api-gateway        # 使用连字符
- name: config/backup       # 包含斜杠
- name: .hidden            # 以点号开头
- name: system$            # 包含特殊字符
- name: null               # 保留关键字
```

## 命名验证工具

### 1. 自动验证脚本

**bash 脚本示例**:
```bash
#!/bin/bash

# 验证 YAML 配置文件
validate_naming_conventions() {
    local file=$1
    local errors=0
    
    # 检查变量名
    if [[ $file == *"vars.yml" ]]; then
        local invalid_vars=$(yq eval '.vars[] | select(.name | ascii_downcase != .name)' "$file")
        if [[ -n "$invalid_vars" ]]; then
            echo "错误: 变量名必须全小写"
            echo "$invalid_vars"
            errors=$((errors + 1))
        fi
    fi
    
    # 检查模块名
    if [[ $file == *"mod_list.yml" ]]; then
        local invalid_modules=$(yq eval '.[] | select(.name | ascii_downcase != .name)' "$file")
        if [[ -n "$invalid_modules" ]]; then
            echo "错误: 模块名必须全小写"
            echo "$invalid_modules"
            errors=$((errors + 1))
        fi
    fi
    
    return $errors
}

# 验证所有配置文件
for file in sys/*.yml; do
    if [[ -f "$file" ]]; then
        echo "验证文件: $file"
        validate_naming_conventions "$file"
        if [[ $? -eq 0 ]]; then
            echo "✓ 通过验证"
        else
            echo "✗ 验证失败"
        fi
    fi
done
```

### 2. 集成验证

**Git 钩子示例**:
```bash
#!/bin/bash
# .git/hooks/pre-commit

# 检查提交的文件是否包含配置文件
changed_files=$(git diff --cached --name-only --diff-filter=ACM | grep -E '\.(yml|gxl)$')

if [[ -n "$changed_files" ]]; then
    echo "验证命名规范..."
    
    for file in $changed_files; do
        echo "检查文件: $file"
        
        # 执行命名规范检查
        if ! validate_naming_conventions "$file"; then
            echo "错误: $file 不符合命名规范"
            exit 1
        fi
    done
fi

echo "命名规范验证通过"
```

## 最佳实践

### 1. 创建命名规范文档

**内容建议**:
- 项目特定的命名规则
- 术语表和缩写定义
- 示例和反例
- 验证工具使用方法
- 维护更新策略

### 2. 自动化验证

**工具集成**:
- CI/CD 流水线集成
- 代码审查工具集成
- 文档生成工具集成
- 开发环境配置集成

### 3. 定期审查

**审查频率**:
- 新功能开发时
- 代码审查阶段
- 版本发布前
- 定期维护更新

### 4. 团队协作

**团队实践**:
- 命名规范培训
- 代码审查重点
- 示例代码库
- 常见问题解答

## 总结

良好的命名规范是项目成功的重要因素。Sys-Operator 的命名规范注重可读性、一致性和可扩展性，通过清晰的命名约定可以：

- 提高代码可读性和维护性
- 减少沟通成本和理解误差
- 支持项目的长期演进
- 便于团队协作和代码审查
- 提供更好的开发体验

遵循这些命名规范，并与团队保持一致的命名约定，将有助于建立高质量、可维护的系统配置。

---

*更多详情请参考 [目录结构](./directory.md) 和 [文件组织方式](./file-organization.md)。*