
# GXL   语法

##  结构 

```rust
mod envs {
 env dev {
 }
}

mod main {
    flow conf {
    }
}
```
* mod   模块
* env   环境
* flow  处理流

## flow  

### 示例

#### 简单使用

```rust
flow test {
  gx.echo (  "hello world" );
}
```

#### 增加描述

```rust
#[usage(desp="test flow")]
flow test() {
  gx.echo (  "hello world" );
}
```

#### 编排

```rust
flow head {
  gx.echo ( "head"; )
}
flow tail {
  gx.echo ( "tail"; )
}

// 执行过程为: test -> head -> tail
flow  @test | head | tail  { }
flow  test | head | tail  { }


// 执行过程为: head -> tail -> test
flow  | head | tail  |@test { }

//执行过程为: head -> test -> tail
flow  head | @test | tail {
  gx.echo ( "test"; )
}
```

### 定义

```rust 
  flow [ <flows>|]  @<flow_name>  [|<flows>] {
  }
```

### 注解

```rust
#[usage(desp="test")]
flow test_1 {

}
```

#### usage 

```rust
#[usage(desp ="")]
```

#### auto_load

```rust
#[auto_load(entry,exit)] 

//entry: 进入flow 
//exit : 退出flow
示例:

mod main {

  flow start {
    gx.echo ( value : "hello" );
  }
  #[auto_load(entry)]
  flow conf {
    gx.echo ( value : "hello" );
  }
}
```

### 分支

```rust
mod main {
  api = "1.0"
  flow conf {
    if  ${API} == "1.0" {
        gx.echo ( value : "this is if true cond " );
    }
    else {
        gx.echo ( value : "this is if false cond" );
    }
  }
}
```
####  通配比较
```rust
mod main {
  api = "1.0"
  flow conf {
    if  ${API} =* "1*" {
        gx.echo ( value : "this is if true cond " );
    }
    else {
        gx.echo ( value : "this is if false cond" );
    }
  }
}
```

## env

环境设定集合

### 示例

```rust
env dev {
    root = "./" ;
}
```


```rust
#[useage(desp="开发环境")]
env dev {
    root = "./" ;
}
```

####   mix env

```rust
env base {}
env dev  : base {
    root = "./" ;
}
```

* 默认env: default  , 可以省去 gflow -e 参数 ;

### 定义

```rust
env <name> [: <mix-envs>] {
}
```

* name  :  
* mix-envs : 可继承的env

## mod 

mod 是顶级的组织结构

只有 envs,main 两个mod 中的 env 和 flow  cli 直接load

```rust
mod envs {
  prop1 = "prop1"
  env dev {}
}
mod main {
  prop1 = "prop1"
  flow test {}
}
```

执行

```rust
gflow -e dev test 
```

### mod 注解

### mod继承


###  示例
```rust
```

# Activity

* 包装shell  成为 activity 

```rust
 activity copy {
     src = "" ;
     dst = "" ;
     log = "1" ;
     out = "true"
     executer = "copy_act.sh" ;
}
```


