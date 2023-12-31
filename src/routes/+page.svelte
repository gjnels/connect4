<script lang="ts">
  import { COLUMN_COUNT, Cell, ROW_COUNT, game } from '$lib'
  import BoardCell from '$lib/components/BoardCell.svelte'
  import GameOverDialog from '$lib/components/GameOverDialog.svelte'
  import MainMenu from '$lib/components/MainMenu.svelte'

  const { turn, status, guessing, guessScore } = game

  $: disabled = $status.type !== 'playing' || (!$guessing && $turn.ai)
</script>

{#if $status.type === 'menu'}
  <MainMenu />
{:else}
  <!-- Game stats & controls -->
  <div
    class="flex items-center gap-x-8 gap-y-4 rounded-md bg-white p-4 shadow dark:bg-gray-800 md:w-1/4 md:flex-col"
  >
    {#if $status.type === 'playing'}
      <div class="flex flex-col items-center gap-1">
        <div class="flex items-center gap-2">
          <span>Next Move</span>
          <span
            class="rounded-full px-3 py-1 font-medium {$turn.piece === Cell.PLAYER_1
              ? 'bg-red-500 text-white'
              : 'bg-yellow-400 text-black'}"
            >{$turn.color[0].toUpperCase() + $turn.color.slice(1).toLowerCase()}</span
          >
        </div>
        {#if $guessing}
          {#if $turn.ai}
            <span class="text-center">Guess where the AI should move!</span>
          {:else}
            <span class="text-center">Make your move!</span>
          {/if}
        {/if}
      </div>
    {:else if $status.type === 'win'}
      {@const color = $status.player.color}
      <div class="flex items-center gap-2">
        <span class="text-lg font-bold">Winner</span>
        <span
          class="rounded-full px-3 py-1 font-medium {color === 'red'
            ? 'bg-red-500 text-white'
            : 'bg-yellow-400 text-black'}"
          >{color[0].toUpperCase() + color.slice(1).toLowerCase()}</span
        >
      </div>
    {:else if $status.type === 'tie'}
      <span class="text-lg font-semibold text-gray-900 dark:text-gray-100">It's a tie!</span>
    {/if}
    <button
      class="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium uppercase text-white shadow hover:brightness-110 md:text-base"
      on:click={() => game.new()}
    >
      New Game
    </button>
    <button
      class="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium uppercase text-white shadow hover:brightness-110 md:text-base"
      on:click={() => game.showMenu()}
    >
      Main Menu
    </button>

    {#if $guessing}
      <div>Score: {$guessScore}</div>
    {/if}
  </div>

  <!-- Game board -->
  <div class="grow">
    <div
      class="mx-auto flex overflow-hidden rounded-md bg-blue-600 shadow md:max-w-2xl"
      style="aspect-ratio: {COLUMN_COUNT} / {ROW_COUNT}"
    >
      {#each Array(COLUMN_COUNT).fill(null) as _, column (column)}
        <button
          class="flex flex-1 flex-col outline-none disabled:cursor-not-allowed [&:not(:disabled)]:hover:bg-blue-500"
          on:click={() => {
            if ($guessing && game.isAiTurn()) {
              game.makeGuess(column)
            } else {
              game.takeTurn(column)
            }
          }}
          {disabled}
        >
          {#each Array(ROW_COUNT).fill(null) as _, row (row)}
            <BoardCell {row} {column} />
          {/each}
        </button>
      {/each}
    </div>
  </div>

  <GameOverDialog open={$status.type === 'tie' || $status.type === 'win'} />
{/if}
