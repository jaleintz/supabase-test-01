import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data', 'urls.json');

export async function GET() {
  try {
    const fileContent = await fs.readFile(dataFilePath, 'utf-8');
    const urls = JSON.parse(fileContent);
    return NextResponse.json(urls);
  } catch (error) {
    console.error('Error reading URLs:', error);
    return NextResponse.json({ error: 'Failed to read URLs' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Read existing URLs
    const fileContent = await fs.readFile(dataFilePath, 'utf-8');
    const urls = JSON.parse(fileContent);

    // Add new URL with timestamp
    const newEntry = {
      url,
      addedAt: new Date().toISOString(),
    };

    urls.push(newEntry);

    // Write back to file
    await fs.writeFile(dataFilePath, JSON.stringify(urls, null, 2), 'utf-8');

    return NextResponse.json({ success: true, data: newEntry });
  } catch (error) {
    console.error('Error adding URL:', error);
    return NextResponse.json({ error: 'Failed to add URL' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Read existing URLs
    const fileContent = await fs.readFile(dataFilePath, 'utf-8');
    const urls = JSON.parse(fileContent);

    // Filter out the URL to delete
    const updatedUrls = urls.filter((entry: { url: string }) => entry.url !== url);

    // Write back to file
    await fs.writeFile(dataFilePath, JSON.stringify(updatedUrls, null, 2), 'utf-8');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting URL:', error);
    return NextResponse.json({ error: 'Failed to delete URL' }, { status: 500 });
  }
}
