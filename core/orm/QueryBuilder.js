class QueryBuilder{
    constructor(table){
        this.table = table;
        this.query = '';
    }
    select(fields = '*'){
        this.query = `SELECT ${fields} FROM ${this.table}`
        return this
    }
    where(conditions = null){
        if(conditions){
            const conditionStr = Object.keys(conditions).map(key=>{
                `${key} = ?`
            }).join('AND');
            this.query += ` WHERE ${conditionStr}`
            this.params = Object.values(conditions)
        }
        return this;
    }
    insert(data){
        const keys = Object.keys(data).join(', ');
        const placeholders = Object.keys(data).map(()=>'?').join(', ')
        this.query = `INSERT INTO ${this.table} (${keys}) VALUES (${placeholders})`
        this.params = Object.values(data);
        return this;
    }
    build(){
        return {sql: this.query, params: this.params}
    }
}

module.exports = QueryBuilder