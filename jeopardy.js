// categories is the main data structure for the app; it looks like this:

//  [
//    { title: "Math",
//      clues: [
//        {question: "2+2", answer: 4, showing: null},
//        {question: "1+1", answer: 2, showing: null}
//        ...
//      ],
//    },
//    { title: "Literature",
//      clues: [
//        {question: "Hamlet Author", answer: "Shakespeare", showing: null},
//        {question: "Bell Jar Author", answer: "Plath", showing: null},
//        ...
//      ],
//    },
//    ...
//  ]

// categories (width)
const width = 6 
// clues (height)
const height = 5; 
// URL 
const url = 'http://jservice.io/api/'; 
let categories = [];
$('body').append('<img src="jeopardy.gif"></img>'); 
$('body').append('<button id="btn-restart">Restart</button>')

/** Get NUM_CATEGORIES random category from API.
 *
 * Returns array of category ids
 */

async function getCategoryIds() {
    // random 1000
    let offset = Math.floor(Math.random() * 1000); 
    let response = await axios.get(`${url}categories?count=${width}&offset=${offset}`); 
    console.log(response.data); 
    let cats = response.data.map(result => {
        return {
            title: result.title, 
            id: result.id, 
        }
    })
    return cats; 
}

/** Return object with data about a category:
 *
 *  Returns { title: "Math", clues: clue-array }
 *
 * Where clue-array is:
 *   [
 *      {question: "Hamlet Author", answer: "Shakespeare", showing: null},
 *      {question: "Bell Jar Author", answer: "Plath", showing: null},
 *      ...
 *   ]
 */

async function getCategory(catId) {
    let response = await axios.get(`${url}clues?category=${catId.id}`); 
    let clues = response.data.map(result => {
        return {
            title: catId.title, 
            clues: {
                question: result.question, 
                answer: result.answer, 
                showing: null, 
            }
        }
    })
    return clues; 
}

/** Fill the HTML table#jeopardy with the categories & cells for questions.
 *
 * - The <thead> should be filled w/a <tr>, and a <td> for each category
 * - The <tbody> should be filled w/NUM_QUESTIONS_PER_CAT <tr>s,
 *   each with a question for each category in a <td>
 *   (initally, just show a "?" where the question/answer would go.)
 */

async function fillTable() {
    // make column tops
    for (let cat of categories) {
        const headCell = $(`<th>${cat[0].title}</th>`);
        $('table').append(headCell);
    }
  
    // make main part of board
    for (let y = 0; y < height; y++) {
        const row = $('<tr></tr>');
        for (let x = 0; x < width; x++) {
            const cell = $(`<td>?</td>`);
            cell.attr('id', `${y}-${x}`);
            row.append(cell);
        }
        $('table').append(row);
    }
}; 

/** Handle clicking on a clue: show the question or answer.
 *
 * Uses .showing property on clue to determine what to show:
 * - if currently null, show question & set .showing to "question"
 * - if currently "question", show answer & set .showing to "answer"
 * - if currently "answer", ignore click
 * */

function handleClick(evt) {
    let cellId = evt.target.id;
    console.log(categories[cellId[2]][cellId[0]].clues)
    if (categories[cellId[2]][cellId[0]].clues.showing === null) {
        categories[cellId[2]][cellId[0]].clues.showing = "question";
        evt.target.innerHTML = categories[cellId[2]][cellId[0]].clues.question;
    } else if (categories[cellId[2]][cellId[0]].clues.showing === "question") {
        categories[cellId[2]][cellId[0]].clues.showing = "answer";
        evt.target.innerHTML = categories[cellId[2]][cellId[0]].clues.answer;
    }
}; 

/** Wipe the current Jeopardy board, show the loading spinner,
 * and update the button used to fetch data.
 */

function showLoadingView() {
    $('.board').remove(); 
    categories = []; 
    $('img').show(); 
}

/** Remove the loading spinner and update the button used to fetch data. */

function hideLoadingView() {
    $('img').hide(); 
}

/** Start game:
 *
 * - get random category Ids
 * - get data for each category
 * - create HTML table
 * */

async function setUpAndStart() {
    showLoadingView(); 
    $('.table').remove(); 
    const cats = await getCategoryIds(); 
    for(let cat of cats) {
        const clues = await getCategory(cat); 
        categories.push(clues)
    }
    const htmlBoard = $('<table class="board"></table>'); 
    $('body').append(htmlBoard); 
    fillTable(); 
    $('td').on('click', handleClick); 

}

/** On click of start / restart button, set up game. */

// TODO
$('#btn-restart').on('click', setUpAndStart); 

/** On page load, add event handler for clicking clues */

// TODO
$(function() {
    setUpAndStart(); 
}); 