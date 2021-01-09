<script lang="ts">
    import { onMount } from "svelte";
    import type { User } from "../types";
    import Todos from "./Todos.svelte";

    let accessToken = "";

    let loading = true;
    let user: User | null = null;
    let page: "todos" | "contact" = tsvscode.getState()?.page || "todos";

    $: {
        tsvscode.setState({ page });
    }

    onMount(() => {
        window.addEventListener("message", async (event) => {
            const message = event.data; // The json data that the extension sent
            console.log({ message });
            switch (message.type) {
                case "token":
                    accessToken = message.value;
                    const response = await fetch(`${apiBaseUrl}/me`, {
                        headers: {
                            authorization: `Bearer ${accessToken}`,
                        },
                    });
                    const data = await response.json();
                    user = data.user;
                    loading = false;
            }
        });

        tsvscode.postMessage({ type: "get-token", value: undefined });
    });
</script>

{#if loading}
    <div>loading ...</div>
{:else if user}
    {#if page === 'todos'}
        <Todos {user} {accessToken} />
        <button
            on:click={() => {
                page = 'contact';
            }}>go to contact</button>
    {:else}
        <div>Contact me here:</div>
        <button
            on:click={() => {
                page = 'todos';
            }}>go back</button>
    {/if}

    <button
        on:click={() => {
            accessToken = '';
            user = null;
            tsvscode.postMessage({ type: 'logout', value: undefined });
        }}>Logout</button>
{:else}
    <div>no user is logged in</div>
    <button
        on:click={() => {
            tsvscode.postMessage({ type: 'authenticate', value: undefined });
        }}>Login with GitHub</button>
{/if}
