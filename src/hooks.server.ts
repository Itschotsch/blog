import { loadConfiguration, type BlogConfiguration } from "$lib/server/configuration";

export function handle({ event, resolve }) {
    const configuration: BlogConfiguration = loadConfiguration();
    return resolve(event, {
        transformPageChunk: ({ html }) => html.replace('%lang%', configuration.language)
    });
}