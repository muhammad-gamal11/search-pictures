import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import Photo from "./Photo";

const mainUrl = `https://api.unsplash.com/photos/`;
const searchUrl = `https://api.unsplash.com/search/photos/`;
// from unsplash
let key = "mAXE72iIo_rEojpwBws-Xr5i0u9rMvB-AKtHXePNIpc";
let clientID = `?client_id=${key}`;

function App() {
  const [loading, setLoading] = useState(true); // Set loading state to true initially
  const [photos, setPhotos] = useState([]);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");

  const fetchImages = async () => {
    setLoading(true); // Set loading state to true before fetching
    let url;
    const urlPage = `&page=${page}`;
    const urlQuery = `&query=${query}`;

    if (query) {
      url = `${searchUrl}${clientID}${urlPage}${urlQuery}`;
    } else {
      url = `${mainUrl}${clientID}${urlPage}`;
    }

    try {
      const response = await fetch(url);
      const data = await response.json();
      // console.log(data);
      if (page === 1) {
        setPhotos(data.results || []);
      } else {
        setPhotos((oldPhotos) => [...oldPhotos, ...(data.results || [])]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false); // Set loading state to false after fetching
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setPage(1); // Reset page to 1 when submitting a new query
    setPhotos([]); // Clear photos when submitting a new query
    fetchImages();
  };

  useEffect(() => {
    fetchImages();
  }, [page]); // Fetch images on initial render only

  useEffect(() => {
    const handleScroll = () => {
      if (
        !loading &&
        window.innerHeight + window.scrollY >= document.body.scrollHeight - 2
      ) {
        setPage((prevPage) => prevPage + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading]); // Re-add event listener when loading state changes

  return (
    <main>
      <section className="search">
        <form className="search-form" onSubmit={handleSubmit}>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            type="text"
            placeholder="search For Pictures.."
            className="form-input"
          />
          <button type="submit" className="submit-btn">
            <FaSearch />
          </button>
        </form>
      </section>
      <section className="photos">
        {loading && <h2 className="loading">Loading...</h2>}
        <div className="photos-center">
          {photos.map((image, index) => (
            <Photo key={index} {...image} />
          ))}
        </div>
      </section>
    </main>
  );
}

export default App;
