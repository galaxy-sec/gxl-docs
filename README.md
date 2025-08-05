# Galaxy  Operator  Ecosystem


## 包括：
* DSL语言: Gxl
* 维护器
* 命令工具
    * gflow :Gxl的执行器
    * gops : 维护工程
    * gsys ：系统维护器
    * gmod ：模块维护器



## 核心流程
- 1、gmod 创建模块维护器，用gxl 编写维护器的workflow
- 2、gsys 创建系统维护器，并组合多个模块维护器,用gxl 编写维护器的workflow
- 3、系统维护器 保存到配置管理库中，待发布到客户环境。
- 4、在客户环境中，使用gops 创建维护工程， 并加载系统维护器。
- 5、在客户环境中，使用gflow 执行维护器的workflow。
- 6、保存维护工程到配置管理库中。