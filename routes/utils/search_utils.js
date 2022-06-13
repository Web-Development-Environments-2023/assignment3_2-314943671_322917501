const axios = require("axios");
require("dotenv").config();
const api_domain = "https://api.spoonacular.com/recipes/complexSearch?";


async function extarctQueryParams(query, search_params) {
    if(query.hasOwnProperty('cuisine')) {
        search_params.cuisine = query.cuisine;
    }
    if(query.hasOwnProperty('diet')) {
        search_params.diet = query.diet;
    }
    if(query.hasOwnProperty('intolerances')) {
        search_params.intolerances = query.intolerances;
    }
}

async function searchForRecipes(search_params) {  
    let a = api_domain;
    if(search_params.hasOwnProperty('query')) {
        a += `query=${search_params.query}&`;
    }
    if(search_params.hasOwnProperty('cuisine')) {
        a += `cuisine=${search_params.cuisine}&`;
    }
    if(search_params.hasOwnProperty('diet')) {
        a += `diet=${search_params.diet}&`;
    }
    if(search_params.hasOwnProperty('intolerances')) {
        a += `intolerances=${search_params.intolerances}&`;
    }
    if(search_params.hasOwnProperty('number')) {
        a += `number=${search_params.number}&`;
    }

    a = a.slice(0, -1);
    //console.log(a);
    const response = await axios.get(`${a}`, {
        params: {
            apiKey: process.env.spooncular_apiKey
        }
    });
    return response.data;
}



exports.extarctQueryParams = extarctQueryParams;
exports.searchForRecipes = searchForRecipes;