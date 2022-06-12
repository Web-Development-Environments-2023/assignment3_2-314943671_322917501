function extarctQueryParams(query, search_params)
{
    if(query.hasOwnProperty('cuisine'))
    {
        search_params.append(cuisine , query[cuisine], ",");
    }
    if(query.hasOwnProperty('diet'))
    {
        search_params.append(diet , query[diet], ",");
    }
    if(query.hasOwnProperty('intolerances'))
    {
        search_params.append(intolerances , query[intolerances], ",");
    }
}
function searchForRecipes(search_params)
{  
    let a = "https://api.spoonacular.com/recipes/complexSearch?query=";
    for (let i = 0; i < search_params.length; i=i+2) {
        a += search_params[i];
        a += "=";
        a += search_params[i+1];
        a += "&";
      } 
      a = a.slice(0, -1);
      return await axios.get(`${a}`);
}