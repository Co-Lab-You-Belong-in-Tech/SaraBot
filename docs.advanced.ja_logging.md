<details class="secondary-wrapper">
<summary class="section-head" markdown="0">
<h4 class="section-head">コンソール以外へのログ出力の送信</h4>
</summary>
<div class="secondary-content" markdown="0">
 
| メソッド      | パラメーター        | 戻り値の型    |
|--------------|-------------------|-------------|
| `setLevel()` | `level: LogLevel` | `void`      |
| `getLevel()` | なし               | `string` (値は `error`, `warn`, `info`, `debug` のいずれか)  |
| `setName()`  | `name: string`    | `void`      |
| `debug()`    | `...msgs: any[]`  | `void`      |
| `info()`     | `...msgs: any[]`  | `void`      |
| `warn()`     | `...msgs: any[]`  | `void`      |
| `error()`    | `...msgs: any[]`  | `void`      |

非常に単純なカスタム logger では、名前やレベルが無視され、すべてのメッセージがファイルに書き込まれることがあります。
</div>

```javascript
const { App } = require('@slack/bolt');
const { createWriteStream } = require('fs');
const logWritable = createWriteStream('/var/my_log_file');

const app = new App({
  token,
  signingSecret,
  // リテラルオブジェクトとして logger を設定（必要なメソッドを持つクラスを指定するイメージで）
  logger: {
    debug(...msgs): { logWritable.write('debug: ' + JSON.stringify(msgs)); },
    info(...msgs): { logWritable.write('info: ' + JSON.stringify(msgs)); },
    warn(...msgs): { logWritable.write('warn: ' + JSON.stringify(msgs)); },
    error(...msgs): { logWritable.write('error: ' + JSON.stringify(msgs)); },
    setLevel(): { },
    setName(): { },
  },
});
```

</details>
