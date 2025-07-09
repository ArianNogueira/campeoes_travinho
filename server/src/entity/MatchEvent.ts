import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from "typeorm";
import { Match } from "./Match";
import { Player } from "./Player";

@Entity()
export class MatchEvent {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Match, (match) => match.events, { onDelete: "CASCADE" })
  match!: Match;

  @ManyToOne(() => Player, (player) => player.events, { onDelete: "CASCADE" })
  player!: Player;

  @Column({ default: 0 })
  goals!: number;

  @Column({ default: false })
  yellowCard!: boolean;

  @Column({ default: false })
  redCard!: boolean;
}
