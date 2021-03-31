import { title } from 'node:process';
import { getRepository, Repository } from 'typeorm';

import { User } from '../../../users/entities/User';
import { Game } from '../../entities/Game';

import { IGamesRepository } from '../IGamesRepository';

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    return this.repository
      .createQueryBuilder("games").where(`LOWER(title) LIKE :param`, { param:`%${param}%` }).getMany()
  }

  async countAllGames(): Promise<[{ count: string }]> {
    return this.repository.query(`SELECT COUNT(*) FROM GAMES`);
  }

  async findUsersByGameId(id: string): Promise<User[]> {
     const users = await this.repository.createQueryBuilder("games").relation("users").of(id).loadMany();

    return users
  }
}
