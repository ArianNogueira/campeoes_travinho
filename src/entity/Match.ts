import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Team } from "./Team";

@Entity()
export class Match {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  opponent!: string;

  @Column()
  date!: string; // poderia ser Date se for um campo de data real

  @ManyToOne(() => Team, (team) => team.matches)
  team!: Team;
}
