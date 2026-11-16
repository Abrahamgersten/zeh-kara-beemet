-- 2026-11-16 (Avraham): "the week" of the gift link is the calendar week (Sunday to Saturday, Israel), not the last 7 days.
do $mig$
declare
  d1 text := pg_get_functiondef('gift_state(text)'::regprocedure);
  d2 text := pg_get_functiondef('gift_pick(text,text)'::regprocedure);
begin
  d1 := replace(d1, 'day > v_day - 7', 'day >= v_day - extract(dow from v_day)::int');
  d2 := replace(d2, 'day > v_day - 7', 'day >= v_day - extract(dow from v_day)::int');
  execute d1;
  execute d2;
end
$mig$;
