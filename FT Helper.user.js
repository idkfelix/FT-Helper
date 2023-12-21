// ==UserScript==
// @name        FT Helper
// @description
// @namespace   http://tampermonkey.net/
// @version     2023-12-21
// @author      Felix
// @match       https://fasttimes.com.au/*
// @icon        https://www.google.com/s2/favicons?sz=64&domain=fasttimes.com.au
// @grant       none
// ==/UserScript==

(function() {
 'use strict';

 const regex = /"sku":"POS-(\d{6})"/g;

 const scripts = document.scripts;

function updatePriceSpan() {
   for (let script of scripts) {
       if (script.innerHTML.includes('"sku":"POS-')) {
           const matches = script.innerHTML.match(regex);

           if (!matches) continue;

           const match = matches[0];
           const sku = match.slice(11, 17);

           const paragraph = document.querySelector('.price');

           if (!paragraph.innerHTML.includes(sku)) {
               let copyButton = document.createElement('button');
               copyButton.type = 'button';
               copyButton.className = 'copy-button';
               copyButton.textContent = 'Copy';
               copyButton.addEventListener('click', function() {
                  navigator.clipboard.writeText(sku).then(function() {
                      console.log('SKU copied to clipboard');
                  }).catch(function(error) {
                      console.error('Could not copy SKU: ', error);
                  });
               });

               paragraph.innerHTML += `<br><br>SKU: ${sku}&nbsp;`;
               paragraph.appendChild(copyButton);

               let spacer = document.createElement('span');
               spacer.innerHTML = "&nbsp;"
               paragraph.appendChild(spacer);

               let searchBtn = document.createElement('button');
               searchBtn.innerHTML = '<a href="https://fasttimes.retailexpress.com.au/DOTNET/Admin/Reports/ReportStockSalesMatrixByColour.aspx#">Search</a>';
               paragraph.appendChild(searchBtn);
           }
       }
   }
}

 setInterval(updatePriceSpan, 1000);
})();
