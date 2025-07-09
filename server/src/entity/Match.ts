// src/entity/Match.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { Team } from "./Team";
import { MatchEvent } from "./MatchEvent";

@Entity()
export class Match {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Team)
  @JoinColumn({ name: "home_team_id" }) // cria coluna personalizada no banco
  home!: Team;

  @ManyToOne(() => Team)
  @JoinColumn({ name: "away_team_id" })
  away!: Team;

  @Column()
  date!: string;

  @Column()
  time!: string;

  @Column()
  round!: number;

  @Column()
  group!: string;

  @OneToMany(() => MatchEvent, (event) => event.match)
  events!: MatchEvent[];

}
