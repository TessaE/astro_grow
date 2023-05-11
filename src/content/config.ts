import { z, defineCollection } from 'astro:content';

const plantCollection = defineCollection({ 
   schema: z.object({
    nameCommon: z.string(),
    nameLatin: z.string().optional(),
    sowIndoors: z.string().optional(),
    sowOutdoors: z.string().optional(),
   })
});

export const collections = {
  'plants': plantCollection,
};