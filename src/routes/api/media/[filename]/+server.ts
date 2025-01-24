import fs from "fs";

function getMIMEType(filePath: string): string {
    const ext = filePath.split(".").pop();
    switch (ext) {
        // Images
        case "jpg":
        case "jpeg":
            return "image/jpeg";
        case "png":
            return "image/png";
        case "gif":
            return "image/gif";
        case "svg":
            return "image/svg+xml";
        // Audio
        case "mp3":
            return "audio/mpeg";
        case "wav":
            return "audio/wav";
        case "ogg":
            return "audio/ogg";
        // Video
        case "mp4":
            return "video/mp4";
        case "webm":
            return "video/webm";
        // Font
        case "ttf":
            return "font/ttf";
        case "woff":
            return "font/woff";
        case "woff2":
            return "font/woff2";
        default:
            return "application/octet-stream";
    }
}

// params is dictionary
export async function GET({ params }: { params: { [key: string]: string } }) {
    try {
        if (!params["filename"]) {
            return new Response("No file specified", { status: 400 });
        }
        if (params["filename"] == ".gitkeep") {
            return new Response("File not found", { status: 404 });
        }
        if (!fs.existsSync(`./content/media/${params["filename"]}`)) {
            return new Response("File not found", { status: 404 });
        }
        const file = fs.readFileSync(`./content/media/${params["filename"]}`);
        return new Response(file, {
            headers: {
                "Content-Type": getMIMEType(params["filename"]),
            },
        });
    } catch (e) {
        return new Response("Internal server error", { status: 500 });
    }
}