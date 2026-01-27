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
    import { goto } from "$app/navigation";
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
        const searchParams = new URLSearchParams(window.location.search);
        const postname = searchParams.get("postname");

        let fetchUrl = "/api/load";
        if (postname) {
            fetchUrl += `?postname=${encodeURIComponent(postname)}`;
        }

        try {
            const response = await fetch(fetchUrl);
            let result: any = await response.json();

            // Check if the specific post result is empty
            if (
                postname &&
                (!result || !result.posts || result.posts.length === 0)
            ) {
                // Update the URL bar to root (without reloading the page)
                await goto("/", { replaceState: true });

                // Manually fetch the list since onMount won't run again
                const fallbackResponse = await fetch("/api/load");
                result = await fallbackResponse.json();
            }

            // Process dates
            if (result && result.posts) {
                for (let i = 0; i < result.posts.length; i++) {
                    result.posts[i].date = new Date(result.posts[i].date);
                }
                // Update state
                data = result;
            }
        } catch (error) {
            console.error("Failed to load posts:", error);
            // Fallback logic for errors
            if (postname) {
                await goto("/", { replaceState: true });
                // NOTE: We may want to fetch the list again here just like above
            }
        }
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
