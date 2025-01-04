<script module>
    export type BlogPostData = {
        title: string | undefined;
        content: string;
        images: HTMLImgAttributes[];
        date: Date;
    };
</script>

<script lang="ts">
    import BlogPost from "$lib/BlogPost.svelte";
    import type { HTMLImgAttributes } from "svelte/elements";
    import { onMount } from "svelte";
    import type { APILoadResponse } from "./api/load/+server";

    // Load blog posts
    let data: APILoadResponse = $state({
        title: "",
        posts: [],
    });
    onMount(async () => {
        data = await fetch("/api/load").then(async function (
            response: Response,
        ): Promise<any> {
            let result: any = await response.json();
            if (!result || !result.posts) {
                return Promise.reject(result);
            }
            // Turn string dates into Date objects
            for (let i = 0; i < result.posts.length; i++) {
                result.posts[i].date = new Date(result.posts[i].date);
            }
            return Promise.resolve(result);
        });
    });
</script>

<svelte:head>
    <title>{data.title}</title>
</svelte:head>

<div class="container">
    <div class="section">
        <h1 class="title">{data.title}</h1>
    </div>
    {#each data.posts as post}
        <BlogPost {post} />
    {/each}
</div>

<style lang="css">
    :global(html) {
        background-color: var(--bulma-background);
    }
</style>
