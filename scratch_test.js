fetch('http://localhost:5000/api/testimonials?published=all')
  .then(r => r.json())
  .then(data => {
    console.log("SUCCESS:", data.success);
    console.log("TESTIMONIALS COUNT:", data.testimonials?.length);
    console.log("TESTIMONIALS:", JSON.stringify(data.testimonials, null, 2));
  })
  .catch(console.error);
