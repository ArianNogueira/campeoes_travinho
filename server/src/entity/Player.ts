import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { Team } from "./Team";
import { MatchEvent } from "./MatchEvent";

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

    @OneToMany(() => MatchEvent, (event) => event.player)
    events!: MatchEvent[];

}
