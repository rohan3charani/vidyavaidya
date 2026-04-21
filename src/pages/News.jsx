import { useState } from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import img1 from "../assets/Articles/1776248712636.jpg";
import img2 from "../assets/Articles/1776248712861.jpg";
import img3 from "../assets/Articles/1776248713247.jpg";
import img4 from "../assets/Articles/1776248713372.jpg";
import img5 from "../assets/Articles/1776248713402.jpg";
import img6 from "../assets/Articles/1776248713645.jpg";
import "./Pages.css";

const articles = [
  {
    id: 1,
    date: "March 23, 2026",
    title: "Community Healthcare Initiative Reaches Remote Villages",
    excerpt: "Mobile health camps bring medical services and wellness programs to underserved rural areas.",
    image: img1,
    category: "Health",
    description: [
      "A comprehensive healthcare outreach program brings medical services, free checkups, and awareness sessions to remote villages. Healthcare professionals and community workers collaborate to provide basic medical treatments and health education.",
      "The program focuses on preventive healthcare, nutrition awareness, and disease screening. Local health workers identify concerns early and direct patients to appropriate treatment facilities.",
      "Mobile clinics visit multiple villages each month, reaching thousands of beneficiaries. Community feedback shows improved health awareness and better preventive practices among residents.",
      "The initiative bridges healthcare gaps and ensures rural populations have access to quality medical services and health information."
    ]
  },
  {
    id: 2,
    date: "February 15, 2026",
    title: "Education Transformation: New Learning Centers Inaugurated",
    excerpt: "State-of-the-art learning facilities open doors for underprivileged children seeking quality education.",
    image: img2,
    category: "Education",
    description: [
      "New educational centers have been inaugurated to provide quality learning opportunities to children from disadvantaged backgrounds. These centers are equipped with modern teaching materials, digital resources, and trained educators.",
      "The curriculum focuses on foundational literacy, numeracy, and life skills with special attention to early childhood development. Children build confidence in their academic journey with supportive learning environments.",
      "Each center serves as a community hub offering academic support, nutritional programs, health screenings, and guidance to parents about child development and education.",
      "Community participation has been overwhelming, with parents actively involved in their children's learning journey and progress. This represents a significant milestone in ensuring inclusive education for all."
    ]
  },
  {
    id: 3,
    date: "January 30, 2026",
    title: "Women Empowerment Program Shows Remarkable Growth",
    excerpt: "Skills training and economic independence initiatives empower hundreds of women.",
    image: img3,
    category: "Community",
    description: [
      "A women empowerment initiative has successfully trained over 500 women in various income-generating skills. The program combines practical skill training with financial literacy and entrepreneurship guidance.",
      "Participants learn skills ranging from handicrafts, tailoring, and food preparation to digital marketing and e-commerce. Training is designed to be market-relevant and aligned with local economic opportunities.",
      "Microfinance support and business mentoring help women establish their own ventures. A dedicated support network connects trainees with market opportunities and helps them scale their businesses.",
      "The program's success is evident from improved household incomes, enhanced self-confidence among participants, and positive social impact in communities. Women trained now serve as role models and mentors to others."
    ]
  },
  {
    id: 4,
    date: "January 10, 2026",
    title: "Child Nutrition Program Celebrates Milestone Achievement",
    excerpt: "Mid-day meal initiative serves nutritious food to thousands of children daily.",
    image: img4,
    category: "Health",
    description: [
      "A comprehensive child nutrition program has achieved the milestone of serving over one million meals to school children. Every child receives balanced, nutritious meals prepared with quality ingredients.",
      "The initiative has directly improved school attendance rates, with data showing 25 percent increase since the program's launch. Children are healthier, more energetic, and better able to concentrate in their studies.",
      "The meal program serves as a platform for health education, teaching children about nutrition, hygiene, and healthy eating habits. Kitchen staff receive regular training to ensure food safety and quality.",
      "Community volunteers and local stakeholders actively participate in the program's success. Addressing child hunger is crucial for enabling education and breaking the cycle of poverty."
    ]
  },
  {
    id: 5,
    date: "December 20, 2025",
    title: "Community Sport and Wellness Festival Unites Neighborhoods",
    excerpt: "Large-scale wellness event promotes physical health and community bonding.",
    image: img5,
    category: "Community",
    description: [
      "A community wellness festival brought together thousands of participants for a day of sports, health awareness, and cultural celebration. The event featured sporting activities, yoga sessions, health camps, and awareness programs.",
      "Participants of all ages engaged in traditional and modern sports, fitness competitions, and wellness workshops. Health professionals conducted free screenings and provided guidance on preventive health measures.",
      "The festival showcased cultural performances, traditional games, and community talent, strengthening social bonds and fostering unity. Local artisans and vendors displayed their work, supporting small businesses.",
      "The overwhelming participation highlighted community enthusiasm for wellness and collective action. Such events promote healthy lifestyles and build stronger, more connected communities."
    ]
  },
  {
    id: 6,
    date: "November 28, 2025",
    title: "Environmental Conservation Initiative Plants Tree Legacy",
    excerpt: "Community-led reforestation project plants thousands of trees for sustainability.",
    image: img6,
    category: "Environment",
    description: [
      "A large-scale tree plantation drive has successfully planted over 50,000 saplings across urban and rural areas. The initiative combines environmental conservation with community participation and environmental education.",
      "Participants from schools, corporate organizations, and community groups worked together to plant native tree species. Each participant planted a tree as part of their commitment to environmental sustainability.",
      "The planted trees will contribute to reducing carbon footprint, improving air quality, and creating green spaces for future generations. Educational programs raise awareness about climate change and environmental protection.",
      "The initiative demonstrates collective action toward sustainability. Communities now take ownership of planted trees, ensuring their care and growth. The project stands as a testament to united environmental action."
    ]
  }
];

