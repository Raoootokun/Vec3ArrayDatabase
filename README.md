# Vec3ArrayDatabase
Vector3を配列として保存します。

## 使い方

- `new Vec3ArrayDatabase(string): Vec3ArrayDatabase`  
  オブジェクトを生成。

- `add(Vec3): void`  
  vec3を追加します。(すでに追加済みの場合追加されない。)

- `delete(Vec3): void`  
  vec3を削除します。

- `has(Vec3): bool`  
  vec3が追加されているかを返します。

- `get(): Vec3[]`  
  追加されているvec3を配列として返します。

- `clear(): void`  
  追加されているvec3をすべて削除します。

- `size(): number`  
  追加されているvec3の数を返します。

- `byte(): number`  
  追加されているvec3のバイト数を返します。
  
### 使用例

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
