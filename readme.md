### 接口

```
// 获取验证码信息 - 接口返回.
result: {
  bg: "https://cdn-public.knowyourself.cc/2022/03/01/621d9167a9ee4.png",
  dg: "https://cdn-public.knowyourself.cc/2022/03/01/621d9167d977b.png",
  id: "628dbab0a3d4a",
  y: 396,
}

// 提交验证码信息.
// 参数.
params: {
  x: "",
  y: "",
  id: "" 验证码id
}
// 返回结果.
result: {
  code: "" // 继续进行下一步的校验.
}
```

### 使用
```
import verificationCode from "@kydev/verification-code"
// el根节点
const verification = new verificationCode(el, {
  getUrl: "", // 获取验证码信息 接口URL.
  postUrl: "", // 提交验证码信息 接口URL.
  api: axios // 接口请求方式.
})

// 验证成功返回的code
verification.codeCallBack().then((code) => {
  console.log(code, "返回的code");
});
```