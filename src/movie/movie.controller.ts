import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { MovieService } from './movie.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { PageOptionsDto } from '../dtos/page-options.dto';

@Controller('movie')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Post()
  async createMovies() {
    return await this.movieService.createMovie();
  }

  @Get('/all')
  async getAllMovies(@Query() pageOptionDto: PageOptionsDto) {
    return await this.movieService.getAllMovies(pageOptionDto);
  }
}
