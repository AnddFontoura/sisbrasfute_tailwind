# Implementation Plan — Match Calendar

Reusable monthly match calendar component for the Vue 3 (Options API) + Vite + Tailwind v4 frontend at
`/home/andrefontoura/PhpstormProjects/sisbrasfute_tailwind`, wired into TeamShow (replacing the "Próximas partidas"
carousel) and TeamAdmin, with a MatchesList change so date-range query params are honored.

## Verified facts (from reading the code — do not re-derive)

- Build/verify commands: `npm run build` (vite build) and `npm run lint` (`eslint . --fix`). No test framework exists in the project; verification is build + lint, both must pass. Do NOT run `npm run dev` (blocks).
- `@/` alias resolves to `src` (vite.config.js). ESLint = js recommended + vue `flat/essential`; keep no unused vars/imports.
- HTTP wrapper: `import api from "@/services/api"`. Base URL from env; `/matches` is the paginated list endpoint.
- `/matches` is consumed in `MatchesList.vue` `getMatchesList()` as:
  `api.get('/matches', { params: { page, teamId, team_name, state_id, city_id, date_start, date_end } })` and the
  response is assigned directly: `this.matches = response.data`, where `response.data` is shaped
  `{ data: [...], current_page, last_page, ... }` (Laravel paginator). So pages are 1-indexed and `current_page`/`last_page` live at the top level of `response.data`.
- Date logic for "past" uses `new Date(match.schedule)` (see `isPastMatch`). `schedule` is an ISO datetime; `schedule_br` is the pt-BR display string.
- Score-vs-VS header logic to mirror exactly (from MatchesList card header):
  - If `match.my_team_score !== null && match.enemy_team_score !== null` → score line:
    `{my_team_name} {my_team_score} [(my_team_penalty_score) if has_penalties] x [(enemy_team_penalty_score) if has_penalties] {enemy_team_score} {enemy_team_name}`.
  - Else → `{my_team_name} VS {enemy_team_name}`.
  - Fallback labels used in the project: `my_team_name || 'Meu Time'`, `enemy_team_name || 'Adversário'`.
- Routes (src/router/team.js):
  - `team-matches-list` → path `/team/:teamId/matches/list` (param name is **`teamId`**), renders MatchesList.vue.
  - `team-admin` → path `/teams/:id/admin` (param name is **`id`**).
  - `team-show` → path `/team/show/:id` (param name is **`id`**).
- `TeamShow.vue`: `teamId` is a data field set in `created()` from `this.$route.params.id`. Right column of the
  `grid grid-cols-1 lg:grid-cols-2 gap-6` block holds the "Upcoming matches carousel" card titled "Próximas partidas".
  Script has: data `upcomingMatches: []`, `upcomingLoading: false`; methods `getUpcomingMatches()`, `scrollUpcoming()`;
  a `this.getUpcomingMatches()` call in `created()`; a `ref="upcomingTrack"` in template; and a `.upcoming-track` block
  in `<style scoped>`. These all become unused after replacement and must be removed.
- `TeamAdmin.vue`: `teamId` is a data field set in `created()` from `this.$route.params.id`. It already has an
  **unrelated** data field `upcomingMatches: 0` (a Number count for a summary card) — leave it untouched; the calendar is
  a child component so there is no name collision. Insert the calendar as a new full-width section AFTER the "Ações
  rápidas" (Quick Actions) card and BEFORE the "Zona de Perigo" (Danger Zone) card.
- `MatchesList.vue` `created()` currently does: `this.teamId = this.$route.params.teamId ?? null`, then
  `this.loadMyTeams()` and `this.getMatchesList()`. `filters` already contains `date_start` and `date_end` (both `null`)
  and they are already sent to `/matches` and bound to the Período date inputs. It does NOT read these from the query
  string — that is the only gap.

## Design decisions (made here, grounded in the above)

