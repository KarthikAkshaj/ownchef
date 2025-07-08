// src/lib/types/recipe.ts - Recipe Type Definitions

// ========================================
// CORE RECIPE TYPES
// ========================================

export interface Recipe {
    id: number;
    title: string;
    slug: string;
    description: string;
    content: string;
    cookTime: number;
    prepTime: number;
    servings: number;
    difficulty: DifficultyLevel;
    featuredImage: string | null;
    isPublished: boolean;
    authorId: string;
    categoryId: number | null;
    cuisineId: number | null;
    views: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface Ingredient {
    id: string;
    name: string;
    amount: string;
    unit: string;
    notes?: string;
    recipeId?: number;
    sortOrder?: number;
}

export interface Instruction {
    id: string;
    stepNumber: number;
    title: string;
    content: string;
    image?: string;
    timer?: number;
    recipeId?: number;
}

export interface RecipeImage {
    id: number;
    recipeId: number;
    url: string;
    alt: string | null;
    caption: string | null;
    sortOrder: number;
    createdAt: Date;
}

export interface RecipeTag {
    id: number;
    recipeId: number;
    tagId: number;
    tag?: Tag;
}

export interface Tag {
    id: number;
    name: string;
    slug: string;
    color: string | null;
    isActive: boolean;
    sortOrder: number;
    createdAt: Date;
}

export interface RecipeTip {
    id: number;
    recipeId: number;
    content: string;
    sortOrder: number;
    createdAt: Date;
}

// ========================================
// RECIPE RELATIONS
// ========================================

export interface Category {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    image: string | null;
    color: string | null;
    sortOrder: number;
    isActive: boolean;
    createdAt: Date;
}

export interface Cuisine {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    image: string | null;
    color: string | null;
    sortOrder: number;
    isActive: boolean;
    createdAt: Date;
}

export interface User {
    id: string;
    username: string;
    email: string | null;
    firstName: string | null;
    lastName: string | null;
    bio: string | null;
    profileImage: string | null;
    location: string | null;
    website: string | null;
    createdAt: Date;
    updatedAt: Date;
}

// ========================================
// RECIPE WITH FULL RELATIONS
// ========================================

export interface RecipeWithRelations extends Recipe {
    author: User;
    category: Category | null;
    cuisine: Cuisine | null;
    ingredients: Ingredient[];
    instructions: Instruction[];
    images: RecipeImage[];
    tags: (RecipeTag & { tag: Tag })[];
    tips: RecipeTip[];
    stats: RecipeStats;
}

export interface RecipeStats {
    views: number;
    likes: number;
    ratings: number;
    averageRating: number;
    comments: number;
    shares: number;
}

// ========================================
// FORM AND INPUT TYPES
// ========================================

export interface RecipeFormInput {
    title: string;
    description: string;
    content: string;
    cookTime: number;
    prepTime: number;
    servings: number;
    difficulty: DifficultyLevel;
    categoryId: number | null;
    cuisineId: number | null;
    ingredients: IngredientInput[];
    instructions: InstructionInput[];
    tags: string[];
    tips: string[];
    featuredImage: string | null;
    isPublished: boolean;
}

export interface IngredientInput {
    id: string;
    name: string;
    amount: string;
    unit: string;
    notes?: string;
}

export interface InstructionInput {
    id: string;
    stepNumber: number;
    title: string;
    content: string;
    image?: string;
    timer?: number;
}

// ========================================
// ENUMS AND CONSTANTS
// ========================================

export type DifficultyLevel = 'Easy' | 'Medium' | 'Hard';

export const DIFFICULTY_LEVELS: DifficultyLevel[] = ['Easy', 'Medium', 'Hard'];

export const DIFFICULTY_COLORS = {
    Easy: 'green',
    Medium: 'yellow',
    Hard: 'red'
} as const;

export const MEASUREMENT_UNITS = [
    // Volume
    'cup', 'tbsp', 'tsp', 'ml', 'l', 'fl oz', 'pt', 'qt', 'gal',
    // Weight
    'g', 'kg', 'oz', 'lb',
    // Count
    'piece', 'slice', 'clove', 'pinch', 'dash',
    // Specialty
    'can', 'jar', 'package', 'bunch', 'head'
] as const;

export type MeasurementUnit = typeof MEASUREMENT_UNITS[number];

// ========================================
// API RESPONSE TYPES
// ========================================

export interface RecipeListResponse {
    recipes: RecipeWithRelations[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
    filters: {
        category?: string;
        cuisine?: string;
        difficulty?: DifficultyLevel;
        author?: string;
        search?: string;
    };
}

export interface RecipeCreateResponse {
    recipe: RecipeWithRelations;
    message: string;
    redirect?: string;
}

export interface RecipeUpdateResponse {
    recipe: RecipeWithRelations;
    message: string;
    changes: string[];
}

// ========================================
// SEARCH AND FILTER TYPES
// ========================================

export interface RecipeSearchParams {
    query?: string;
    category?: string;
    cuisine?: string;
    difficulty?: DifficultyLevel;
    author?: string;
    tags?: string[];
    cookTimeMax?: number;
    prepTimeMax?: number;
    servingsMin?: number;
    servingsMax?: number;
    page?: number;
    limit?: number;
    sortBy?: RecipeSortOption;
    sortOrder?: 'asc' | 'desc';
}

export type RecipeSortOption =
    | 'title'
    | 'createdAt'
    | 'updatedAt'
    | 'views'
    | 'rating'
    | 'cookTime'
    | 'prepTime'
    | 'difficulty';

export interface RecipeFilters {
    categories: Category[];
    cuisines: Cuisine[];
    difficulties: DifficultyLevel[];
    tags: Tag[];
    authors: Pick<User, 'id' | 'username' | 'firstName' | 'lastName'>[];
}

// ========================================
// RATING AND REVIEW TYPES
// ========================================

export interface RecipeRating {
    id: number;
    recipeId: number;
    userId: string;
    rating: number; // 1-5
    review: string | null;
    isPublic: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface RecipeComment {
    id: number;
    recipeId: number;
    userId: string;
    parentId: number | null;
    content: string;
    isPublic: boolean;
    createdAt: Date;
    updatedAt: Date;
    author: Pick<User, 'id' | 'username' | 'firstName' | 'lastName' | 'profileImage'>;
    replies?: RecipeComment[];
}

// ========================================
// RECIPE COLLECTION TYPES
// ========================================

export interface RecipeCollection {
    id: number;
    name: string;
    description: string | null;
    isPublic: boolean;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface RecipeCollectionItem {
    id: number;
    collectionId: number;
    recipeId: number;
    addedAt: Date;
    recipe?: Recipe;
}

// ========================================
// NUTRITION TYPES (Future Enhancement)
// ========================================

export interface NutritionInfo {
    calories?: number;
    protein?: number; // grams
    carbohydrates?: number; // grams
    fat?: number; // grams
    fiber?: number; // grams
    sugar?: number; // grams
    sodium?: number; // milligrams
    cholesterol?: number; // milligrams
    servingSize?: string;
}

export interface RecipeNutrition {
    id: number;
    recipeId: number;
    perServing: NutritionInfo;
    total: NutritionInfo;
    lastCalculated: Date;
}

// ========================================
// HELPER TYPES
// ========================================

export type RecipeStatus = 'draft' | 'published' | 'archived';

export interface RecipeDraft {
    id: string;
    userId: string;
    data: RecipeFormInput;
    lastSaved: Date;
    autoSaved: boolean;
}

export interface RecipeImportData {
    source: 'url' | 'text' | 'file';
    data: string;
    parsed?: Partial<RecipeFormInput>;
    errors?: string[];
}

// ========================================
// EVENT TYPES
// ========================================

export interface RecipeEvent {
    type: 'created' | 'updated' | 'published' | 'unpublished' | 'deleted' | 'viewed';
    recipeId: number;
    userId?: string;
    timestamp: Date;
    metadata?: Record<string, any>;
}

// ========================================
// VALIDATION TYPES
// ========================================

export interface ValidationError {
    field: string;
    message: string;
    code: string;
}

export interface RecipeValidationResult {
    valid: boolean;
    errors: ValidationError[];
    warnings: ValidationError[];
}

// ========================================
// EXPORT TYPES
// ========================================

export interface RecipeExportFormat {
    format: 'json' | 'pdf' | 'txt' | 'markdown';
    includeImages: boolean;
    includeNutrition: boolean;
    template?: string;
}

export interface RecipeExportData {
    recipe: RecipeWithRelations;
    format: RecipeExportFormat;
    generatedAt: Date;
    url?: string;
}

// ========================================
// TYPE GUARDS
// ========================================

export function isValidDifficulty(value: string): value is DifficultyLevel {
    return DIFFICULTY_LEVELS.includes(value as DifficultyLevel);
}

export function isValidMeasurementUnit(value: string): value is MeasurementUnit {
    return MEASUREMENT_UNITS.includes(value as MeasurementUnit);
}

export function isRecipeWithRelations(recipe: any): recipe is RecipeWithRelations {
    return recipe &&
        typeof recipe.id === 'number' &&
        typeof recipe.title === 'string' &&
        Array.isArray(recipe.ingredients) &&
        Array.isArray(recipe.instructions);
}