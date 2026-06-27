import fs from 'fs';
import { PNG } from 'pngjs';

fs.createReadStream('public/images/hero-grass-foreground.png')
  .pipe(new PNG())
  .on('parsed', function() {
    console.log(`Width: ${this.width}, Height: ${this.height}`);
    // Check alpha of bottom-left pixel
    const idx = (this.height - 1) * this.width * 4;
    console.log(`Bottom-left pixel: R:${this.data[idx]}, G:${this.data[idx+1]}, B:${this.data[idx+2]}, A:${this.data[idx+3]}`);
  });
