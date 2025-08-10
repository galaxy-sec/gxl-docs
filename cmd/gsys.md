# gsys - Galaxy System Management Tool

## 概述

`gsys` 是 Galaxy 系统管理工具，用于创建、更新和本地化 Galaxy 系统配置。它提供了完整的系统生命周期管理功能，帮助开发者快速构建和维护 Galaxy 系统。

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
gsys
# 输出示例：gsys: 1.0.0
```

### 显示帮助信息

```bash
gsys --help
gsys <command> --help
```

## 命令详解

### gsys new

创建新的系统操作符

**语法：**
```bash
gsys new [OPTIONS]
```

**选项：**
- `-n, --name <NAME>` - 系统名称（字母数字，可包含连字符和下划线）【必填】

**功能：**
- 创建指定名称的新系统
- 初始化系统目录结构
- 生成所有必需的配置文件
- 交互式选择系统型号配置

**示例：**
```bash
# 创建名为 "my-system" 的新系统
gsys new --name my-system

# 创建系统时交互式选择系统型号
# 系统会提示：请选择系统型号配置:
# 1. ModelSTD_1
# 2. ModelSTD_2
# ...
# 选择完成后会自动生成对应的配置文件
```

**输出：**
```
创建目录：my-system/
生成配置文件：my-system/sys/sys_model.yml
生成模板文件：my-system/templates/
生成示例文件：my-system/examples/
```

### gsys update

更新现有系统配置

**语法：**
```bash
gsys update [OPTIONS]
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
  - 0：正常更新
  - 1：跳过确认
  - 2：覆盖文件
  - 3：强制 git pull

**功能：**
- 更新系统的配置和依赖关系
- 下载远程引用的系统资源
- 支持多种强制更新模式
- 自动处理系统版本冲突

**示例：**
```bash
# 正常更新系统
gsys update

# 跳过确认更新
gsys update --force 1

# 详细调试输出更新过程
gsys update --debug 3 --log all=debug

# 完整强制更新
gsys update --force 3 --debug 4
```

### gsys localize

本地化系统配置

**语法：**
```bash
gsys localize [OPTIONS]
```

**选项：**
- `-d, --debug <LEVEL>` - 调试级别（0-4）
- `--log <LOG>` - 日志配置
- `--value <PATH>` - 值文件路径（YAML/JSON）
- `--default` - 使用内置默认值，不使用用户提供的 value.yml

**功能：**
- 根据环境特定的值生成本地化配置
- 支持多环境配置管理
- 可选择使用自定义或默认值
- 自动生成环境特定的配置文件

**示例：**
```bash
# 使用默认值本地化
gsys localize --default

# 使用自定义值文件本地化
gsys localize --value prod-values.yml

# 使用自定义值文件并启用调试
gsys localize --value dev-values.yml --debug 2

# 使用详细日志进行本地化
gsys localize --value staging-values.yml --log cmd=debug,localize=info
```

## 系统型号配置

### 支持的系统型号

`gsys` 支持多种系统型号配置，可通过以下方式查看：

```bash
# 查看所有支持的系统型号
python3 -c "from galaxy_ops.module import ModelSTD; print('\n'.join(str(m) for m in ModelSTD.support()))"
```

### 系统型号选择

在创建新系统时，`gsys` 会交互式提示选择系统型号：

```
请选择系统型号配置:
1. ModelSTD_AWS
2. ModelSTD_Docker
3. ModelSTD_Kubernetes
4. ModelSTD_BareMetal
5. 从当前系统自动检测
请输入选项编号 [1-5]:
```

### 当前系统检测

如果选择"从当前系统自动检测"，`gsys` 会自动检测当前运行环境并生成对应的配置：

```bash
# 自动检测当前系统
ModelSTD::from_cur_sys()  # 内部调用的方法
```

## 环境变量

- `TEST_MODE` - 测试模式设置
- `MOCK_SUCCESS` - 模拟成功状态
- `TEST_MODE` 和 `MOCK_SUCCESS` 用于测试环境，确保测试的安全性和隔离性

## 配置文件

### 系统配置结构

```
my-system/
├── sys/                       # 系统配置目录
│   ├── sys_model.yml          # 系统型号配置
│   ├── dependencies.yml      # 依赖配置
│   └── config/               # 系统配置
│       ├── default.yml        # 默认配置
│       ├── local.yml          # 本地配置
│       └── env/               # 环境特定配置
│           ├── dev.yml
│           ├── staging.yml
│           └── prod.yml
├── templates/                 # 模板目录
├── examples/                 # 示例文件
├── scripts/                  # 脚本文件
└── deployment/               # 部署配置
    ├── docker/
    ├── kubernetes/
    └── terraform/
```

### sys_model.yml 示例

