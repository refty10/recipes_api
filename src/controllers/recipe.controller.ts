import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {Recipe} from '../models';
import {RecipeRepository} from '../repositories';

import _ from 'lodash';

export class ResipeController {
  constructor(
    @repository(RecipeRepository)
    public recipeRepository: RecipeRepository,
  ) {}

  @post('/recipes')
  @response(200, {
    description: 'Recipe model instance',
    content: {'application/json': {schema: getModelSchemaRef(Recipe)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Recipe, {
            title: 'NewRecipe',
            exclude: ['id'],
          }),
        },
      },
    })
    recipe: Omit<Recipe, 'id'>,
  ): Promise<any> {
    const res = await this.recipeRepository.create(recipe);
    return {
      message: 'Recipe successfully created!',
      recipe: [res],
    };
  }

  @get('/recipes/count')
  @response(200, {
    description: 'Recipe model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Recipe) where?: Where<Recipe>): Promise<Count> {
    return this.recipeRepository.count(where);
  }

  @get('/recipes')
  @response(200, {
    description: 'Array of Recipe model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Recipe, {includeRelations: true}),
        },
      },
    },
  })
  async find(@param.filter(Recipe) filter?: Filter<Recipe>): Promise<any> {
    const res = await this.recipeRepository.find(filter);
    return {
      recipes: res.map(e => _.omit(e, ['created_at', 'updated_at'])),
    };
  }

  @patch('/recipes')
  @response(200, {
    description: 'Recipe PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Recipe, {partial: true}),
        },
      },
    })
    recipe: Recipe,
    @param.where(Recipe) where?: Where<Recipe>,
  ): Promise<Count> {
    return this.recipeRepository.updateAll(recipe, where);
  }

  @get('/recipes/{id}')
  @response(200, {
    description: 'Recipe model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Recipe, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Recipe, {exclude: 'where'})
    filter?: FilterExcludingWhere<Recipe>,
  ): Promise<any> {
    const res = await this.recipeRepository.findById(id, filter);
    return {
      message: 'Recipe details by id',
      recipe: [_.omit(res, ['created_at', 'updated_at'])],
    };
  }

  @patch('/recipes/{id}')
  @response(204, {
    description: 'Recipe PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Recipe, {partial: true}),
        },
      },
    })
    recipe: Recipe,
  ): Promise<any> {
    await this.recipeRepository.updateById(id, recipe);
    const res = await this.recipeRepository.findById(id);
    return {
      message: 'Recipe successfully updated!',
      recipe: [_.omit(res, ['id', 'created_at', 'updated_at'])],
    };
  }

  @put('/recipes/{id}')
  @response(204, {
    description: 'Recipe PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() recipe: Recipe,
  ): Promise<void> {
    await this.recipeRepository.replaceById(id, recipe);
  }

  @del('/recipes/{id}')
  @response(204, {
    description: 'Recipe DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<any> {
    try {
      await this.recipeRepository.deleteById(id);
      return {message: 'Recipe successfully removed!'};
    } catch (error) {
      return {message: 'No Recipe found'};
    }
  }
}
