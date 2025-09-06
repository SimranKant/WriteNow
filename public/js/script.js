document.addEventListener("DOMContentLoaded", () => {
  const alerts = document.querySelectorAll(".alert");
  alerts.forEach((alert) => {
    setTimeout(() => {
      alert.classList.remove("show");
      alert.classList.add("fade");
      setTimeout(() => alert.remove(), 500); // remove after fade-out
    }, 4000); // auto-dismiss after 4 sec
  });
});
document.querySelectorAll('.like-form').forEach(form => {
  const button = form.querySelector('.like-btn');
  if(!button || button.disabled) return; // skip guests

  const postId = form.dataset.postId;
  const likeCountSpan = button.querySelector('.like-count');
  let liked = button.classList.contains('btn-primary');

  button.addEventListener('click', (e) => {
    // 1️⃣ Toggle UI instantly
    liked = !liked;
    button.classList.toggle('btn-primary', liked);
    button.classList.toggle('btn-outline-primary', !liked);

    // 2️⃣ Animate like count
    likeCountSpan.classList.add('rolling');
    setTimeout(() => {
      let count = parseInt(likeCountSpan.textContent);
      likeCountSpan.textContent = liked ? count + 1 : count - 1;
      likeCountSpan.classList.remove('rolling');
    }, 150); // match transition duration

    // 3️⃣ Pop animation
    button.classList.remove('pop');
    void button.offsetWidth; // restart animation
    button.classList.add('pop');

    // 4️⃣ Floating heart if liked
    if(liked){
      const rect = button.getBoundingClientRect();
      const heart = document.createElement('span');
      heart.classList.add('floating-heart');
      heart.innerHTML = '❤️';
      heart.style.left = `${e.clientX - rect.left - 8}px`;
      heart.style.top = `${e.clientY - rect.top - 8}px`;
      form.parentElement.appendChild(heart);
      setTimeout(() => heart.remove(), 1000);
    }

    // 5️⃣ Async server update
    fetch(`/posts/${postId}/like`, { method: 'POST' })
      .then(res => res.json())
      .then(data => {
        if(data.success){
          likeCountSpan.textContent = data.likes;
          liked = data.liked;
        }
      })
      .catch(err => console.error('Error liking post', err));
  });
});
