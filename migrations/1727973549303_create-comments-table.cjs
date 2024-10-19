exports.up = (pgm) => {
    pgm.createTable('comments', {
        id: 'id',
        user_id: {
            type: 'integer',
            notNull: true,
            references: 'users',
            onDelete: 'cascade',
        },
        post_id: {
            type: 'integer',
            notNull: true,
            references: 'posts',
            onDelete: 'cascade',
        },
        publish_date: {
            type: 'date',
            notNull: true,
            default: pgm.func('current_date'),
        },
        content: {
            type: 'text',
            notNull: true,
        },
        status: {
            type: 'varchar(16)',
            notNull: true,
            default: 'active',
            check: "status IN ('active', 'inactive')",
        },
    })
    pgm.createIndex('comments', ['user_id', 'post_id'])
};

exports.down = (pgm) => {
    pgm.dropTable('comments')
};
