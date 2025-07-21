# 变量定义

## 示例

```rust 
    one= "one";
    sys_a = { mod1 : "A", mod2 : "B" , mod3: 1 , mod4 : 2};
    sys_b =  [ "C", "D" ];
    sys_c = ${SYS_B[1]} ;
    sys_d = ${SYS_A.MOD1} ;
```

##  规则

在GXL内 变量名不区分大小写


## 使用示例

```rust 
mod envs {
    env default   {
      data_list =  [ "JAVA", "RUST", "PYTHON"] ;
      data_obj =  { 
        JAVA : { NAME: "JAVA", SCORE: 80 }, 
        RUST : { NAME: "RUST", SCORE: 100 }, 
        PYTHON : { NAME: "PYTHON", SCORE: 200} 
        } ;
    }
}
mod main   {
  flow array_do{
    for ${CUR} in ${ENV_DATA_LIST} {
      gx.echo( "CUR:${CUR}" );
    }
  }
  flow obj_do{
    for ${CUR} in ${ENV_DATA_OBJ} {
      gx.echo( "CUR:${CUR.NAME} : ${CUR.SCORE}" );
    }
  }

}
```