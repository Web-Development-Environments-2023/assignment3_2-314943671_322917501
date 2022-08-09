const DButils = require("./DButils");

async function markAsFavorite(user_id, recipe_id){
    await DButils.execQuery(`INSERT INTO favoriterecipes VALUES ('${user_id}','${recipe_id}')`);
}

async function getFavoriteRecipes(user_id){
    const recipes_id = await DButils.execQuery(`select recipe_id from favoriterecipes where user_id='${user_id}'`);
    return recipes_id;
}


async function markAsWatched(user_id, recipe_id){
    await DButils.execQuery(`INSERT INTO watchedrecipes (user_id,recipe_id) VALUES ('${user_id}','${recipe_id}')`);
}

async function getWatchedRecipes(user_id){
    const recipes_id = await DButils.execQuery(`select recipe_id from watchedrecipes where user_id='${user_id}' order by time DESC`);
    return recipes_id;
}


async function addMyRecipes(user_id, recipe_details){
    await DButils.execQuery(
        `INSERT INTO myrecipes VALUES ('${user_id}','${recipe_details.title}', '${recipe_details.readyInMinutes}', 
        '${recipe_details.image}', '${recipe_details.popularity}', '${recipe_details.vegan}', '${recipe_details.vegetarian}',
        '${recipe_details.glutenFree}', '${recipe_details.ingredients}', '${recipe_details.instructions}', '${recipe_details.servings}')`
        );
}

async function getMyRecipes(user_id){
    const recipes_id = await DButils.execQuery(`select * from myrecipes where user_id='${user_id}'`);
    return recipes_id;
}


async function getFamilyRecipes(user_id){
    const recipes_id = await DButils.execQuery(`select * from familyrecipes where user_id='${user_id}'`);
    return recipes_id;
}



exports.markAsFavorite = markAsFavorite;
exports.getFavoriteRecipes = getFavoriteRecipes;
exports.markAsWatched = markAsWatched;
exports.getWatchedRecipes = getWatchedRecipes;
exports.addMyRecipes = addMyRecipes;
exports.getMyRecipes = getMyRecipes;
exports.getFamilyRecipes = getFamilyRecipes;