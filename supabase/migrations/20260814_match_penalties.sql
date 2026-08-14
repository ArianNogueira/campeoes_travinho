alter table public.matches
  add column if not exists home_penalty_score integer,
  add column if not exists away_penalty_score integer;

alter table public.matches
  drop constraint if exists matches_penalty_scores_nonnegative;

alter table public.matches
  add constraint matches_penalty_scores_nonnegative
  check (
    (home_penalty_score is null or home_penalty_score >= 0)
    and (away_penalty_score is null or away_penalty_score >= 0)
  );
