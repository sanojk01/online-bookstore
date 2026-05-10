// src/components/home/Footer.jsx

import { Box, Container, Grid, Typography } from "@mui/material";
import { Facebook, Instagram, Twitter, LinkedIn } from "@mui/icons-material";

const socialLinks = [
  { icon: <Facebook sx={{ fontSize: 17 }} />, label: "Facebook", color: "#4f9ef8" },
  { icon: <Instagram sx={{ fontSize: 17 }} />, label: "Instagram", color: "#f06292" },
  { icon: <Twitter sx={{ fontSize: 17 }} />, label: "Twitter", color: "#4fc3f7" },
  { icon: <LinkedIn sx={{ fontSize: 17 }} />, label: "LinkedIn", color: "#5c9ce6" },
];

const quickLinks = ["Home", "Books", "Categories", "Contact"];
const categories = ["Fiction", "Science", "Technology", "History"];
const stats = [
  { value: "50K+", label: "Books", gradient: "linear-gradient(135deg, #38bdf8, #818cf8)" },
  { value: "10K+", label: "Readers", gradient: "linear-gradient(135deg, #a78bfa, #f472b6)" },
  { value: "200+", label: "Authors", gradient: "linear-gradient(135deg, #34d399, #38bdf8)" },
];

export default function Footer() {
  return (
    <Box
      sx={{
        position: "relative",
        bgcolor: "#080d14",
        color: "#fff",
        overflow: "hidden",
        "@keyframes drift": {
          "0%,100%": { transform: "translate(0,0) scale(1)" },
          "33%": { transform: "translate(30px,-20px) scale(1.05)" },
          "66%": { transform: "translate(-20px,15px) scale(0.97)" },
        },
        "@keyframes pulse": {
          "0%,100%": { opacity: 1 },
          "50%": { opacity: 0.4 },
        },
      }}
    >
      {/* Background orbs */}
      {[
        { top: "-80px", left: "10%", size: "500px", color: "rgba(56,189,248,0.07)", dur: "14s" },
        { bottom: "-100px", right: "5%", size: "420px", color: "rgba(167,139,250,0.06)", dur: "18s", reverse: true },
        { top: "40%", left: "50%", size: "300px", color: "rgba(251,113,133,0.04)", dur: "22s", delay: "4s" },
      ].map((orb, i) => (
        <Box key={i} sx={{
          position: "absolute", pointerEvents: "none",
          top: orb.top, bottom: orb.bottom, left: orb.left, right: orb.right,
          width: orb.size, height: orb.size, borderRadius: "50%",
          background: `radial-gradient(circle, ${orb.color} 0%, transparent 65%)`,
          animation: `drift ${orb.dur} ease-in-out infinite ${orb.delay || ""} ${orb.reverse ? "reverse" : ""}`,
        }} />
      ))}

      {/* Top shimmer line */}
      <Box sx={{
        height: "1px",
        background: "linear-gradient(90deg, transparent 0%, rgba(56,189,248,0.7) 30%, rgba(167,139,250,0.7) 60%, transparent 100%)",
      }} />

      <Container maxWidth="xl" sx={{ pt: 7, pb: 0, position: "relative", zIndex: 1 }}>
        <Grid container spacing={4} alignItems="flex-start">

          {/* Brand */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
              <Box sx={{
                width: 42, height: 42, borderRadius: "13px",
                background: "linear-gradient(135deg, #38bdf8 0%, #818cf8 55%, #f472b6 100%)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "20px",
                boxShadow: "0 0 28px rgba(56,189,248,0.4), 0 0 60px rgba(129,140,248,0.15)",
              }}>📚</Box>
              <Typography sx={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontWeight: 900, fontSize: "1.35rem", letterSpacing: "-0.5px",
                background: "linear-gradient(90deg, #e2e8f0 0%, #94a3b8 100%)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>
                BookStore
              </Typography>
            </Box>

            <Typography sx={{
              color: "rgba(255,255,255,0.4)", lineHeight: 1.9, fontSize: "0.875rem",
              maxWidth: 270, mb: 3.5,
              fontFamily: "Georgia, serif", fontStyle: "italic",
            }}>
              Your trusted online bookstore with thousands of books across all categories. Discover, read, and grow.
            </Typography>

            {/* Glassy pill */}
            <Box sx={{
              display: "inline-flex", alignItems: "center", gap: 1.2,
              px: 2.2, py: 1.1, borderRadius: "999px",
              border: "1px solid rgba(56,189,248,0.2)",
              background: "rgba(56,189,248,0.05)", backdropFilter: "blur(12px)",
              cursor: "pointer", transition: "all 0.3s ease",
              "&:hover": {
                border: "1px solid rgba(56,189,248,0.45)",
                background: "rgba(56,189,248,0.1)",
                boxShadow: "0 0 24px rgba(56,189,248,0.15)",
              },
            }}>
              <Box sx={{
                width: 6, height: 6, borderRadius: "50%",
                bgcolor: "#38bdf8", boxShadow: "0 0 8px #38bdf8",
                animation: "pulse 2.5s ease-in-out infinite",
              }} />
              <Typography sx={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.55)", letterSpacing: "0.3px" }}>
                Stay updated with new arrivals
              </Typography>
            </Box>
          </Grid>

          {/* Navigation */}
          <Grid item xs={6} md={2}>
            <Typography sx={{
              fontSize: "0.62rem", fontWeight: 700, letterSpacing: "3px",
              textTransform: "uppercase", color: "rgba(255,255,255,0.22)", mb: 2.8,
            }}>Navigation</Typography>

            {quickLinks.map((item) => (
              <Box key={item} sx={{
                display: "flex", alignItems: "center", mb: 1.7, cursor: "pointer",
                "& .glow-dot": { width: 0, overflow: "hidden", transition: "all 0.25s ease", mr: 0 },
                "&:hover .glow-dot": { width: "14px", mr: "6px" },
                "&:hover .link-text": { color: "#38bdf8" },
                "&:hover": { transform: "translateX(3px)" },
                transition: "transform 0.25s ease",
              }}>
                <Box className="glow-dot" sx={{ display: "flex", alignItems: "center" }}>
                  <Box sx={{ width: 4, height: 4, borderRadius: "50%", bgcolor: "#38bdf8", boxShadow: "0 0 7px #38bdf8", flexShrink: 0 }} />
                </Box>
                <Typography className="link-text" sx={{
                  fontSize: "0.88rem", color: "rgba(255,255,255,0.5)", fontWeight: 500,
                  transition: "color 0.25s ease",
                }}>{item}</Typography>
              </Box>
            ))}
          </Grid>

          {/* Categories */}
          <Grid item xs={6} md={2}>
            <Typography sx={{
              fontSize: "0.62rem", fontWeight: 700, letterSpacing: "3px",
              textTransform: "uppercase", color: "rgba(255,255,255,0.22)", mb: 2.8,
            }}>Categories</Typography>

            {categories.map((item) => (
              <Box key={item} sx={{
                display: "flex", alignItems: "center", mb: 1.7, cursor: "pointer",
                "& .glow-dot": { width: 0, overflow: "hidden", transition: "all 0.25s ease", mr: 0 },
                "&:hover .glow-dot": { width: "14px", mr: "6px" },
                "&:hover .link-text": { color: "#a78bfa" },
                "&:hover": { transform: "translateX(3px)" },
                transition: "transform 0.25s ease",
              }}>
                <Box className="glow-dot" sx={{ display: "flex", alignItems: "center" }}>
                  <Box sx={{ width: 4, height: 4, borderRadius: "50%", bgcolor: "#a78bfa", boxShadow: "0 0 7px #a78bfa", flexShrink: 0 }} />
                </Box>
                <Typography className="link-text" sx={{
                  fontSize: "0.88rem", color: "rgba(255,255,255,0.5)", fontWeight: 500,
                  transition: "color 0.25s ease",
                }}>{item}</Typography>
              </Box>
            ))}
          </Grid>

          {/* Connect */}
          <Grid item xs={12} md={4}>
            <Typography sx={{
              fontSize: "0.62rem", fontWeight: 700, letterSpacing: "3px",
              textTransform: "uppercase", color: "rgba(255,255,255,0.22)", mb: 2.8,
            }}>Connect</Typography>

            {/* Social icon cards */}
            <Box sx={{ display: "flex", gap: 1.2, mb: 4 }}>
              {socialLinks.map(({ icon, label, color }, i) => (
                <Box key={i} title={label} sx={{
                  width: 44, height: 44, borderRadius: "12px",
                  border: "1px solid rgba(255,255,255,0.07)",
                  background: "rgba(255,255,255,0.03)",
                  backdropFilter: "blur(8px)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "rgba(255,255,255,0.45)", cursor: "pointer",
                  transition: "all 0.3s cubic-bezier(0.34,1.56,0.64,1)",
                  "&:hover": {
                    color: color,
                    borderColor: `${color}55`,
                    background: `${color}12`,
                    boxShadow: `0 0 22px ${color}35, 0 6px 16px rgba(0,0,0,0.35)`,
                    transform: "translateY(-5px) scale(1.1)",
                  },
                }}>
                  {icon}
                </Box>
              ))}
            </Box>

            {/* Stats card */}
            <Box sx={{
              display: "flex", borderRadius: "16px",
              border: "1px solid rgba(255,255,255,0.06)",
              background: "rgba(255,255,255,0.025)",
              backdropFilter: "blur(12px)",
              overflow: "hidden",
            }}>
              {stats.map(({ value, label, gradient }, i) => (
                <Box key={label} sx={{
                  flex: 1, py: 2.2, px: 1.5, textAlign: "center",
                  borderRight: i < stats.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                  transition: "background 0.25s ease",
                  cursor: "default",
                  "&:hover": { background: "rgba(255,255,255,0.04)" },
                }}>
                  <Typography sx={{
                    fontWeight: 800, fontSize: "1.15rem",
                    background: gradient,
                    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                    letterSpacing: "-0.5px",
                  }}>{value}</Typography>
                  <Typography sx={{
                    fontSize: "0.65rem", color: "rgba(255,255,255,0.28)",
                    letterSpacing: "1.5px", textTransform: "uppercase", mt: 0.4,
                  }}>{label}</Typography>
                </Box>
              ))}
            </Box>
          </Grid>

        </Grid>

        {/* Bottom bar */}
        <Box sx={{
          mt: 6, py: 2.5,
          borderTop: "1px solid rgba(255,255,255,0.05)",
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
        }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box sx={{
              width: 6, height: 6, borderRadius: "50%",
              bgcolor: "#34d399", boxShadow: "0 0 10px #34d399",
              animation: "pulse 3s ease-in-out infinite",
            }} />
            <Typography sx={{ fontSize: "0.77rem", color: "rgba(255,255,255,0.27)", letterSpacing: "0.2px" }}>
              © {new Date().getFullYear()} BookStore. All rights reserved.
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 3 }}>
            {["Privacy Policy", "Terms of Use", "Cookie Policy"].map((item) => (
              <Typography key={item} sx={{
                fontSize: "0.74rem", color: "rgba(255,255,255,0.24)", cursor: "pointer",
                letterSpacing: "0.2px", transition: "color 0.2s",
                "&:hover": { color: "rgba(255,255,255,0.65)" },
              }}>
                {item}
              </Typography>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}