```yaml
# AWS 系统型号配置
system_name: my-aws-system
model: ModelSTD_AWS
version: "1.0.0"

# 基础配置
base_config:
  region: us-east-1
  availability_zones:
    - us-east-1a
    - us-east-1b
    - us-east-1c

# 计算资源
compute:
  type: auto_scaling
  min_size: 2
  max_size: 10
  desired_capacity: 3
  instance_type: t3.large

# 存储配置
storage:
  type: ebs
  volume_size: 100
  volume_type: gp3
  encrypted: true

# 网络配置
network:
  vpc_cidr: "10.0.0.0/16"
  subnet_cidrs:
    - "10.0.1.0/24"
    - "10.0.2.0/24"
    - "10.0.3.0/24"

# 安全配置
security:
  enable_vpc: true
  enable_security_groups: true
  enable_iam: true
```

### Docker 系统型号配置

```yaml
# Docker 系统型号配置
system_name: my-docker-system
model: ModelSTD_Docker
version: "1.0.0"

# 容器配置
containers:
  - name: main
    image: "my-app:latest"
    ports:
      - "8080:80"
    environment:
      - NODE_ENV=production
    volumes:
      - "/opt/app/data:/app/data"

# 网络配置
networks:
  - name: app-network
    driver: bridge
    internal: false

# 数据卷配置
volumes:
  - name: app-data
    driver: local
```

## 最佳实践

### 系统命名

- 使用小写字母、数字、连字符和下划线
- 避免特殊字符和空格
- 使用有意义的名称，如：`production-web-app`
- 区分环境和用途：`dev-api-gateway`

### 系统型号选择

```bash
# AWS 环境
gsys new --name aws-ecommerce -- 选择 ModelSTD_AWS

# Docker 环境
gsys new --name docker-microservices -- 选择 ModelSTD_Docker

# Kubernetes 环境
gsys new --name k8s-monitoring -- 选择 ModelSTD_Kubernetes

# 裸金属服务器
gsys new --name bare-metal-database -- 选择 ModelSTD_BareMetal
```

### 依赖管理

- 定期更新系统依赖：`gsys update --force 1`
- 在生产环境使用锁定版本
- 使用版本控制管理配置变更

### 配置管理

```bash
# 开发环境配置
gsys localize --value dev-config.yml --log cmd=debug

# 测试环境配置
gsys localize --value test-config.yml

# 生产环境配置
gsys localize --value prod-config.yml --default
```

## 故障排除

### 常见问题

**Q: 创建系统失败**
```
错误：无法创建目录 "my-system"
原因：目录已存在或权限不足
解决：删除现有目录或检查权限
```

**Q: 系统型号选择失败**
```
错误：无法解析系统型号
解决：检查系统型号配置文件是否正确
gsys new --name test-system -- 选择 1
```

**Q: 更新系统时网络错误**
```
错误：无法下载依赖
解决：检查网络连接和 git 配置
gsys update --debug 3 --log net=debug
```

**Q: 本地化失败**
```
错误：无法解析值文件
解决：检查 YAML/JSON 格式是否正确
gsys localize --value config.yml --debug 2
```

### 调试模式

使用调试模式获取详细的执行信息：

```bash
# 最高级别调试
gsys update --debug 4 --log all=debug

# 关键模块调试
gsys new --name test --debug 3 --log cmd=debug

# 网络调试
gsys update --debug 3 --log net=debug
```

### 系统诊断

```bash
# 检查系统配置
ls -la my-system/sys/

# 验证系统型号配置
cat my-system/sys/sys_model.yml

# 检查环境配置
ls -la my-system/sys/config/env/
```

## 测试

项目包含完整的测试套件：

```bash
# 运行所有测试
cargo test

# 运行特定测试
cargo test test_gxsys_run_success

# 运行测试并显示输出
cargo test -- --nocapture

# 测试环境隔离
TEST_MODE=true cargo test
```

## 示例工作流

### 开发新系统

```bash
# 1. 创建新系统
gsys new --name my-system

# 2. 选择系统型号（交互式）
# 输入编号选择对应的系统型号

# 3. 编辑系统配置
cd my-system
vim sys/sys_model.yml

# 4. 更新系统资源
cd ..
gsys update

# 5. 本地化配置
gsys localize --value dev-config.yml

# 6. 验证系统配置
ls -la my-system/sys/config/env/
```

### 部署到生产环境

```bash
# 1. 创建生产系统
gsys new --name production-system

# 2. 选择生产环境系统型号
# 根据实际情况选择 AWS/Docker/K8s 等

# 3. 更新到最新版本
gsys update --force 3

# 4. 使用生产配置本地化
gsys localize --value prod-config.yml --default

# 5. 验证生产配置
cat my-system/sys/config/env/prod.yml
```

## 版本历史

### 当前版本：1.0.0
- 初始版本
- 支持系统创建、更新和本地化
- 交互式系统型号选择
- 多种系统型号支持（AWS、Docker、Kubernetes、BareMetal）
- 完整的错误处理和日志记录

## 贡献指南

欢迎贡献代码和建议：

1. Fork 项目
2. 创建特性分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 许可证

本项目采用 MIT 许可证 - 详见 LICENSE 文件
