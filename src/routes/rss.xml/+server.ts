import { Feed } from "feed";
import { getPosts } from "$lib/server/posts";
import { loadConfiguration } from "$lib/server/configuration";

export const prerender = false;

export async function GET() {
    const configuration = loadConfiguration();
    const posts = await getPosts();

    // Ensure siteUrl is a valid URI (Atom requires absolute URIs with http/https)
    let siteUrl = configuration.url;
    
    // Remove trailing slash if present to make link building easier
    if (siteUrl.endsWith("/")) {
        siteUrl = siteUrl.slice(0, -1);
    }
    
    // Ensure protocol exists (browsers/readers reject "localhost" without http://)
    if (!siteUrl.startsWith("http")) {
        siteUrl = `http://${siteUrl}`;
    }

    const feed = new Feed({
        title: configuration.title,
        description: configuration.description,
        id: siteUrl + "/", // Atom IDs should be unique IRIs
        link: siteUrl + "/",
        language: configuration.language,
        image: `${siteUrl}/favicon.png`,
        favicon: `${siteUrl}/favicon.png`,
        copyright: `© ${new Date().getFullYear()}, ${configuration.author.name}`,
        updated: posts.length > 0 ? posts[0].date : new Date(),
        generator: "SvelteKit + Feed",
        author: {
            name: configuration.author.name,
            email: configuration.author.email,
            link: siteUrl
        }
    });

    posts.forEach((post) => {
        // Construct the post URL
        const slug = encodeURIComponent(post.slug);
        const postLink = `${siteUrl}/?postname=${slug}`;

        feed.addItem({
            title: post.title || "Untitled",
            id: postLink,
            link: postLink,
            description: post.content.length > 200 ? post.content.substring(0, 200) + "..." : post.content,
            content: post.content,
            author: [
                {
                    name: configuration.author.name,
                    email: configuration.author.email,
                    link: siteUrl
                }
            ],
            date: post.date,
            image: post.images[0]?.src ? (post.images[0].src.startsWith("http")? post.images[0].src : `${siteUrl}/${post.images[0].src}`) : undefined
        });
    });

    // Output using .atom1()
    return new Response(feed.atom1(), {
        headers: {
            // content-type is specific for Atom
            "Content-Type": "application/atom+xml; charset=utf-8", 
            "Cache-Control": "max-age=0, s-maxage=3600"
        }
    });
}