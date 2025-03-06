import React, { useState } from "react";
import { Card, Rate, Progress, Tag } from "antd";
import { format } from "date-fns";
import "./MovieCard.css";

const MovieCard = ({
  title,
  rating,
  releaseDate,
  genre = [],
  description,
  imageUrl,
}) => {
  const progressPercent = (rating / 10) * 100;

  const getProgressColor = (percent) => {
    if (percent < 30) return "#E90000";
    if (percent < 50) return "#E97E00";
    if (percent < 70) return "#E9D100";
    return "#66E900";
  };

  const [userRating, setUserRating] = useState(0);

  const handleRatingChange = (value) => {
    setUserRating(value);
  };

  const formattedReleaseDate = releaseDate
    ? format(new Date(releaseDate), "MMMM dd,  yyyy")
    : "Дата не указана";

  return (
    <Card className="card" style={{ padding: 0 }}>
      <div className="card-content">
        <img src={imageUrl} alt="Placeholder" className="card-image" />
        <div className="card-info">
          <div className="card-title">
            <h3>{title}</h3>
            <Progress
              type="circle"
              percent={progressPercent}
              strokeColor={getProgressColor(progressPercent)}
              format={() => `${rating}`}
              size={40}
            />
          </div>
          <p className="card-rating">{formattedReleaseDate}</p>
          <div className="card-genre">
            {genre.map((genre, index) => (
              <Tag key={index} color="grey" style={{ marginBottom: "4px" }}>
                {genre}
              </Tag>
            ))}
          </div>
          <p className="card-description">{description}</p>
          <Rate
            value={userRating}
            onChange={handleRatingChange}
            count={10}
            className="stars-rating"
          />
        </div>
      </div>
    </Card>
  );
};

export default MovieCard;
