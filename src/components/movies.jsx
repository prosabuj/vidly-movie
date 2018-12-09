import React, { Component } from "react";
import MoviesTable from "./moviesTable";
import ListGroup from "./common/listGroup";
import Pagination from "./common/pagination";
import { paginate } from "../utils/paginate";
import { getMovies } from "../services/fakeMovieService";
import { getGenres } from "../services/fakeGenreService";
import _ from "lodash";

class movies extends Component {
  state = {
    movies: [],
    genre: [],
    currentPage: 1,
    pageSize: 4,
    sortColumn: { path: "title", order: "asc" }
  };

  componentDidMount() {
    const genres = [{ _id: "", name: "All Genre" }, ...getGenres()];
    this.setState({ movies: getMovies(), genre: genres });
  }

  handleDelete = movie => {
    const movies = this.state.movies.filter(m => m._id !== movie._id);
    this.setState({ movies: movies });
  };

  handleLike = movie => {
    const movies = [...this.state.movies];
    const index = movies.indexOf(movie);
    movies[index] = { ...movies[index] };
    movies[index].liked = !movies[index].liked;
    this.setState({ movies });
  };

  handlePageChange = page => {
    this.setState({ currentPage: page });
  };

  handleGenreSelect = genre => {
    this.setState({ selectedGenre: genre, currentPage: 1 });
  };

  handleSort = sortColumn => {
    this.setState({ sortColumn });
  };

  getPagedData = () => {
    const {
      currentPage,
      sortColumn,
      pageSize,
      selectedGenre,
      movies: allMovies
    } = this.state;
    const filtered =
      selectedGenre && selectedGenre._id
        ? allMovies.filter(m => m.genre._id === selectedGenre._id)
        : allMovies;

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

    const movies = paginate(sorted, currentPage, pageSize);

    return { totalCount: filtered.length, data: movies};
  }

  render() {
    const { length: count } = this.state.movies;
    const {
      currentPage,
      sortColumn,
      pageSize
    } = this.state;
    if (count === 0) return <p>There are no movie in the database</p>;

    const {totalCount, data: movies} = this.getPagedData()

    return (
      <div className="row">
        <div className="col-3">
          <ListGroup
            items={this.state.genre}
            onItemSelect={this.handleGenreSelect}
            selectedGenre={this.state.selectedGenre}
          />
        </div>
        <div className="col">
          <p>
            Showing {totalCount}{" "}
            {totalCount === 1 || totalCount === 0
              ? "Movie"
              : "Movies"}{" "}
            Item this List
          </p>
          <MoviesTable
            movies={movies}
            sortColumn={sortColumn}
            onDelete={this.handleDelete}
            onLike={this.handleLike}
            onSort={this.handleSort}
          />
          <Pagination
            itemsCount={totalCount}
            pageSize={pageSize}
            currentPage={currentPage}
            onPageChange={this.handlePageChange}
          />
        </div>
      </div>
    );
  }
}

export default movies;
