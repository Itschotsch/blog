import { loadConfiguration, type BlogConfiguration } from "$lib/server/configuration";
import { getPosts, type BlogPostData } from "$lib/server/posts";

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
    const configuration: BlogConfiguration = loadConfiguration();
    const postname = url.searchParams.get("postname");

    // Use shared logic
    const posts = await getPosts(postname || undefined);

    const response: APILoadResponse = {
        title: configuration.title,
        stylesheets: (configuration.stylesheets || []).map((stylesheet: string): string => {
            if (!isURLAbsolute(stylesheet)) {
                return STYLE_PATH + stylesheet;
            }
            return stylesheet;
        }),
        posts: posts,
    };

    return new Response(JSON.stringify(response));
}