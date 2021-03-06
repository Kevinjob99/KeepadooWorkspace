import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Movie } from '../movies/state/models/movie';
import { MoviesQuery } from '../movies/state/movies.query';
import { MoviesService } from '../movies/state/movies.service';
import { MoviesList } from '../state/models/movies-list';
import { MoviesListsQuery } from '../state/movies-lists.query';
import { MoviesListsService } from '../state/movies-lists.service';

@Component({
  selector: 'keepadoo-movies-list-details',
  templateUrl: './movies-list-details.component.html',
  styleUrls: ['./movies-list-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoviesListDetailsComponent implements OnInit {
  movies$: Observable<Movie[]>;
  selectedList$: Observable<MoviesList>;
  editMode$: Observable<boolean>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private moviesListsService: MoviesListsService,
    private moviesService: MoviesService,
    private moviesQuery: MoviesQuery,
    private moviesListQuery: MoviesListsQuery
  ) {}

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      const listId = params.get('id');
      this.moviesListsService.setActive(listId);
    });

    this.movies$ = this.moviesQuery.selectAll();
    this.selectedList$ = this.moviesListQuery.selectActive() as Observable<
      MoviesList
    >;
    this.editMode$ = this.moviesQuery
      .select()
      .pipe(map(state => state.editMode));
  }

  edit(): void {
    this.moviesService.enableEditMode();
  }

  done(): void {
    this.moviesService.disableEditMode();
  }

  async deleteMovie(movie: Movie) {
    this.moviesService.deleteMovie(movie);
  }
}
