import fs from 'fs';

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

// params is dictionary
export async function GET({ params }: { params: { [key: string]: string } }) {
    try {
        if (!params['src']) {
            return new Response('No file specified', { status: 400 });
        }
        if (!fs.existsSync(`./content/media/${params['src']}`)) {
            return new Response('File not found', { status: 404 });
        }
        const file = fs.readFileSync(`./content/media/${params['src']}`);
        return new Response(file, {
            headers: {
                'Content-Type': getMIMEType(params['src']),
            },
        });
    } catch (e) {
        return new Response('Internal server error', { status: 500 });
    }
}