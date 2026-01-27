import fs from "fs";
import yaml from "yaml";

const DEFAULT_URL = "localhost";
const DEFAULT_BLOG_TITLE = "Blog";
const DEFAULT_AUTHOR = {
    name: "Anonymous",
    email: "anonymous@myblog.ch",
};
const DEFAULT_DESCRIPTION = "A blog.";
const DEFAULT_BLOG_LANGUAGE = "en";
const DEFAULT_STYLESHEETS = ["default.css"];

export type BlogConfiguration = {
    url: string;
    title: string;
    author: {
        name: string;
        email: string;
    }
    description: string;
    language: string;
    stylesheets: string[];
}

export function loadConfiguration(): BlogConfiguration {
    // Load blog configuration from content/configuration.yaml
    let configuration: BlogConfiguration = yaml.parse(fs.readFileSync("content/configuration.yaml", "utf-8"));
    if (!configuration) {
        configuration = {
            url: DEFAULT_URL,
            title: DEFAULT_BLOG_TITLE,
            author: DEFAULT_AUTHOR,
            description: DEFAULT_DESCRIPTION,
            language: DEFAULT_BLOG_LANGUAGE,
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