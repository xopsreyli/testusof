exports.up = (pgm) => {
    pgm.createTable('categories', {
        id: 'id',
        title: {
            type: 'varchar(32)',
            notNull: true,
        },
        description: {
            type: 'text',
            notNull: true,
        },
        number_of_posts: {
          type: 'integer',
          notNull: true,
          default: 0,
        },
    })
};

exports.down = (pgm) => {
    pgm.dropTable('categories')
};
