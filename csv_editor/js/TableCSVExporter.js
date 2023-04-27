export default class {

    constructor (table, includeHeaders = true) {
        this.table = table;
        // every row is represented with <tr> and then cells inside of it
        this.rows = Array.from(table.querySelectorAll("tr"));

        if(!includeHeaders && this.rows[0].querySelectorAll("th").length) {
            // this will remove the first row
            this.rows.shift();
        }
  
    }

  
    convertToCSV () {
        const lines = [];
        const numCols = this._findLongestRowLength();

        for(const row of this.rows) {
            let line = "";

            for(let i = 0; i < numCols; i++) {
                if (row.children[i] !== undefined) {
                    line += this.parseCell(row.children[i]);
                }

                // if we're NOT in last column of the loop
                line += (i !== (numCols - 1)) ? "," : "";
            }
            
            // add lines to lines array
            lines.push(line);

        }

        return lines.join("\n");
        
    }
  
    /* naming convention in js that signifies a private methods since there's no private methods */
    _findLongestRowLength () {
        // for each row, check current element count and see if it's bigger than current longest length replace it. Default value is 0
        return this.rows.reduce((longestl, row) => row.childElementCount > longestl ? row.childElementCount : longestl, 0);
    }
  
    parseCell (tableCell) {
        let parsedValue = tableCell.textContent;
  
        // Replace all double quotes with two double quotes
        parsedValue = parsedValue.replace(/"/g, `""`);
  
        // If value contains comma, new-line or double-quote, enclose in double quotes
        parsedValue = /[",\n]/.test(parsedValue) ? `"${parsedValue}"` : parsedValue;
  
        return parsedValue;
    }
  }