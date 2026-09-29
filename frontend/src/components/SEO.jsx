import { useEffect } from "react";

export default function SEO({ title, description }) {
  useEffect(() => {
    if (title) {
      document.title = title;
    }

    if (description) {
      const meta = document.querySelector('meta[name="description"]');
      if (meta) {
        meta.setAttribute("content", description);
      }
    }

    return () => {
      document.title = "کافی‌نت مهر | خدمات اینترنتی، پرینت، اسکن و تایپ در ورامین";
    };
  }, [title, description]);

  return null;
}
