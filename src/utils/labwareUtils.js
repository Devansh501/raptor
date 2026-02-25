import labwareDefinitions from '../data/labwareDefinitions.json';

export const getLabwareDefinitions = () => labwareDefinitions;

export const getLabwareByCategory = (category) =>
    labwareDefinitions.filter(lw => lw.category === category);

export const getLabwareCategories = () =>
    [...new Set(labwareDefinitions.map(lw => lw.category))];

export const getLabwareDefinitionById = (id) =>
    labwareDefinitions.find(lw => lw.id === id) ?? null;
