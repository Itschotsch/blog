<script lang="ts">
    import { Carousel } from "flowbite-svelte";
    import type { BlogPostData } from "../routes/+page.svelte";

    export let post: BlogPostData;
</script>

<div class="section">
    <div class="card">
        {#if post.images.length > 0}
            {#if post.images.length == 1}
                <Carousel
                    images={post.images}
                    imgClass="object-contain h-full w-full"
                    class="Carousel"
                >
                    <a
                        slot="slide"
                        href={post.images[index]?.src}
                        target="_blank"
                        let:Slide
                        let:index
                    >
                        <Slide image={post.images[index]} />
                    </a>
                </Carousel>
            {/if}
            {#if post.images.length > 1}
                <Carousel
                    images={post.images}
                    let:Controls
                    let:Indicators
                    imgClass="object-contain h-full w-full"
                    class="Carousel"
                >
                    <a
                        slot="slide"
                        href={post.images[index]?.src}
                        target="_blank"
                        let:Slide
                        let:index
                    >
                        <Slide image={post.images[index]} />
                    </a>
                    <Controls />
                    <Indicators />
                </Carousel>
            {/if}
        {/if}
        <div class="card-content">
            {#if post.title || post.date}
                <div class="media">
                    {#if post.title}
                        <div class="media-content">
                            <p class="title is-4">{post.title}</p>
                        </div>
                    {/if}
                    {#if post.date}
                        <div class="media-right">
                            <time datetime={post.date.toISOString()}>
                                {post.date.toLocaleString()}
                            </time>
                        </div>
                    {/if}
                </div>
            {/if}

            <div class="content">
                {@html post.content}
            </div>
        </div>
    </div>
</div>

<style>
    .card {
        overflow: hidden;
        box-shadow: none;
    }

    :global(.Carousel) {
        height: 50vw;
        border-radius: 0;
    }
</style>
