<script lang="ts">
  import { Cell } from '$lib/board'
  import { game } from '$lib/game'
  import { fade, fly } from 'svelte/transition'

  export let open: boolean

  const { winner } = game
</script>

{#if open}
  <!-- Dialog backdrop -->
  <div class="fixed inset-0 h-screen w-screen bg-black/25 dark:bg-white/25" transition:fade />

  <!-- Dialog container -->
  <div class="fixed inset-0 flex h-screen w-screen items-center justify-center">
    <!-- Dialog -->
    <div
      class="flex flex-col rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800"
      transition:fly={{ y: 10 }}
    >
      <h2 class="text-center text-xl font-bold">Game Over</h2>
      <hr class="mb-6 mt-1 border-gray-300 dark:border-gray-500" />
      {#if $winner}
        <p
          class="self-center rounded-full px-3 py-1 text-lg font-semibold {$winner.winner ===
          Cell.RED
            ? 'bg-red-500 text-white'
            : 'bg-yellow-400 text-black'}"
        >
          {$winner.winner === Cell.RED ? 'Red' : 'Yellow'} wins!
        </p>
      {:else}
        <p class="self-center text-lg font-semibold text-gray-900 dark:text-gray-100">
          It's a tie!
        </p>
      {/if}
      <div class="mt-6 flex justify-center gap-4">
        <button
          class="rounded-md bg-blue-600 px-3 py-1.5 font-medium uppercase text-white shadow hover:brightness-110"
          on:click={() => {
            game.newGame()
            open = false
          }}
        >
          New Game
        </button>
        <button
          class="rounded-md bg-blue-300 px-3 py-1.5 font-medium uppercase text-black shadow hover:brightness-110"
          on:click={() => {
            open = false
          }}
        >
          View Board
        </button>
      </div>
    </div>
  </div>
{/if}
