# flow 

##  注解

### task   (v0.6.0)

```rust
#[task(name="setup")]
flow setup{
    ...
}
```

### dryrun  (v0.7.0)
```
#[dryrun(_pub_dryrun)]
flow _pub_dysec {
    ...
}
flow _pub_dryrun {
    ...
}
```


### transcation undo (v0.7.0)
```
flow trans1 | step1 | step2 | step3 ;
  #[transaction,undo(_undo_step1)]
  flow step1 {
    gx.echo (" step1 ");
  }
  #[undo(_undo_step2)]
  flow step2 {
    gx.echo (" step2 ");
  }
  #[undo(_undo_step3)]
  flow step3 {
    gx.echo (" step3 ");
    gx.assert ( value : "true" , expect : "false" );
  }

  flow _undo_step1 {
    gx.echo (" undo step1 ");
  }
  flow _undo_step2 {
    gx.echo (" undo step2 ");
  }
  flow _undo_step3 {
    gx.echo (" undo step3 ");
  }
```

### usage
```rust
#[usage(desp="test")]
flow test_1 {

}
```

### auto_load

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