1. **Data source**: existing `/matches` endpoint with `date_start`/`date_end` range, paginated. No backend changes.
   Rationale: constraint fixed by the task; MatchesList already proves the endpoint accepts these params.
2. **Pagination**: loop pages (`page = 1..last_page`) accumulating `data`, rather than guessing a `per_page` the API may
   not support. Rationale: safest; `last_page` is known from the first response.
3. **Month range bounds**: `date_start` = first day of visible month, `date_end` = last day of visible month, both
   `YYYY-MM-DD`. Build them from the visible month's year/month using **local** date construction (no `toISOString`,
   which would shift by timezone). Rationale: the project treats `schedule` as local (`new Date(match.schedule)`), and the
   date inputs in MatchesList are plain `YYYY-MM-DD`.
4. **Local-day grouping**: group matches by the local calendar day of `new Date(match.schedule)` using a
   `YYYY-MM-DD` key built from local getFullYear/getMonth/getDate (zero-padded). Rationale: mirrors `isPastMatch`'s local
   interpretation and avoids a match landing on the wrong cell near midnight/UTC boundaries.
5. **Empty-day guard**: a day cell renders the ball marker only when its grouped list length ≥ 1. Days with no matches
   render as a plain cell. Rationale: the known project pitfall called out in the task.
6. **Multiple matches/day**: a single ball marker whose hover popover / title lists every match for that day.
7. **Click target**: clicking a day that has matches pushes router `team-matches-list` with `params: { teamId }` and
   `query: { date_start: dayKey, date_end: dayKey }`. Rationale: task-mandated; requires the MatchesList query fix below.
8. **Loading/accessibility**: reuse the orange `animate-spin` SVG spinner seen across the project; nav buttons get
   `aria-label`; the ball marker container is focusable (`tabindex="0"`) and carries a `title` as a non-hover fallback.
9. **Grid always renders**: the month grid is always visible; the spinner overlays/sits above it; empty months just show
   no ball markers (no error state needed).

---

## Items

