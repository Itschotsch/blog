import fs from 'fs/promises';

function getMIMEType(filePath: string): string {
    const ext = filePath.split('.').pop();
    switch (ext) {
        case 'jpg':
        case 'jpeg':
            return 'image/jpeg';
        case 'png':
            return 'image/png';
        case 'gif':
            return 'image/gif';
        case 'svg':
            return 'image/svg+xml';
        default:
            return 'application/octet-stream';
    }
}

export async function GET({ params }: { params: string[] }): Promise<Response> {
    const filePath = `./content/media/${params[0]}`;
    const file = await fs.readFile(filePath);
    if (!file) {
        return new Response('File not found', { status: 404 });
    }

    return new Response(file, {
        headers: {
            'Content-Type': getMIMEType(filePath),
        },
    });
}