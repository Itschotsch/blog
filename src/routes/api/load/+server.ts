import fs from "fs";
import { marked } from "marked";
import yaml from "yaml";
import type { BlogPostData } from "../../+page.svelte";
import type { HTMLImgAttributes } from "svelte/elements";
import { loadConfiguration, type BlogConfiguration } from "$lib/server/configuration";

const POSTS_PATH = "content/posts/";
const MEDIA_PATH = "api/media/";
const STYLE_PATH = "api/style/";

function isURLAbsolute(url: string): boolean {
    try {
        new URL(url);
        return true;
    } catch (_) {
        return false;
    }
}

export type APILoadResponse = {
    title: string;
    stylesheets: string[];
    posts: BlogPostData[];
};

export async function GET({ url }: { url: URL }) {
    let configuration: BlogConfiguration = loadConfiguration();

    const postname = url.searchParams.get("postname");

    let files: string[] = [];

    if (postname) {
        // Prevent directory traversal
        const safePostname = postname.replace(/^.*[\\\/]/, '');

        // Check if file exists before trying to read it
        if (fs.existsSync(POSTS_PATH + safePostname)) {
            files = [safePostname];
        } else {
            files = [];
        }
    } else {
        files = fs.readdirSync(POSTS_PATH) || [];
        if (files.includes(".gitkeep")) {
            files.splice(files.indexOf(".gitkeep"), 1);
        }
    }

    // Example file:
    // ---
    // title: Hello, World!
    // datetime: 2025-01-01 00:00
    // images:
    //   - src: https://picsum.photos/1500/1000
    //     alt: Example image
    //     title: Example image
    // ---
    //
    // *Hello*, **World**!
    //

    // Parse each file's frontmatter (YAML)
    const posts = await Promise.all(files.map(async (fileName: string): Promise<BlogPostData> => {
        const file: string = fs.readFileSync(POSTS_PATH + fileName, "utf-8");

        // Handle files with no frontmatter
        let frontmatter: string;
        let rawContent: string;
        const fileParts = file.split("---");
        if (fileParts.length < 3) {
            frontmatter = "";
            rawContent = file;
        } else {
            frontmatter = fileParts[1];
            rawContent = fileParts[2];
        }
        const metadata = yaml.parse(frontmatter);

        let title: string | undefined = metadata.title;
        let parsedContent: string = await marked.parse(rawContent);
        let images: HTMLImgAttributes[] = metadata.images || [];
        let date: Date = new Date(metadata.datetime || fs.statSync(POSTS_PATH + fileName).mtime);

        images = images.map((image: any): HTMLImgAttributes => {
            // In case an image is not of type HTMLImgAttributes, fix it
            if (!image.src) {
                image = {
                    src: image,
                }
            }
            // If an image's URL is not absolute, prepend the MEDIA_PATH
            if (!isURLAbsolute(image.src)) {
                image.src = MEDIA_PATH + image.src;
            }
            return image;
        });

        return {
            title: title,
            content: parsedContent,
            images: images,
            date: date,
        };
    }));

    // Sort the posts by date in descending order
    posts.sort((a: BlogPostData, b: BlogPostData): number => {
        return b.date.getTime() - a.date.getTime();
    });

    const response: APILoadResponse = {
        title: configuration.title,
        stylesheets: (configuration.stylesheets).map((stylesheet: string): string => {
            if (!isURLAbsolute(stylesheet)) {
                return STYLE_PATH + stylesheet;
            }
            return stylesheet;
        }),
        posts: posts,
    };

    return new Response(JSON.stringify(response));
}