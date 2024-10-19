exports.up = (pgm) => {
    pgm.createTable('favorites', {
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
            onDelete: 'cascade'
        },
    })
    pgm.createIndex('favorites', ['user_id', 'post_id'], { unique: true })
};

exports.down = (pgm) => {
    pgm.dropTable('favorites')
};
