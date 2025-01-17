import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm'

@Entity()
export class Users {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ unique: true })
    username: string

    @Column()
    password: string

    @Column({ nullable: true })
    email: string

    @Column({ default: 'user' })
    role: string

    @CreateDateColumn()
    created_date: Date

    @UpdateDateColumn()
    updated_date: Date
}
