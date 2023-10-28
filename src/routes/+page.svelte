<script lang="ts">
  import { BOARD_HEIGHT, BOARD_WIDTH, Cell, board, game } from '$lib'
  import BoardCell from '$lib/components/BoardCell.svelte'
  import GameOverDialog from '$lib/components/GameOverDialog.svelte'

  const { winner, turn } = game
  game.newGame()
  for (let i = 0; i < 20; i++) {
    game.takeTurn(Math.floor(Math.random() * BOARD_WIDTH))
  }

  $: gameOver = !!$winner || board.isFull()

  let dialogOpen = false
  $: {
    if (gameOver) {
      dialogOpen = true
    }
  }
</script>

{#if $board.length}
  <!-- Game stats & controls -->
  <div
    class="flex items-center justify-between gap-x-8 gap-y-4 rounded-md bg-white p-4 shadow dark:bg-gray-800 md:w-1/4 md:flex-col md:justify-start"
  >
    <div class="flex items-center gap-2">
      {#if gameOver}
        {#if $winner}
          <span class="text-lg font-bold">Winner</span>
          <span
            class="rounded-full px-3 py-1 font-medium {$winner.winner === Cell.RED
              ? 'bg-red-500 text-white'
              : 'bg-yellow-400 text-black'}">{$winner.winner === Cell.RED ? 'Red' : 'Yellow'}</span
          >
        {:else}
          <span class="text-lg font-semibold text-gray-900 dark:text-gray-100">It's a tie!</span>
        {/if}
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
        <button
          on:click={() => game.takeTurn(colIndex)}
          class="flex grow flex-col-reverse bg-blue-600 outline-none focus-visible:bg-blue-500 {!$winner &&
          board.isValidColumn(colIndex)
            ? 'hover:bg-blue-500'
            : ''}"
        >
          {#each col as cell, rowIndex (rowIndex)}
            <BoardCell {cell} position={{ row: rowIndex, column: colIndex }} />
          {/each}
        </button>
      {/each}
    </div>
  </div>
{/if}

<GameOverDialog bind:open={dialogOpen} />
