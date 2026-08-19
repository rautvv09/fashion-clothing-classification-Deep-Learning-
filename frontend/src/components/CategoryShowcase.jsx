import { SAMPLES, generateSampleImageFile } from "../utils/sampleGenerator";

const ALL_CATEGORIES = [
  { name: "T-shirt/top", icon: "👕", desc: "Short-sleeved shirts, tank tops, and casual tops.", sampleId: "tshirt" },
  { name: "Trouser", icon: "👖", desc: "Pants, jeans, and formal trousers.", sampleId: "trouser" },
  { name: "Pullover", icon: "🧥", desc: "Sweaters, hoodies, and long-sleeve knitwear.", sampleId: "tshirt" },
  { name: "Dress", icon: "👗", desc: "One-piece garments and evening gowns.", sampleId: "dress" },
  { name: "Coat", icon: "🥼", desc: "Jackets, trench coats, and outerwear.", sampleId: "tshirt" },
  { name: "Sandal", icon: "👡", desc: "Open-toed footwear and flip-flops.", sampleId: "boot" },
  { name: "Shirt", icon: "👔", desc: "Button-up collared shirts and dress shirts.", sampleId: "tshirt" },
  { name: "Sneaker", icon: "👟", desc: "Athletic shoes, trainers, and sport footwear.", sampleId: "sneaker" },
  { name: "Bag", icon: "👜", desc: "Handbags, backpacks, and totes.", sampleId: "bag" },
  { name: "Ankle boot", icon: "👢", desc: "High-top boots and leather ankle footwear.", sampleId: "boot" }
];

function CategoryShowcase({ onSelectCategory }) {
  return (
    <section className="categories-section" id="categories">
      <div className="section-header">
        <h2>10 Supported Fashion Categories</h2>
        <p>Our CNN model is trained to recognize 10 distinct apparel types from the Fashion-MNIST dataset</p>
      </div>

      <div className="categories-grid">
        {ALL_CATEGORIES.map((cat) => (
          <div 
            key={cat.name} 
            className="category-card glass-panel"
            onClick={() => onSelectCategory && onSelectCategory(cat.sampleId)}
            title={`Click to try ${cat.name}`}
          >
            <div className="category-card-icon">{cat.icon}</div>
            <h4>{cat.name}</h4>
            <p>{cat.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default CategoryShowcase;
