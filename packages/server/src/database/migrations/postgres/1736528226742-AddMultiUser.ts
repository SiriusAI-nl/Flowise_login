import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableColumn } from 'typeorm'

export class AddMultiUser1736527795526 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create users table
        await queryRunner.createTable(
            new Table({
                name: 'users',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'uuid'
                    },
                    {
                        name: 'username',
                        type: 'varchar',
                        isUnique: true,
                        isNullable: false
                    },
                    {
                        name: 'password',
                        type: 'varchar',
                        isNullable: false
                    },
                    {
                        name: 'email',
                        type: 'varchar',
                        isNullable: true,
                        isUnique: true
                    },
                    {
                        name: 'role',
                        type: 'varchar',
                        default: "'user'",
                        isNullable: false
                    },
                    {
                        name: 'created_date',
                        type: 'timestamp',
                        default: 'now()',
                        isNullable: false
                    },
                    {
                        name: 'updated_date',
                        type: 'timestamp',
                        default: 'now()',
                        isNullable: false
                    }
                ]
            }),
            true
        )

        // Create user_chatflows table
        await queryRunner.createTable(
            new Table({
                name: 'user_chatflows',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'uuid'
                    },
                    {
                        name: 'user_id',
                        type: 'uuid',
                        isNullable: false
                    },
                    {
                        name: 'chatflow_id',
                        type: 'uuid',
                        isNullable: false
                    },
                    {
                        name: 'permission',
                        type: 'varchar',
                        default: "'view'",
                        isNullable: false
                    }
                ]
            }),
            true
        )

        // Add owner_id to chat_flow table
        await queryRunner.addColumn(
            'chat_flow',
            new TableColumn({
                name: 'owner_id',
                type: 'uuid',
                isNullable: true
            })
        )

        // Add foreign key constraints
        await queryRunner.createForeignKey(
            'user_chatflows',
            new TableForeignKey({
                columnNames: ['user_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'users',
                onDelete: 'CASCADE'
            })
        )

        await queryRunner.createForeignKey(
            'user_chatflows',
            new TableForeignKey({
                columnNames: ['chatflow_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'chat_flow',
                onDelete: 'CASCADE'
            })
        )

        await queryRunner.createForeignKey(
            'chat_flow',
            new TableForeignKey({
                columnNames: ['owner_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'users',
                onDelete: 'SET NULL'
            })
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop foreign keys first
        const userChatflows = await queryRunner.getTable('user_chatflows')
        const chatFlow = await queryRunner.getTable('chat_flow')

        if (userChatflows) {
            const foreignKeys = userChatflows.foreignKeys
            for (const foreignKey of foreignKeys) {
                await queryRunner.dropForeignKey('user_chatflows', foreignKey)
            }
        }

        if (chatFlow) {
            const ownerForeignKey = chatFlow.foreignKeys.find((fk) => fk.columnNames.includes('owner_id'))
            if (ownerForeignKey) {
                await queryRunner.dropForeignKey('chat_flow', ownerForeignKey)
            }
        }

        // Drop column
        await queryRunner.dropColumn('chat_flow', 'owner_id')

        // Drop tables
        await queryRunner.dropTable('user_chatflows')
        await queryRunner.dropTable('users')
    }
}
