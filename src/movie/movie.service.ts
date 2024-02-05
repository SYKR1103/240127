import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Movie } from './entities/movie.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { OrderConstraint } from '../constraint/order.constraint';
import { PageMetaDto } from '../dtos/page-meta.dto';
import { PageDto } from '../dtos/page.dto';

@Injectable()
export class MovieService {
  //constructor 작성
  constructor(
    @InjectRepository(Movie)
    private movieRepo: Repository<Movie>,
    private httpService: HttpService,
    private configService: ConfigService,
  ) {}

  //createmovie함수 작성
  async createMovie() {
    //httpservice, configservice사용하여 data, status 갖고오기

    const { data, status } = await this.httpService
      .get(this.configService.get('TMDB_URL'), {
        headers: { Authorization: this.configService.get('TMDB_KEY') },
      })
      .toPromise();

    //status가 ok이면 그때 result data가져오고, 빈 어레이 무비 함수로 정의
    if (status === 200) {
      const datas = data.results;
      const movieData = [];
      datas.map((data) =>
        movieData.push({
          title: data['title'],
          overview: data['overview'],
          release_data: data['release_data'],
          adult: data['adult'],
          vote_average: data['vote_average'],
        }),
      );

      //최종값으로 무비데이터 세이브하기
      return await this.movieRepo.save(movieData);
    }
  }

  //getAllMoview 함수 작성하기. 파라미터는 pageoptionsddto,
  async getAllMovies(pageOptionDto) {
    //repo에서 createquerybuilder 사용하여 querybuilder생성
    const querybuilder = await this.movieRepo.createQueryBuilder('movie');

    //querybuilder를 option의 order, skip, take를 적용
    await querybuilder
      .orderBy('movie.createdAt', pageOptionDto.order)
      .skip(pageOptionDto.skip)
      .take(pageOptionDto.take);

    //itemcount querybuilder와 getcount
    const itemCount = await querybuilder.getCount();

    //entities querybuilder와 getraw
    const { entities } = await querybuilder.getRawAndEntities();

    //pageMetaDto 새로 설정하기 new 사용해서
    const pageMega = new PageMetaDto({ pageOptionDto, itemCount });
    // 리턴 : new사용해서
    return new PageDto(entities, pageMega);
  }
}
