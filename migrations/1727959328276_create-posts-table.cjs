exports.up = (pgm) => {
    pgm.createTable('posts', {
        id: 'id',
        user_id: {
            type: 'integer',
            notNull: true,
            references: 'users',
            onDelete: 'cascade',
        },
        title: {
            type: 'varchar(255)',
            notNull: true,
        },
        publish_date: {
            type: 'date',
            notNull: true,
            default: pgm.func('current_date'),
        },
        status: {
            type: 'varchar(16)',
            notNull: true,
            default: 'active',
            check: "status IN ('active', 'inactive')",
        },
        content: {
            type: 'text',
            notNull: true,
        },
        rating: {
            type: 'integer',
            notNull: true,
            default: 0,
        },
    })
    pgm.createIndex('posts', 'user_id')
};

exports.down = (pgm) => {
    pgm.dropTable('posts')
};
