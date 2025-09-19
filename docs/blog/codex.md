# codex

claude用着用着感觉变笨了，九月转战codex。

---

## 查询用量

```bash
npx @ccusage/codex daily
```

---

## 默认设置

1. `/model` 选择 `gpt-5-codex high`（high 会增加 token 消耗，但换来更充分的思考时间，个人认为值得）。
2. `/approvals` 选择 `Full Access`，避免每次执行都要手动授权。
3. 结合第 2 点，codex 没有 plan mode，需在提示词中显式注明“不要编码”，在确认后“:执行这个方案”。
