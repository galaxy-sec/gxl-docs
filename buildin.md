

## gx.assert

```bash
gx.assert { value = "hello" ; expect = "hello" ; } 
```
### 属性参数

value    :  需要验证的变量
expect  :  期待的结果
result  :  "[true|false]" 默认值为 "true"
err     :  验证失败后的错误信息。

### 示例:

```
gx.assert { value = "hello" ; expect = "hello" ; result = "false" , err="test assert";} 
```


## gx.cmd

```bash
gx.cmd {  
	cmd = "${PRJ_ROOT}/do.sh"; 
 } 
```

### 属性参数

* cmd       执行脚本
* log       日志输出级别
* out       输出执行结果
* expect    期待的结果

### 示例:

```bash
gx.cmd {  
	cmd = "${PRJ_ROOT}/do.sh"; 
    log     = "1" ;
    out     = "true" ;
    expect  = "[0,1,255]" ;
 } 
```

## gx.echo

```bash
 gx.echo { value = "${PRJ_ROOT}/test/main.py" ; }
```

### 属性参数

* value : 需显示的变量

## gx.read

读取信息到环境变量。

### 读取CMD运行结果到 name 

```bash
env dev {
    gx.read { name = "gx" ; cmd = "echo rigger-1.0"; }
}
```

###  从INI文件中读取;

```bash
env dev {
    gx.read { ini = "${ENV_ROOT}/test.ini"; }
}
```

### 从标准输入读取;

```bash
env dev {
    gx.read { stdin = "please input you name"; name = "NAME" ; }
    gx.echo { value = "${NAME}"; }
}
```

## gx.tpl

通过模板生成文件,使用 handlebars 引擎。

```bash
gx.tpl {  
   tpl = "${PRJ_ROOT}/conf_tpl.toml" ;
   dst = "${PRJ_ROOT}/conf.toml" ;
}
```

### 属性参数

* tpl  :  模板文件
* dst ： 生成目标文件


```bash
gx.tpl {  
   tpl = "${PRJ_ROOT}/conf_tpl.toml" ;
   dst = "${PRJ_ROOT}/conf.toml" ;
   data = ^" { "name" : "xiaoming", "age" : 3 } "^;
}
```

* data : 符合Json格式的模板数据 



## gx.vars 



```bash
gx.vars {  
   x = "${PRJ_ROOT}/test/main.py" ;
   y = "${PRJ_ROOT}/test/main.py" ; 
}
```


x,y 自定义的变量，可以在gxL 和扩展脚本使用


## gx.ver

```yml
gx.ver { file = "./version.txt" ;  inc = "bugfix" ; } 
```

### 属性参数

* file :  version.txt 文件
* inc： 增长单位。   有 null,build,bugfix,feature,main 六个选项 