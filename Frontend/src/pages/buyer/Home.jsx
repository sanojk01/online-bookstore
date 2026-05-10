import {
  useState,
  useEffect,
  useCallback,
} from "react";

import {
  Box,
} from "@mui/material";

import { toast } from "react-toastify";

import API from "../../api/axios";

import HeroSection from "../../components/home/HeroSection";

import FeaturesSection from "../../components/home/FeaturesSection";

import ExploreBooksSection from "../../components/home/ExploreBooksSection";

import AboutUsSection from "../../components/home/AboutUsSection";

import TestimonialsSection from "../../components/home/TestimonialsSection";

import Footer from "../../components/home/Footer";

export default function Home() {

  const [books, setBooks] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [category, setCategory] =
    useState("all");

  const [sortBy, setSortBy] =
    useState("newest");

  const [page, setPage] =
    useState(1);

  const [total, setTotal] =
    useState(0);

  const [pages, setPages] =
    useState(1);

  const limit = 12;

  const fetchBooks =
  useCallback(async () => {

    try {

      setLoading(true);

      const params = {
        page,
        limit,
      };

      if (search.trim()) {
        params.search =
          search.trim();
      }

      // category filter
      if (category !== "all") {
        params.category =
          category;
      }

      const { data } =
        await API.get(
          "/books",
          { params }
        );

      let fetchedBooks =
        data.books || [];

      // Random books when ALL selected
      if (category === "all") {

        fetchedBooks =
          [...fetchedBooks].sort(
            () => Math.random() - 0.5
          );
      }

      setBooks(fetchedBooks);

      setTotal(
        data.total || 0
      );

      setPages(
        data.pages || 1
      );

    } catch {

      toast.error(
        "Failed to load books."
      );

    } finally {

      setLoading(false);
    }

  }, [
    search,
    category,
    page,
  ]);

  useEffect(() => {

    const timer =
      setTimeout(
        fetchBooks,
        search ? 400 : 0
      );

    return () =>
      clearTimeout(timer);

  }, [fetchBooks, search]);

  const handleSearch = (e) => {

    setSearch(e.target.value);

    setPage(1);
  };

  const handleCategory = (cat) => {

    setCategory(cat);

    setPage(1);
  };

  return (
    <Box
      sx={{
        bgcolor: "#f8fafc",

        minHeight: "100vh",
      }}
    >

      <HeroSection
        search={search}
        handleSearch={handleSearch}
      />

      <ExploreBooksSection
        books={books}
        loading={loading}
        total={total}
        pages={pages}
        page={page}
        setPage={setPage}
        search={search}
        category={category}
        handleCategory={handleCategory}
        setSearch={setSearch}
        setCategory={setCategory}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      <AboutUsSection />

      <FeaturesSection />

      <TestimonialsSection />

      <Footer />

    </Box>
  );
}