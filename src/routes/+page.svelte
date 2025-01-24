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
        stylesheets: [],
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
    {#each data.stylesheets as stylesheet}
        <link rel="stylesheet" type="text/css" href={stylesheet} />
    {/each}
</svelte:head>

<h1 class="page-title">{data.title}</h1>
<div class="posts">
    {#each data.posts as post}
        <BlogPost {post} />
    {/each}
</div>
