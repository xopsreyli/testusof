exports.up = (pgm) => {
    pgm.createTable('comment_likes', {
        id: 'id',
        user_id: {
            type: 'integer',
            notNull: true,
            references: 'users',
            onDelete: 'cascade',
        },
        publish_date: {
            type: 'date',
            notNull: true,
            default: pgm.func('current_date'),
        },
        entity_id: {
            type: 'integer',
            references: 'comments',
            onDelete: 'cascade'
        },
        type: {
            type: 'varchar(8)',
            notNull: true,
            check: "type IN ('like', 'dislike')"
        }
    })
    pgm.createIndex('comment_likes', 'user_id')
    pgm.createIndex('comment_likes', 'entity_id')
};

exports.down = (pgm) => {
    pgm.dropTable('comment_likes')
};
