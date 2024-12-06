# Vec3ArrayDatabase
Vector3を配列として保存します。

## 使い方

```javascript
import { world } from "@minecraft/server";
import { Vec3ArrayDatabase } from "./Vec3ArrayDatabase.js";

const database = new Vec3ArrayDatabase("stoneLocas");

database.add({ x:10, y:10, z:10 });

database.has({ x:10, y:10, z:10 }); //true
database.get(); //[ { x:10, y:10, z:10 }, ]

database.delete({ x:10, y:10, z:10 });

database.get(); //[]
```
