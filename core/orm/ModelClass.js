class ModelClass{
    constructor(connection){
        this.connection = connection
    }
    async tableExists(tableName) {
        const [rows] = await this.connection.promise().query(
            `SELECT COUNT(*) AS table_exists
             FROM information_schema.tables
             WHERE table_schema = DATABASE() AND table_name = ?`, 
            [tableName]
        );
        return rows[0].table_exists > 0;
    }

    async createTableIfNotExists(schema){
        const {title, fields} = schema;

        const exists = await this.tableExists(title);
        if(exists) {
            return;
        }
        const fieldDefinitions = Object.entries(fields).map(([fieldName, fieldConfig])=>{
            const sqlType = this.mapTypeToSQL(fieldConfig.type)
            const constraints = [];

            if (fieldConfig.reqd) constraints.push('NOT NULL')
            if(fieldConfig.unique) constraints.push('UNIQUE')
            return `\`${fieldName}\` ${sqlType} ${constraints.join(' ')}`.trim();
        })
        // Modify logic for primary key
        const primaryKey = 'id INT AUTO_INCREMENT PRIMARY KEY,'

        const createTableSQL = `
            CREATE TABLE \`${title}\` (
             ${primaryKey}
             ${fieldDefinitions.join(',\n')}
            )
        `
        await this.connection.promise().query(createTableSQL)
        console.log(`Table ${title} has been created`)
    }

    mapTypeToSQL(jsType){
        switch(jsType){
            case String: return 'VARCHAR(255)';
            case Number: return 'INT';
            case Array: return 'JSON';
            default: throw new Error(`Unsupported type: ${jsType}`)
        }
    }
}

module.exports = ModelClass