import TableCsv from "./TableCsv.js";
import TableCSVExporter from "./TableCSVExporter.js";


var x = document.querySelector("#tags-parent");
x.classList.add("hide");
const tableRoot = document.querySelector("#csvRoot"); // csvRoot is the id we gave table in the HTML
const csvFileInput = document.querySelector('#csvFileInput');
const tableCsv = new TableCsv(tableRoot);

var headerfromtable = ["Click the Box"];

var confirmFilterListenMade = false
var confirmSplitMergeMade = false



// he input object as a property called files which is an array, index 0 is the file we chose
// notice for results.data.slice(1) we skipped the first element 1 of the table. That's because first line is header, handle separately
// csvFileInput.addEventListener("change", e=> {
//     Papa.parse(csvFileInput.files[0], {
//         delimiter: ",",
//         skipEmptyLines: true,
//         complete: results => {
//             tableCsv.update(results.data.slice(1), results.data[0]);
//             headerfromtable =  results.data[0];
//         }
//     })
    

            
// });

tableCsv.update(
    [],
    []
);

const btnExportToCsv = document.querySelector("#btnExportToCsv");

btnExportToCsv.addEventListener("click", () => {
    const dataTable = document.querySelector("#csvRoot");
    const exporter = new TableCSVExporter(dataTable);
    const csvOutput = exporter.convertToCSV();
    // a blob is a container for random data, this is a blob for csv
    const csvBlob = new Blob([csvOutput], { type: "text/csv" });
    // a blob URL pretty much just creates an internal reference to this object in the form of an actual link which the user then downloads
    const blobUrl = URL.createObjectURL(csvBlob);
    const anchorElement = document.createElement("a");

    anchorElement.href = blobUrl;
    anchorElement.download = "table-export.csv";
    anchorElement.click();

    setTimeout(() => {
        URL.revokeObjectURL(blobUrl);
    }, 500);
});

const btnshowTransforming = document.querySelector("#btnshowTransform");

btnshowTransforming.addEventListener("click", () => {
    const dataTable = document.querySelector("#csvRoot");
    const exporter = new TableCSVExporter(dataTable);
    const csvOutput = exporter.convertToCSV();

    /* unrelated to sending post, this just shows the buttons */

    x.style.opacity = "1";
    if (x.classList.contains("hide")) {
      x.classList.remove("hide");
    } else {
      x.classList.add("hide");
      x.style.opacity = "0";
    }

});

const filterButton = document.querySelector("#filterbutton");
const splitmergebutton = document.querySelector("#splitmergebutton");
var splitmergebox = document.querySelector('#splitmergebox');
var filterbox = document.querySelector('#filterbox');

var inputkeyword = document.querySelector('input[name=tags-normal]');
    // initialize Tagify on the above input node reference
new Tagify(inputkeyword);

console.log(headerfromtable)

var input = document.querySelector('input[name=tags-filter-columns]'),
// init Tagify script on the above inputs
tagify = new Tagify(input, {
    whitelist : headerfromtable,
    dropdown: {
        maxHeight: "1000px",
        position: "manual",
        maxItems: Infinity,
        enabled: 0,
        classname: "customSuggestionsList"
    },
    templates: {
        dropdownItemNoMatch() {
            return `<div class='empty'>Nothing Found</div>`;
        }
    },
    enforceWhitelist: true
})

tagify.on("dropdown:show")
    .on("dropdown:hide")
    .on('dropdown:scroll')

renderSuggestionsList()  // defined down below  

// https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentElement
function renderSuggestionsList(){
    tagify.dropdown.show() // load the list
    tagify.DOM.scope.parentNode.appendChild(tagify.DOM.dropdown)
}
        

