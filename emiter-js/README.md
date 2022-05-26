# emiter-js js事件监听工具

*  emample
```
import { eventEmitter, eventListener } from 'emiter-js'

/*开启监听*/
eventListener.on('abc', (e) => {})

/*发送事件*/
eventEmitter.emit('abc', 'abc')

/*移除监听*/
eventListener.remove('abc')
```

* 引用自: https://github.com/aoran997/emiter-js
