import labwareDefinitions from '../data/labwareDefinitions.json';

/**
 * Returns all available labware definitions.
 * @returns {Array} List of labware objects.
 */
export const getLabwareDefinitions = () => {
    return labwareDefinitions;
};

/**
 * Returns labware definitions filtered by category.
 * @param {string} category - The category to filter by (e.g., 'Well Plate', 'Reservoir').
 * @returns {Array} List of labware objects in the specified category.
 */
export const getLabwareByCategory = (category) => {
    return labwareDefinitions.filter(lw => lw.category === category);
};

/**
 * Returns a list of unique categories available in the definitions.
 * @returns {Array} List of category strings.
 */
export const getLabwareCategories = () => {
    return [...new Set(labwareDefinitions.map(lw => lw.category))];
};
