// src/lib/server/posts.ts
import fs from "fs";
import { marked } from "marked";
import yaml from "yaml";
import type { HTMLImgAttributes } from "svelte/elements";

const POSTS_PATH = "content/posts/";
const MEDIA_PATH = "api/media/";

export enum BlogPostStatus {
    Draft = "draft",
    Published = "published",
    Archived = "archived",
}

export type BlogPostData = {
    slug: string; // The filename, needed for linking
    title: string | undefined;
    content: string;
    images: HTMLImgAttributes[];
    date: Date;
    status: BlogPostStatus;
};

function isURLAbsolute(url: string): boolean {
    try {
        new URL(url);
        return true;
    } catch (_) {
        return false;
    }
}

export async function getPosts(postnameFilter?: string): Promise<BlogPostData[]> {
    let files: string[] = [];

    // Determine which files to read
    if (postnameFilter) {
        // Sanitise: Prevent directory traversal
        const safeName = postnameFilter.replace(/^.*[\\\/]/, "");
        // Check if file exists before trying to read it
        if (fs.existsSync(POSTS_PATH + safeName)) {
            files = [safeName];
        }
    } else {
        // Read directory and filter out any file starting with '.'
        files = (fs.readdirSync(POSTS_PATH) || []).filter(file => !file.startsWith('.'));
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
        const fileContent: string = fs.readFileSync(POSTS_PATH + fileName, "utf-8");

        // Handle files with and without frontmatter
        const fileParts = fileContent.split("---");
        let frontmatter = "";
        let rawContent = fileContent;
        
        if (fileParts.length >= 3) {
            frontmatter = fileParts[1];
            rawContent = fileParts[2];
        }
        
        const metadata = yaml.parse(frontmatter) || {};
        const parsedContent = await marked.parse(rawContent);

        // Handle images
        let images: HTMLImgAttributes[] = metadata.images || [];
        images = images.map((image: any) => {
            // In case an image is not of type HTMLImgAttributes, fix it
            if (typeof image === "string") {
                image = { src: image };
            }
            if (!image.src) {
                return image;
            }
            
            // If an image's URL is not absolute, prepend the MEDIA_PATH
            if (!isURLAbsolute(image.src)) {
                image.src = MEDIA_PATH + image.src;
            }
            return image;
        });

        // Handle date
        // Priority: Frontmatter date > file modification time > current time
        let dateVal = metadata.datetime || fs.statSync(POSTS_PATH + fileName).mtime;
        const date = new Date(dateVal);

        // Handle status:
        // If the metadata are not configured, default to published.
        // Otherwise, if the metadata contain a status, use it.
        // Otherwise, default to draft.
        let status: BlogPostStatus = BlogPostStatus.Published;
        if (Object.keys(metadata).length === 0) {
            status = BlogPostStatus.Published;
        } else {
            status = metadata.status || BlogPostStatus.Draft;
        }

        return {
            slug: fileName,
            title: metadata.title,
            content: parsedContent,
            images: images,
            date: date,
            status: status,
        };
    }));

    // Only keep published posts
    const publishedPosts = posts.filter(post => post.status === BlogPostStatus.Published);

    // Sort the posts by date in descending order
    return publishedPosts.sort((a, b) => b.date.getTime() - a.date.getTime());
}
