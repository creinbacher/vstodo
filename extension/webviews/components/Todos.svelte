<script lang="ts">
    import { onMount } from "svelte";
    import type { User } from "../types";

    export let user: User;

    let text = "";
    let todos: Array<{ text: string; completed: boolean }> = [];

    onMount(() => {
        window.addEventListener("message", async (event) => {
            const message = event.data; // The json data that the extension sent
            console.log({ message });
            switch (message.type) {
                case "addTodo":
                    todos = [
                        { text: message.value, completed: false },
                        ...todos,
                    ];
            }
        });
    });
</script>

<style>
    .complete {
        text-decoration: line-through;
    }
</style>

<div>Hello {user.name}</div>

<form
    on:submit|preventDefault={() => {
        todos = [{ text, completed: false }, ...todos];
        text = '';
    }}>
    <input bind:value={text} />
</form>

<ul>
    {#each todos as todo (todo.text)}
        <li
            class:complete={todo.completed}
            on:click={() => {
                todo.completed = !todo.completed;
            }}>
            {todo.text}
        </li>
    {/each}
</ul>
