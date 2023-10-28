<script lang="ts">
  import { board, Cell } from '$lib/board'
  import { game } from '$lib/game'

  export let cell: Cell
  export let position: { row: number; column: number }

  const { winner } = game
  const { row, column } = position
  $: winningCell = $winner && !!$winner.cells.find((cell) => cell[0] === column && cell[1] === row)
  $: losingCell = $winner && !winningCell && cell !== Cell.EMPTY
</script>

<div
  class="flex w-full grow items-center justify-center overflow-hidden outline-none {!$winner &&
  board.isValidColumn(column)
    ? 'cursor-pointer'
    : 'cursor-not-allowed'}"
>
  <span
    class="aspect-square w-3/4 rounded-full shadow-inner shadow-black"
    class:empty={cell === Cell.EMPTY}
    class:red={cell === Cell.RED}
    class:yellow={cell === Cell.YELLOW}
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
