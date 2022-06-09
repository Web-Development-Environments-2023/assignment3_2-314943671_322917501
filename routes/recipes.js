var express = require("express");
var router = express.Router();
const recipes_utils = require("./utils/recipes_utils");
const search_utils = require("./utils/search_utils");
const user_utils = require("./utils/user_utils");
const DButils = require("./utils/DButils");

/**
 * Authenticate all incoming requests by middleware
 */
 router.use(async function (req, res, next) {
  if (req.session && req.session.user_id) {
    DButils.execQuery("SELECT username FROM users").then((users) => {
      if (users.find((x) => x.username === req.session.user_id)) {
        req.user_id = req.session.user_id;
        next();
      }
    }).catch(err => next(err));
  } else {
    next();
  }
});


router.get("/", (req, res) => res.send("im here"));

/**
 * This path returns 3 random preview recipes
 */
router.get("/random", async (req, res, next) => {
  try {
    let random_3_recipes = await recipes_utils.getRandomThreeRecipes();
    res.send(random_3_recipes);
  } catch(error) {
    next(error);
  }
});


/**
 * This path returns a full details of a recipe by its id
 */
router.get("/:recipeId", async (req, res, next) => {
  try {
    const recipe = await recipes_utils.getRecipeDetails(req.params.recipeId);
    const user_id = req.session.user_id;
    const recipe_id = req.params.recipeId;
    //console.log(user_id); /////////////
    //console.log(recipe_id); ///////////////
    const recipes_id = await user_utils.getWatchedRecipes(user_id);
    let recipes_id_array = [];
    recipes_id.map((element) => recipes_id_array.push(element.recipe_id));
    //console.log(recipes_id_array)
    if(!recipes_id_array.includes(recipe_id)) {
      await user_utils.markAsWatched(user_id,recipe_id);
    }
    res.send(recipe);
  } catch (error) {
    next(error);
  }
});

/**
 * Search for recipes by a search query.
 * Will return results from spooncular API, according to number param.
 * Result will be preview recipe.
 */
router.get("/search/query/:searchQuery/amount/:num", async (req, res, next) => {
  const {searchQuery, num} = req.params;
  //set serach params
  search_params = {};
  search_params.query = searchQuery;
  search_params.number = num;
  search_params.instructionsRequired = true;
  search_params.apiKey = process.env.spooncular_apiKey;

  //gives a default num
  if (num != 5 && num != 10 && num != 15) {
    search_params.number = 5;
  }
  //check if query params exists (cuisine / diet / intolerances) and add them to serach_params
  search_utils.extarctQueryParams(req.query, search_params);
  search_utils.searchForRecipes(search_params)
  .then((recipes) => res.send(recipes))
  .catch((err) => {
    next(err);
  })
});

module.exports = router;
