<script lang="ts">
  import { BOARD_HEIGHT, BOARD_WIDTH, Cell, board, game } from '$lib'

  const { winner } = game
  game.newGame()
</script>

{#if $board.length}
  <div
    class="flex max-w-2xl mx-auto rounded-md overflow-hidden"
    style="aspect-ratio: {BOARD_WIDTH} / {BOARD_HEIGHT};"
  >
    {#each $board as col, colIndex (colIndex)}
      <div
        class="flex grow flex-col-reverse bg-blue-700 {!$winner && board.isValidColumn(colIndex)
          ? 'hover:brightness-110'
          : ''}"
      >
        {#each col as cell, rowIndex (rowIndex)}
          {@const winningCell =
            $winner && !!$winner.cells.find((cell) => cell[0] === colIndex && cell[1] === rowIndex)}
          <button
            on:click={() => game.takeTurn(colIndex)}
            class="flex justify-center items-center grow {!$winner && board.isValidColumn(colIndex)
              ? 'cursor-pointer'
              : 'cursor-not-allowed'}"
          >
            <span
              class="w-3/4 aspect-square rounded-full ring-4 {cell === Cell.RED
                ? 'bg-red-500'
                : cell === Cell.YELLOW
                ? 'bg-yellow-400'
                : 'bg-gray-100 dark:bg-gray-900'} {winningCell
                ? 'dark:ring-gray-100 ring-gray-900 brightness-110'
                : 'ring-transparent'}"
            />
          </button>
        {/each}
      </div>
    {/each}
  </div>
{/if}
