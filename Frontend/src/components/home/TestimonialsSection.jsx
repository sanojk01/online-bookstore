import {
  Box,
  Container,
  Typography,
  Avatar,
  Rating,
} from "@mui/material";
import { FormatQuote } from "@mui/icons-material";
import { useRef, useEffect } from "react";

const testimonials = [
  {
    name: "Rahul Sharma",
    role: "Software Developer",
    review: "Amazing collection of books and super fast delivery. The UI is smooth and easy to use.",
    rating: 5,
    accent: "#2563eb",
    tag: "⚡ Fast Delivery",
  },
  {
    name: "Priya Verma",
    role: "College Student",
    review: "I found all my favorite programming books at affordable prices. Highly recommended!",
    rating: 5,
    accent: "#7c3aed",
    tag: "💰 Great Prices",
  },
  {
    name: "Aman Gupta",
    role: "Entrepreneur",
    review: "Best online bookstore experience. Secure payment and quality books every time.",
    rating: 4.5,
    accent: "#0891b2",
    tag: "🔒 Secure",
  },
  {
    name: "Sneha Patel",
    role: "Book Blogger",
    review: "Discovered so many hidden gems here! The category filters make it so easy to find exactly what I want.",
    rating: 5,
    accent: "#be185d",
    tag: "✨ Great Discovery",
  },
  {
    name: "Vikram Nair",
    role: "High School Teacher",
    review: "Ordered textbooks for my entire class and got them delivered within 2 days. Outstanding service!",
    rating: 5,
    accent: "#059669",
    tag: "📦 2-Day Delivery",
  },
];

const TestimonialCard = ({ item }) => (
  <Box
    sx={{
      p: 3.2,
      borderRadius: "20px",
      background: "#ffffff",
      border: "1px solid rgba(0,0,0,0.06)",
      boxShadow: "0 2px 16px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)",
      display: "flex",
      flexDirection: "column",
      gap: 2,
      minWidth: { xs: "82vw", md: 355 },
      maxWidth: { xs: "82vw", md: 355 },
      flexShrink: 0,
      userSelect: "none",
      position: "relative",
      overflow: "hidden",
      transition: "transform 0.3s ease, box-shadow 0.3s ease",
      "&:hover": {
        transform: "translateY(-6px)",
        boxShadow: `0 20px 48px rgba(0,0,0,0.1), 0 4px 12px ${item.accent}18`,
        border: `1px solid ${item.accent}25`,
      },
      // Top accent bar
      "&::before": {
        content: '""',
        position: "absolute",
        top: 0, left: 0, right: 0,
        height: "3px",
        background: `linear-gradient(90deg, ${item.accent}, ${item.accent}55)`,
        borderRadius: "20px 20px 0 0",
      },
    }}
  >
    {/* Top row */}
    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: 0.5 }}>
      <Box sx={{
        display: "inline-flex", alignItems: "center", gap: 0.7,
        px: 1.4, py: 0.5, borderRadius: "999px",
        background: `${item.accent}10`,
        border: `1px solid ${item.accent}20`,
      }}>
        <Typography sx={{ fontSize: "0.68rem", color: item.accent, fontWeight: 600, letterSpacing: "0.2px" }}>
          {item.tag}
        </Typography>
      </Box>
      <Rating
        value={item.rating}
        precision={0.5}
        readOnly
        size="small"
        sx={{ "& .MuiRating-iconFilled": { color: "#f59e0b" } }}
      />
    </Box>

    {/* Quote icon + text */}
    <Box>
      <FormatQuote sx={{ color: `${item.accent}40`, fontSize: 32, mb: -0.5, ml: -0.5 }} />
      <Typography sx={{
        color: "#374151",
        lineHeight: 1.85,
        fontSize: "0.875rem",
        fontFamily: "Georgia, serif",
        fontStyle: "italic",
      }}>
        {item.review}
      </Typography>
    </Box>

    {/* Divider */}
    <Box sx={{ height: "1px", background: "linear-gradient(90deg, #e5e7eb, transparent)" }} />

    {/* Author */}
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
      <Avatar sx={{
        width: 42, height: 42,
        fontSize: 15, fontWeight: 800,
        bgcolor: item.accent,
        boxShadow: `0 4px 12px ${item.accent}35`,
      }}>
        {item.name[0]}
      </Avatar>
      <Box sx={{ flex: 1 }}>
        <Typography sx={{ fontWeight: 700, color: "#111827", fontSize: "0.85rem" }}>
          {item.name}
        </Typography>
        <Typography sx={{ color: "#9ca3af", fontSize: "0.72rem", mt: 0.2 }}>
          {item.role}
        </Typography>
      </Box>
      {/* Verified badge */}
      <Box sx={{
        px: 1.2, py: 0.4, borderRadius: "6px",
        background: "#f0fdf4", border: "1px solid #bbf7d0",
      }}>
        <Typography sx={{ fontSize: "0.62rem", color: "#16a34a", fontWeight: 600 }}>✓ Verified</Typography>
      </Box>
    </Box>
  </Box>
);

