# Galaxy Ops 模块示例说明

本目录包含 Galaxy Ops 框架的模块示例，展示了如何创建和管理可复用的运维模块。

## 目录结构说明

### mysql_mock 示例模块

```
mysql/
├── _gal/                    # 模块构建配置目录
│   ├── adm.gxl             # 模块管理配置
│   └── work.gxl            # 工作流环境配置
├── mod/                     # 平台特定配置目录
│   ├── arm-mac14-host/     # ARM Mac 平台配置
│   │   ├── vars.yml        # 环境变量定义
│   │   └── workflows/      # 平台特定工作流
│   │       └── operators.gxl
│   └── x86-ubt22-k8s/      # x86 Ubuntu K8s 平台配置
│       ├── vars.yml
│       └── workflows/
├── mod-prj.yml              # 模块项目配置
└── version.txt             # 模块版本信息
```

## 文件作用详解

### 1. `_gal/adm.gxl` - 模块管理配置
- **作用**: 定义模块的版本管理和依赖关系
- **关键配置**:
  - 引入版本管理模块 `ver_adm` 用于版本控制
  - 定义默认环境配置
  - 继承版本管理功能

### 2. `_gal/work.gxl` - 工作流环境配置
- **作用**: 定义模块支持的不同运行环境和平台配置
- **关键配置**:
  - 引入 `mod_ops` 模块提供核心运维功能
  - 定义多个环境配置：
    - `arm_mac`: ARM Mac 平台
    - `x86_ubt`: x86 Ubuntu 平台
    - `x86_ubt_k8s`: x86 Ubuntu K8s 平台
  - 每个环境关联对应的模型目录

### 3. `mod-prj.yml` - 模块项目配置
- **作用**: 定义模块的测试环境和依赖关系
- **配置说明**:
  - `test_envs.dep_root`: 依赖根目录（空表示使用默认）
  - `test_envs.deps`: 依赖模块列表（空数组表示无额外依赖）

### 4. `version.txt` - 版本信息
- **作用**: 记录模块的当前版本号
- **格式**: 遵循语义化版本规范（如 0.1.0）

### 5. `mod/*/vars.yml` - 环境变量配置
- **作用**: 定义平台特定的环境变量和参数
- **配置结构**:
  ```yaml
  vars:
  - name: 变量名
    desp: 描述（可选）
    value: 变量值
  ```
- **示例变量**:
  - `EXAMPLE_SIZE`: 示例数据大小
  - `HOME_BIN`: 用户二进制文件目录
  - `WORK_BIN`: 工作目录二进制文件路径

### 6. `mod/*/workflows/operators.gxl` - 工作流定义
- **作用**: 定义模块的具体操作流程和任务
- **关键功能**:
  - `__into`: 初始化流程，加载配置文件
  - `install`: 安装任务（空实现，可扩展）
  - `download`: 下载任务，处理构件下载
- **操作说明**:
  - 读取配置文件 `./values/_used.json`
  - 解析构件信息 `artifact.yml`
  - 执行文件下载和解压操作
