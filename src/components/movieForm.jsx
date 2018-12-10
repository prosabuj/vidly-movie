import React from "react";

const movieForm = ({ match, history }) => {
  return (
    <div>
      <h1>Movie Form: {match.params.id}</h1>
      <button
        onClick={() => history.push("/movies")}
        className="btn btn-primary"
      >
        Save
      </button>
    </div>
  );
};

export default movieForm;
