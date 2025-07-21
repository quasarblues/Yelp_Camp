// add event listener to the edit button.
// replace the element with a form + update button.
// clicking update submits the form
// make a route to handle the review update.
// I don't need a route for the review update, since it'll be done on the show page.

const editReviewBtn = document.querySelector('#editReview');

editReviewBtn.addEventListener('click', () => {
    alert('You clicked me');
})