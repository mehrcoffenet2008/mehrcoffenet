import { useRef } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function ServiceCard3D({ icon, title, description, link, delay = 0 }) {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 15;
    const rotateY = (centerX - x) / 15;

    cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = "perspective(1000px) rotateX(0) rotateY(0) scale(1)";
  };

  return (
    <motion.div
      ref={cardRef}
      className="service-card-3d"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transformStyle: "preserve-3d" }}
    >
      <div className="service-card-3d-inner">
        <div className="service-card-3d-icon">{icon}</div>
        <h3>{title}</h3>
        <p>{description}</p>
        {link && (
          <Link to={link} className="service-card-3d-link">
            مشاهده جزئیات
          </Link>
        )}
      </div>
    </motion.div>
  );
}
