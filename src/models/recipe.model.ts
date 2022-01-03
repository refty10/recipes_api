import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class Recipe extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  title: string;

  @property({
    type: 'string',
    required: true,
  })
  making_time: string;

  @property({
    type: 'string',
    required: true,
  })
  serves: string;

  @property({
    type: 'string',
    required: true,
  })
  ingredients: string;

  @property({
    type: 'number',
    required: true,
  })
  cost: number;

  @property({
    type: 'date',
    defaultFn: 'now',
  })
  created_at: string;

  @property({
    type: 'date',
    defaultFn: 'now',
  })
  updated_at: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Recipe>) {
    super(data);
  }
}

export interface RecipeRelations {
  // describe navigational properties here
}

export type RecipeWithRelations = Recipe & RecipeRelations;