filterButton.addEventListener("click", () => {
    console.log("filterclick")

    if(filterbox.style.display == 'grid') {
        filterbox.style.display = 'none';
    } else {
        filterbox.style.display = 'grid';
    }

    if(splitmergebox.style.display == 'grid') {
        splitmergebox.style.display = 'none';
    } 
        var confirmButtonFilter = document.querySelector('#confirmButtonFilter');

        var filterdonotswitch = document.querySelector('#filterdonotswitch');
        var matchkeywordsswitch = document.querySelector('#matchkeywordsswitch');

        if(confirmFilterListenMade == false) {
            confirmFilterListenMade = true
            confirmButtonFilter.addEventListener("click", () => {
                const dataTable = document.querySelector("#csvRoot");
                const exporter = new TableCSVExporter(dataTable);
                const csvOutput = exporter.convertToCSV();

                var dataToSend = {
                    function: "filterKeywords",
                    theTable: csvOutput,
                    columns: input.value,
                    keywords: inputkeyword.value,
                    boolFilterOut: filterdonotswitch.checked,
                    boolMatchExact: matchkeywordsswitch.checked
                };

                fetch("http://127.0.0.1:5000/receiver", 
                    {
                        method: 'POST',
                        headers: {
                            'Content-type': 'application/json',
                            'Accept': 'application/json'
                        },
                        // Stringify the payload into JSON
                        body:JSON.stringify(dataToSend)
                        }).then(res=>{
                        if(res.ok){
                            return res.json()
                            }else{
                                alert("something is wrong")
                            }
                        }).then(jsonResponse=>{

                            tableCsv.clear();
                            var newheader = jsonResponse[0]
                            var newbody = jsonResponse.slice(1)
                            console.log(newbody)
                            tableCsv.update(newbody, newheader);
                            headerfromtable =  jsonResponse[0];
                            
                        } 
                        ).catch((err) => console.error(err));
            });

    }
    

});


var inputcolumn = document.querySelector('input[name=tags-split-columns]'),
    tagifysecond = new Tagify(inputcolumn, {
        whitelist : headerfromtable,
        dropdown: {
            maxHeight: "1000px",
            position: "manual",
            maxItems: Infinity,
            enabled: 0,
            classname: "customSuggestionsList"
        },
        templates: {
            dropdownItemNoMatch() {
                return `<div class='empty'>Nothing Found</div>`;
            }
        },
        enforceWhitelist: true
    })

    tagifysecond.on("dropdown:show")
        .on("dropdown:hide")
        .on('dropdown:scroll')

    renderSuggestionsList2()  // defined down below

 

    // https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentElement
    function renderSuggestionsList2(){
        tagifysecond.dropdown.show() // load the list
        tagifysecond.DOM.scope.parentNode.appendChild(tagifysecond.DOM.dropdown)
    }


splitmergebutton.addEventListener("click", () => {
    console.log("splitclick");

    if(splitmergebox.style.display == 'grid') {
        splitmergebox.style.display = 'none';
    } else {
        splitmergebox.style.display = 'grid';

    }

    if(filterbox.style.display == 'grid') {
        filterbox.style.display = 'none';
    } 

    var confirmButtonSplit = document.querySelector('#confirmButtonSplit');



    if(confirmSplitMergeMade == false) {
        confirmSplitMergeMade = true;
        var language = document.querySelector('#language');
        var textareasplitmerge = document.querySelector('#splitmergecharacter');
        var inorder = document.querySelector('#inorder');
        language.addEventListener("click", () => {
            if(language.value == "Merge Columns by Characters") {
                console.log("jdhjh")
                textareasplitmerge.placeholder = "Cell values in all merged columns will be separated by these characters";
                inorder.style.opacity = "100";
            } else if(language.value == "Split Columns by Characters") {
                textareasplitmerge.placeholder = 'Use [/column] to represent column and [/cell-value] to represent the value assigned\nExample: "[/column]: [/cell-value] " would turn "Phone: 999-999 Name: Bob" into 2 columns.\nNote that the whitespace after [/cell-value] is necessary in this example\n\nIf the above format is not used, it will split column by input and name columns 1,2,3, etc.';
                inorder.style.opacity = "0";
            } else {
                textareasplitmerge.placeholder = "";
                inorder.style.opacity = "0";
            }
        });
        confirmButtonSplit.addEventListener("click", () => {
            const dataTable = document.querySelector("#csvRoot");
            const exporter = new TableCSVExporter(dataTable);
            const csvOutput = exporter.convertToCSV();

            const confirmerror = document.querySelector(".confirm-error");

            var countsplit1 = (textareasplitmerge.value.match(/\[\/column\]/g) || []).length;
            var countsplit2 = (textareasplitmerge.value.match(/\[\/cell-value\]/g) || []).length;

            if((countsplit1 >= 2 || countsplit2 >= 2) || ((countsplit1 == 1 && countsplit2 != 1) || (countsplit1 != 1 && countsplit2 == 1))) {
                confirmerror.style.display = "block";
                confirmerror.textContent = 'Please Use [/column] and [/cell-value] Exactly Once, or Not At All';
            } else {
                confirmerror.textContent = '';
                confirmerror.style.display = "hide";

                var dataToSend = {
                    function: language.value,
                    theTable: csvOutput,
                    columns:  inputcolumn.value,
                    splitters:  textareasplitmerge.value,
                };

                fetch("http://127.0.0.1:5000/receiver", 
                {
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json',
                        'Accept': 'application/json'
                    },
                    // Stringify the payload into JSON
                    body:JSON.stringify(dataToSend)
                    }).then(res=>{
                    if(res.ok){
                        return res.json()
                        }else{
                            alert("something is wrong")
                        }
                    }).then(jsonResponse=>{

                        tableCsv.clear();
                        var newheader = jsonResponse[0]
                        var newbody = jsonResponse.slice(1)
                        console.log(newbody)
                        tableCsv.update(newbody, newheader);
                        headerfromtable =  jsonResponse[0];
                        
                    } 
                    ).catch((err) => console.error(err));
            }

        });
    }
  
});