export default function TestimonialsSection() {
  const trackRef = useRef(null);
  const animRef = useRef(null);
  const pausedRef = useRef(false);
  const posRef = useRef(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const speed = 0.45;
    const animate = () => {
      if (!pausedRef.current) {
        posRef.current += speed;
        const halfWidth = track.scrollWidth / 2;
        if (posRef.current >= halfWidth) posRef.current = 0;
        track.style.transform = `translateX(-${posRef.current}px)`;
      }
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  const doubled = [...testimonials, ...testimonials];

  return (
    <Box sx={{
      py: { xs: 8, md: 11 },
      background: "linear-gradient(180deg, #f8fafc 0%, #f1f5f9 50%, #f8fafc 100%)",
      overflow: "hidden",
      position: "relative",
      "@keyframes pulse": {
        "0%,100%": { opacity: 1 },
        "50%": { opacity: 0.35 },
      },
      "@keyframes float": {
        "0%,100%": { transform: "translateY(0px)" },
        "50%": { transform: "translateY(-12px)" },
      },
    }}>

      {/* Subtle background shapes */}
      <Box sx={{
        position: "absolute", top: "-60px", right: "8%",
        width: "320px", height: "320px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(37,99,235,0.05) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      <Box sx={{
        position: "absolute", bottom: "-40px", left: "5%",
        width: "280px", height: "280px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(124,58,237,0.05) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1 }}>
        {/* Header */}
        <Box sx={{ textAlign: "center", mb: 7 }}>

          {/* Badge */}
          <Box sx={{
            display: "inline-flex", alignItems: "center", gap: 1,
            px: 2, py: 0.8, borderRadius: "999px", mb: 3,
            background: "#eff6ff",
            border: "1px solid #bfdbfe",
          }}>
            <Box sx={{
              width: 6, height: 6, borderRadius: "50%",
              bgcolor: "#2563eb",
              boxShadow: "0 0 0 3px rgba(37,99,235,0.15)",
              animation: "pulse 2.5s ease-in-out infinite",
            }} />
            <Typography sx={{
              color: "#1d4ed8", fontSize: "0.65rem",
              fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase",
            }}>
              Testimonials
            </Typography>
          </Box>

          <Typography sx={{
            fontSize: { xs: "2rem", md: "2.75rem" },
            fontWeight: 900,
            color: "#0f172a",
            lineHeight: 1.15,
            mb: 2,
            fontFamily: "'Playfair Display', Georgia, serif",
            letterSpacing: "-0.5px",
          }}>
            What Our Readers Say
          </Typography>

          <Typography sx={{
            maxWidth: 500, mx: "auto",
            color: "#64748b", lineHeight: 1.85, fontSize: "0.9rem",
          }}>
            Thousands of readers trust our platform for discovering and buying their favorite books.
          </Typography>

          {/* Accent line */}
          <Box sx={{
            mt: 3, mx: "auto", width: 56, height: "3px",
            background: "linear-gradient(90deg, #2563eb, #7c3aed)",
            borderRadius: "3px",
          }} />

          {/* Stats row */}
          <Box sx={{
            display: "flex", justifyContent: "center", gap: { xs: 3, md: 6 },
            mt: 5,
          }}>
            {[
              { val: "50K+", label: "Happy Readers" },
              { val: "4.9★", label: "Average Rating" },
              { val: "99%", label: "Satisfaction Rate" },
            ].map(({ val, label }) => (
              <Box key={label} sx={{ textAlign: "center" }}>
                <Typography sx={{
                  fontWeight: 800, fontSize: { xs: "1.3rem", md: "1.5rem" },
                  color: "#0f172a", letterSpacing: "-0.5px",
                }}>
                  {val}
                </Typography>
                <Typography sx={{ fontSize: "0.72rem", color: "#94a3b8", mt: 0.3, letterSpacing: "0.5px" }}>
                  {label}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Container>

      {/* Scrolling track */}
      <Box
        sx={{ position: "relative", width: "100%", overflow: "hidden" }}
        onMouseEnter={() => (pausedRef.current = true)}
        onMouseLeave={() => (pausedRef.current = false)}
      >
        {/* Fade masks */}
        <Box sx={{
          position: "absolute", left: 0, top: 0, bottom: 0, width: 120, zIndex: 2,
          background: "linear-gradient(to right, #f8fafc, transparent)",
          pointerEvents: "none",
        }} />
        <Box sx={{
          position: "absolute", right: 0, top: 0, bottom: 0, width: 120, zIndex: 2,
          background: "linear-gradient(to left, #f8fafc, transparent)",
          pointerEvents: "none",
        }} />

        <Box
          ref={trackRef}
          sx={{
            display: "flex", gap: 2.5,
            py: 2.5, px: 3,
            width: "max-content",
            willChange: "transform",
          }}
        >
          {doubled.map((item, i) => (
            <TestimonialCard key={i} item={item} />
          ))}
        </Box>
      </Box>
    </Box>
  );
}