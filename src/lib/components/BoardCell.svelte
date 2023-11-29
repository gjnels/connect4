<script lang="ts">
  import { game, Cell, ROW_COUNT } from '$lib'

  export let row: number
  export let column: number

  const { board, status } = game
  $: cell = $board[ROW_COUNT - 1 - row][column]
  $: winningCell =
    $status.type === 'win' &&
    !!$status.cells.find((cell) => cell[0] === ROW_COUNT - 1 - row && cell[1] === column)
  $: losingCell = $status.type === 'win' && !winningCell && cell !== Cell.EMPTY
</script>

<div class="flex w-full flex-1 items-center justify-center overflow-hidden outline-none">
  <span
    class="aspect-square w-3/4 rounded-full shadow-inner shadow-black"
    class:empty={cell === Cell.EMPTY}
    class:red={cell === Cell.PLAYER_1}
    class:yellow={cell === Cell.PLAYER_2}
    class:winner={winningCell}
  >
    {#if losingCell}
      <span class="block h-full w-full rounded-full bg-white/25 dark:bg-black/25"></span>
    {/if}
  </span>
</div>

<style lang="postcss">
  .red {
    @apply bg-red-500;
  }
  .yellow {
    @apply bg-yellow-400;
  }
  .empty {
    @apply bg-gray-100 dark:bg-gray-900;
  }
  .winner {
    @apply ring-4 ring-white;
  }
</style>