try {

    var dropdownCSS = document.querySelectorAll('.tagify__dropdown__wrapper');
    for (var i = 0; i < dropdownCSS.length; i++){
        dropdownCSS[i].style.maxHeight = '500px';
        dropdownCSS[i].style.background = '#f4fcfa';
    }

    /* I DID NOT REALIZE QUERYSELECTOR ONLY PICKS FIRST ONE OF IT TYPE, DROPDOWN NOW WORKS FOR ALL ELEMENTS NOT JUST FIRST */
    var dropdownCSSItem = document.querySelectorAll('.tagify__dropdown__item')
    for (var i = 0; i < dropdownCSSItem.length; i++){
        dropdownCSSItem[i].style.maxHeight = '1000px';
    }

    /*roundabout solution, tagify dropdown keeps getting destroyed when it becoems active so must remake it */
    var tdropdownwrapper = document.querySelectorAll('.tagify__dropdown__wrapper')
    for (var i = 0; i < dropdownCSSItem.length; i++){
        tdropdownwrapper[i].onmouseover = function() {mouseOver()};
        tdropdownwrapper[i].onmouseout = function() {mouseOver()};
    }
    var tinputtag = document.querySelectorAll('.tagify__input')
    for (var i = 0; i < dropdownCSSItem.length; i++){
        tinputtag[i].onmouseover = function() {mouseOver()};
        tinputtag[i].onmouseout = function() {mouseOver()};
    }
    var telements = document.querySelectorAll('.tagify')
    for (var i = 0; i < dropdownCSSItem.length; i++){
        telements[i].onmouseover = function() {mouseOver()};
        telements[i].onmouseout = function() {mouseOver()};
    }
    
    function mouseOver() {
        var dropdownCSSItem = document.querySelectorAll('.tagify__dropdown__item');
        for (var i = 0; i < dropdownCSSItem.length; i++){
            dropdownCSSItem[i].style.maxHeight = '1000px';
        }
    }
    // end roundabout

    var inputsizes = document.querySelectorAll('.tagify__input');
    for (var i = 0; i < dropdownCSSItem.length; i++){
        inputsizes[i].style.width = '700px';
        inputsizes[i].style.minwidth = '700px';
    }

} catch {
    console.log("issue");
}


csvFileInput.addEventListener("change", e=> {
    Papa.parse(csvFileInput.files[0], {
        delimiter: ",",
        skipEmptyLines: true,
        complete: results => {
            tableCsv.update(results.data.slice(1), results.data[0]);
            headerfromtable =  results.data[0];
            tagify.whitelist = headerfromtable;
            tagifysecond.whitelist = headerfromtable;
        }
    })

            
});