export default function News() {
  const [selectedArticle, setSelectedArticle] = useState(null);

  const handleReadMore = (article) => {
    setSelectedArticle(article);
    setTimeout(() => {
      document.getElementById("news-detail-panel")?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  const backToList = () => {
    setSelectedArticle(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="page-wrapper">
      <Navbar />

      <section className="page-hero">
        <span className="page-hero-tag">Latest Updates</span>
        <h1>Articles</h1>
        <p>Read thoughtful news stories, article highlights, and in-depth coverage of our work in education and health.</p>
      </section>

      <section className="page-section" style={{ background: "#f8fafc" }}>
        <div className="page-container--narrow">
          {!selectedArticle ? (
            <div className="news-grid-vertical">
              {articles.map((article) => (
                <div key={article.id} className="news-card-vertical">
                  <button 
                    className="news-card-image-button"
                    onClick={() => handleReadMore(article)}
                    aria-label={`View article: ${article.title}`}
                  >
                    <img src={article.image} alt={article.title} loading="lazy" />
                  </button>
                  <div className="news-card-vertical-content">
                    <span className="news-card-category">{article.category}</span>
                    <h3 className="news-card-vertical-title">{article.title}</h3>
                    <p className="news-card-date">{article.date}</p>
                    <p className="news-card-excerpt">{article.excerpt}</p>
                    <button 
                      className="news-read-more"
                      onClick={() => handleReadMore(article)}
                    >
                      READ MORE
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div id="news-detail-panel" className="news-detail-panel">
              <button className="news-detail-close" onClick={backToList}>Back to Articles</button>
              <div className="news-detail-header">
                <span className="news-detail-category">{selectedArticle.category}</span>
                <p className="news-date">{selectedArticle.date}</p>
                <h2 className="news-detail-title">{selectedArticle.title}</h2>
              </div>
              <div className="news-detail-media">
                <img src={selectedArticle.image} alt={selectedArticle.title} />
              </div>
              <div className="news-detail-description">
                {selectedArticle.description.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
              <button className="news-read-more news-detail-back" onClick={backToList}>Back to Articles</button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
