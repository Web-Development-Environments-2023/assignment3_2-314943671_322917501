var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const user_utils = require("./utils/user_utils");
const recipe_utils = require("./utils/recipes_utils");

/**
 * Authenticate all incoming requests by middleware
 */
router.use(async function (req, res, next) {
  if (req.session && req.session.user_id) {
    DButils.execQuery("SELECT username FROM users").then((users) => {
      if (users.find((x) => x.username === req.session.user_id)) { //if (users.find((x) => x.user_id === req.session.user_id)) {
        req.user_id = req.session.user_id;
        next();
      }
    }).catch(err => next(err));
  } else {
    res.sendStatus(401);
  }
});


/**
 * This path gets body with recipeId and save this recipe in the favorites list of the logged-in user
 */
router.post('/favorites', async (req,res,next) => {
  try{
    const user_id = req.session.user_id;
    const recipe_id = req.body.recipeId;
    const recipes_id = await user_utils.getFavoriteRecipes(user_id);
    let recipes_id_array = [];
    recipes_id.map((element) => recipes_id_array.push(element.recipe_id));
    if(!recipes_id_array.includes(recipe_id)) {
      await user_utils.markAsFavorite(user_id,recipe_id);
    }
    res.status(200).send("The Recipe successfully saved as favorite");
    } catch(error){
    next(error);
  }
})

/**
 * This path returns the favorites recipes that were saved by the logged-in user
 */
router.get('/favorites', async (req,res,next) => {
  try{
    const user_id = req.session.user_id;
    let favorite_recipes = {};
    const recipes_id = await user_utils.getFavoriteRecipes(user_id);
    let recipes_id_array = [];
    recipes_id.map((element) => recipes_id_array.push(element.recipe_id)); //extracting the recipe ids into array
    const results = await recipe_utils.getRecipesPreview(recipes_id_array);
    res.status(200).send(results);
  } catch(error){
    next(error); 
  }
});


/**
 * This path returns the watched recipes that were saved by the logged-in user
 */
 router.get('/watched', async (req,res,next) => {
  try{
    const user_id = req.session.user_id;
    let watched_recipes = {};
    const recipes_id = await user_utils.getWatchedRecipes(user_id);
    let recipes_id_array = [];
    recipes_id.map((element) => recipes_id_array.push(element.recipe_id)); //extracting the recipe ids into array
    const results = await recipe_utils.getRecipesPreview(recipes_id_array);
    res.status(200).send(results);
  } catch(error){
    next(error); 
  }
});


/**
 * This path gets body with recipe details and save this recipe in the myRecipes list of the logged-in user
 */
 router.post('/myRecipes', async (req,res,next) => {
  try{
    let recipe_details = {
      title: req.body.title,
      readyInMinutes: req.body.readyInMinutes,
      image: req.body.image,
      popularity: 0, // req.body.aggregateLikes,
      vegan: req.body.vegan,
      vegetarian: req.body.vegetarian,
      glutenFree: req.body.glutenFree,
      ingredients: req.body.ingredients,
      instructions: req.body.instructions,
      servings: req.body.servings
    }

    const user_id = req.session.user_id;
    //const recipe_id = req.body.recipeId;
    await user_utils.addMyRecipes(user_id, recipe_details);
    res.status(200).send("The Recipe added successfully");
    } catch(error){
    next(error);
  }
})

/**
 * This path returns the user recipes that were added by the logged-in user
 */
router.get('/myRecipes', async (req,res,next) => {
  try{
    const user_id = req.session.user_id;
    let favorite_recipes = {};
    const recipes_id = await user_utils.getMyRecipes(user_id);
    let recipes_id_array = [];
    recipes_id.map((element) => recipes_id_array.push(element));
    //const results = await recipe_utils.getRecipesPreview(recipes_id_array);
    res.status(200).send(recipes_id_array);
  } catch(error){
    next(error); 
  }
});



module.exports = router;
