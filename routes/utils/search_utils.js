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

}