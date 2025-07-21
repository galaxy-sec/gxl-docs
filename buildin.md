

## 内置常量

* GXL_PRJ_ROOT:   最近定义了 _gal/project.toml 的目录
* GXL_START_ROOT:  GXL 启动处理的目录
* GXL_CUR_DIR:  GXL 当前所在目录，在调用gx.run时，与GXL_START_ROOT可能不同
* GXL_CMD_ARG:  gflow -- <cmd_arg>

## gx.assert

```rust
gx.assert ( value = "hello" , expect = "hello"  ); 
```
### 参数

* value    :  [必须]需要验证的变量
* expect   :  [必须] 期待的结果
* result  :  "[true|false]" 默认值为 "true"
* err     :  验证失败后的错误信息。

### 示例:

```rust
gx.assert ( value = "hello" , expect : "hello" , result : "false" , err:"test assert"); 
```


## gx.cmd

```rust
gx.cmd (  cmd : "cat ./test.txt" ); 
// 可省略 cmd 参数名
gx.cmd (  "cat ./test.txt" ); 
```

### 属性参数

* cmd       [必须][] 执行命令
* log       日志输出级别
* quiet     静默，不输出出指令和结果
* expect    期待的结果

### 示例:

```rust
gx.cmd (  
	cmd     : "${PRJ_ROOT}/do.sh", 
    log     : "1" ,
    quiet   : "true" ,
    expect  : "[0,1,255]" 
 ) 
```
## gx.shell

```rust
gx.shell (  arg_file : "./arg.json ", shell: "${PRJ_ROOT}/do.sh" , out_var : "DO_OUT" ); 
```
### 属性参数

* shell       [必须] 执行脚本
* arg_file    脚本参数文件
* out_var     输出变量名

## gx.run

```rust
gx.run (  local: "${PRJ_ROOT}/mod/" ,env : "dev", flow : "conf,test" ); 
```

### 属性参数

* local   [必须] 运行所在目录
* env     [必须] 运行环境
* flow    [必须]运行的flow
* conf    运行的配置文件

### 示例:

```rust
gx.cmd (  
	cmd     : "${PRJ_ROOT}/do.sh", 
    log     : "1" ,
    out     : "true" ,
    expect  : "[0,1,255]" 
 ) 
```

## gx.echo

```rust
 gx.echo ( value : "${PRJ_ROOT}/test/main.py"  );
// 可省略 value 参数名
 gx.echo ( "${PRJ_ROOT}/test/main.py"  );
```


### 属性参数

* value : [必须]需显示的变量

## gx.read

读取信息到环境变量。

### 读取CMD运行结果到 name 

```rust
env dev {
    gx.read_cmd ( name : "gx" , cmd : "echo rigger-1.0" );
}
```

###  从INI文件中读取;

```rust
    gx.read_file ( file : "${ENV_ROOT}/test.ini" );
    gx.read_file ( "${ENV_ROOT}/test.ini" );
```

### 从标准输入读取;

```rust
env dev {
    gx.read_stdin ( prompt : "please input you name", name : "NAME"  );
    gx.echo (  "${NAME}" );
}
```

## gx.tpl

通过模板生成文件,使用 handlebars 引擎。

```rust
gx.tpl (  
   tpl : "${PRJ_ROOT}/conf_tpl.toml" ,
   dst : "${PRJ_ROOT}/conf.toml" ,
);
```

### 属性参数

* tpl : [必须]模板文件
* dst : [必须]生成目标文件


```rust
gx.tpl (  
   tpl : "${PRJ_ROOT}/conf_tpl.toml" ,
   dst : "${PRJ_ROOT}/conf.toml" ,
   data : r#" { "name" : "xiaoming", "age" : 3 } "#x
);
```

* data : 符合Json格式的模板数据 



## gx.vars 



```rust
gx.vars {  
   x = "${PRJ_ROOT}/test/main.py" ;
   y = "${PRJ_ROOT}/test/main.py" ; 
}
```


x,y 自定义的变量，可以在gxL 和扩展脚本使用


## gx.ver

```rust
gx.ver ( file : "./version.txt" ,  inc : "bugfix"  ); 
```

### 属性参数

* file :  version.txt 文件
* inc： 增长单位。   有 null,build,bugfix,feature,main 六个选项 


## gx.upload

```rust
gx.upload ( url: "https://github/galaxy-sec" ,  method : "put", local_file : "gflow"  ); 
```


## gx.download

```rust
gx.download( url: "https://github/galaxy-sec" ,   local_file : "gflow"  ); 
```

* username :   用户名
* password :   密码