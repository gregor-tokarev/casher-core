import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { ProductSearchItem } from '@core/entities/product.entity';

@Injectable()
export class SearchService {
  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async addToIndex(index: string, body: Record<string, any>): Promise<void> {
    await this.elasticsearchService.index({
      index,
      body,
    });
  }

  async updateInIndex(index: string, id: string, body: Record<string, any>) {
    const script = Object.entries(body).reduce((result, [key, value]) => {
      return `${result} ctx._source.${key}='${value}';`;
    }, '');

    await this.elasticsearchService.updateByQuery({
      index,
      body: {
        query: { match: { id } },
        script,
      },
    });
  }

  async deleteFromIndex(index: string, id: string): Promise<void> {
    await this.elasticsearchService.deleteByQuery({
      index,
      body: {
        query: { match: { id } },
      },
    });
  }

  async search(
    index: string,
    text: string,
    fields: string[],
  ): Promise<ProductSearchItem[]> {
    const { hits } = await this.elasticsearchService.search<ProductSearchItem>({
      index: index,
      query: {
        multi_match: {
          query: text,
          fields,
        },
      },
    });

    return hits.hits.map((item) => item._source);
  }
}
