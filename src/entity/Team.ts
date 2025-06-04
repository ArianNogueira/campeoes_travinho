import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany } from "typeorm";
import { Captain } from "./Captain";
import { Player } from "./Player";
import { Match } from "./Match";

@Entity()
export class Team {
    @PrimaryGeneratedColumn()
    id!: number;
    
    @Column({ unique: true })
    name!: string;
    
    @Column()
    group!: string;
    
    @OneToOne(() => Captain, { cascade: true, onDelete: "CASCADE" })
    @JoinColumn()
    captain!: Captain;
    
    @OneToMany(() => Player, (player) => player.team, { cascade: true, onDelete: "CASCADE" })
    players!: Player[];
    
    @OneToMany(() => Match, (match) => match.team, { cascade: true })
    matches!: Match[];
    
}
