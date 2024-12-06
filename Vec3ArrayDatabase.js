import { world } from '@minecraft/server';

class WorldDatabase {
    prefixBase = `WorldDatabase`;
    static prefixBaseStatic = `WorldDatabase`;

    constructor(id) {
        this.map = new Map();

        this.id = id;
        this.prefix = `${this.prefixBase}_${this.id}`;

        this.load();
    };

    set(key, value) {
        const valueCopy = this.get(key);

        this.map.set(key, value);
        if(this.save(key, value))return true;

        this.set(key, valueCopy);
        return false;
    };

    delete(key) {
        this.map.delete(key);
        this.save(key);
    };

    get(key) {
        const value = this.map.get(key);
        if(value == undefined)return;

        return JSON.parse(JSON.stringify(value));
    };

    clear() {
        this.map.clear();
        const ids = world.getDynamicPropertyIds().filter(id => { if(id.startsWith(this.prefix))return id; });

        for(const id of ids) {
           world.setDynamicProperty(id); 
        };
    };

    keys() {
        const keys = [];
        for(const key of this.map.keys()) {
            keys.push(key)
        };
        return keys;
    };

    values() {
        const values = [];
        for(const value of this.map.values()) {
            values.push(value)
        };
        return values;
    };

    entries() {
        const entries = [];
        for(const entry of this.map.entries()) {
            entries.push(entry)
        };
        return entries;
    };

    save(key, value) {
        const valueStr = JSON.stringify(value);

        try{
            //WorldDatabase-test-key1
            world.setDynamicProperty(this.prefix + `_` + key, valueStr);
        }catch(e){
            return false;
        };
        return true;
    };

    load() {
        const ids = world.getDynamicPropertyIds().filter(id => { if(id.startsWith(this.prefix))return id; });

        for(const id of ids) {
            const key = id.replace(this.prefix+`_`, ``);
            const valueStr = world.getDynamicProperty(id);
            if(!valueStr)continue;

            const value = JSON.parse(valueStr);
            this.map.set(key, value);
        };
    };

    byte(key) {
        return encodeURI(JSON.stringify(this.map.get(key))).split(/%..|./).length - 1  
    };

    get size() {
        return this.map.size;
    };

};

export class Vec3ArrayDatabase {
    constructor(id) {
        this.id = id;

        this.dataId = Vec3ArrayDatabase.PREFIX + `_` + id;
        this.DATABASE = new WorldDatabase(this.dataId);//データベース
        this.databaseCount = 0;//データベースの数
        this.cache = [];

        this.load();
    };

    /**
     * @param {Vec3} vec3 
     * @returns 
     */
    add(vec3) {
        if(this.databaseCount == 0){
            this.databaseCount = 1;
            this.DATABASE.set(`dbc`, 1);
            this.DATABASE.set(`ary_` + this.databaseCount, []);  
        };
        const strVec3 = JSON.stringify(vec3);

        //すでに配列に追加済みかチェック
        let ary;
        for(let i=1; i<=this.databaseCount; i++){
            const id = `ary_` + i;
            const vec3Array = this.DATABASE.get(id);
            if(vec3Array.includes(strVec3))return;
            ary = vec3Array;
        };

        //追加
        ary.push(strVec3);

        //保存
        const saveRes = this.DATABASE.set(`ary_` + this.databaseCount, ary);  
        if(!saveRes) {
            this.databaseCount += 1;
            this.DATABASE.set(`ary_` + this.databaseCount, [strVec3]);
            this.DATABASE.set(`dbc`, this.databaseCount);
        };
         
    };

    /**
     * @param {Vec3} vec3 
     * @returns 
     */
    delete(vec3) {
        const strVec3 = JSON.stringify(vec3);
        for(let i=1; i<=this.databaseCount; i++){
            const id = `ary_` + i;
            const vec3Array = this.DATABASE.get(id);
            if(vec3Array.includes(strVec3)){

                const index = vec3Array.indexOf(strVec3);
                vec3Array.splice(index, 1);
                this.DATABASE.set(id, vec3Array);
                return;
            };
        };
    };

    /**
     * @param {Vec3} vec3 
     * @returns {Boolean}
     */
    has(vec3) {
        const strVec3 = JSON.stringify(vec3);
        for(let i=1; i<=this.databaseCount; i++){
            const id = `ary_` + i;
            const vec3Array = this.DATABASE.get(id);
            if(vec3Array.includes(strVec3))return true;
        };
        return false;
    };

    /**
     * @returns {Vec3[]}
     */
    get() {
        const ary = [];
        for(let i=1; i<=this.databaseCount; i++){
            const id = `ary_` + i;
            const vec3Array = this.DATABASE.get(id);
            ary.push(...vec3Array);
        };
        return ary.map(a => { return JSON.parse(a); });
    };

    clear() {
        this.databaseCount = 0;
        for(let i=1; i<=this.databaseCount; i++){
            const id = `ary_` + i;
            this.DATABASE.delete(id);
        };
        this.DATABASE.set(`dbc`, 0);
    };

    size() {
        if(this.databaseCount == 0)return 0;

        let size = 0;
        for(let i=1; i<=this.databaseCount; i++){
            const id = `ary_` + i;
            const vec3Array = this.DATABASE.get(id);
            size += vec3Array.length;
        };
        return size;
    };

    byte() {
        if(this.databaseCount == 0)return 0;
        let byte = 0;
        for(let i=1; i<=this.databaseCount; i++){
            const id = `ary_` + i;
            const vec3Array = this.DATABASE.get(id).map(v => { return JSON.stringify(v); });
            byte += encodeURI(vec3Array.join(``)).split(/%..|./).length - 1;
        };

        return byte; 
    };

    load() {
        this.databaseCount = this.DATABASE.get(`dbc`) ?? 0;
    };
};
Vec3ArrayDatabase.PREFIX = `Vec3ArrayDatabase`;