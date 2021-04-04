import "bootstrap/dist/css/bootstrap.css";
import Moment from "moment";
import { FaUser } from "react-icons/fa";
import StarRatingComponent from "react-star-rating-component";
import "@fortawesome/fontawesome-free/css/all.min.css";

function Review({ reviews }) {
  if (reviews) {
    return (
      <div>
        <h5>User reviews</h5>
        {reviews.map((c) => (
          <div key={c.id} style={{ marginTop: "20px" }}>
            <span style={{ display: "flex", alignItems: "center" }}>
              <FaUser></FaUser>
              <span style={{ marginLeft: "5px", color: "blue" }}>{c.user}</span>
            </span>
            <StarRatingComponent
              name="template rate"
              editing={false}
              starCount={5}
              value={c.rate}
              renderStarIcon={(index, value) => {
                return (
                  <span>
                    <i
                      className={index <= value ? "fas fa-star" : "far fa-star"}
                    />
                  </span>
                );
              }}
            />
            <div style={{ fontSize: "12px" }}>
              {" "}
              Reviewed on {Moment(c.created_at).format("MMM d, YYYY")}
            </div>
            <div>{c.review}</div>
          </div>
        ))}
      </div>
    );
  } else {
    return null;
  }
}

export default Review;
