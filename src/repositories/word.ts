import { EntityRepository, Repository } from 'typeorm';
import { WordInformation } from '../entity/Word';

export interface WordInformationParams {
  id?: number;
  word: string;
  pronunciation: string;
  change?: 'create' | 'update' | 'delete';
}

@EntityRepository(WordInformation)
export class WordInformationRepository extends Repository<WordInformation> {
  findAll() {
    return this.find({ order: { word: 'ASC' } });
  }

  async bulkUpdate(dictionary: WordInformationParams[]) {
    console.log({ dictionary });
    const deleteWordIds = dictionary
      .filter((word) => word.change && word.change === 'delete')
      .map((word) => word.id);

    if (deleteWordIds.length > 0) {
      await this.delete(deleteWordIds);
    }
    const createOrUpdateWords = dictionary
      .filter(
        (word) => word.change && ['create', 'update'].includes(word.change)
      )
      .map((word) => {
        const wordInfo = new WordInformation();
        wordInfo.id = word.id;
        wordInfo.word = word.word;
        wordInfo.pronunciation = word.pronunciation;
        return wordInfo;
      });

    if (createOrUpdateWords.length > 0) {
      await this.save(createOrUpdateWords);
    }
  }
}
