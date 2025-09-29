import { MealCategories } from "../common/enum/categories.enum.js";
import { Meal } from "../models/meal.schema.js";

const mockMeals = [
  {
    name: "Grilled Salmon",
    description:
      "Fresh Atlantic salmon grilled to perfection with herbs and lemon, served with steamed vegetables and quinoa.",
    calories: 420,
    ingredients: ["Salmon fillet", "Lemon", "Herbs", "Quinoa", "Vegetables"],
    categories: MealCategories.NON_VEGETARIAN,
  },
  {
    name: "Chicken Caesar Salad",
    description:
      "Crisp romaine lettuce with grilled chicken breast, parmesan, croutons, and Caesar dressing.",
    calories: 350,
    ingredients: [
      "Chicken breast",
      "Romaine lettuce",
      "Parmesan",
      "Croutons",
      "Caesar dressing",
    ],
    categories: MealCategories.NON_VEGETARIAN,
  },
  {
    name: "Spaghetti Bolognese",
    description:
      "A hearty serving of spaghetti with slow-cooked meat sauce topped with parmesan cheese.",
    calories: 600,
    ingredients: [
      "Spaghetti",
      "Ground beef",
      "Tomato sauce",
      "Parmesan cheese",
    ],
    categories: MealCategories.NON_VEGETARIAN,
  },
  {
    name: "Vegetable Stir Fry",
    description:
      "A mix of fresh vegetables sautéed in a light soy-garlic sauce served with steamed rice.",
    calories: 300,
    ingredients: [
      "Broccoli",
      "Bell peppers",
      "Carrots",
      "Soy sauce",
      "Garlic",
      "Rice",
    ],
    categories: MealCategories.VEGAN,
  },
  {
    name: "Beef Tacos",
    description:
      "Soft tortillas filled with seasoned beef, lettuce, tomato, and basil topped with cheese.",
    calories: 450,
    ingredients: ["Beef", "Tortillas", "Lettuce", "Tomato", "Basil", "Cheese"],
    categories: MealCategories.NON_VEGETARIAN,
  },
  {
    name: "Margherita Pizza",
    description:
      "Classic pizza topped with fresh tomatoes, mozzarella, and basil leaves on a thin crust.",
    calories: 500,
    ingredients: ["Fresh tomatoes", "Mozzarella", "Basil", "Pizza dough"],
    categories: MealCategories.VEGETARIAN,
  },
  {
    name: "Chocolate Brownies",
    description:
      "Rich and fudgy chocolate brownies topped with chocolate chips and a sprinkle of powdered sugar.",
    calories: 380,
    ingredients: ["Chocolate", "Butter", "Sugar", "Eggs", "Flour"],
    categories: MealCategories.VEGETARIAN,
  },
  {
    name: "Fruit Smoothie",
    description:
      "Refreshing blend of mixed fruits with yogurt and honey for a natural sweet taste.",
    calories: 200,
    ingredients: ["Mixed berries", "Banana", "Yogurt", "Honey"],
    categories: MealCategories.VEGAN,
  },
];

export const addMockMeals = async () => {
  try {
    await Meal.deleteMany();
    for (let {
      name,
      description,
      calories,
      ingredients,
      categories,
    } of mockMeals) {
      const meal = new Meal({
        name,
        description,
        calories,
        ingredients,
        categories,
      });
      await meal.save();
    }
    return { success: true, message: "Mock meals seeded successfully" };
  } catch (error) {
    throw error;
  }
};
