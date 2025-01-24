import fs from "fs";
import yaml from "yaml";

const DEFAULT_BLOG_TITLE = "Blog";
const DEFAULT_STYLESHEETS = ["default.css"];

export type BlogConfiguration = {
    title: string;
    stylesheets: string[];
}

export function loadConfiguration(): BlogConfiguration {
    // Load blog configuration from content/configuration.yaml
    let configuration: BlogConfiguration = yaml.parse(fs.readFileSync("content/configuration.yaml", "utf-8"));
    if (!configuration) {
        configuration = {
            title: DEFAULT_BLOG_TITLE,
            stylesheets: DEFAULT_STYLESHEETS,
        };
    }
    if (!configuration.title) {
        configuration.title = DEFAULT_BLOG_TITLE;
    }
    if (!configuration.stylesheets) {
        configuration.stylesheets = DEFAULT_STYLESHEETS;
    }
    return configuration;
}