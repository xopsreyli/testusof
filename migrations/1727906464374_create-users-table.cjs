const bcrypt = require('bcrypt')

exports.up = async (pgm) => {
    pgm.createTable('users', {
        id: 'id',
        login: {
            type: 'varchar(32)',
            notNull: true,
            unique: true,
        },
        password: {
            type: 'varchar(64)',
            notNull: true,
        },
        full_name: {
            type: 'varchar(255)',
        },
        email: {
            type: 'varchar(255)',
            notNull: true,
            unique: true,
        },
        profile_picture: {
            type: 'varchar(255)',
            notNull: true,
            default: 'default-avatar.svg',
        },
        rating: {
            type: 'integer',
            notNull: true,
            default: 0,
        },
        role: {
            type: 'varchar(32)',
            notNull: true,
            default: 'user',
            check: "role IN ('user', 'admin')",
        },
        refresh_token: {
            type: 'text',
        },
        is_confirmed: {
            type: 'boolean',
            notNull: true,
            default: false,
        }
    })

    const hashedPassword = await bcrypt.hash('AdminPass1234', 10)

    pgm.sql(`INSERT INTO users (login, password, email, role, is_confirmed) VALUES ('admin', '${hashedPassword}', 'admin@gmail.com', 'admin', 'true')`)
};

exports.down = (pgm) => {
    pgm.dropTable('users')
};