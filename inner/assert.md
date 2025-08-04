# gx.assert

## 功能描述
执行断言检查，验证表达式的值是否符合预期。

## 语法定义
```gxl
gx.assert {
  value: <表达式>,      // 要检查的值
  expect: <期望值>,     // 期望的值
  err: <错误信息>,      // 断言失败时的错误信息（可选）
  result: <变量名>      // 存储断言结果的变量名（可选）
}
```

## 示例代码
```gxl
// 检查变量值是否等于期望值
gx.assert {
  value: ${MY_VAR},
  expect: "expected_value",
  err: "MY_VAR值不正确"
}

// 检查表达式结果并存储结果
gx.assert {
  value: ${CALC_RESULT},
  expect: 42,
  result: "assert_result"
}
```