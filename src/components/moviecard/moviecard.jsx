import React, { useContext, useState, useEffect } from "react";
import { Card, Rate, Progress, Tag } from "antd";
import { format } from "date-fns";
import { GenresContext } from "../genrescontext";
import "./moviecard.css";

const MovieCard = ({
  title,
  rating,
  releaseDate,
  genreIds,
  description,
  imageUrl,
  onRatingChange,
  userRating,
}) => {
  const { getMovieGenres } = useContext(GenresContext);
  const [localRating, setLocalRating] = useState(userRating || 0);

  useEffect(() => {
    console.log(`Initial userRating: ${userRating}`);
    console.log(`Initial localRating: ${localRating}`);
  }, [userRating, localRating]);

  const progressPercent = (rating / 10) * 100;

  const getProgressColor = (percent) => {
    if (percent < 30) return "#E90000";
    if (percent < 50) return "#E97E00";
    if (percent < 70) return "#E9D100";
    return "#66E900";
  };

  const formattedReleaseDate = releaseDate
    ? format(new Date(releaseDate), "MMMM dd, yyyy")
    : "No Release Date";

  const genreArray = getMovieGenres(genreIds);

  const handleRateChange = (value) => {
    console.log(`Rating changed to: ${value}`);
    setLocalRating(value);
    onRatingChange(value);
  };

  return (
    <Card className="card" style={{ padding: 0 }}>
      <div className="card-content">
        <img src={imageUrl} alt={title} className="card-image" />
        <div className="card-info">
          <div className="card-title">
            <h3 title={title}>{title}</h3>
            <Progress
              type="circle"
              percent={progressPercent}
              strokeColor={getProgressColor(progressPercent)}
              format={() => `${rating.toFixed(1)}`}
              size={40}
            />
          </div>
          <p className="card-rating">{formattedReleaseDate}</p>
          <div className="card-genre">
            {genreArray.map((genre, index) => (
              <Tag key={index} color="grey" style={{ marginBottom: "4px" }}>
                {genre}
              </Tag>
            ))}
          </div>
          <p className="card-description">{description}</p>
          <Rate
            value={localRating}
            onChange={handleRateChange}
            count={10}
            className="stars-rating"
          />
        </div>
      </div>
    </Card>
  );
};

export default MovieCard;
