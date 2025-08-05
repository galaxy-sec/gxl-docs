# 工程说明

这一个 mdbook 的文档工程，用于 Galaxy-Flow 的文档组织

## 文档编写规则
-  文档要以 mdbook 的格式编写
-  文档文件与summary.md 对应


## 任务规则
- 完成任务，要把结构反馈到 work.md 中。

# 工作任务 

[x] 调整文档结构
    [x] 把当前文件与GXL相关的内容移动到 gxl 目录下。
    [x] 将 inner 目录（gxl的内键能力）移动到 gxl 目录下。
    [x] 清理原有位置的文件
    [x] 将 example 目录移动到 gxl 目录下
    
    完成结果：
    - 已将 gxl.md、var_def.md、env.md、flow.md、fun.md 移动到 gxl/ 目录下
    - 已将 inner/ 目录移动到 gxl/inner/ 目录下
    - 已清理根目录下的 inner/ 目录
    - 已更新 SUMMARY.md 中的路径引用（包括inner相关路径）
    - 已验证 mdbook build 构建成功
[ ] 增加了cmd,operator 相关的文档， 更新 SUMMARY.md
