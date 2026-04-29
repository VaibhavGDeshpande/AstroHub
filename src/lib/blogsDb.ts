import fs from 'fs';
import path from 'path';

export interface Blog {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

const dataFilePath = path.join(process.cwd(), 'data', 'blogs.json');

// Ensure the data directory and file exist
export function initDb() {
  const dir = path.dirname(dataFilePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(dataFilePath)) {
    fs.writeFileSync(dataFilePath, JSON.stringify([]), 'utf-8');
  }
}

export function getBlogs(): Blog[] {
  initDb();
  const fileContent = fs.readFileSync(dataFilePath, 'utf-8');
  try {
    return JSON.parse(fileContent) as Blog[];
  } catch (error) {
    console.error('Failed to parse blogs.json:', error);
    return [];
  }
}

export function saveBlogs(blogs: Blog[]) {
  initDb();
  fs.writeFileSync(dataFilePath, JSON.stringify(blogs, null, 2), 'utf-8');
}
