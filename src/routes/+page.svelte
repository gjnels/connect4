<script lang="ts">
  import { BOARD_HEIGHT, BOARD_WIDTH, Cell, board, game } from '$lib'

  const { winner, turn } = game
  game.newGame()
  for (let i = 0; i < 20; i++) {
    game.takeTurn(Math.floor(Math.random() * BOARD_WIDTH))
  }
</script>

{#if $board.length}
  <!-- Game stats & controls -->
  <div
    class="flex items-center justify-between gap-x-8 gap-y-4 rounded-md bg-gray-200 p-4 shadow dark:bg-gray-800 md:w-1/4 md:flex-col md:justify-start"
  >
    <div class="flex items-center gap-2">
      {#if $winner}
        <span class="text-lg font-bold">Winner</span>
        <span
          class="rounded-full px-3 py-1 font-medium {$turn === Cell.RED
            ? 'bg-red-500 text-white'
            : 'bg-yellow-400 text-black'}">{$turn === Cell.RED ? 'Red' : 'Yellow'}</span
        >
      {:else}
        <span>Next Move</span>
        <span
          class="rounded-full px-3 py-1 font-medium {$turn === Cell.RED
            ? 'bg-red-500 text-white'
            : 'bg-yellow-400 text-black'}">{$turn === Cell.RED ? 'Red' : 'Yellow'}</span
        >
      {/if}
    </div>
    <button
      class="rounded-md bg-blue-600 px-3 py-1.5 font-medium uppercase text-white shadow hover:brightness-110"
      on:click={game.newGame}
    >
      New Game
    </button>
  </div>

  <!-- Game board -->
  <div class="grow">
    <div
      class="mx-auto flex overflow-hidden rounded-md shadow md:max-w-2xl"
      style="aspect-ratio: {BOARD_WIDTH} / {BOARD_HEIGHT};"
    >
      {#each $board as col, colIndex (colIndex)}
        <div
          class="flex grow flex-col-reverse bg-blue-600 {!$winner && board.isValidColumn(colIndex)
            ? 'hover:brightness-110'
            : ''}"
        >
          {#each col as cell, rowIndex (rowIndex)}
            {@const winningCell =
              $winner &&
              !!$winner.cells.find((cell) => cell[0] === colIndex && cell[1] === rowIndex)}
            <button
              on:click={() => game.takeTurn(colIndex)}
              class="flex grow items-center justify-center {!$winner &&
              board.isValidColumn(colIndex)
                ? 'cursor-pointer'
                : 'cursor-not-allowed'}"
            >
              <span
                class="aspect-square w-3/4 rounded-full shadow-inner shadow-black {cell === Cell.RED
                  ? 'bg-red-500'
                  : cell === Cell.YELLOW
                  ? 'bg-yellow-400'
                  : 'bg-gray-100 dark:bg-gray-900'} {$winner
                  ? winningCell
                    ? 'ring-4 ring-white'
                    : cell !== Cell.EMPTY
                    ? 'brightness-75'
                    : ''
                  : ''}"
              />
            </button>
          {/each}
        </div>
      {/each}
    </div>
  </div>
{/if}
