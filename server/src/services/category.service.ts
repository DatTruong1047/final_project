import { CategoryListType, ResultType } from '@app/models';
import CategoryRepository from '@app/repositories/category.repository';

export default class CategoryService {
  private readonly _categoryRepository: CategoryRepository;
  constructor() {
    this._categoryRepository = new CategoryRepository();
  }

  async getCategoryList(): Promise<ResultType<CategoryListType>> {
    const categoryList = await this._categoryRepository.getCategoryList();

    return {
      code: 200,
      message: 'Category list fetched successfully',
      data: categoryList,
      success: true,
    };
  }
}
