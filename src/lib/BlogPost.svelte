<script lang="ts">
    import { Carousel } from "flowbite-svelte";
    import type { BlogPostData } from "../routes/+page.svelte";

    export let post: BlogPostData;
</script>

<div class="blog-post">
    {#if post.images.length > 0}
        {#if post.images.length == 1}
            <Carousel
                images={post.images}
                imgClass="object-contain h-full w-full"
                class="carousel"
            >
                <a
                    slot="slide"
                    href={post.images[index]?.src}
                    target="_blank"
                    let:Slide
                    let:index
                    class="slide-link"
                >
                    <Slide class="slide-media" image={post.images[index]} />
                </a>
            </Carousel>
        {/if}
        {#if post.images.length > 1}
            <Carousel
                images={post.images}
                let:Controls
                let:Indicators
                imgClass="object-contain h-full w-full"
                class="carousel"
            >
                <a
                    slot="slide"
                    href={post.images[index]?.src}
                    target="_blank"
                    let:Slide
                    let:index
                    class="slide-link"
                >
                    <Slide class="slide-media" image={post.images[index]} />
                </a>
                <Controls />
                <Indicators />
            </Carousel>
        {/if}
    {/if}
    <div class="post-nonmedia">
        {#if post.title || post.date}
            <div class="post-metadata">
                {#if post.title}
                    <div class="post-title">
                        <p class="title is-4">{post.title}</p>
                    </div>
                {/if}
                {#if post.date}
                    <div class="post-datetime">
                        <time datetime={post.date.toISOString()}>
                            {post.date.toLocaleString()}
                        </time>
                    </div>
                {/if}
            </div>
        {/if}

        <div class="post-content">
            {@html post.content}
        </div>
    </div>
</div>

<style>
    :global(.carousel) {
        height: 50vw;
        max-height: 55vh;
        border-radius: 0;
    }
</style>
