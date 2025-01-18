const QueryBuilder = require("./QueryBuilder");

class TableManager{
    constructor(tableName, connection){
        this.table = tableName;
        this.connection = connection
    }
    async create(data){
        const builder = new QueryBuilder(this.table).insert(data).build()
        return this.connection.query(builder.sql, builder.params)
    }
    async find(conditions){
        const builder = new QueryBuilder(this.table).select().where(conditions).build()
        return this.connection.query(builder.sql, builder.params)
    }
}

module.exports = TableManager