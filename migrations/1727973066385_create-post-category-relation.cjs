exports.up = (pgm) => {
    pgm.createTable('post_category', {
        post_id: {
            type: 'integer',
            notNull: true,
            references: 'posts',
            onDelete: 'cascade'
        },
        category_id: {
            type: 'integer',
            notNull: true,
            references: 'categories',
            onDelete: 'cascade',
        }
    })
    pgm.createIndex('post_category', ['post_id', 'category_id'], { unique: true })
};

exports.down = (pgm) => {
    pgm.dropTable('post_category')
};
