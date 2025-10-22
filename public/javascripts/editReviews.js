document.querySelectorAll('.editReview').forEach(button => {
  button.addEventListener('click', e => {
    const card = e.target.closest('.card');          // find the review card
    const reviewId = card.dataset.reviewId;         // get the review ID
    const bodyText = card.querySelector('.review-body').innerText;
    const rating = card.querySelector('.starability-result').dataset.rating;
    const cardBody = card.querySelector('.card-body');

    // Remove existing form if one already exists
    const existingForm = card.querySelector('form.editReviewForm');
    if (existingForm) existingForm.remove();

    // Create the form element
    const form = document.createElement('form');
    form.classList.add('editReviewForm', 'mb-3', 'validated-form',);
    form.method = 'POST';
    form.action = `/campgrounds/${campground._id}/reviews/${reviewId}?_method=PUT`;

    // Insert form HTML
    form.innerHTML = `
  <h3 class="h5">Edit Review</h3>
  <div class="mb-0">
    <fieldset class="starability-basic p-0">
      <legend class="visually-hidden">Rating</legend>
      <input type="radio" id="edited-rate1-${reviewId}" name="review[rating]" value="1" required ${rating == 1 ? 'checked' : ''} />
      <label for="edited-rate1-${reviewId}" title="Terrible">1 star</label>

      <input type="radio" id="edited-rate2-${reviewId}" name="review[rating]" value="2" ${rating == 2 ? 'checked' : ''} />
      <label for="edited-rate2-${reviewId}" title="Not good">2 stars</label>

      <input type="radio" id="edited-rate3-${reviewId}" name="review[rating]" value="3" ${rating == 3 ? 'checked' : ''} />
      <label for="edited-rate3-${reviewId}" title="Average">3 stars</label>

      <input type="radio" id="edited-rate4-${reviewId}" name="review[rating]" value="4" ${rating == 4 ? 'checked' : ''} />
      <label for="edited-rate4-${reviewId}" title="Very good">4 stars</label>

      <input type="radio" id="edited-rate5-${reviewId}" name="review[rating]" value="5" ${rating == 5 ? 'checked' : ''} />
      <label for="edited-rate5-${reviewId}" title="Amazing">5 stars</label>
    </fieldset>
  </div>

  <div class="mb-3">
    <textarea class="form-control" name="review[body]" required>${bodyText}</textarea>
  </div>

  <button class="btn btn-success">Update</button>
  <button type="button" class="btn btn-secondary ms-2 cancelEdit">Cancel</button>
`;

    cardBody.style.display = 'none';
    // card.appendChild(form);
    card.insertAdjacentElement('afterend', form);

    form.querySelector('.cancelEdit').addEventListener('click', () => {
      form.remove();  // simply remove the form from the DOM
      cardBody.style.display = '';
    });

  });
});


