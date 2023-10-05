import React, { useState, useEffect } from "react";
import YouTube from "react-youtube";
import axios from "../axios";
import "./Row.scss";
import { API_KEY } from "../request";
// import movieTrailer from "movie-trailer";
const movieTrailer = require("movie-trailer");
const base_url = "https://image.tmdb.org/t/p/original";

type Props = {
  title: string;
  fetchUrl: string;
  isLargeRow?: boolean;
};

type Movie = {
  id: string;
  name: string;
  title: string;
  original_name: string;
  poster_path: string;
  backdrop_path: string;
};

//trailerのoption
type Options = {
  height: string;
  width: string;
  playerVars: {
    autoplay: 0 | 1 | undefined;
  };
};


export const Row = ({ title, fetchUrl, isLargeRow }: Props) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [trailerUrl, setTrailerUrl] = useState<string | null>("");

  useEffect(() => {
    async function fetchData() {
      const request = await axios.get(fetchUrl);
      setMovies(request.data.results);
      return request;
    }
    fetchData();
  }, [fetchUrl]);

  console.log(movies);

  const opts: Options = {
    height: "390",
    width: "640",
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 1,
    },
  };

  const handleClick = async (movie: Movie) => {
    if (trailerUrl) {
      setTrailerUrl("");
    } else {
      try {
        let trailerurl = await axios.get(`/movie/${movie.id}/videos?api_key=`+ API_KEY);
        console.log('trailerurl')
        console.log(trailerurl)
        setTrailerUrl(trailerurl.data.results[0]?.key);
      } catch (e) {
        console.log(e);
      } finally {
        console.log("例外実行");
      }
    }
      movieTrailer(movie?.name || movie?.title || movie?.original_name || "")
        .then((url: string) => {
          console.log('url')
          console.log(url)
          // urlが存在する場合に検索を実施
          if(url){
            const urlParams = new URLSearchParams(new URL(url).search);
            setTrailerUrl(urlParams.get("v"));
          }
        })


  };

  return(
    <div className="Row">
      <h2>{title}</h2>
      <div className="Row-posters">
        {/* ポスターコンテンツ */}
        {movies.map((movie, i) => (
          <img
            key={movie.id}
            className={`Row-poster ${isLargeRow && "Row-poster-large"}`}
            src={`${base_url}${
              isLargeRow ? movie.poster_path : movie.backdrop_path
            }`}
            alt={movie.name}
            onClick={() => handleClick(movie)}
          />
        ))}
      </div>
      {trailerUrl && <YouTube videoId={trailerUrl} opts={opts} />}
    </div>
  );
};