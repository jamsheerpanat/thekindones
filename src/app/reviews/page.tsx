const reviews = [
  {
    name: "Sara",
    comment: "Soft scramble sandwich is next level. Love the clean packaging.",
    rating: "5.0"
  },
  {
    name: "Hamad",
    comment: "Catering box was perfect for our team brunch.",
    rating: "4.8"
  },
  {
    name: "Maya",
    comment: "Fast delivery and the sauces are incredible.",
    rating: "4.9"
  }
];

export default function ReviewsPage() {
  return (
    <div className="section">
      <div className="container-padded grid gap-8">
        <div className="card p-6">
          <h2>Guest reviews</h2>
          <p className="text-sm text-ink-500">
            We read every review and respond within 24 hours.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {reviews.map((review) => (
              <div key={review.name} className="card border border-ink-100 p-4">
                <p className="text-lg font-semibold text-ink-900">
                  {review.rating}
                </p>
                <p className="text-sm text-ink-600">{review.comment}</p>
                <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-ink-400">
                  {review.name}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="card p-6">
          <h3 className="text-xl font-semibold">Leave a review</h3>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <input className="input" placeholder="Your name" />
            <select className="input">
              <option>5 stars</option>
              <option>4 stars</option>
              <option>3 stars</option>
            </select>
            <textarea
              className="input md:col-span-2"
              placeholder="Share your experience"
            />
          </div>
          <button className="btn btn-primary mt-4">Submit review</button>
        </div>
      </div>
    </div>
  );
}