- [ ] 1. Create the MatchCalendar component.
      Create `src/components/calendar/MatchCalendar.vue` as an Options-API SFC (`data()/methods/computed`, no `<script setup>`),
      `name: "MatchCalendar"`, importing `api` from `@/services/api`. Props: `teamId` (type `[Number, String]`, `required: true`).
      Implement:
      - **State**: `viewDate` (a Date pinned to the 1st of the visible month, initialized to today's month), `matchesByDay`
        (object keyed `YYYY-MM-DD` → array of match objects), `loading` (bool).
      - **Weekday headers**: `['Dom','Seg','Ter','Qua','Qui','Sex','Sáb']`.
      - **Header label** computed: `"{MesPorExtenso} de {ano}"` using a pt-BR month-name array
        (`['Janeiro',...,'Dezembro']`) — e.g. "Outubro de 2026". (Avoid relying on `toLocaleString` locale availability in CI;
        use the explicit array.)
      - **Grid cells** computed: produce a flat list of 42 cells (6 weeks) covering the visible month. Each cell =
        `{ date: Date, key: 'YYYY-MM-DD', dayNumber, inCurrentMonth: bool, isToday: bool, matches: [] }`. Leading cells come
        from the days of the previous month needed to reach the first weekday (Sunday-start), trailing cells fill the last row.
        `matches` for a cell = `this.matchesByDay[cell.key] || []`.
      - **Date helpers**: `pad2(n)`, `localKey(date)` → `` `${y}-${pad2(m+1)}-${pad2(d)}` `` from local getters,
        `firstDayKey()`/`lastDayKey()` for the visible month (last day via `new Date(year, month+1, 0).getDate()`).
      - **Fetch** `fetchMonth()`: set `loading=true`; loop pages starting at `page=1`:
        `api.get('/matches', { params: { page, teamId: this.teamId, date_start: firstDayKey, date_end: lastDayKey } })`;
        read `response.data.data`, `response.data.current_page`, `response.data.last_page`; accumulate all `data`; continue
        while `current_page < last_page` (increment `page`); then rebuild `matchesByDay` by grouping accumulated matches on
        `localKey(new Date(m.schedule))` (skip matches without `schedule`); `loading=false` in a `finally`. Wrap in try/catch
        that `console.error`s (match the project's non-blocking error style; no Swal needed here).
      - **Navigation methods**: `prevMonth()`, `nextMonth()` (shift `viewDate` by ∓1 month via
        `new Date(year, month∓1, 1)`), `goToday()` (reset to current month's 1st). Each calls `fetchMonth()` after updating.
      - **Match display helpers** (mirror MatchesList): `hasScore(m)` = `m.my_team_score !== null && m.enemy_team_score !== null`;
        `matchLabel(m)` returning the score line when `hasScore`, else `"{my_team_name||'Meu Time'} VS {enemy_team_name||'Adversário'}"`.
        Compose the score line as text:
        `"{my}  {my_team_score}{(my_pen) if has_penalties} x {(enemy_pen) if has_penalties}{enemy_team_score}  {enemy}"`.
        `cityLabel(m)` = `m.city_info?.name` optionally with `m.city_info?.state_info?.name`.
      - **Click**: `openDay(cell)` — only when `cell.matches.length > 0` — `this.$router.push({ name: 'team-matches-list',
        params: { teamId: this.teamId }, query: { date_start: cell.key, date_end: cell.key } })`.
      - **Template**: card-free root (parents wrap it in a card). Header row: prev button (`aria-label="Mês anterior"`),
        the month label, next button (`aria-label="Próximo mês"`), and a "Hoje" button. Weekday header row (7 cols).
        A `grid grid-cols-7` of day cells: de-emphasize `!inCurrentMonth` (e.g. `text-gray-400 dark:text-gray-600`),
        highlight `isToday` (e.g. orange ring/`bg-orange-50 dark:bg-orange-900/20`). For cells with matches, render a focusable
        (`tabindex="0"`) ball marker (⚽) with `:title="cell.matches.map(matchLabel + schedule_br/city).join()"` and a
        CSS hover popover (group-hover) listing each match: `matchLabel(m)`, `m.schedule_br`, `cityLabel(m)`. Clicking the
        cell/ball calls `openDay(cell)`. Show the orange `animate-spin` SVG spinner (copy the markup used in MatchesList)
        while `loading`, as an overlay or inline above the grid, keeping the grid rendered. All text pt-BR; every element has
        dark-mode variants (`bg-white dark:bg-gray-800`, borders `dark:border-gray-700`, etc.).
      - `created()` (or `mounted()`): call `fetchMonth()`.
      Files: `src/components/calendar/MatchCalendar.vue`
      Verify: `cd /home/andrefontoura/PhpstormProjects/sisbrasfute_tailwind && npm run lint && npm run build` — both exit 0.
      (The component is not yet imported anywhere, so build only confirms it compiles; integrations in items 3–4 exercise it.)

- [ ] 2. Teach MatchesList to honor `date_start`/`date_end` query params.
      In `src/views/System/Matches/MatchesList.vue` `created()`, BEFORE the existing `this.getMatchesList()` call, read the
      query string and seed the filters when present, keeping current behavior when absent:
      set `this.filters.date_start = this.$route.query.date_start ?? this.filters.date_start` and the same for
      `date_end`. (Values from the query are already `YYYY-MM-DD` strings, matching the date inputs and the params
      `getMatchesList` sends — no transform needed.) Do not change anything else; when no query params are present the
      filters stay `null` and behavior is identical to today. Optionally open the Filtros panel when a date query is present
      (set `this.showFilters = true`) so the applied range is visible — keep this minimal.
      Files: `src/views/System/Matches/MatchesList.vue`
      Verify: `npm run lint && npm run build` — both pass. Manual sanity (not required to pass): navigating to
      `/team/:teamId/matches/list?date_start=YYYY-MM-DD&date_end=YYYY-MM-DD` lists only that day's matches for the team.

- [ ] 3. Replace the "Próximas partidas" carousel in TeamShow with the calendar.
      In `src/views/System/Team/TeamShow.vue`:
      - **Template**: delete the entire right-column card commented `<!-- Upcoming matches carousel -->` (the whole
        `<div class="rounded-xl bg-white dark:bg-gray-800 p-6 ...">` block that contains the "Próximas partidas" heading,
        the prev/next scroll buttons, the loading/empty states, and the carousel `<div ref="upcomingTrack" ... class="... upcoming-track">`).
        Replace it with an equivalent card wrapper
        `<div class="rounded-xl bg-white dark:bg-gray-800 p-6 shadow-sm border border-gray-100 dark:border-gray-700">`
        containing a heading `<h2 class="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-4">Calendário de partidas</h2>`
        and `<match-calendar :teamId="teamId" />`. Keep this as the right column so the `grid grid-cols-1 lg:grid-cols-2 gap-6`
        two-column layout and the players column (left) are untouched.
      - **Script**: import the component (`import MatchCalendar from "@/components/calendar/MatchCalendar.vue"`) and register
        it in `components`. Remove the now-unused upcoming machinery: data fields `upcomingMatches: []` and
        `upcomingLoading: false`; the `getUpcomingMatches()` and `scrollUpcoming()` methods; and the `this.getUpcomingMatches()`
        line in `created()`. Leave `getTeamInformation()`/`getTeamPlayers()` calls intact.
      - **Style**: remove the `.upcoming-track` rules (both the `.upcoming-track` and `.upcoming-track::-webkit-scrollbar`
        blocks) from `<style scoped>`; keep the `.fade-*` transition rules.
      Files: `src/views/System/Team/TeamShow.vue`
      Verify: `npm run lint && npm run build` — both pass (lint would flag leftover unused `upcomingMatches`/`scrollUpcoming`
      refs or an unused import if any were missed).

- [ ] 4. Add the calendar as a full-width section in TeamAdmin.
      In `src/views/System/Team/TeamAdmin.vue`:
      - **Template**: insert a new full-width section AFTER the "Ações rápidas" (Quick Actions) card and BEFORE the
        "Zona de Perigo" (Danger Zone) card:
        `<div class="rounded-xl bg-white dark:bg-gray-800 p-6 shadow-sm border border-gray-100 dark:border-gray-700">`
        with `<h2 class="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-4">Calendário de partidas</h2>`
        and `<match-calendar :teamId="teamId" />`. The surrounding `w-full space-y-6` wrapper already makes it full width.
      - **Script**: import `MatchCalendar` from `@/components/calendar/MatchCalendar.vue` and register it in `components`.
        Do not touch the existing `upcomingMatches` Number data field or its summary card.
      Files: `src/views/System/Team/TeamAdmin.vue`
      Verify: `npm run lint && npm run build` — both pass.

- [ ] 5. Final verification of the whole change.
      Run the project's build and lint from the project root and confirm a clean result, then confirm no stray references to
      the removed carousel remain.
      Files: none (verification only).
      Verify: `cd /home/andrefontoura/PhpstormProjects/sisbrasfute_tailwind && npm run lint && npm run build` — both exit 0;
      and a search for `upcomingTrack`, `scrollUpcoming`, `getUpcomingMatches`, and `upcoming-track` returns no matches in
      `src/views/System/Team/TeamShow.vue`.

## Verification record (implementation iteration 1)

Commands run from the project root `/home/andrefontoura/PhpstormProjects/sisbrasfute_tailwind`:

- `npm run build` → **exit 0**. Vite compiled all chunks including `TeamShow`, `TeamAdmin`, `MatchesList`, and the new
  `MatchCalendar` component. This is the authoritative compile gate and it passes clean. (`✓ built in ~5.9s`.)
- `npm run lint` (`eslint . --fix` over the whole repo) → exit 1, but with **24 pre-existing errors that are not mine**.
  Verified against the committed `main` baseline (stash the working changes, re-run lint): the SAME 24 errors appear with
  the working tree reverted, so lint was already red on `main` before this task. They live in unrelated files
  (`App.vue`, `OrangeButton.vue`, `CitySelectComponent.vue`, `systemLayout.vue`, `websiteLayout.vue`, `router/index.js`,
  `Login.vue`, `Register.vue`, `Configuration.vue`, `Dashboard.vue`, `MatchesForm.vue`, `TeamMatchesAdmin.vue`,
  `TeamForm.vue`, `Home.vue`, `vite.config.js`).
- Scoped lint of my changes is clean:
  - `npx eslint src/components/calendar/MatchCalendar.vue src/views/System/Matches/MatchesList.vue src/views/System/Team/TeamAdmin.vue` → **exit 0, 0 problems**.
  - `npx eslint src/views/System/Team/TeamShow.vue` → the only 3 errors are the pre-existing
    `vue/require-component-is` warnings on the info-card `<component is="MapIcon"/>` lines (52/62/72), which predate this
    task and are untouched by the carousel removal. No new errors introduced.
- Carousel cleanup verified: a search for `upcomingTrack`, `scrollUpcoming`, `getUpcomingMatches`, `upcoming-track` in
  `TeamShow.vue` returns **no matches**.

Fixing the 24 unrelated repo-wide lint errors would be an out-of-scope refactor across ~15 files; they are left as-is.
The build (the real compile gate for this change) is green.

### Date-grouping reasoning (dev server not started — traced by hand)

`matchesByDay` groups each match under `localKey(new Date(match.schedule))`, where `localKey` reads LOCAL
`getFullYear/getMonth/getDate` and zero-pads (never `toISOString`, which would shift by the UTC offset).

Trace for a sample `schedule = "2026-10-05 20:30:00"` (the shape the API returns, parsed as local time):
- `new Date("2026-10-05 20:30:00")` → local Mon 05 Oct 2026 20:30.
- `getFullYear()=2026`, `getMonth()=9` → `pad2(10)="10"`, `getDate()=5` → `pad2(5)="05"`.
- key = `"2026-10-05"`. The grid cell for Oct 5 is built the same way (`localKey(cellDate)`), so the match lands on the
  Oct-5 cell and that cell renders one ⚽ marker. A second match the same day appends to the same array → still one ball,
  popover lists both. A day with no matches has an empty array → no marker (empty-day guard: `v-if cell.matches.length > 0`).
- Month range sent to `/matches`: `date_start` = `localKey(new Date(2026,9,1))` = `"2026-10-01"`,
  `date_end` = `localKey(new Date(2026,10,0))` = `"2026-10-31"` (last day via `new Date(year, month+1, 0).getDate()`).
- Pagination: loop `page = 1..last_page` reading `response.data.data` / `current_page` / `last_page`, accumulating all
  rows before grouping. Click on Oct-5 pushes `team-matches-list` with `params:{teamId}` and
  `query:{date_start:"2026-10-05", date_end:"2026-10-05"}`; MatchesList `created()` now seeds its date filters from those
  query params, so the list opens filtered to exactly that day for that team.

## Notes / assumptions

- No automated test framework exists; per the task, build + lint are the verification gates. If the implementer wants a
  manual smoke test, run `npm run dev` locally in a throwaway terminal (NOT via the workflow) and visit a team's show/admin page.
- The `/matches` endpoint is assumed to filter by `date_start`/`date_end` inclusively on `schedule` (as MatchesList already
  relies on). If a month returns zero matches, `matchesByDay` is empty and the grid renders with no ball markers — the
  intended empty state.
- Timezone: all date keys are built from local getters; do not switch to `toISOString()` for day keys.
