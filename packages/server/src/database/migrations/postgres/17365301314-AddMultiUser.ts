// File: 1694326141424-AddMultiUser.ts

import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddMultiUser1694326141424 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS users (
                id uuid NOT NULL DEFAULT uuid_generate_v4(),
                username varchar NOT NULL UNIQUE,
                password varchar NOT NULL,
                email varchar UNIQUE,
                role varchar NOT NULL DEFAULT 'user',
                created_date timestamp NOT NULL DEFAULT now(),
                updated_date timestamp NOT NULL DEFAULT now(),
                CONSTRAINT "PK_users" PRIMARY KEY (id)
            );

            CREATE TABLE IF NOT EXISTS user_chatflows (
                id uuid NOT NULL DEFAULT uuid_generate_v4(),
                user_id uuid NOT NULL,
                chatflow_id uuid NOT NULL,
                permission varchar NOT NULL DEFAULT 'view',
                CONSTRAINT "PK_user_chatflows" PRIMARY KEY (id),
                CONSTRAINT "FK_user_chatflows_users" FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                CONSTRAINT "FK_user_chatflows_chat_flow" FOREIGN KEY (chatflow_id) REFERENCES chat_flow(id) ON DELETE CASCADE
            );

            -- Add user_id to chat_flow table if it doesn't exist
            DO $$ 
            BEGIN 
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                    WHERE table_name = 'chat_flow' AND column_name = 'owner_id') THEN
                    ALTER TABLE chat_flow ADD COLUMN owner_id uuid;
                    ALTER TABLE chat_flow ADD CONSTRAINT "FK_chat_flow_users" 
                        FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE SET NULL;
                END IF;
            END $$;
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE chat_flow DROP CONSTRAINT IF EXISTS "FK_chat_flow_users";
            ALTER TABLE chat_flow DROP COLUMN IF EXISTS owner_id;
            DROP TABLE IF EXISTS user_chatflows;
            DROP TABLE IF EXISTS users;
        `)
    }
}
