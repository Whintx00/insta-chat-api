
import { IgApiClient, CookieLoader } from '../src';
import * as dotenv from 'dotenv';

dotenv.config();

(async () => {
  const ig = new IgApiClient();
  
  // Generate device
  ig.state.generateDevice(process.env.IG_USERNAME);

  // Method 1: Load from JSON file (Cookie-Editor extension format)
  console.log('Loading cookies from JSON file...');
  const cookieLoader = new CookieLoader(ig, './account.json');
  const success = await cookieLoader.loadFromFile();

  if (success) {
    console.log('Cookies loaded successfully!');
    
    // Verify by getting current user
    try {
      const user = await ig.account.currentUser();
      console.log(`Logged in as: ${user.username}`);
    } catch (err) {
      console.error('Cookie authentication failed:', err.message);
    }
  } else {
    console.log('Failed to load cookies, trying traditional login...');
    await ig.account.login(process.env.IG_USERNAME, process.env.IG_PASSWORD);
  }

  // Method 2: Load from Netscape format (.txt)
  // const cookieLoaderTxt = new CookieLoader(ig, './account.txt');
  // await cookieLoaderTxt.loadFromFile();
})();
