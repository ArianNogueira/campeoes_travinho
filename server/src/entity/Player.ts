import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Team } from "./Team";

@Entity()
export class Player {
    @PrimaryGeneratedColumn()
    id!: number;
    
    @Column()
    name!: string;
    
    @Column()
    playerNumber!: number;
    
    @Column()
    position!: string;
    
    @ManyToOne(() => Team, (team) => team.players, { onDelete: "CASCADE"} )
    team!: Team;   
}
