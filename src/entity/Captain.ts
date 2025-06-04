import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from "typeorm";
import { Team } from "./Team";

@Entity()
export class Captain {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  playerNumber!: number;

  @Column()
  position!: string;

  @OneToOne(() => Team, (team) => team.captain)
  team!: Team;
}
