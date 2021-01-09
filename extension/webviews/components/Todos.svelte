<script lang="ts">
    import { onMount } from "svelte";
    import type { User } from "../types";

    export let user: User;
    export let accessToken: string;

    let text = "";
    let todos: Array<{ text: string; completed: boolean; id: number }> = [];

    async function addTodo(t: string) {
        const response = await fetch(`${apiBaseUrl}/todo`, {
            method: "POST",
            headers: {
                "content-type": "application/json",
                authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                text: t,
            }),
        });

        const { todo } = await response.json();
        todos = [todo, ...todos];
    }

    onMount(async () => {
        window.addEventListener("message", async (event) => {
            const message = event.data; // The json data that the extension sent
            console.log({ message });
            switch (message.type) {
                case "addTodo":
                    addTodo(message.value);
            }
        });

        const response = await fetch(`${apiBaseUrl}/todo`, {
            headers: {
                "content-type": "application/json",
                authorization: `Bearer ${accessToken}`,
            },
        });

        const payload = await response.json();
        todos = payload.todos;
    });
</script>

<style>
    .complete {
        text-decoration: line-through;
    }
</style>

<div>Hello {user.name}</div>

<form
    on:submit|preventDefault={async () => {
        addTodo(text);
        text = '';

        //todos = [{ text, completed: false }, ...todos];
    }}>
    <input bind:value={text} />
</form>

<ul>
    {#each todos as todo (todo.id)}
        <li
            class:complete={todo.completed}
            on:click={async () => {
                todo.completed = !todo.completed;
                const response = await fetch(`${apiBaseUrl}/todo`, {
                    method: 'PUT',
                    headers: {
                        'content-type': 'application/json',
                        authorization: `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify({
                        id: todo.id,
                    }),
                });

                console.log(await response.json());
            }}>
            {todo.text}
        </li>
    {/each}
</ul>
