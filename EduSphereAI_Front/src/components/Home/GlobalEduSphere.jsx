import React from "react";
import "./GlobalEduSphere.css";

const flags = [
  { src: "https://flagcdn.com/w80/in.png", alt: "India" },
  { src: "https://flagcdn.com/w80/us.png", alt: "USA" },
  { src: "https://flagcdn.com/w80/gb.png", alt: "UK" },
  { src: "https://flagcdn.com/w80/fr.png", alt: "France" },
  { src: "https://flagcdn.com/w80/de.png", alt: "Germany" },
  { src: "https://flagcdn.com/w80/br.png", alt: "Brazil" },
  { src: "https://flagcdn.com/w80/ca.png", alt: "Canada" },
  { src: "https://flagcdn.com/w80/au.png", alt: "Australia" },
  { src: "https://flagcdn.com/w80/jp.png", alt: "Japan" },
  { src: "https://flagcdn.com/w80/za.png", alt: "South Africa" },
  { src: "https://flagcdn.com/w80/cn.png", alt: "China" },
];

const GlobalEduSphere = () => {
  return (
    <section className="global-edu-section">
      <h2 className="title">EduSphere Around the World</h2>
      <p className="subtitle">
        EduSphere is empowering learners across the globe! Explore our diverse educational network spanning multiple countries.
      </p>
      <div className="flags-container">
        {flags.map((flag, index) => (
          <img key={index} src={flag.src} alt={flag.alt} className="flag" />
        ))}
      </div>
    </section>
  );
};

export default GlobalEduSphere;
