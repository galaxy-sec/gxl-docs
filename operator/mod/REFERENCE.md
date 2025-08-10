# Mod-Operator API 和枚举参考

本文档提供 Mod-Operator 的 API 接口、枚举定义和数据结构参考，是开发者进行二次开发和功能扩展的重要指南。

## 目录

- [模块 API](#模块-api)
- [枚举定义](#枚举定义)
- [数据结构](#数据结构)
- [工作流 API](#工作流-api)
- [配置文件格式](#配置文件格式)
- [错误代码](#错误代码)
- [环境变量](#环境变量)
- [API 使用示例](#api-使用示例)

## 模块 API

### ModuleSpec 接口

模块的核心数据结构，定义了模块的基本信息和支持的目标平台。

```rust
#[derive(Debug, Clone, Getters)]
pub struct ModuleSpec {
    /// 模块名称
    name: String,

    /// 目标平台配置映射
    targets: IndexMap<ModelSTD, ModModelSpec>,

    /// 本地化路径
    local: Option<PathBuf>,
}

impl ModuleSpec {
    /// 创建新模块
    pub fn init<S: Into<String>>(name: S, target_vec: Vec<ModModelSpec>) -> Self

    /// 清理其他平台配置
    pub fn clean_other(&mut self, node: &ModelSTD) -> MainResult<()>

    /// 保存主要配置
    pub fn save_main(&self, path: &Path, name: Option<String>) -> MainResult<()>
}
```

#### 方法详解

| 方法 | 参数 | 返回值 | 说明 |
|------|------|--------|------|
| `init` | `name: String`, `target_vec: Vec<ModModelSpec>` | `ModuleSpec` | 创建新的模块实例 |
| `clean_other` | `node: &ModelSTD` | `MainResult<()>` | 清理指定平台外的其他平台配置 |
| `save_main` | `path: &Path`, `name: Option<String>` | `MainResult<()>` | 保存模块主要配置文件 |

#### 使用示例

```rust
// 创建模块
let targets = vec![
    ModModelSpec::init(
        ModelSTD::x86_ubt22_k8s(),
        ArtifactPackage::default(),
        ModWorkflows::mod_k8s_tpl_init(),
        GxlProject::spec_k8s_tpl(),
        VarCollection::default(),
        None,
    ),
    ModModelSpec::init(
        ModelSTD::arm_mac14_host(),
        ArtifactPackage::default(),
        ModWorkflows::mod_host_tpl_init(),
        GxlProject::spec_host_tpl(),
        VarCollection::default(),
        None,
    ),
];

let module_spec = ModuleSpec::init("postgresql", targets);

// 清理其他平台
module_spec.clean_other(&ModelSTD::x86_ubt22_k8s());
```

### ModModelSpec 接口

模型规格定义，包含模块的具体实现配置。

```rust
#[derive(Debug, Clone, Getters)]
pub struct ModModelSpec {
    /// 模型标准
    model: ModelSTD,

    /// 构件包定义
    artifact_pkg: ArtifactPackage,

    /// 工作流定义
    workflows: ModWorkflows,

    /// GXL 项目配置
    prj: GxlProject,

    /// 变量集合
    vars: VarCollection,

    /// 设置配置
    setting: Option<Setting>,
}

impl ModModelSpec {
    /// 创建新的模型规格
    pub fn init(
        model: ModelSTD,
        artifact_pkg: ArtifactPackage,
        workflows: ModWorkflows,
        prj: GxlProject,
        vars: VarCollection,
        setting: Option<Setting>,
    ) -> Self

    /// 更新本地配置
    pub async fn update_local(
        &self,
        accessor: Accessor,
        path: &Path,
        options: &DownloadOptions,
    ) -> MainResult<UpdateUnit>

    /// 本地化处理
    pub async fn localize(
        &self,
        dst_path: Option<ValuePath>,
        options: LocalizeOptions,
    ) -> MainResult<()>

    /// 保存配置
    pub fn save_to(&self, path: &Path, name: Option<String>) -> SerdeResult<()>

    /// 从文件加载
    pub fn load_from(path: &Path) -> SerdeResult<Self>
}
```

#### 主要方法

| 方法 | 参数 | 说明 |
|------|------|------|
| `init` | `model`, `artifact_pkg`, `workflows`, `prj`, `vars`, `setting` | 创建模型规格实例 |
| `update_local` | `accessor`, `path`, `options` | 更新本地构件配置 |
| `localize` | `dst_path`, `options` | 执行本地化处理 |
| `save_to` | `path`, `name` | 保存配置到文件 |
| `load_from` | `path` | 从文件加载配置 |

## 枚举定义

### ModelSTD 标准型号

模型标准定义，包含 CPU 架构、操作系统和运行环境。

```rust
/// CPU 架构枚举
pub enum CpuArch {
    /// x86_64 架构
    X86,
    /// ARM 架构
    Arm,
}

/// 操作系统枚举
pub enum OsCPE {
    /// macOS 14+
    MAC14,
    /// Windows 10+
    WIN10,
    /// Ubuntu 22.04
    UBT22,
    /// CentOS 7
    COS7,
}

/// 运行环境枚举
pub enum RunSPC {
    /// 宿主机环境
    Host,
    /// Kubernetes 环境
    K8S,
}

/// 模型标准结构
#[derive(Debug, Clone, PartialEq, Eq, Hash, Getters)]
pub struct ModelSTD {
    /// CPU 架构
    arch: CpuArch,
    /// 操作系统
    os: OsCPE,
    /// 运行环境
    spc: RunSPC,
}
```

#### 常用预定义实例

```rust
// 主流平台组合
impl ModelSTD {
    /// x86 + Ubuntu 22.04 + Kubernetes
    pub fn x86_ubt22_k8s() -> Self

    /// x86 + Ubuntu 22.04 + Host
    pub fn x86_ubt22_host() -> Self

    /// ARM + macOS 14 + Host
    pub fn arm_mac14_host() -> Self

    /// ARM + Ubuntu 22.04 + Host
    pub fn arm_ubt22_host() -> Self
}
```

### Artifact 枚举

构件类型和状态枚举。

```rust
/// 构件类型
pub enum ArtifactType {
    /// HTTP/HTTPS 下载
    Http,
    /// Git 仓库
    Git,
    /// 本地文件
    Local,
    /// 容器镜像
    Container,
}

/// 构件状态
pub enum ArtifactStatus {
    /// 待下载
    Pending,
    /// 下载中
    Downloading,
    /// 已下载
    Downloaded,
    /// 解压中
    Extracting,
    /// 已解压
    Extracted,
    /// 已安装
    Installed,
    /// 错误
    Error,
}
```

### 枚举比较和转换

```rust
// 枚举比较
impl PartialEq for CpuArch {
    fn eq(&self, other: &Self) -> bool {
        match (self, other) {
            (CpuArch::X86, CpuArch::X86) => true,
            (CpuArch::Arm, CpuArch::Arm) => true,
            _ => false,
        }
    }
}

// 枚举转字符串
impl ToString for CpuArch {
    fn to_string(&self) -> String {
        match self {
            CpuArch::X86 => "x86".to_string(),
            CpuArch::Arm => "arm".to_string(),
        }
    }
}

// 字符串转枚举
impl FromStr for CpuArch {
    type Err = ParseError;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        match s.to_lowercase().as_str() {
            "x86" | "x86_64" | "amd64" => Ok(CpuArch::X86),
            "arm" | "aarch64" => Ok(CpuArch::Arm),
            _ => Err(ParseError::InvalidCpuArch(s.to_string())),
        }
    }
}
```

## 数据结构

### ArtifactPackage 构件包

```rust
#[derive(Debug, Clone, Serialize, Deserialize, Getters)]
pub struct ArtifactPackage {
    /// 构件列表
    artifacts: Vec<Artifact>,
}

impl ArtifactPackage {
    /// 创建默认构件包
    pub fn default() -> Self

    /// 从构件列表创建
    pub fn from(artifacts: Vec<Artifact>) -> Self

    /// 获取所有构件
    pub fn artifacts(&self) -> &Vec<Artifact>

    /// 添加构件
    pub fn add_artifact(&mut self, artifact: Artifact)

    /// 移除构件
    pub fn remove_artifact(&mut self, name: &str) -> Option<Artifact>

    /// 查找构件
    pub fn find_artifact(&self, name: &str) -> Option<&Artifact>

    /// 验证构件包
    pub fn validate(&self) -> Result<(), ValidationError>
}
```

### VarCollection 变量集合

```rust
#[derive(Debug, Clone, Serialize, Deserialize, Getters)]
pub struct VarCollection {
    /// 变量定义列表
    vars: Vec<VarDefinition>,
}

impl VarCollection {
    /// 定义变量
    pub fn define(vars: Vec<VarDefinition>) -> Self

    /// 添加变量
    pub fn add_var(&mut self, var: VarDefinition)

    /// 获取变量
    pub fn get_var(&self, name: &str) -> Option<&VarDefinition>

    /// 设置变量值
    pub fn set_value(&mut self, name: &str, value: String) -> Result<(), VarError>

    /// 解析变量值
    pub fn resolve_value(&self, name: &str, context: &Context) -> Result<String, VarError>

    /// 验证变量
    pub fn validate(&self) -> Result<(), VarError>
}
```

### GxlProject GXL 项目

```rust
#[derive(Debug, Clone, Serialize, Deserialize, Getters)]
pub struct GxlProject {
    /// 项目名称
    name: String,

    /// 工作流定义
    workflows: HashMap<String, GxlWorkflow>,

    /// 项目配置
    config: HashMap<String, Value>,
}

impl GxlProject {
    /// 创建项目配置模板
    pub fn spec_k8s_tpl() -> Self

    /// 创建主机配置模板
    pub fn spec_host_tpl() -> Self

    /// 添加工作流
    pub fn add_workflow(&mut self, name: String, workflow: GxlWorkflow)

    /// 获取工作流
    pub fn get_workflow(&self, name: &str) -> Option<&GxlWorkflow>

    /// 执行工作流
    pub async fn execute_workflow(
        &self,
        name: &str,
        context: &Context,
    ) -> Result<WorkflowResult, WorkflowError>
}
```

## 工作流 API

### GxlWorkflow GXL 工作流

```rust
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct GxlWorkflow {
    /// 工作流名称
    name: String,

    /// 工作流描述
    description: Option<String>,

    /// 任务列表
    tasks: Vec<GxlTask>,

    /// 变量定义
    variables: HashMap<String, GxlVariable>,

    /// 条件分支
    conditions: Vec<GxlCondition>,

    /// 错误处理
    error_handler: Option<GxlErrorHandler>,
}

impl GxlWorkflow {
    /// 创建工作流
    pub fn new(name: String) -> Self

    /// 添加任务
    pub fn add_task(&mut self, task: GxlTask)

    /// 添加条件分支
    pub fn add_condition(&mut self, condition: GxlCondition)

    /// 设置错误处理器
    pub fn set_error_handler(&mut self, handler: GxlErrorHandler)

    /// 验证工作流
    pub fn validate(&self) -> Result<(), WorkflowError>

    /// 执行工作流
    pub async fn execute(&self, context: &mut Context) -> Result<WorkflowResult, WorkflowError>
}
```

### GxlTask GXL 任务

```rust
#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum GxlTask {
    /// 命令任务
    Command(GxlCommandTask),

    /// 脚本任务
    Script(GxlScriptTask),

    /// 模板渲染任务
    Template(GxlTemplateTask),

    /// 下载任务
    Download(GxlDownloadTask),

    /// 并行任务
    Parallel(GxlParallelTask),

    /// 条件任务
    Conditional(GxlConditionalTask),

    /// 循环任务
    Loop(GxlLoopTask),
}
```

### 任务执行上下文

```rust
#[derive(Debug, Clone)]
pub struct Context {
    /// 变量存储
    variables: HashMap<String, Value>,

    /// 工作目录
    working_dir: PathBuf,

    /// 执行状态
    status: ExecutionStatus,

    /// 错误收集
    errors: Vec<ExecutionError>,

    /// 日志输出
    logs: Vec<LogEntry>,
}

impl Context {
    /// 创建新上下文
    pub fn new() -> Self

    /// 设置变量
    pub fn set_var(&mut self, name: String, value: Value)

    /// 获取变量
    pub fn get_var(&self, name: &str) -> Option<&Value>

    /// 执行命令
    pub async fn execute_command(&mut self, cmd: &str) -> Result<CommandResult, CommandError>

    /// 添加日志
    pub fn add_log(&mut self, level: LogLevel, message: String)

    /// 保存状态
    pub fn save_state(&self) -> Result<StateSnapshot, StateError>

    /// 恢复状态
    pub fn restore_state(&mut self, state: &StateSnapshot) -> Result<(), StateError>
}
```

## 配置文件格式

### YAML 配置验证

```rust
/// 配置验证器
pub struct ConfigValidator;

impl ConfigValidator {
    /// 验证 artifact.yml
    pub fn validate_artifact(yaml_content: &str) -> Result<Vec<Artifact>, ConfigError>

    /// 验证 depends.yml
    pub fn validate_depends(yaml_content: &str) -> Result<DependsConfig, ConfigError>

    /// 验证 vars.yml
    pub fn validate_vars(yaml_content: &str) -> Result<VarCollection, ConfigError>

    /// 验证 setting.yml
    pub fn validate_setting(yaml_content: &str) -> Result<Setting, ConfigError>

    /// 验证 mod-prj.yml
    pub fn validate_project(yaml_content: &str) -> Result<ProjectConfig, ConfigError>
}
```

### 配置生成器

```rust
/// 配置文件生成器
pub struct ConfigGenerator;

impl ConfigGenerator {
    /// 生成 artifact.yml
    pub fn generate_artifact(artifacts: &[Artifact]) -> String

    /// 生成 depends.yml
    pub fn generate_depends(deps: &[Dependency]) -> String

    /// 生成 vars.yml
    pub fn generate_vars(vars: &[VarDefinition]) -> String

    /// 生成 setting.yml
    pub fn generate_setting(setting: &Setting) -> String

    /// 生成 mod-prj.yml
    pub fn generate_project(project: &ProjectConfig) -> String
}
```

## 错误代码

### 错误类型定义

```rust
/// 系统错误
#[derive(Debug, Error)]
pub enum SystemError {
    #[error("配置解析错误: {0}")]
    ConfigParse(String),

    #[error("文件操作错误: {0}")]
    FileOperation(String),

    #[error("网络错误: {0}")]
    Network(String),

    #[error("进程错误: {0}")]
    Process(String),

    #[error("权限错误: {0}")]
    Permission(String),

    #[error("资源不足: {0}")]
    Resource(String),
}

/// 业务错误
#[derive(Debug, Error)]
pub enum BusinessError {
    #[error("模块不存在: {0}")]
    ModuleNotFound(String),

    #[error("任务执行失败: {0}")]
    TaskFailed(String),

    #[error("验证失败: {0}")]
    ValidationFailed(String),

    #[error("状态错误: {0}")]
    InvalidState(String),

    #[error("依赖冲突: {0}")]
    DependencyConflict(String),
}
```

### 错误处理模式

```rust
/// 错误处理结果
pub type Result<T> = std::result::Result<T, Error>;

/// 错误处理工具
pub struct ErrorHandler;

impl ErrorHandler {
    /// 记录错误
    pub fn log_error(error: &Error) {
        // 记录错误日志
    }

    /// 错误恢复
    pub fn recover(context: &mut Context, error: &Error) -> Result<()> {
        // 执行错误恢复操作
        Ok(())
    }

    /// 错误通知
    pub fn notify(error: &Error) -> Result<()> {
        // 发送错误通知
        Ok(())
    }
}
```

## 环境变量








## API 使用示例

### 创建自定义模块

```rust
use galaxy_ops::{
    artifact::{Artifact, ArtifactPackage},
    model::{ModelSTD, CpuArch, OsCPE, RunSPC},
    module::ModuleSpec,
};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // 定义目标平台
    let target_platforms = vec![
        ModelSTD::x86_ubt22_k8s(),
        ModelSTD::arm_mac14_host(),
    ];

    // 创建构件包
    let artifacts = vec![
        Artifact::new(
            "nginx",
            "1.25.3",
            "https://nginx.org/download/nginx-1.25.3.tar.gz".parse()?,
            "nginx-1.25.3.tar.gz",
        ),
        Artifact::new(
            "openssl",
            "3.0.0",
            "https://github.com/openssl/openssl.git".parse()?,
            "openssl-3.0.0",
        ),
    ];

    let artifact_pkg = ArtifactPackage::from(artifacts);

    // 为每个平台创建模型规格
    let mut target_specs = Vec::new();
    for platform in target_platforms {
        let model_spec = ModModelSpec::init(
            platform.clone(),
            artifact_pkg.clone(),
            ModWorkflows::mod_k8s_tpl_init(),
            GxlProject::spec_k8s_tpl(),
            VarCollection::define(vec![
                VarDefinition::new("MODULE_NAME", "nginx"),
                VarDefinition::new("VERSION", "1.25.3"),
            ]),
            None,
        );

        target_specs.push(model_spec);
    }

    // 创建模块规格
    let module_spec = ModuleSpec::init("nginx-server", target_specs);

    // 保存模块配置
    module_spec.save_main(&std::path::Path::new("./nginx"), Some("nginx".to_string()))?;

    println!("自定义模块创建成功");
    Ok(())
}
```




### 错误处理示例

```rust
use galaxy_ops::{error::{SystemError, BusinessError}, workflow::Context};

fn handle_error(context: &mut Context, error: &dyn std::error::Error) {
    match error.downcast_ref::<SystemError>() {
        Some(sys_error) => {
            match sys_error {
                SystemError::ConfigParse(msg) => {
                    eprintln!("配置解析错误: {}", msg);
                    // 执行配置错误恢复
                    ConfigErrorHandler::recover(context, msg);
                }
                SystemError::FileOperation(msg) => {
                    eprintln!("文件操作错误: {}", msg);
                    // 执行文件错误恢复
                    FileErrorHandler::recover(context, msg);
                }
                SystemError::Network(msg) => {
                    eprintln!("网络错误: {}", msg);
                    // 执行网络错误恢复
                    NetworkErrorHandler::recover(context, msg);
                }
                _ => {
                    eprintln!("未知系统错误: {}", msg);
                }
            }
        }
        None => {
            match error.downcast_ref::<BusinessError>() {
                Some(biz_error) => {
                    match biz_error {
                        BusinessError::ModuleNotFound(msg) => {
                            eprintln!("模块不存在: {}", msg);
                            ModuleErrorHandler::recover(context, msg);
                        }
                        BusinessError::TaskFailed(msg) => {
                            eprintln!("任务执行失败: {}", msg);
                            TaskErrorHandler::recover(context, msg);
                        }
                        BusinessError::ValidationFailed(msg) => {
                            eprintln!("验证失败: {}", msg);
                            ValidationErrorHandler::recover(context, msg);
                        }
                        _ => {
                            eprintln!("未知业务错误: {}", msg);
                        }
                    }
                }
                None => {
                    eprintln!("未分类错误: {}", error);
                }
            }
        }
    }
}
```




## 总结

本 API 参考文档提供了 Mod-Operator 框架的完整接口和功能说明，包括：

1. **模块管理 API** - 用于创建和管理模块实例
2. **枚举定义** - 标准化的平台和类型定义
3. **数据结构** - 核心配置和数据类型
4. **工作流 API** - 任务执行和流程控制
5. **配置处理** - 配置文件的验证和生成
6. **错误处理** - 完善的错误处理机制
7. **环境变量** - 系统和用户配置变量
8. **实用示例** - 常见场景的实现示例

通过这些 API，开发者可以：
- 创建自定义模块类型
- 扩展工作流功能
- 自定义配置验证
- 实现高级监控功能
- 集成第三方系统

建议开发者在使用前仔细阅读相关章节，并根据实际需求选择合适的 API 接口。

## 相关资源

- 📖 [配置说明](./CONFIGURATION.md) - 完整的配置文件参考
- 📖 [开发指南](./DEVELOPMENT.md) - 开发工作流和最佳实践
- 📖 [故障排除](./TROUBLESHOOTING.md) - 调试和问题解决
- 🛠️ [gmod 工具文档](../gmod/) - 模块管理工具使用指南
- 🛠️ [gflow 工具文档](../gflow/) - 工作流执行工具使用指南

---
*本文档会根据框架发展持续更新，请关注最新版本。如需帮助，请参考示例代码或提交 Issue。*
