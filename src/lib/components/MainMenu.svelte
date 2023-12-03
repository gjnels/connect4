<script lang="ts">
  import { game } from '$lib'

  let player1Ai = game.player1.ai
  let player1Difficulty = game.player1.difficulty
  let player2Ai = game.player2.ai
  let player2Difficulty = game.player2.difficulty
  let { guessing } = game

  $: guessingError = $guessing && !player1Ai && !player2Ai

  function startGame() {
    if (guessingError) return

    game.player1.setAi(player1Ai)
    game.player1.setDifficulty(player1Difficulty)
    game.player2.setAi(player2Ai)
    game.player2.setDifficulty(player2Difficulty)
    game.new()
  }
</script>

<div
  class="mx-auto flex flex-col items-center gap-x-8 gap-y-4 rounded-md bg-white px-8 py-4 shadow dark:bg-gray-800"
>
  <h2 class="text-xl font-medium">Main Menu</h2>
  <label class="flex items-center gap-1.5">
    <input type="checkbox" bind:checked={$guessing} class="accent-blue-600" />
    <span>Guess AI moves</span>
  </label>
  <div class="flex justify-center gap-8">
    <div class="flex flex-col items-center gap-2">
      <div class="flex items-center gap-2">
        <h3 class="text-lg">Player 1</h3>
        <span
          class="rounded-full px-3 py-1 font-medium {game.player1.color === 'red'
            ? 'bg-red-500 text-white'
            : 'bg-yellow-400 text-black'}"
          >{game.player1.color[0].toUpperCase() + game.player1.color.slice(1).toLowerCase()}</span
        >
      </div>
      <label class="flex items-center gap-1.5">
        <input type="checkbox" class="accent-blue-600" bind:checked={player1Ai} />
        <span>AI</span>
      </label>
      {#if player1Ai}
        <label class="flex flex-col">
          <span>Difficulty</span>
          <select
            bind:value={player1Difficulty}
            class="rounded-md bg-gray-100 px-2 py-1 dark:bg-gray-900"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </label>
      {/if}
    </div>
    <div class="flex flex-col items-center gap-2">
      <div class="flex items-center gap-2">
        <h3 class="text-lg">Player 2</h3>
        <span
          class="rounded-full px-3 py-1 font-medium {game.player2.color === 'red'
            ? 'bg-red-500 text-white'
            : 'bg-yellow-400 text-black'}"
          >{game.player2.color[0].toUpperCase() + game.player2.color.slice(1).toLowerCase()}</span
        >
      </div>
      <label class="flex items-center gap-1.5">
        <input type="checkbox" class="accent-blue-600" bind:checked={player2Ai} />
        <span>AI</span>
      </label>
      {#if player2Ai}
        <label class="flex flex-col">
          <span>Difficulty</span>
          <select
            bind:value={player2Difficulty}
            class="rounded-md bg-gray-100 px-2 py-1 dark:bg-gray-900"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </label>
      {/if}
    </div>
  </div>

  {#if guessingError}
    <span class="text-red-500">At least one player must be an AI to guess their moves</span>
  {/if}

  <button
    class="rounded-md bg-blue-600 px-3 py-1.5 font-medium uppercase text-white shadow disabled:cursor-not-allowed [&:not(:disabled)]:hover:brightness-110"
    on:click={startGame}
    disabled={guessingError}>Play</button
  >
</div>
