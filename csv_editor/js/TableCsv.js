export default class {
  /**
   * 
   * @param {HTMLTableElement} root The table element which will display csv data
   */
  constructor(root) {
    this.root = root
  }


  /*
  * clear all contents of table including the header
  */
  clear() {
    this.root.innerHTML = "";
  }

  /*
  *
  * notice update keeps headercolumns default as empty array in case csv has no header columns
  */
  update(data, headerColumns = []) {
    this.clear();
    this.setHeader(headerColumns);
    this.setBody(data);
  }


  /**
   * Sets the table header
   * @param {string[]} headerColumns List of headings to be used
   * 
   * afterbegin means we insert this html after the <table> since in main we defined TableCsv to be table. This is actually child of table
   *  each text being mapped is an individual header, and th is a table header element
   */
  setHeader(headerColumns) {
    this.root.insertAdjacentHTML("afterbegin", `
      <thead>
        <tr>
          ${ headerColumns.map(text => `<th>${text}</th>`).join("") }
        </tr>
      </thead>
    `);
  }

  /**
   * 
   * @param {string[][]} data a 2D array of data to be used as table body
   * 
   * row is row, text is individual cell
   * join("") array on empty string ""
   * 
   * <tr> is table row and then a <td> for each cell
   */
  setBody(data) {
    const rowsHtml = data.map((row) => {
      return `
                <tr>
                    ${row.map((text) => `<td>${text}</td>`).join("")}
                </tr>
            `;
    });


    this.root.insertAdjacentHTML(
      "beforeend",
      `
            <tbody>
                ${rowsHtml.join("")}
            </tbody>
        `
    );
  }
}
