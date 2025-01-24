import fs from "fs";

const STYLE_PATH = "./content/style/";

export async function GET({ params }: { params: { [key: string]: string } }) {
    try {
        if (!params["filename"]) {
            return new Response("No file specified", { status: 400 });
        }
        if (params["filename"] == ".gitkeep") {
            return new Response("File not found", { status: 404 });
        }
        if (!fs.existsSync(STYLE_PATH + params["filename"])) {
            return new Response("File not found", { status: 404 });
        }
        const file = fs.readFileSync(STYLE_PATH + params["filename"]);
        return new Response(file, {
            headers: {
                "Content-Type": "text/css",
            },
        });
    } catch (e) {
        return new Response("Internal server error", { status: 500 });
    }
}