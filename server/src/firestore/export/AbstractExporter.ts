import { AbstractEntity } from '../v1entities/utis/AbstractEntity';
import {Meta, V1Id, V2Service} from '../v1entities/utis/types';
import OrmProvider from '../v1services/OrmProvider';

export abstract class AbstractExporter<
  A extends V1Id,
  B extends AbstractEntity,
  C extends V2Service<A>,
> {
  constructor(
    protected firestoreService: OrmProvider,
    protected v2Service: C,
  ) {}

  abstract transform(input: A, meta: Meta): Promise<B>;

  async upsert(input: B): Promise<B> {
    await this.firestoreService.upsert(input);
    return input;
  }

  async onlyCreate(input: B): Promise<B> {
    await this.firestoreService.onlyCreate(input);
    return input;
  }

  async getMany(organisation: string): Promise<A[]> {
    const inputs = await this.v2Service.getMany({
      organisation,
    });
    return inputs.data;
  }

  async exportAll(meta: Meta, key?: string): Promise<B[]> {
    console.log('Exporting ' + key);
    const inputs = await this.getMany(meta.organisation);

    // console.log('inputs', inputs);

    const transformed = await Promise.all(
      inputs.map((s) => this.transform(s, meta)),
    );
    // console.log('transformed', transformed);
    if (meta.onlyCreate) {
      const upserted = await Promise.all(
        transformed.map((a) => this.onlyCreate(a)),
      );
      // console.log('upserted', upserted);
      console.log('Exporting Done ' + key);
      return upserted;
    } else {
      const upserted = await Promise.all(
        transformed.map((a) => this.upsert(a)),
      );
      // console.log('upserted', upserted);
      console.log('Exporting Done ' + key);
      return upserted;
    }
    const upserted = await Promise.all(transformed.map((a) => this.upsert(a)));
    // console.log('upserted', upserted);
    console.log('Exporting Done ' + key);
    return upserted;
  }

  async exportOne(id: string, meta: Meta): Promise<B> {
    const input: A = await this.v2Service.getOne({
      id,
      org: meta.organisation,
    });

    const transformed = await this.transform(input, meta);

    const res = await this.upsert(transformed);

    return res;
  }
}
