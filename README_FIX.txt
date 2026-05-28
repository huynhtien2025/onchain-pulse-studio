Copy src/core/normalize.js into your project at:
C:\Users\Asus\Desktop\onchain-pulse-studio\src\core\normalize.js

Then run:
npm run build
git add .
git commit -m "Fix SoDEX ticker parsing"
git push origin main

This fixes SoDEX fields like lastPx, changePct, quoteVolume so price/change/volume no longer show null.
