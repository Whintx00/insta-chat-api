
import { IgApiClient } from './client';
import * as fs from 'fs';
import * as path from 'path';
import debug from 'debug';

const logger = debug('ig:cookie-loader');

export interface CookieFormat {
  name?: string;
  key?: string;
  value: string;
  domain?: string;
  path?: string;
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: string;
  expirationDate?: number;
}

export class CookieLoader {
  constructor(private client: IgApiClient, private cookieFile: string) {}

  async loadFromFile(): Promise<boolean> {
    try {
      const filePath = path.resolve(this.cookieFile);
      
      if (!fs.existsSync(filePath)) {
        logger(`Cookie file not found: ${filePath}`);
        return false;
      }

      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const ext = path.extname(filePath).toLowerCase();

      let cookies: CookieFormat[];

      if (ext === '.json') {
        cookies = JSON.parse(fileContent);
      } else if (ext === '.txt') {
        // Parse Netscape cookie format
        cookies = this.parseNetscapeCookies(fileContent);
      } else {
        logger(`Unsupported file format: ${ext}`);
        return false;
      }

      return await this.importCookies(cookies);
    } catch (error) {
      logger(`Failed to load cookies from ${this.cookieFile}:`, error.message);
      return false;
    }
  }

  private parseNetscapeCookies(content: string): CookieFormat[] {
    const cookies: CookieFormat[] = [];
    const lines = content.split('\n');

    for (const line of lines) {
      if (line.trim().startsWith('#') || !line.trim()) continue;

      const parts = line.split('\t');
      if (parts.length >= 7) {
        cookies.push({
          name: parts[5],
          value: parts[6],
          domain: parts[0],
          path: parts[2],
          secure: parts[3] === 'TRUE',
          httpOnly: false,
          expirationDate: parseInt(parts[4], 10),
        });
      }
    }

    return cookies;
  }

  private async importCookies(cookies: CookieFormat[]): Promise<boolean> {
    const jar = this.client.state.cookieJar;
    const baseUrl = 'https://www.instagram.com/';
    let loadedCount = 0;

    for (const c of cookies) {
      const name = c.name || c.key;
      const value = c.value;

      if (!name || !value) continue;

      const cookieStr = `${name}=${value}; Domain=${c.domain || '.instagram.com'}; Path=${c.path || '/'}${c.secure ? '; Secure' : ''}${c.httpOnly ? '; HttpOnly' : ''}`;

      try {
        await jar.setCookie(cookieStr, baseUrl);
        loadedCount++;
      } catch (cookieError) {
        logger(`Failed to set cookie ${name}:`, cookieError.message);
      }
    }

    logger(`Loaded ${loadedCount} cookies from ${this.cookieFile}`);
    return loadedCount > 0;
  }
}
